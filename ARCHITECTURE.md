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
│  │  (Auth, Portfolio, Language, Theme)      │    │
│  └────────────────┬─────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴─────────────────────────┐    │
│  │   Supabase Client (@supabase/ssr)        │    │
│  │  (cookie sessions + RLS queries)         │    │
│  └────────────────┬─────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴─────────────────────────┐    │
│  │    localStorage (cache / fallback)        │    │
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
│  │  /api/auth/signout (session cleanup)     │    │
│  │  /api/search    /api/quote               │    │
│  │  /api/chart     /api/news                │    │
│  │  /api/calendar  /api/logo (image proxy)  │    │
│  │  /api/countries /api/metrics             │    │
│  └────────────────┬─────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴─────────────────────────┐    │
│  │     lib/yahooFinance.ts                   │    │
│  │     (yahoo-finance2 wrapper + cache)     │    │
│  └────────────────┬─────────────────────────┘    │
│                   │                              │
│  ┌────────────────┴─────────────────────────┐    │
│  │         In-memory cache (Map)             │    │
│  │   (TTL: 60s - 7 dní dle endpointu)      │    │
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

### Přihlášení uživatele

```
1. Uživatel otevře stránku → middleware detekuje nepřihlášeného → redirect na /login
2. Uživatel zadá e-mail a heslo → Supabase Auth signInWithPassword()
3. Supabase nastaví session cookies
4. Redirect na / → middleware potvrdí session → propustí
5. AuthContext načte user profil, spustí migraci z localStorage (jednorázově)
6. PortfolioContext načte portfolia z Supabase
```

### Odhlášení uživatele

```
1. Uživatel klikne "Odhlásit se" v user menu
2. signOut() → supabase.auth.signOut() (klient) — vymaže klientský session state
3. POST /api/auth/signout → server-side Supabase signOut() — správně vyčistí httpOnly cookies
4. Redirect na /login přes window.location.href (full page reload)
5. Middleware detekuje nepřihlášeného → propustí na /login
```

### Načtení dashboardu

```
1. Uživatel otevře stránku (přihlášen)
2. AuthContext načte session, profil a spustí migraci z localStorage
3. PortfolioContext načte portfolia + instrumenty z Supabase
4. Komponenty získají activePortfolio z kontextu
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
6. addInstrument() → vloží do Supabase DB + dispatch do lokálního reduceru
7. Dashboard se přerenderuje s novým instrumentem
9. useMarketData a useChart refetchují data pro nový seznam symbolů
```

### Načtení loga instrumentu

```
1. InstrumentLogo se renderuje — <img src="/api/logo?symbol=X&type=Y">
2. Prohlížeč pošle request na API route (s 7denní Cache-Control hlavičkou)
3. API route → yahooFinance.getLogoImage()
   - Krypto: stáhne PNG z cryptocurrency-icons CDN
   - Akcie/ETF: resolveDomain() najde doménu firmy
     → zkusí apple-touch-icon.png z webu firmy
     → zkusí apple-touch-icon-precomposed.png
     → zkusí Google faviconV2 (128px)
4. Vrátí surové byty obrázku (Content-Type: image/png) s HTTP cache hlavičkami
5. Výsledek se cachuje server-side (7 dní in-memory)
6. Pokud se <img> nepodaří načíst, onError → zobrazí barevnou iniciálu
```

### Přepnutí jazyka

```
1. Uživatel otevře jazykový dropdown v hlavičce
2. Vybere jazyk z 6 možností (EN, CZ, SK, UA, ZH, MN)
3. setLocale() → změní locale v LanguageContext
4. Nový locale se uloží do localStorage (cache) + Supabase (persistent)
5. Načte se příslušný JSON (/locales/{locale}.json) — cachuje se po prvním načtení
6. t() funkce vrací překlady z nového souboru
7. Všechny komponenty se přerenderují s novými texty
```

---

## State management

### Architektura

```
              Root Layout
           ┌──────┴──────┐
     ThemeProvider  LanguageProvider
                         │
               (app) Layout
              ┌──────┴──────┐
        AuthProvider  PortfolioProvider
                         │
           ┌─────────────┼──────────────┐
           │             │              │
    ┌──────┴──────┐ ┌───┴────┐ ┌──────┴──────┐
    │ThemeContext │ │Language│ │Portfolio   │
    │ + Supabase │ │Context │ │Context     │
    │ sync       │ │+ sync  │ │+ Supabase  │
    └─────────────┘ └────────┘ └─────────────┘
          │              │              │
     localStorage   localStorage    Supabase DB
     (cache)        (cache)        (persistent)
```

### Proč Context + useReducer?

- Máme 4 globální stavy (auth, portfolia, jazyk, téma)
- `useReducer` dává předvídatelné přechody stavů
- Tržní data (quotes, chart, news) nejsou globální — fetchují se přes hooky ve scope komponent, které je potřebují

