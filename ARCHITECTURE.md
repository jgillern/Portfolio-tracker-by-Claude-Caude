# Architektura

Tento dokument popisuje celkovou architekturu aplikace Portfolio Tracker — vrstvy, tok dat, rozhodnutí a budoucí rozšiřitelnost.

---

## Obsah

1. [Přehled vrstev](#přehled-vrstev)
2. [Tok dat](#tok-dat)
3. [State management](#state-management)
4. [Data layer — Yahoo Finance](#data-layer)
5. [Komponentová hierarchie](#komponentová-hierarchie)
6. [Cachování](#cachování)
7. [Klíčová architektonická rozhodnutí](#klíčová-rozhodnutí)
8. [Známá omezení](#známá-omezení)
9. [Plán rozšíření (Fáze 2)](#plán-rozšíření)

---

## Přehled vrstev

```
┌─────────────────────────────────────────────────┐
│                   BROWSER                        │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Pages   │  │Components│  │  Hooks   │      │
│  │ (page.tsx│  │  (UI +   │  │(useMarket│      │
│  │  news/)  │  │ feature) │  │ useChart)│      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │              │              │             │
│  ┌────┴──────────────┴──────────────┴──────┐    │
│  │           Context Providers              │    │
│  │  (Portfolio, Language, Theme)            │    │
│  └────────────────┬─────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴─────────────────────────┐    │
│  │           localStorage                    │    │
│  │  (portfolio-tracker-state/lang/theme)    │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│           fetch() ───────────────────────────────┤
└──────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────┐
│                   SERVER (Next.js)                │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │           API Routes                      │    │
│  │  /api/search  /api/quote                 │    │
│  │  /api/chart   /api/news                  │    │
│  │  /api/calendar                           │    │
│  └────────────────┬─────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴─────────────────────────┐    │
│  │     lib/yahooFinance.ts                   │    │
│  │     (yahoo-finance2 wrapper + cache)     │    │
│  └────────────────┬─────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴─────────────────────────┐    │
│  │         In-memory cache (Map)             │    │
│  │     (TTL: 60s - 30min dle endpointu)     │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────┐
│              Yahoo Finance API                    │
│  (neoficiální, přes yahoo-finance2 knihovnu)     │
└──────────────────────────────────────────────────┘
```

---

## Tok dat

### Načtení dashboardu

```
1. Uživatel otevře stránku
2. PortfolioContext načte stav z localStorage
3. Komponenty získají activePortfolio z kontextu
4. useMarketData hook → fetch /api/quote?symbols=AAPL,MSFT,...
5. API route → yahooFinance.getQuotes() → yahoo-finance2 → Yahoo API
6. Odpověď se cachuje server-side (60s) a vrátí klientovi
7. Komponenty renderují tabulku s daty
8. Paralelně: useChart hook → fetch /api/chart (obdobný flow)
```

### Přidání instrumentu

```
1. Uživatel klikne "Přidat instrument"
2. Otevře se AddInstrumentModal
3. Uživatel píše do vyhledávání → useSearch hook → /api/search
4. Výsledky se zobrazí v dropdownu
5. Uživatel klikne na instrument
6. addInstrument() → dispatch do PortfolioContext reduceru
7. Nový stav se synchronizuje do localStorage
8. Dashboard se přerenderuje s novým instrumentem
9. useMarketData a useChart refetchují data pro nový seznam symbolů
```

### Přepnutí jazyka

```
1. Uživatel klikne LanguageToggle
2. toggleLanguage() → změní locale v LanguageContext (en ↔ cs)
3. Nový locale se uloží do localStorage
4. Načte se příslušný JSON (/locales/cs.json nebo /locales/en.json)
5. t() funkce vrací překlady z nového souboru
6. Všechny komponenty se přerenderují s novými texty
```

---

## State management

### Architektura

```
                  ┌─────────────┐
                  │  Providers  │
                  └──────┬──────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
   ┌──────┴──────┐ ┌────┴────┐ ┌──────┴──────┐
   │ThemeContext │ │Language │ │Portfolio   │
   │            │ │Context  │ │Context     │
   │ theme      │ │ locale  │ │ portfolios │
   │ toggle()   │ │ t()     │ │ CRUD ops   │
   └─────────────┘ └─────────┘ └─────────────┘
         │              │              │
    localStorage   localStorage   localStorage
```

### Proč Context + useReducer?

- Máme pouze 3 globální stavy (portfolia, jazyk, téma)
- Žádný nestačí komplexní na to, aby vyžadoval Zustand/Redux
- `useReducer` dává předvídatelné přechody stavů
- Tržní data (quotes, chart, news) nejsou globální — fetchují se přes hooky ve scope komponent, které je potřebují

### localStorage klíče

| Klíč | Obsah | Aktualizace |
|---|---|---|
| `portfolio-tracker-state` | `PortfolioState` (JSON) | Při každé změně portfolia |
| `portfolio-tracker-lang` | `"en"` nebo `"cs"` | Při přepnutí jazyka |
| `portfolio-tracker-theme` | `"light"` nebo `"dark"` | Při přepnutí tématu |

---

## Data layer

### Proč proxy přes API routes?

Knihovna `yahoo-finance2` nemůže běžet v prohlížeči (CORS, cookie požadavky). Next.js API routes běží server-side a řeší:

1. **CORS** — požadavky na Yahoo API jdou ze serveru, ne z browseru
2. **Cachování** — in-memory cache snižuje počet požadavků na Yahoo
3. **Transformace dat** — normalizace, výpočty změn, agregace zpráv
4. **Budoucí middleware** — autentizace, rate limiting bez změny klientského kódu

### Výpočet grafu portfolia

```
Pro každý symbol:
  1. Načti historická data z Yahoo Finance (period1, period2, interval)
  2. Normalizuj cenu na base = 100 (první datový bod)

Agregace:
  3. Vezmi nejdelší řadu jako referenční časovou osu
  4. Pro každý časový bod spočítej vážený průměr:
     value = Σ(normalized_price_i × weight_i) / Σ(weight_i)
  5. Pokud nejsou custom váhy, weight_i = 100 / počet_instrumentů
```

### Výpočet procentuálních změn

```
Pro každý symbol:
  1. Načti aktuální cenu přes yf.quote()
  2. Načti historická denní data za poslední rok přes yf.chart()
  3. Pro období (1W, 1M, 1Y, YTD):
     a. Najdi nejbližší historický bod k cílovému datu
     b. change = ((current - historical) / historical) × 100
  4. 24h změna: přímo z yf.quote().regularMarketChangePercent
```

---

## Komponentová hierarchie

```
RootLayout
└── Providers
    ├── Header
    │   ├── Logo + navigační linky (Dashboard, Zprávy, Kalendář)
    │   ├── PortfolioSwitcher (dropdown + "Přidat nové portfolio")
    │   ├── LanguageToggle
    │   └── ThemeToggle
    │
    ├── DashboardPage (/)
    │   ├── Portfolio heading + akce (přidat, upravit, smazat)
    │   ├── PerformanceChart
    │   │   └── TimePeriodSelector
    │   ├── InstrumentsTable
    │   │   ├── RefreshControl (odpočítávání + manuální refresh)
    │   │   └── InstrumentRow × N (logo + váha + ceny)
    │   ├── AllocationTable
    │   │   ├── Stacked bar
    │   │   └── Legend
    │   ├── AddInstrumentModal
    │   │   ├── InstrumentSearch (krok 1)
    │   │   └── Weight input + potvrzení (krok 2)
    │   ├── EditPortfolioModal
    │   │   └── InstrumentRow × N (logo + editace váhy + odebrání)
    │   ├── Empty state + CreatePortfolioModal (pokud žádné portfolio)
    │   └── Delete confirmation dialog
    │
    ├── NewsPage (/news)
    │   └── NewsFeed
    │       └── NewsCard × N
    │
    └── CalendarPage (/calendar)
        └── CalendarFeed
            └── EventCard × N (earnings, dividendy)
```

---

## Cachování

### Server-side cache (in-memory Map)

| Endpoint | TTL | Klíč |
|---|---|---|
| `/api/search` | 10 min | `search:{query}` |
| `/api/quote` | 60 s | `quote:{symbol}` |
| `/api/chart` | 5 min | `chart:{symbols}:{period}:{weights}` |
| `/api/news` | 15 min | `news:{symbols}` |
| `/api/calendar` | 30 min | `calendar:{symbols}` |

**Poznámky:**
- Cache žije pouze po dobu běhu serveru (restart = vyčištění)
- Záznamy se invalidují lazy (při dalším čtení po expiraci)
- Žádný background refresh — data se aktualizují při dalším požadavku

### Client-side polling

- `useMarketData`: auto-refresh každých 10 minut (s odpočítáváním a manuálním refreshem)
- Ostatní hooky: jednorázový fetch při mountu nebo změně parametrů

---

## Klíčová rozhodnutí

### 1. localStorage místo databáze (Fáze 1)

**Pro:** Žádná backend infrastruktura, okamžitý start, jednoduchost
**Proti:** Data nepřežijí změnu prohlížeče/zařízení
**Mitigace:** Architektura připravena na migraci — PortfolioContext akce lze přesměrovat na API

### 2. Yahoo Finance (neoficiální)

**Pro:** Bezplatné, nepotřebuje API klíč, pokrývá akcie/ETF/krypto/komodity
**Proti:** Neoficiální API může kdykoli přestat fungovat nebo změnit formát
**Mitigace:** Wrapper v `lib/yahooFinance.ts` izoluje Yahoo-specifický kód; výměna za jinou API vyžaduje změnu pouze v tomto souboru

### 3. Tailwind CSS 4 s class-based dark mode

**Pro:** Uživatel řídí téma přes toggle, ne jen systémová preference
**Realizace:** `@custom-variant dark (&:where(.dark, .dark *))` v CSS + `ThemeContext` přidává `dark` třídu na `<html>`

### 4. In-memory cache místo Redis/DB cache

**Pro:** Žádné další závislosti, dostatečné pro single-instance deployment
**Proti:** Nesdílí se mezi instancemi, neprežije restart
**Mitigace:** Cache je optimalizace, ne nutnost — bez ní aplikace funguje (jen pomaleji)

### 5. Auto-detekce vlastních vah

**Pro:** Uživatel nemusí přepínat žádný toggle — systém automaticky detekuje, zda jsou váhy nastaveny
**Realizace:** `hasCustomWeights(portfolio)` kontroluje, zda alespoň jeden instrument má weight > 0. Pokud ano, použijí se custom váhy; jinak rovné zastoupení. Váha se zadává přímo při přidávání instrumentu.

---

## Známá omezení

| Omezení | Detail | Plánované řešení |
|---|---|---|
| Žádná autentizace | Data jen v lokálním prohlížeči | Fáze 2: NextAuth.js |
| Žádná databáze | localStorage — max ~5 MB | Fáze 2: PostgreSQL / Supabase |
| Yahoo API rate limits | Neoficiální API bez garantovaných limitů | Server-side cache minimalizuje požadavky |
| Žádné nákupní ceny | Nelze počítat reálný P&L | Plánované rozšíření |
| Max 50 instrumentů | Implicitní limit (výkon API volání) | Optimalizace batch requestů |
| Cache nepřežije restart | In-memory Map | Pro MVP dostatečné |
| Sektor pro non-equity | Statická mapa (crypto→Cryptocurrency atd.) | Rozšíření sektorové klasifikace |

---

## Plán rozšíření

### Fáze 2: Autentizace + Databáze

```
Aktuální stav:                     Cílový stav:
┌──────────────┐                  ┌──────────────┐
│ localStorage │                  │   Database   │
│  (browser)   │                  │ (PostgreSQL) │
└──────┬───────┘                  └──────┬───────┘
       │                                 │
       ▼                                 ▼
┌──────────────┐                  ┌──────────────┐
│ Portfolio    │                  │ Portfolio    │
│ Context      │ ───migrate───▶  │ Context      │
│ (reducer +   │                  │ (API calls + │
│  localStorage)│                 │  auth check) │
└──────────────┘                  └──────────────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │  NextAuth.js │
                                  │  (session)   │
                                  └──────────────┘
```

**Změny potřebné:**
1. Přidat `NextAuth.js` provider do `Providers.tsx`
2. Vytvořit API routes pro CRUD portfolia (`/api/portfolios/*`)
3. Nahradit localStorage volání za API volání v `PortfolioContext`
4. Přidat middleware pro autentizaci na API routes
5. Datové typy (`Portfolio`, `Instrument`) již obsahují `id`, `createdAt`, `updatedAt` — připraveny pro DB

**Co se nemění:**
- Všechny UI komponenty
- Hooky pro tržní data (`useMarketData`, `useChart`, `useNews`)
- API routes pro Yahoo Finance data
- Lokalizace a téma
