# API dokumentace

Portfolio Tracker poskytuje 8 interních API endpointů, které slouží jako server-side proxy pro Yahoo Finance, finanční metriky a loga instrumentů. Všechny endpointy jsou GET requesty a běží na straně serveru (Next.js API Routes).

---

## Obsah

1. [Přehled endpointů](#přehled-endpointů)
2. [GET /api/search](#get-apisearch)
3. [GET /api/quote](#get-apiquote)
4. [GET /api/chart](#get-apichart)
5. [GET /api/news](#get-apinews)
6. [GET /api/calendar](#get-apicalendar)
7. [GET /api/logo](#get-apilogo)
8. [GET /api/countries](#get-apicountries)
9. [GET /api/metrics](#get-apimetrics)
10. [Cachování](#cachování)
11. [Chybové odpovědi](#chybové-odpovědi)

---

## Přehled endpointů

| Endpoint | Účel | Cache TTL |
|---|---|---|
| `GET /api/search` | Vyhledávání instrumentů | 10 min |
| `GET /api/quote` | Aktuální ceny + změny | 60 s |
| `GET /api/chart` | Historická data pro graf | 5 min |
| `GET /api/news` | Finanční zprávy | 15 min |
| `GET /api/calendar` | Kalendářní události (earnings, dividendy) | 30 min |
| `GET /api/logo` | Logo instrumentu (server-side image proxy) | 7 dní |
| `GET /api/countries` | Země původu instrumentů | 24 h |
| `GET /api/metrics` | Finanční metriky portfolia (P/E, Sharpe, Beta...) | 10 min |

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

## GET /api/calendar

Vrátí nadcházející klíčové události (earnings, dividendy) pro zadané symboly.

### Request

```
GET /api/calendar?symbols={symbol1},{symbol2},...
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
    "type": "earnings",
    "date": "2026-04-24T00:00:00.000Z",
    "title": "AAPL Earnings",
    "detail": "EPS est. 1.62 (1.55 - 1.70)"
  },
  {
    "symbol": "MSFT",
    "name": "Microsoft Corporation",
    "type": "dividend",
    "date": "2026-03-15T00:00:00.000Z",
    "title": "MSFT Ex-Dividend",
    "detail": "Pay date: 4/10/2026"
  }
]
```

| Pole | Typ | Popis |
|---|---|---|
| `symbol` | string | Ticker symbol |
| `name` | string | Název instrumentu |
| `type` | `'earnings' \| 'dividend' \| 'split' \| 'other'` | Typ události |
| `date` | string | ISO 8601 datum události |
| `title` | string | Nadpis události |
| `detail` | string? | Doplňující informace (EPS odhad, datum výplaty dividendy...) |

### Poznámky

- Zpracovává max 15 symbolů
- Načítá data přes `yf.quoteSummary()` s modulem `calendarEvents`
- Události jsou seřazeny chronologicky
- Earnings: zahrnuje odhad EPS a rozsah (pokud dostupné z Yahoo Finance)
- Dividendy: zahrnuje ex-dividend datum a pay date

---

## GET /api/logo

Server-side image proxy — stáhne logo instrumentu a vrátí surové byty obrázku. Automaticky rozhodne zdroj podle typu instrumentu.

### Request

```
GET /api/logo?symbol={symbol}&type={type}
```

| Parametr | Typ | Povinný | Popis |
|---|---|---|---|
| `symbol` | string | Ano | Ticker symbol (AAPL, BTC-USD, META...) |
| `type` | InstrumentType | Ne | Typ instrumentu (výchozí: `stock`) |

### Response — 200 OK

Vrací **binární data obrázku** (ne JSON).

| Hlavička | Hodnota |
|---|---|
| `Content-Type` | `image/png`, `image/x-icon` apod. |
| `Cache-Control` | `public, max-age=604800, immutable` (7 dní) |

### Response — 404 Not Found

Logo nebylo nalezeno (prázdné tělo).

### Algoritmus resolution

1. **Krypto** (`type === 'crypto'`): Stáhne PNG z cryptocurrency-icons CDN:
   `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/128/color/{symbol}.png`
   - Symbol se převede na lowercase a odstraní se přípona `-USD` (BTC-USD → btc)

2. **Akcie/ETF/ostatní**:
   1. Zjistí doménu firmy: COMMON_DOMAINS mapa (~50 známých tickerů) → fallback na `yf.quoteSummary(symbol).assetProfile.website`
   2. Zkusí `https://{domain}/apple-touch-icon.png`
   3. Zkusí `https://{domain}/apple-touch-icon-precomposed.png`
   4. Zkusí Google faviconV2: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://{domain}&size=128`
   5. `null` (404) — klient zobrazí barevnou iniciálu

### Poznámky

- Server-side cache TTL: 7 dní (loga se mění zřídka)
- HTTP Cache-Control hlavička zajišťuje cachování v prohlížeči — minimalizuje opakované requesty
- Obrázky menší než 100 bajtů jsou ignorovány (pravděpodobně chybové odpovědi)
- Fetch timeout: 5 sekund na každý pokus
- Pozn.: Clearbit Logo API (dříve používaný) byl zrušen po akvizici HubSpotem

---

## GET /api/countries

Vrátí země původu pro zadané symboly (z Yahoo Finance assetProfile).

### Request

```
GET /api/countries?symbols={symbol1},{symbol2}&types={type1},{type2}
```

| Parametr | Typ | Povinný | Popis |
|---|---|---|---|
| `symbols` | string | Ano | Čárkou oddělené ticker symboly |
| `types` | string | Ne | Čárkou oddělené typy instrumentů (pro přeskočení krypta) |

### Response — 200 OK

```json
[
  { "symbol": "AAPL", "country": "United States", "countryCode": "US" },
  { "symbol": "SAP", "country": "Germany", "countryCode": "DE" }
]
```

| Pole | Typ | Popis |
|---|---|---|
| `symbol` | string | Ticker symbol |
| `country` | string | Název země (anglicky) |
| `countryCode` | string | ISO 2-písmenný kód země |

### Poznámky

- Cache TTL: 24 hodin
- Krypto symboly se přeskakují (nemají zemi původu)
- Symboly bez assetProfile se v odpovědi vynechají

---

## GET /api/metrics

Vrátí finanční metriky pro portfolio (6 klíčových ukazatelů).

### Request

```
GET /api/metrics?symbols={symbol1},{symbol2}&weights={w1},{w2}
```

| Parametr | Typ | Povinný | Popis |
|---|---|---|---|
| `symbols` | string | Ano | Čárkou oddělené ticker symboly |
| `weights` | string | Ne | Čárkou oddělené váhy (pokud chybí, použije rovné zastoupení) |

### Response — 200 OK

```json
{
  "peRatio": 25.4,
  "sharpeRatio": 1.23,
  "beta": 1.15,
  "alpha": 2.8,
  "sortinoRatio": 1.67,
  "treynorRatio": 0.089
}
```

| Pole | Typ | Popis |
|---|---|---|
| `peRatio` | number \| null | Vážený P/E ratio portfolia |
| `sharpeRatio` | number \| null | Sharpe ratio (rizikově vážený výnos) |
| `beta` | number \| null | Beta portfolia vůči S&P 500 |
| `alpha` | number \| null | Jensenova Alfa (přebytkový výnos nad CAPM) |
| `sortinoRatio` | number \| null | Sortino ratio (jen downside riziko) |
| `treynorRatio` | number \| null | Treynor ratio (systematicky rizikově vážený výnos) |

### Algoritmus výpočtu

1. Načte 1 rok denních dat pro všechny symboly + S&P 500 (^GSPC) jako benchmark
2. Spočítá vážené denní výnosy portfolia
3. **P/E:** Vážený průměr z `trailingPE` jednotlivých symbolů
4. **Sharpe:** `(annualized_return - risk_free_rate) / annualized_volatility` (risk-free rate = 4,5 %)
5. **Beta:** `covariance(portfolio, market) / variance(market)`
6. **Alpha:** `portfolio_return - (risk_free_rate + beta × (market_return - risk_free_rate))`
7. **Sortino:** Jako Sharpe, ale volatilita pouze z negativních výnosů
8. **Treynor:** `(annualized_return - risk_free_rate) / beta`

### Poznámky

- Cache TTL: 10 minut
- Metrika může být `null` pokud není dostatek dat k výpočtu
- Historická data: 1 rok denních uzavíracích cen

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
| `/api/calendar` | 30 min | `calendar:{symbols}` |
| `/api/logo` | 7 dní | `logo-img:{symbol}` (+ HTTP Cache-Control 7 dní) |
| `/api/countries` | 24 h | `countries:{symbol}` |
| `/api/metrics` | 10 min | `metrics:{symbols}:{weights}` |

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