### Datová persistence

| Zdroj | Data | Účel |
|---|---|---|
| **Supabase DB** | Portfolia, instrumenty, preference | Trvalé úložiště, cross-device |
| **Supabase Auth** | Session, user metadata | Autentizace (cookie-based) |
| **localStorage** | Jazyk, téma, pořadí sekcí | Cache pro okamžitý start |

### localStorage klíče (cache)

| Klíč | Obsah | Aktualizace |
|---|---|---|
| `portfolio-tracker-lang` | `"en"`, `"cs"`, `"sk"`, `"uk"`, `"zh"` nebo `"mn"` | Při přepnutí jazyka |
| `portfolio-tracker-theme` | `"light"` nebo `"dark"` | Při přepnutí tématu |
| `portfolio-tracker-dashboard-order` | `string[]` (JSON) — pořadí sekcí dashboardu | Při přeřazení sekcí drag-and-drop |

**Poznámka:** Klíč `portfolio-tracker-state` (dříve používaný pro portfolia) se čte pouze při jednorázové migraci do Supabase — po migraci se odstraní. Nová data portfolií se ukládají výhradně do Supabase DB.

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
RootLayout (ThemeProvider → LanguageProvider)
├── LoginPage (/login) — veřejná
│   ├── LanguageToggle + ThemeToggle
│   ├── Animovaný gradient + nadpis
│   └── Login/Register formuláře
│
└── AppLayout (AuthProvider → PortfolioProvider)
    ├── Header
    │   ├── Logo + navigační linky (Dashboard, Zprávy, Kalendář)
    │   ├── PortfolioSwitcher (dropdown + "Přidat nové portfolio")
    │   ├── LanguageToggle
    │   ├── ThemeToggle
    │   └── UserMenu (iniciály, jméno, e-mail, odhlášení)
    │
    ├── DashboardPage (/)
    │   ├── Portfolio heading + RefreshControl + akce (přidat, import CSV, upravit, smazat)
    │   ├── Varovný banner (pokud váhy < 100%)
    │   ├── DraggableSection × 6 (pořadí řízeno useDashboardOrder)
    │   │   ├── PerformanceChart (refreshSignal prop)
    │   │   │   └── TimePeriodSelector
    │   │   ├── InstrumentsTable (quotes + isLoading props)
    │   │   │   └── InstrumentRow × N (logo + váha + ceny)
    │   │   ├── AllocationTable (sektorová alokace)
    │   │   │   ├── Stacked bar
    │   │   │   └── Legend
    │   │   ├── TypeAllocation (alokace dle typu)
    │   │   ├── CountryAllocation (alokace dle země, vlajky)
    │   │   └── PortfolioMetrics (6 metrik)
    │   │       └── MetricGauge × 6 (gradientní osa + tooltip)
    │   ├── AddInstrumentModal
    │   │   ├── InstrumentSearch
    │   │   └── Vybraný instrument + weight input (jeden krok)
    │   ├── EditPortfolioModal (lokální kopie stavu, Save/Cancel)
    │   │   └── InstrumentRow × N (logo + editace váhy + odebrání)
    │   ├── ImportCsvModal (nahrání souboru, náhled, validace, výsledek)
    │   ├── Empty state + CreatePortfolioModal (pokud žádné portfolio)
    │   └── Delete confirmation dialog
    │
    ├── NewsPage (/news)
    │   └── NewsFeed
    │       ├── InstrumentFilter (multi-select dropdown s checkboxy)
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
| `/api/logo` | 7 dní | `logo-img:{symbol}` |
| `/api/countries` | 24 h | `countries:{symbol}` |
| `/api/metrics` | 10 min | `metrics:{symbols}:{weights}` |

**HTTP cache (logo):**
- `/api/logo` vrací odpovědi s hlavičkou `Cache-Control: public, max-age=604800, immutable` — prohlížeč cachuje obrázky 7 dní

**Poznámky:**
- Cache žije pouze po dobu běhu serveru (restart = vyčištění)
- Záznamy se invalidují lazy (při dalším čtení po expiraci)
- Žádný background refresh — data se aktualizují při dalším požadavku

### Client-side polling

- `useMarketData`: auto-refresh každých 10 minut (s odpočítáváním a manuálním refreshem)
- Ostatní hooky: jednorázový fetch při mountu nebo změně parametrů

---

## Klíčová rozhodnutí

### 1. Supabase jako backend (Fáze 2)

**Pro:** Plně spravovaný PostgreSQL + Auth, cookie-based sessions přes `@supabase/ssr`, Row Level Security
**Architektura:** Kontexty (Theme, Language, Portfolio) fungují jako abstrakční vrstva — komponenty neimportují Supabase přímo. `database.ts` je centrální datový modul.
**Migrace:** Automatická jednorázová migrace z localStorage při prvním přihlášení (`migration.ts`)

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

