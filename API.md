# API dokumentace

Portfolio Tracker poskytuje 4 interní API endpointy, které slouží jako server-side proxy pro Yahoo Finance. Všechny endpointy jsou GET requesty a běží na straně serveru (Next.js API Routes).

---

## Obsah

1. [Přehled endpointů](#přehled-endpointů)
2. [GET /api/search](#get-apisearch)
3. [GET /api/quote](#get-apiquote)
4. [GET /api/chart](#get-apichart)
5. [GET /api/news](#get-apinews)
6. [Cachování](#cachování)
7. [Chybové odpovědi](#chybové-odpovědi)

---

## Přehled endpointů

| Endpoint | Účel | Cache TTL |
|---|---|---|
| `GET /api/search` | Vyhledávání instrumentů | 10 min |
| `GET /api/quote` | Aktuální ceny + změny | 60 s |
| `GET /api/chart` | Historická data pro graf | 5 min |
| `GET /api/news` | Finanční zprávy | 15 min |

---

## GET /api/search

Vyhledá instrumenty na Yahoo Finance podle názvu nebo tickeru.

### Request

```
GET /api/search?q={query}
```

| Parametr | Typ | Povinný | Popis |
|---|---|---|---|
| `q` | string | Ano | Hledaný text (název společnosti nebo ticker) |

### Response — 200 OK

```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "type": "stock",
    "exchange": "NMS",
    "sector": "Technology"
  },
  {
    "symbol": "AAPL.BA",
    "name": "Apple Inc.",
    "type": "stock",
    "exchange": "BUE"
  }
]
```

| Pole | Typ | Popis |
|---|---|---|
| `symbol` | string | Ticker symbol |
| `name` | string | Název instrumentu |
| `type` | `'stock' \| 'etf' \| 'crypto' \| 'bond' \| 'commodity'` | Typ instrumentu |
| `exchange` | string | Kód burzy |
| `sector` | string? | Sektor (pouze pro akcie, pokud je k dispozici) |

### Poznámky

- Vrací max 10 výsledků
- Filtruje pouze Yahoo Finance výsledky (ne Crunchbase)
- Prázdný `q` vrací prázdné pole `[]`

---

## GET /api/quote

Vrátí aktuální ceny a procentuální změny pro zadané symboly.

### Request

```
GET /api/quote?symbols={symbol1},{symbol2},...
```

| Parametr | Typ | Povinný | Popis |
|---|---|---|---|
| `symbols` | string | Ano | Čárkou oddělené ticker symboly |

### Response — 200 OK

```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 182.52,
    "currency": "USD",
    "change24h": 1.23,
    "change1w": -0.45,
    "change1m": 3.67,
    "change1y": 28.91,
    "changeYtd": 12.34
  }
]
```

| Pole | Typ | Popis |
|---|---|---|
| `symbol` | string | Ticker symbol |
| `name` | string | Název instrumentu |
| `price` | number | Aktuální tržní cena |
| `currency` | string | Měna ceny (USD, EUR, CZK...) |
| `change24h` | number | Změna za posledních 24h v % |
| `change1w` | number | Změna za poslední týden v % |
| `change1m` | number | Změna za poslední měsíc v % |
| `change1y` | number | Změna za poslední rok v % |
| `changeYtd` | number | Změna od začátku roku v % |

### Výpočet změn

- `change24h`: přímo z Yahoo Finance (`regularMarketChangePercent`)
- `change1w/1m/1y/ytd`: vypočteno z historických dat
  - Načte denní data za poslední rok přes `yf.chart()`
  - Najde nejbližší historický uzavírací bod k cílovému datu
  - `change = ((current - historical) / historical) × 100`

### Poznámky

- Pokud se nepodaří načíst data pro symbol, tento symbol chybí v odpovědi (partial success)
- Historické změny mohou být 0, pokud nejsou k dispozici historická data

---

## GET /api/chart

Vrátí historická data pro graf výkonnosti portfolia.

### Request

```
GET /api/chart?symbols={symbol1},{symbol2}&range={period}&weights={w1},{w2}
```

| Parametr | Typ | Povinný | Popis |
|---|---|---|---|
| `symbols` | string | Ano | Čárkou oddělené ticker symboly |
| `range` | TimePeriod | Ano | Časové období |
| `weights` | string | Ne | Čárkou oddělené váhy (odpovídají pořadí symbolů) |

**Povolené hodnoty `range`:**

| Hodnota | Období | Interval dat |
|---|---|---|
| `1d` | 1 den | 5 minut |
| `1w` | 1 týden | 15 minut |
| `1mo` | 1 měsíc | 1 den |
| `1y` | 1 rok | 1 týden |
| `5y` | 5 let | 1 měsíc |
| `ytd` | Od začátku roku | 1 den |

### Response — 200 OK

```json
[
  { "timestamp": 1707600000000, "value": 100.0 },
  { "timestamp": 1707686400000, "value": 101.23 },
  { "timestamp": 1707772800000, "value": 99.87 }
]
```

| Pole | Typ | Popis |
|---|---|---|
| `timestamp` | number | Unix timestamp v milisekundách |
| `value` | number | Normalizovaná hodnota portfolia (base = 100) |

### Algoritmus

1. Pro každý symbol načte historická data z Yahoo Finance
2. Normalizuje cenu každého symbolu: `normalized = (close / first_close) × 100`
3. Použije nejdelší řadu jako referenční časovou osu
4. Pro každý časový bod vypočte vážený průměr:
   - S custom váhami: `Σ(normalized_i × weight_i) / Σ(weight_i)`
   - Bez vah: rovný průměr všech řad

### Příklady

Rovné váhy (2 instrumenty):
```
GET /api/chart?symbols=AAPL,MSFT&range=1mo
```

Custom váhy (60% AAPL, 40% MSFT):
```
GET /api/chart?symbols=AAPL,MSFT&range=1mo&weights=60,40
```

---

## GET /api/news

Vrátí finanční zprávy relevantní k zadaným symbolům.

### Request

```
GET /api/news?symbols={symbol1},{symbol2},...
```

| Parametr | Typ | Povinný | Popis |
|---|---|---|---|
| `symbols` | string | Ano | Čárkou oddělené ticker symboly |

### Response — 200 OK

```json
[
  {
    "uuid": "abc-123-def",
    "title": "Apple Reports Record Q4 Revenue",
    "summary": "",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "link": "https://finance.yahoo.com/news/...",
    "publisher": "Reuters",
    "publishedAt": "2026-02-11T14:30:00.000Z",
    "relatedSymbols": ["AAPL"]
  }
]
```

| Pole | Typ | Popis |
|---|---|---|
| `uuid` | string | Unikátní identifikátor zprávy |
| `title` | string | Nadpis zprávy |
| `summary` | string | Krátký popis (může být prázdný) |
| `thumbnailUrl` | string? | URL náhledového obrázku (nebo null) |
| `link` | string | URL na plný článek |
| `publisher` | string | Název vydavatele (Reuters, Bloomberg...) |
| `publishedAt` | string | ISO 8601 datum publikace |
| `relatedSymbols` | string[] | Symboly, ke kterým se zpráva vztahuje |

### Poznámky

- Zpracovává max 10 symbolů (pro omezení API volání)
- Pro každý symbol hledá max 5 zpráv
- Deduplikace: pokud se stejná zpráva vztahuje k více symbolům, slučuje `relatedSymbols`
- Seřazeno od nejnovějších
- Vrací max 20 zpráv celkem

---

## Cachování

Všechny endpointy využívají server-side in-memory cache.

```
Request → Cache hit?
  ├── Ano → Vrať cached data (bez Yahoo API volání)
  └── Ne  → Zavolej Yahoo API → Ulož do cache → Vrať data
```

| Endpoint | Cache TTL | Klíč formát |
|---|---|---|
| `/api/search` | 10 min | `search:{query}` |
| `/api/quote` | 60 s | `quote:{symbol}` (per symbol) |
| `/api/chart` | 5 min | `chart:{symbols}:{period}:{weights}` |
| `/api/news` | 15 min | `news:{symbols}` |

**Omezení cache:**
- In-memory — neprežije restart serveru
- Nesdílí se mezi instancemi (relevantní pro clustered deployment)
- Lazy invalidace — expirované záznamy se smažou při dalším čtení

---

## Chybové odpovědi

### 400 Bad Request

Chybějící nebo neplatné parametry.

```json
{
  "error": "symbols parameter required"
}
```

```json
{
  "error": "Invalid range parameter"
}
```

### 500 Internal Server Error

Chyba při komunikaci s Yahoo Finance API.

```json
{
  "error": "Failed to fetch quotes"
}
```

### Partial failures

Endpointy `/api/quote` a `/api/chart` používají `Promise.allSettled()` — pokud selže jeden symbol, ostatní se stále vrátí. V odpovědi jednoduše chybí symbol, pro který se nepodařilo načíst data.
