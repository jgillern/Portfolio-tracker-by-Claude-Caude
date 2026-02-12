# Technická dokumentace

Tento dokument popisuje technické detaily implementace Portfolio Trackeru — datové modely, komponenty, hooky, kontexty, utility funkce a konfiguraci.

---

## Obsah

1. [Datové modely (Types)](#datové-modely)
2. [Konfigurace](#konfigurace)
3. [Utility knihovny (lib/)](#utility-knihovny)
4. [Context Providers](#context-providers)
5. [Custom Hooks](#custom-hooks)
6. [Komponenty](#komponenty)
7. [Stránky (Pages)](#stránky)
8. [Styly](#styly)
9. [Lokalizace](#lokalizace)

---

## Datové modely

### `src/types/portfolio.ts`

Definuje struktury pro portfolia a instrumenty.

```typescript
type InstrumentType = 'stock' | 'etf' | 'crypto' | 'bond' | 'commodity';

interface Instrument {
  symbol: string;          // Ticker symbol (AAPL, BTC-USD, GLD)
  name: string;            // Plný název instrumentu
  type: InstrumentType;    // Typ instrumentu
  sector?: string;         // Sektor (Technology, Finance...), volitelný
  weight?: number;         // Vlastní váha v % (0-100), volitelný
  logoUrl?: string;        // URL loga instrumentu, volitelný
  addedAt: string;         // ISO datum přidání
}

interface Portfolio {
  id: string;              // UUID generované přes crypto.randomUUID()
  name: string;            // Uživatelský název portfolia
  instruments: Instrument[];
  createdAt: string;       // ISO datum vytvoření
  updatedAt: string;       // ISO datum poslední úpravy
}

// Helper: auto-detekce vlastních vah (true pokud alespoň 1 instrument má weight)
function hasCustomWeights(portfolio: Portfolio): boolean;

interface PortfolioState {
  portfolios: Portfolio[];         // Všechna portfolia
  activePortfolioId: string | null; // ID aktivního portfolia
}
```

### `src/types/market.ts`

Definuje struktury pro tržní data.

```typescript
interface Quote {
  symbol: string;
  name: string;
  price: number;           // Aktuální cena
  currency: string;        // Měna (USD, EUR...)
  change24h: number;       // Změna za 24h v %
  change1w: number;        // Změna za 1 týden v %
  change1m: number;        // Změna za 1 měsíc v %
  change1y: number;        // Změna za 1 rok v %
  changeYtd: number;       // Změna od začátku roku v %
}

interface ChartDataPoint {
  timestamp: number;       // Unix timestamp v ms
  value: number;           // Normalizovaná hodnota (base = 100)
}

interface NewsArticle {
  uuid: string;
  title: string;
  summary: string;
  thumbnailUrl: string | null;
  link: string;            // URL na zdrojový článek
  publisher: string;
  publishedAt: string;     // ISO datum publikace
  relatedSymbols: string[]; // Symboly, ke kterým se zpráva vztahuje
}

type TimePeriod = '1d' | '1w' | '1mo' | '1y' | '5y' | 'ytd';

type CalendarEventType = 'earnings' | 'dividend' | 'split' | 'other';

interface CalendarEvent {
  symbol: string;          // Ticker symbol
  name: string;            // Název instrumentu
  type: CalendarEventType; // Typ události
  date: string;            // ISO datum události
  title: string;           // Nadpis události
  detail?: string;         // Doplňující informace (EPS odhad atd.)
}
```

### `src/types/api.ts`

Definuje typy pro API odpovědi.

```typescript
interface SearchResult {
  symbol: string;
  name: string;
  type: InstrumentType;
  exchange: string;
  sector?: string;
}

interface ApiError {
  error: string;
  status: number;
}
```

---

## Konfigurace

### `src/config/constants.ts`

| Konstanta | Typ | Popis |
|---|---|---|
| `TIME_PERIODS` | `Array<{ key, label }>` | Časová období s bilingválními popisky |
| `STORAGE_KEYS` | `Record` | Klíče pro localStorage (`portfolio-tracker-state`, `portfolio-tracker-lang`, `portfolio-tracker-theme`) |
| `INSTRUMENT_TYPE_LABELS` | `Record` | Bilingvální názvy typů instrumentů |

### `src/config/sectors.ts`

| Konstanta | Typ | Popis |
|---|---|---|
| `DEFAULT_SECTORS` | `Record<InstrumentType, string>` | Výchozí sektor pro každý typ instrumentu (crypto → "Cryptocurrency", bond → "Fixed Income" atd.) |
| `SECTOR_LABELS` | `Record<string, { en, cs }>` | Bilingvální názvy 16 sektorů |

---

## Utility knihovny

### `src/lib/utils.ts`

| Funkce | Podpis | Popis |
|---|---|---|
| `cn` | `(...inputs: ClassValue[]) => string` | Spojení CSS tříd přes `clsx` |
| `formatPercent` | `(value: number) => string` | Formátování procent s +/- znaménkem (`+1.23%`, `-0.45%`) |
| `formatCurrency` | `(value: number, currency?: string) => string` | Formátování ceny přes `Intl.NumberFormat` |
| `formatDate` | `(date: Date \| string, locale?: string) => string` | Lokalizované formátování data (cs-CZ / en-US) |
| `getEqualWeights` | `(count: number) => number[]` | Vrací pole rovných vah pro `count` instrumentů |
| `getPortfolioWeights` | `(portfolio: Portfolio) => number[]` | Vrací pole vah — auto-detekce přes `hasCustomWeights()` |

### `src/lib/localStorage.ts`

| Funkce | Podpis | Popis |
|---|---|---|
| `getItem<T>` | `(key: string, fallback: T) => T` | Čtení z localStorage s JSON parsováním, SSR-safe |
| `setItem<T>` | `(key: string, value: T) => void` | Zápis do localStorage s JSON serializací |
| `removeItem` | `(key: string) => void` | Smazání klíče z localStorage |

Všechny funkce kontrolují `typeof window !== 'undefined'` pro bezpečné použití při SSR.

### `src/lib/yahooFinance.ts`

Server-side wrapper nad knihovnou `yahoo-finance2` (v3). Instance `new YahooFinance()` sdílená napříč požadavky.

| Funkce | Podpis | Cache TTL |
|---|---|---|
| `searchInstruments` | `(query: string) => Promise<SearchResult[]>` | 10 min |
| `getQuotes` | `(symbols: string[]) => Promise<Quote[]>` | 60 s |
| `getChart` | `(symbols: string[], period: TimePeriod, weights?: number[]) => Promise<ChartDataPoint[]>` | 5 min |
| `getNews` | `(symbols: string[]) => Promise<NewsArticle[]>` | 15 min |
| `getCalendarEvents` | `(symbols: string[]) => Promise<CalendarEvent[]>` | 30 min |

**Cachování:** In-memory `Map` s TTL expirací. Každý záznam má `{ data, expiresAt }`. Při expiraci se záznam smaže a znovu načte.

**Výpočet cenových změn (getQuotes):**
1. Načte aktuální quote přes `yf.quote(symbol)`
2. Načte historická data za 1 rok přes `yf.chart(symbol, { period1, interval: '1d' })`
3. Pro každé období (1W, 1M, 1Y, YTD) najde nejbližší historický bod a vypočte procentuální změnu

**Výpočet grafu portfolia (getChart):**
1. Pro každý symbol načte historická data s příslušným intervalem
2. Každou řadu normalizuje na base = 100 (první bod)
3. Vypočte vážený průměr napříč řadami (custom váhy nebo rovné)

---

## Context Providers

### `src/context/PortfolioContext.tsx`

Centrální state management pro portfolia. Používá `useReducer` se 7 akcemi.

**Hook:** `usePortfolio()`

| Vlastnost / metoda | Typ | Popis |
|---|---|---|
| `state` | `PortfolioState` | Celý stav (všechna portfolia + active ID) |
| `activePortfolio` | `Portfolio \| null` | Aktivní portfolio (derived) |
| `createPortfolio(name)` | `(string) => void` | Vytvoří nové portfolio a nastaví jako aktivní |
| `deletePortfolio(id)` | `(string) => void` | Smaže portfolio, přepne na první zbývající |
| `renamePortfolio(id, name)` | `(string, string) => void` | Přejmenuje portfolio |
| `setActivePortfolio(id)` | `(string \| null) => void` | Nastaví aktivní portfolio |
| `addInstrument(portfolioId, instrument)` | `(string, Instrument) => void` | Přidá instrument do portfolia (s volitelnou váhou) |
| `removeInstrument(portfolioId, symbol)` | `(string, string) => void` | Odebere instrument z portfolia |
| `updateInstrumentWeight(portfolioId, symbol, weight)` | `(string, string, number \| undefined) => void` | Aktualizuje váhu instrumentu |

**Reducer akce:** `SET_STATE`, `CREATE_PORTFOLIO`, `DELETE_PORTFOLIO`, `RENAME_PORTFOLIO`, `SET_ACTIVE`, `ADD_INSTRUMENT`, `REMOVE_INSTRUMENT`, `UPDATE_INSTRUMENT_WEIGHT`

**Persistence:** Při mountu načte stav z `localStorage["portfolio-tracker-state"]`. Při každé změně stav synchronizuje zpět.

### `src/context/LanguageContext.tsx`

Bilingvální i18n systém (EN/CS).

**Hook:** `useLanguage()`

| Vlastnost / metoda | Typ | Popis |
|---|---|---|
| `locale` | `'en' \| 'cs'` | Aktuální jazyk |
| `toggleLanguage()` | `() => void` | Přepne jazyk |
| `t(key)` | `(string) => string` | Přeloží klíč (dot notation: `'dashboard.name'`) |

**Překlady:** Lazy-loaded JSON soubory z `/locales/{en,cs}.json`. Cachovány v paměti po prvním načtení.

### `src/context/ThemeContext.tsx`

Světlý / tmavý režim.

**Hook:** `useTheme()`

| Vlastnost / metoda | Typ | Popis |
|---|---|---|
| `theme` | `'light' \| 'dark'` | Aktuální téma |
| `toggleTheme()` | `() => void` | Přepne téma |

**Chování:**
- Při mountu: zjistí uložené téma z localStorage, jinak respektuje `prefers-color-scheme`
- Přidává/odebírá třídu `dark` na `<html>` elementu
- Ukládá preferenci do `localStorage["portfolio-tracker-theme"]`

### `src/context/Providers.tsx`

Kompozitní wrapper: `ThemeProvider` → `LanguageProvider` → `PortfolioProvider`.

---

## Custom Hooks

### `src/hooks/useMarketData.ts`

```typescript
useMarketData(symbols: string[])
→ { quotes: Quote[], isLoading: boolean, error: string | null, refetch: () => Promise<void>, lastUpdated: number | null }
```

Načítá kotace z `/api/quote`. Auto-refresh každých 10 minut. Vrací `lastUpdated` timestamp pro odpočítávání. Refetchuje při změně seznamu symbolů.

### `src/hooks/useChart.ts`

```typescript
useChart(symbols: string[], period: TimePeriod, weights?: number[])
→ { data: ChartDataPoint[], isLoading: boolean, error: string | null, refetch: () => Promise<void> }
```

Načítá data grafu z `/api/chart`. Přepočítá při změně symbolů, období nebo vah.

### `src/hooks/useSearch.ts`

```typescript
useSearch(query: string)
→ { results: SearchResult[], isLoading: boolean }
```

Debounced vyhledávání (300 ms) přes `/api/search`. Při prázdném dotazu vrací `[]`.

### `src/hooks/useNews.ts`

```typescript
useNews(symbols: string[])
→ { articles: NewsArticle[], isLoading: boolean, error: string | null, refetch: () => Promise<void> }
```

Načítá zprávy z `/api/news`. Refetchuje při změně seznamu symbolů.

### `src/hooks/useCalendar.ts`

```typescript
useCalendar(symbols: string[])
→ { events: CalendarEvent[], isLoading: boolean, error: string | null, refetch: () => Promise<void> }
```

Načítá kalendářní události z `/api/calendar`. Refetchuje při změně seznamu symbolů.

---

## Komponenty

### UI primitiva (`src/components/ui/`)

| Komponenta | Props | Popis |
|---|---|---|
| `Button` | `variant: 'primary'\|'secondary'\|'ghost'\|'danger'`, `size: 'sm'\|'md'\|'lg'`, + HTML button attrs | Tlačítko s variantami a velikostmi |
| `Modal` | `isOpen`, `onClose`, `title`, `children`, `className?` | Modální dialog s overlay, ESC zavření, click-outside |
| `Spinner` | `className?` | Animovaný loading indikátor |
| `Badge` | `type: InstrumentType`, `label`, `className?` | Barevný badge podle typu instrumentu |
| `InstrumentLogo` | `symbol`, `name`, `type`, `logoUrl?`, `size?` | Logo instrumentu — zobrazí obrázek (pokud logoUrl) nebo barevnou iniciálu dle typu |
| `LanguageToggle` | — | Tlačítko pro přepnutí jazyka |
| `ThemeToggle` | — | Tlačítko pro přepnutí tématu (ikona slunce/měsíc) |

### Layout (`src/components/layout/`)

| Komponenta | Popis |
|---|---|
| `Header` | Sticky hlavička s navigací (Dashboard, Zprávy, Kalendář), portfolio switcherem, jazykovým a tematickým přepínačem. Responsive — mobilní navigace pod hlavičkou. |

### Portfolio (`src/components/portfolio/`)

| Komponenta | Props | Popis |
|---|---|---|
| `PortfolioSwitcher` | `onCreateNew: () => void` | Dropdown pro přepínání mezi portfolii. Zobrazuje název + počet instrumentů. Poslední položka "+ Přidat nové portfolio" otevře modal. Click-outside zavření. |
| `EditPortfolioModal` | `isOpen`, `onClose` | Modal pro správu instrumentů v portfoliu — zobrazuje seznam s logy, umožňuje editaci vah a odebrání instrumentů křížkem s potvrzením. |
| `CreatePortfolioModal` | `isOpen`, `onClose` | Modální formulář pro vytvoření portfolia (vstup: název). |
| `InstrumentSearch` | `onSelect: (SearchResult) => void`, `existingSymbols: string[]` | Vyhledávací pole s debounced autocomplete. Filtruje již přidané symboly. Zobrazuje symbol, typ badge, název, burzu. |
| `AddInstrumentModal` | `isOpen`, `onClose` | Dvou-krokový modal: 1) vyhledání instrumentu, 2) potvrzení s volitelným zadáním váhy (%). Pokud jiné instrumenty mají váhy, zobrazí upozornění. |

### Dashboard (`src/components/dashboard/`)

| Komponenta | Props | Popis |
|---|---|---|
| `TimePeriodSelector` | `selected: TimePeriod`, `onChange: (TimePeriod) => void` | Skupina tlačítek pro výběr časového období. Lokalizované popisky. |
| `PerformanceChart` | — | Recharts `LineChart` zobrazující výkonnost portfolia. Podporuje vlastní váhy. Zelená/červená barva podle trendu. Responsive container. |
| `RefreshControl` | `lastUpdated`, `isLoading`, `onRefresh` | Odpočítávání do automatického obnovení (10 min) + tlačítko pro manuální refresh (ikona otáčení). |
| `InstrumentsTable` | — | Tabulka instrumentů s logy, cenami, váhami a změnami. RefreshControl v hlavičce. Bez tlačítka odebrání (to je v EditPortfolioModal). Responsive. |
| `AllocationTable` | — | Sektorová alokace: stacked bar chart + legenda. Auto-detekce vlastních vah přes `hasCustomWeights()`. Bilingvální názvy sektorů. 10 barev pro sektory. |

### News (`src/components/news/`)

| Komponenta | Props | Popis |
|---|---|---|
| `NewsCard` | `article: NewsArticle` | Karta zprávy: thumbnail (nebo placeholder), nadpis, shrnutí (2 řádky), vydavatel, datum, související symboly, odkaz. |
| `NewsFeed` | — | Seznam zpráv z aktivního portfolia. Loading a empty stavy. |

### Calendar (`src/components/calendar/`)

| Komponenta | Props | Popis |
|---|---|---|
| `CalendarFeed` | — | Seznam nadcházejících a nedávných událostí (earnings, dividendy) pro instrumenty v portfoliu. Barevné ikony dle typu, počet dní do události. |

---

## Stránky

### `src/app/layout.tsx` — Root Layout

- Metadata: title "Portfolio Tracker", description
- Obaluje `<html>` s `suppressHydrationWarning` (dark mode)
- Providers wrapper (všechny kontexty)
- Header komponenta
- `<main>` s `max-w-7xl` containerem

### `src/app/page.tsx` — Dashboard

- Zobrazuje název aktivního portfolia
- Tlačítka: přidat instrument, upravit portfolio, smazat portfolio
- Komponenty: `PerformanceChart`, `InstrumentsTable`, `AllocationTable`
- Modaly: `AddInstrumentModal`, `EditPortfolioModal`
- Potvrzovací dialog pro smazání portfolia
- Empty state s tlačítkem pro vytvoření portfolia pokud žádné neexistuje

### `src/app/news/page.tsx` — Zprávy

- Wrapper renderující `NewsFeed` komponentu

### `src/app/calendar/page.tsx` — Kalendář událostí

- Wrapper renderující `CalendarFeed` komponentu

---

## Styly

### `src/app/globals.css`

- Tailwind CSS 4 import (`@import "tailwindcss"`)
- Dark mode varianta: `@custom-variant dark (&:where(.dark, .dark *))`
- Theme proměnné: `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`
- Custom utilita `.line-clamp-2` pro ořezání textu na 2 řádky

### Dark mode strategie

Třída `dark` na `<html>` elementu (spravována přes `ThemeContext`). Všechny komponenty používají Tailwind `dark:` varianty.

### Responsive breakpointy

- **Mobile** (< 640px): jednosloupcový layout, skryté méně důležité sloupce tabulky, mobilní navigace
- **Tablet** (640-1024px): více sloupců viditelných, desktop navigace
- **Desktop** (> 1024px): plný layout se všemi sloupci

---

## Lokalizace

### Struktura překladových souborů

Soubory: `public/locales/en.json`, `public/locales/cs.json`

```
{
  "app":        { ... }     // Název aplikace
  "header":     { ... }     // Navigace, tlačítka v hlavičce
  "dashboard":  { ... }     // Popisky na dashboardu
  "portfolio":  { ... }     // Dialogy správy portfolia
  "search":     { ... }     // Vyhledávání instrumentů
  "news":       { ... }     // Sekce zpráv
  "calendar":   { ... }     // Kalendář událostí
  "periods":    { ... }     // Časová období (1D, 1T, 1M...)
  "types":      { ... }     // Typy instrumentů
  "errors":     { ... }     // Chybové hlášky
}
```

### Použití v komponentách

```tsx
const { t } = useLanguage();
// Dot notation přístup:
t('dashboard.name')      // → "Name" nebo "Název"
t('types.stock')         // → "Stock" nebo "Akcie"
```

### Přidání nového překladu

1. Přidejte klíč do obou souborů (`en.json` i `cs.json`)
2. Použijte přes `t('section.key')` v komponentě