### 6. Validace vah a ochrana před překročením 100%

**Pro:** Uživatel nemůže vytvořit nekonzistentní portfolio s váhami > 100%
**Realizace:**
- `AddInstrumentModal` a `EditPortfolioModal` počítají `currentTotal` a `remaining`
- Tlačítko Přidat/Uložit je `disabled` pokud by nová váha překročila 100%
- Zobrazuje se zbývající procento jako informativní text
- Dashboard zobrazuje varovný banner (amber) pokud `hasCustomWeights && total < 100%`

### 7. Logo resolution — server-side image proxy

**Pro:** Uživatel vidí reálná loga firem místo generických iniciál
**Realizace:** `/api/logo` slouží jako image proxy — stahuje logo server-side a vrací surové byty obrázku s HTTP cache hlavičkami (7 dní).
- Akcie/ETF: zjistí doménu firmy (COMMON_DOMAINS mapa ~50 tickerů → fallback na Yahoo assetProfile.website), zkusí `apple-touch-icon.png` → `apple-touch-icon-precomposed.png` → Google faviconV2.
- Krypto: stáhne PNG z cryptocurrency-icons CDN.
- Klient: `<img src="/api/logo?...">` s `onError` fallback na barevnou iniciálu.
- Poznámka: Clearbit Logo API (dříve používaný) byl zrušen po akvizici HubSpotem (vrací 403).

### 8. Drag-and-drop pořadí sekcí

**Pro:** Uživatel si přizpůsobí dashboard podle preference
**Realizace:** HTML5 Drag and Drop API (nativní, bez knihovny). `DraggableSection` wrapper s vizuální zpětnou vazbou. `useDashboardOrder` hook ukládá pořadí do localStorage. Výchozí pořadí se automaticky aktualizuje při přidání/odebrání sekcí.

### 9. CSV import s validací

**Pro:** Hromadné přidání instrumentů bez opakovaného vyhledávání
**Realizace:** `ImportCsvModal` parsuje CSV soubor (UTF-8, středník jako oddělovač — český formát), zobrazí náhled v tabulce, postupně validuje tickery přes `/api/search`. Kontroluje duplicity a nepřekročení 100% váhy. Zobrazí výsledek: úspěšně přidané + přeskočené s důvody.

---

## Známá omezení

| Omezení | Detail | Plánované řešení |
|---|---|---|
| ~~Žádná autentizace~~ | ✅ Implementováno (Supabase Auth) | — |
| ~~Žádná databáze~~ | ✅ Implementováno (Supabase PostgreSQL) | — |
| Yahoo API rate limits | Neoficiální API bez garantovaných limitů | Server-side cache minimalizuje požadavky |
| Žádné nákupní ceny | Nelze počítat reálný P&L | Plánované rozšíření |
| Max 50 instrumentů | Implicitní limit (výkon API volání) | Optimalizace batch requestů |
| Cache nepřežije restart | In-memory Map | Pro MVP dostatečné |
| Sektor pro non-equity | Statická mapa (crypto→Cryptocurrency atd.) | Rozšíření sektorové klasifikace |

---

## Implementované fáze

### Fáze 2: Autentizace + Databáze ✅

```
Stav před:                         Stav po:
┌──────────────┐                  ┌──────────────┐
│ localStorage │                  │ Supabase DB  │
│  (browser)   │                  │ (PostgreSQL) │
└──────┬───────┘                  └──────┬───────┘
       │                                 │
       ▼                                 ▼
┌──────────────┐                  ┌──────────────┐
│ Portfolio    │                  │ Portfolio    │
│ Context      │ ──migrated──▶   │ Context      │
│ (reducer +   │                  │ (Supabase +  │
│  localStorage)│                 │  useReducer) │
└──────────────┘                  └──────────────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │ Supabase Auth│
                                  │(@supabase/ssr│
                                  │ + cookies)   │
                                  └──────────────┘
```

**Co bylo implementováno:**
1. Supabase Auth s cookie-based sessions (`@supabase/ssr`)
2. Next.js middleware pro ochranu routes + session refresh
3. PostgreSQL tabulky: `profiles`, `user_preferences`, `portfolios`, `instruments` (RLS)
4. `database.ts` centrální datová vrstva (CRUD operace)
5. `AuthContext` — přihlášení, registrace, odhlášení
6. Route group `(app)` pro chráněné stránky
7. Animovaná login stránka ("Honzův bombézní portfolio tracker")
8. User menu v Header s iniciálami a odhlášením
9. Automatická migrace localStorage → Supabase

**Co se nezměnilo:**
- Všechny UI komponenty (grafem, tabulky, alokace, metriky)
- Hooky pro tržní data (`useMarketData`, `useChart`, `useNews`)
- API routes pro Yahoo Finance data
- Lokalizace (6 jazyků) — rozšířena o `auth` sekci
