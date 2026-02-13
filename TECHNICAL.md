# Technická dokumentace

Tento dokument popisuje technické detaily implementace Portfolio Trackeru — datové modely, komponenty, hooky, kontexty, utility funkce a konfiguraci.

---

## Obsah

1. [Datové modely (Types)](#datové-modely)
2. [Databázové schéma (Supabase)](#databázové-schéma)
3. [Konfigurace](#konfigurace)
4. [Utility knihovny (lib/)](#utility-knihovny)
5. [Supabase vrstva](#supabase-vrstva)
6. [Context Providers](#context-providers)
7. [Custom Hooks](#custom-hooks)
8. [Komponenty](#komponenty)
9. [Stránky (Pages)](#stránky)
10. [Styly](#styly)
11. [Lokalizace](#lokalizace)

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

interface PortfolioMetrics {
  sharpeRatio: number | null;  // Sharpe ratio (rizikově vážený výnos)
  beta: number | null;         // Beta vůči S&P 500
  alpha: number | null;        // Jensenova Alfa
  sortinoRatio: number | null; // Sortino ratio (jen downside volatilita)
  treynorRatio: number | null; // Treynor ratio (systematický rizik. výnos)
  calmarRatio: number | null;  // Calmar ratio (výnos / max. propad)
}

interface CountryAllocationItem {
  country: string;         // Název země
  countryCode: string;     // ISO kód (US, DE, GB...)
  percentage: number;      // Podíl v portfoliu (%)
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

### `src/types/auth.ts`

Definuje struktury pro autentizaci a uživatelské profily.

```typescript
interface UserProfile {
  id: string;           // UUID z Supabase Auth
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  id: string;           // UUID z Supabase Auth
  language: string;     // Locale kód (en, cs, sk, uk, zh, mn)
  theme: string;        // Kombinovaný formát "skin|avatar" (např. "ocean|ninja"), zpětně kompatibilní s "light"/"dark"
  dashboard_order: string[]; // Pořadí sekcí dashboardu
  updated_at: string;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SignInData {
  email: string;
  password: string;
}
```

---

## Databázové schéma

Aplikace používá Supabase PostgreSQL s Row Level Security (RLS). Schema se vytváří ručně v Supabase Dashboard → SQL Editor.

### SQL Schema

```sql
-- Profily uživatelů (auto-vytvoření přes trigger při registraci)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Uživatelské preference (auto-vytvoření přes trigger při registraci)
CREATE TABLE user_preferences (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  dashboard_order JSONB DEFAULT '["performance","instruments","sectorAllocation","typeAllocation","countryAllocation","metrics"]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = id);

-- Portfolia
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own portfolios" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolios" ON portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolios" ON portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolios" ON portfolios FOR DELETE USING (auth.uid() = user_id);

-- Instrumenty
CREATE TABLE instruments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stock','etf','crypto','bond','commodity')),
  sector TEXT,
  weight NUMERIC,
  logo_url TEXT,
  added_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own instruments" ON instruments FOR SELECT
  USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own instruments" ON instruments FOR INSERT
  WITH CHECK (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own instruments" ON instruments FOR UPDATE
  USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own instruments" ON instruments FOR DELETE
  USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));

-- Trigger: automatické vytvoření profilu a preferencí při registraci
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  INSERT INTO user_preferences (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## Konfigurace

### `src/config/constants.ts`

| Konstanta | Typ | Popis |
|---|---|---|
| `TIME_PERIODS` | `Array<{ key, label }>` | Časová období s bilingválními popisky |
| `STORAGE_KEYS` | `Record` | Klíče pro localStorage (`portfolio-tracker-state`, `portfolio-tracker-lang`, `portfolio-tracker-theme`, `portfolio-tracker-avatar`) |
| `SKINS` | `Array<{ key: Skin, isDark, label, emoji }>` | 6 skinů: light, dark, ocean, sunset, forest, cyberpunk |
| `AVATARS` | `Array<{ id: AvatarId, label }>` | 8 avatarů: ninja, astronaut, robot, pirate, wizard, alien, cat, bear |
| `Skin` | Type alias | `'light' \| 'dark' \| 'ocean' \| 'sunset' \| 'forest' \| 'cyberpunk'` |
| `AvatarId` | Type alias | `'ninja' \| 'astronaut' \| 'robot' \| 'pirate' \| 'wizard' \| 'alien' \| 'cat' \| 'bear'` |
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
| `formatDate` | `(date: Date \| string, locale?: string) => string` | Lokalizované formátování data (6 lokálů: en-US, cs-CZ, sk-SK, uk-UA, zh-CN, mn-MN) |
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
| `getLogoImage` | `(symbol: string, type: InstrumentType) => Promise<{ buffer: Buffer; contentType: string } \| null>` | 7 dní |
| `getCountries` | `(symbols: string[], types: InstrumentType[]) => Promise<{ symbol, country, countryCode }[]>` | 24 h |
| `getPortfolioMetrics` | `(symbols: string[], weights: number[]) => Promise<PortfolioMetrics>` | 10 min |

**Logo image proxy (`getLogoImage`):**

Vrací surové byty obrázku (ne URL). Server-side proxy stahuje loga z webu firmy.

1. **Krypto:** Stáhne PNG z cryptocurrency-icons CDN, odstraní příponu `-USD` ze symbolu
2. **Akcie/ETF/ostatní:** Tříúrovňový fallback:
   1. Zjistí doménu firmy: `COMMON_DOMAINS` mapa (~50 známých tickerů) → fallback na `yf.quoteSummary(symbol).assetProfile.website`
   2. Zkusí `https://{domain}/apple-touch-icon.png`
   3. Zkusí `https://{domain}/apple-touch-icon-precomposed.png`
   4. Zkusí Google faviconV2: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://{domain}&size=128`
3. Vrací `null` pokud logo nelze najít — klient pak zobrazí barevnou iniciálu

**Pomocné funkce:**
- `resolveDomain(symbol)` — najde doménu firmy (COMMON_DOMAINS → Yahoo assetProfile)
- `tryFetchImage(url)` — stáhne a validuje obrázek (5s timeout, min. 100B, content-type musí být image)

**Výpočet metrik portfolia (`getPortfolioMetrics`):**
1. Načte 1 rok denních dat pro všechny symboly + S&P 500 (^GSPC) jako benchmark
2. Spočítá vážené denní výnosy portfolia
3. Vypočte 6 metrik: Sharpe, Beta, Jensenova Alfa, Sortino, Treynor, Calmar (anualizovaný výnos / maximální propad)
4. Risk-free rate: 4,5 % p.a.

**Výpočet zemí (`getCountries`):**
1. Přeskočí krypto symboly (nemají zemi)
2. Načte `assetProfile` přes `yf.quoteSummary()`, extrahuje `country`
3. Vrací `{ symbol, country, countryCode }`

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

## Supabase vrstva

### `src/lib/supabase/client.ts`
Browser-side Supabase klient (`createBrowserClient` z `@supabase/ssr`). Používá cookie-based session management.

### `src/lib/supabase/server.ts`
Server-side Supabase klient pro Server Components a API Routes. Čte cookies přes Next.js `cookies()`.

### `src/app/api/auth/signout/route.ts`
Server-side API route pro odhlášení. Volá `supabase.auth.signOut()` přes server-side klient, čímž správně vyčistí httpOnly auth cookies. Voláno z `AuthContext.signOut()` před redirectem na `/login`.

### `src/lib/supabase/middleware.ts`
Middleware helper — refreshuje session tokeny a vynucuje autentizaci. Používá `getUser()` (ne `getSession()`) pro server-side validaci JWT — `getSession()` pouze čte z cookies bez ověření, takže podvržený JWT by mohl obejít ochranu routes. Nepřihlášení uživatelé jsou přesměrováni na `/login`, přihlášení na `/login` jsou přesměrováni na `/`.

### `src/lib/supabase/database.ts`
Centrální datová vrstva — CRUD operace pro profily, preference, portfolia a instrumenty. Všechny komponenty přistupují k DB přes tento modul.

| Funkce | Popis |
|---|---|
| `getProfile(userId)` | Načte profil uživatele |
| `updateProfile(userId, updates)` | Aktualizuje jméno/příjmení |
| `getPreferences(userId)` | Načte preference (jazyk, téma, pořadí) |
| `updatePreferences(userId, updates)` | Aktualizuje preference |
| `getPortfolios(userId)` | Načte všechna portfolia uživatele |
| `createPortfolio(userId, name, isActive)` | Vytvoří nové portfolio |
| `deletePortfolio(portfolioId)` | Smaže portfolio (kaskádně i instrumenty) |
| `renamePortfolio(portfolioId, name)` | Přejmenuje portfolio |
| `setActivePortfolio(userId, portfolioId)` | Nastaví aktivní portfolio |
| `getInstruments(portfolioId)` | Načte instrumenty portfolia |
| `getAllInstruments(portfolioIds)` | Načte instrumenty více portfolií najednou |
| `addInstrument(portfolioId, instrument)` | Přidá instrument |
| `removeInstrument(portfolioId, symbol)` | Odebere instrument |
| `updateInstrumentWeight(portfolioId, symbol, weight)` | Aktualizuje váhu instrumentu |

### `src/lib/supabase/migration.ts`
Jednorázová migrace dat z localStorage do Supabase při prvním přihlášení. Kontroluje, zda uživatel již má data v Supabase — pokud ne, migruje portfolia, instrumenty a preference z localStorage. Po úspěšné migraci vyčistí localStorage.

### `src/middleware.ts`
Next.js middleware — volá `updateSession()` pro refresh session tokenů. Matcher vylučuje statické soubory, API routes a assety.

---

## Context Providers

### `src/context/AuthContext.tsx`

Autentizační kontext — spravuje přihlášení, registraci a odhlášení přes Supabase Auth.

**Hook:** `useAuth()`

| Vlastnost / metoda | Typ | Popis |
|---|---|---|
| `user` | `User \| null` | Supabase Auth user objekt |
| `profile` | `UserProfile \| null` | Profil uživatele (jméno, příjmení, e-mail) |
| `isLoading` | `boolean` | Zda se načítá session |
| `isSigningOut` | `boolean` | Zda probíhá odhlášení (zabraňuje flash "žádné portfolio") |
| `signIn(data)` | `(SignInData) => Promise<{ error }>` | Přihlášení e-mailem a heslem |
| `signUp(data)` | `(SignUpData) => Promise<{ error }>` | Registrace s metadaty (jméno, příjmení) |
| `signOut()` | `() => Promise<void>` | Odhlášení a přesměrování na `/login` |
| `refreshProfile()` | `() => Promise<void>` | Znovu načte profil z DB (po úpravě v nastavení) |

**Chování (2-efektová architektura):**

AuthContext používá dva oddělené efekty, aby se zabránilo deadlocku Supabase auth locku:

- **Effect 1 (synchronní):** Registruje `onAuthStateChange` listener. Callback NESMÍ být async pro `INITIAL_SESSION` event, protože ten se spouští UVNITŘ Supabase auth locku. Pokud by callback čekal na DB dotazy (které potřebují `getSession()` → stejný lock), došlo by k deadlocku. Nastaví `user` state a `isLoading` (false pouze pro odhlášení/null user).
- **Effect 2 (async):** Reaguje na změnu `user?.id`. Načte profil z DB a spustí migraci z localStorage. Tento efekt běží AŽ PO uvolnění auth locku, takže DB dotazy fungují normálně. Používá `profileLoadRef` pro zamezení duplicitních načtení.
- Při odhlášení: klientský signOut + server-side `POST /api/auth/signout` (vyčistí cookies) + redirect na `/login`

**Proč ne jeden efekt s async callbackem?**
Supabase v2.x drží interní auth lock při emitování `INITIAL_SESSION`. Jakýkoli `await` uvnitř callbacku, který nepřímo volá `getSession()` (a to dělají i DB dotazy přes Supabase klient), způsobí deadlock — stránka se zasekne v loading stavu a portfolia se nikdy nenačtou.

### `src/context/PortfolioContext.tsx`

Centrální state management pro portfolia. Používá `useReducer` s Supabase jako persistent backend.

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

**Reducer akce:** `SET_STATE`, `SET_PORTFOLIOS`, `ADD_PORTFOLIO`, `REMOVE_PORTFOLIO`, `UPDATE_PORTFOLIO_NAME`, `SET_ACTIVE`, `ADD_INSTRUMENT`, `REMOVE_INSTRUMENT`, `UPDATE_INSTRUMENT_WEIGHT`

**Persistence:** Při mountu načte data z Supabase (portfolia + instrumenty). Čeká na dokončení autentizace (`authLoading === false`) — tím se zabrání DB dotazům v době, kdy je ještě držen Supabase auth lock. Každá akce (CRUD) volá příslušnou funkci z `database.ts` a současně aktualizuje lokální reducer state. Závisí na `user?.id` a `authLoading` z `AuthContext` — reload z DB se spustí pouze při skutečné změně uživatele (login/logout), nikoliv při token refresh.

### `src/context/LanguageContext.tsx`

Vícejazyčný i18n systém (6 jazyků).

**Hook:** `useLanguage()`

| Vlastnost / metoda | Typ | Popis |
|---|---|---|
| `locale` | `'en' \| 'cs' \| 'sk' \| 'uk' \| 'zh' \| 'mn'` | Aktuální jazyk |
| `setLocale(locale)` | `(Locale) => void` | Nastaví jazyk na zvolený locale |
| `t(key)` | `(string) => string` | Přeloží klíč (dot notation: `'dashboard.name'`) |

**Podporované jazyky:** EN (angličtina), CZ (čeština), SK (slovenština), UA (ukrajinština), ZH (čínština), MN (mongolština).

**Výchozí jazyk:** čeština (`cs`). Nový návštěvník bez uloženého nastavení uvidí stránku česky. Po přepnutí jazyka se volba uloží do localStorage a Supabase.

**Překlady:** Lazy-loaded JSON soubory z `/locales/{en,cs,sk,uk,zh,mn}.json`. Cachovány v paměti po prvním načtení.

### `src/context/ThemeContext.tsx`

Single source of truth pro skin, avatar a theme (light/dark). Spravuje 6 skinů a 8 avatarů.

**Hook:** `useTheme()`

| Vlastnost / metoda | Typ | Popis |
|---|---|---|
| `theme` | `'light' \| 'dark'` | Odvozeno ze skinu (`skinIsDark()`) |
| `skin` | `Skin` | Aktuální skin (light, dark, ocean, sunset, forest, cyberpunk) |
| `avatar` | `AvatarId` | Aktuální avatar (ninja, astronaut, robot, pirate, wizard, alien, cat, bear) |
| `toggleTheme()` | `() => void` | Přepne mezi light/dark (persistuje okamžitě) |
| `setTheme(theme)` | `('light' \| 'dark') => void` | Nastaví light nebo dark skin |
| `setSkin(skin)` | `(Skin) => void` | Živý náhled skinu — ukládá do localStorage, NE do DB |
| `setAvatar(avatar)` | `(AvatarId) => void` | Živý náhled avatara — ukládá do localStorage, NE do DB |
| `persistPreferences()` | `() => Promise<void>` | Uloží aktuální skin + avatar do DB i localStorage |

**Persistence formát:** Skin a avatar se ukládají jako kombinovaný řetězec `"skin|avatar"` (např. `"ocean|ninja"`) do sloupce `user_preferences.theme`. Zpětně kompatibilní s plain `"light"` / `"dark"`.

**Klíčové funkce:**
- `parseThemeValue(raw)` — dekóduje `"ocean|ninja"` na `{ skin: 'ocean', avatar: 'ninja' }`, fallback na `light` + `ninja`
- `encodeThemeValue(skin, avatar)` — zakóduje na `"ocean|ninja"`
- `skinIsDark(skin)` — vrací `true` pro dark, ocean, forest, cyberpunk

**Chování:**
- Při mountu: zjistí uložené hodnoty z localStorage, jinak respektuje `prefers-color-scheme`
- Registruje `onAuthStateChange` listener — při `INITIAL_SESSION` nebo `SIGNED_IN` načte preferenci z Supabase (má přednost nad localStorage). Tím se zabrání volání `getUser()`, které by mohlo způsobit deadlock uvnitř auth locku.
- Přidává/odebírá třídu `dark` na `<html>` elementu + nastavuje atribut `data-skin` pro CSS overrides
- `setSkin()` / `setAvatar()` slouží k živému náhledu v SettingsModal — ukládají jen do localStorage
- `persistPreferences()` uloží do DB — voláno z SettingsModal při kliknutí na "Uložit"
- `toggleTheme()` persistuje okamžitě (pro toggle button v hlavičce, mimo nastavení)

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

### `src/hooks/useCountries.ts`

```typescript
useCountries(symbols: string[], types: InstrumentType[], weights: number[])
→ { countries: CountryAllocationItem[], isLoading: boolean, error: string | null, refetch: () => Promise<void> }
```

Načítá geografické rozložení z `/api/countries`. Agreguje data podle země s využitím vah portfolia. Vrací seřazeno sestupně dle procenta.

### `src/hooks/useMetrics.ts`

```typescript
useMetrics(symbols: string[], weights: number[])
→ { metrics: PortfolioMetrics | null, isLoading: boolean, error: string | null, refetch: () => Promise<void> }
```

Načítá hodnocení portfolia z `/api/metrics`. Refetchuje při změně symbolů nebo vah.

### `src/hooks/useDashboardOrder.ts`

```typescript
useDashboardOrder()
→ { order: string[], draggedId: string | null, dragOverId: string | null,
    handleDragStart: (id: string) => void, handleDragOver: (id: string) => void, handleDragEnd: () => void }
```

Spravuje pořadí sekcí dashboardu s drag-and-drop. Ukládá pořadí do `localStorage["portfolio-tracker-dashboard-order"]` a synchronizuje s Supabase. Výchozí pořadí: `keyStats`, `performance`, `instruments`, `sectorAllocation`, `typeAllocation`, `countryAllocation`, `metrics`. Při načtení sloučí uložené pořadí s výchozím (přidá nové sekce, odebere smazané).

---

## Komponenty

### UI primitiva (`src/components/ui/`)

| Komponenta | Props | Popis |
|---|---|---|
| `Button` | `variant: 'primary'\|'secondary'\|'ghost'\|'danger'`, `size: 'sm'\|'md'\|'lg'`, + HTML button attrs | Tlačítko s variantami a velikostmi |
| `Modal` | `isOpen`, `onClose`, `title`, `children`, `className?` | Modální dialog s overlay, ESC zavření, click-outside |
| `Spinner` | `className?` | Animovaný loading indikátor |
| `Badge` | `type: InstrumentType`, `label`, `className?` | Barevný badge podle typu instrumentu |
| `InstrumentLogo` | `symbol`, `name`, `type`, `logoUrl?`, `size?` | Logo instrumentu — `<img>` tag s `src="/api/logo?symbol=X&type=Y"` (server-side image proxy), onError fallback na barevnou iniciálu dle typu. Lazy loading. |
| `LanguageToggle` | — | Dropdown pro výběr jazyka (6 jazyků) — obrázky vlajek z flagcdn.com CDN (`<img>` tagy s srcSet pro retina), click-outside zavření, zvýraznění aktivního jazyka |
| `ThemeToggle` | — | Tlačítko pro přepnutí tématu (ikona slunce/měsíc) |

### Layout (`src/components/layout/`)

| Komponenta | Popis |
|---|---|
| `Header` | Sticky hlavička s navigací (Dashboard, Zprávy, Kalendář), portfolio switcherem, jazykovým a tematickým přepínačem. User menu: avatar pill (FunAvatar + celé jméno uživatele) s dropdown nabídkou (profil, nastavení, odhlášení). Spravuje SettingsModal a CreatePortfolioModal. Responsive — mobilní navigace pod hlavičkou. |

### Portfolio (`src/components/portfolio/`)

| Komponenta | Props | Popis |
|---|---|---|
| `PortfolioSwitcher` | `onCreateNew: () => void` | Dropdown pro přepínání mezi portfolii. Zobrazuje název + počet instrumentů. Poslední položka "+ Přidat nové portfolio" otevře modal. Click-outside zavření. |
| `EditPortfolioModal` | `isOpen`, `onClose` | Modal pro správu instrumentů v portfoliu — pracuje s lokální kopií stavu. Zobrazuje seznam s logy, umožňuje editaci vah a odebrání instrumentů. Zobrazuje celkovou váhu, zbývající %, blokuje uložení při >100%. Tlačítko Save uloží změny do kontextu, Cancel zahodí úpravy. |
| `CreatePortfolioModal` | `isOpen`, `onClose` | Modální formulář pro vytvoření portfolia (vstup: název). |
| `InstrumentSearch` | `onSelect: (SearchResult) => void`, `existingSymbols: string[]` | Vyhledávací pole s debounced autocomplete. Filtruje již přidané symboly. Zobrazuje symbol, typ badge, název, burzu. |
| `AddInstrumentModal` | `isOpen`, `onClose` | Jednokrokový modal: vyhledávání, vybraný instrument a zadání váhy (%) na jedné obrazovce. Po přidání se modal zavře. Zobrazuje zbývající % váhy, blokuje přidání při překročení 100%. Pokud jiné instrumenty mají váhy, zobrazí upozornění. |
| `ImportCsvModal` | `isOpen`, `onClose` | Modal pro hromadný import instrumentů z CSV souboru (oddělovač středník). Zobrazuje pokyny k formátu, nahrání souboru (.csv/.txt), parsování a náhled v tabulce. Po importu validuje tickery přes `/api/search`, kontroluje nepřekročení 100% váhy. Výsledek: počet úspěšně importovaných + přeskočených s důvody. |

### Dashboard (`src/components/dashboard/`)

| Komponenta | Props | Popis |
|---|---|---|
| `TimePeriodSelector` | `selected: TimePeriod`, `onChange: (TimePeriod) => void` | Skupina tlačítek pro výběr časového období. Lokalizované popisky. |
| `KeyStats` | — | Zobrazuje 5 klíčových statistik výkonnosti portfolia (5 let, 1 rok, YTD, měsíc, týden). Načítá data paralelně pro všechna období přes `/api/chart`. Grid layout (2-3-5 sloupců dle breakpointu). |
| `PerformanceChart` | `refreshSignal?: number` | Recharts `LineChart` zobrazující výkonnost portfolia. Podporuje vlastní váhy. Zelená/červená barva podle trendu. **Nové:** Možnost porovnání s až 5 dalšími instrumenty. Vyhledávání přes `InstrumentSearch`. Procentuální zhodnocení na konci každé čáry (custom `CustomDot` komponenta). Barevně odlišené čáry pro srovnávací instrumenty. Data srovnání se neukládají (lokální state). Responsive container. |
| `RefreshControl` | `lastUpdated`, `isLoading`, `onRefresh` | Odpočítávání do automatického obnovení (10 min) + tlačítko pro manuální refresh (ikona otáčení). Umístěn na úrovni dashboardu vedle názvu portfolia. Refresh spouští obnovu kotací i grafu (přes refreshSignal prop). |
| `InstrumentsTable` | `quotes`, `isLoading` | Tabulka instrumentů s logy, cenami, váhami a změnami. Přijímá kotace a stav načítání jako props (nepoužívá vlastní hook). Bez tlačítka odebrání (to je v EditPortfolioModal). **Automatické řazení podle váhy** (sestupně) pokud jsou nastaveny vlastní váhy. Responsive. |
| `AllocationTable` | — | Sektorová alokace: stacked bar chart + legenda. Auto-detekce vlastních vah přes `hasCustomWeights()`. Bilingvální názvy sektorů. 10 barev pro sektory. |
| `TypeAllocation` | — | Alokace dle typu instrumentu (stock, ETF, crypto, bond, commodity). Horizontální bar chart + legenda. Barvy: modrá (stock), fialová (ETF), oranžová (crypto), zelená (bond), žlutá (commodity). Čistě klient-side výpočet z portfolia. |
| `CountryAllocation` | — | Alokace dle země původu. Načítá data přes `useCountries` hook. Stacked bar chart + legenda s vlajkami (flagcdn.com). Loading spinner, empty state. 12 barev pro země. |
| `PortfolioMetrics` | — | Hodnocení portfolia — 6 finančních metrik ve 2-sloupcové mřížce. Každá metrika zobrazena přes `MetricGauge` s piecewise lineární škálou (center=0 pro většinu metrik, center=1 pro Beta). Rozsahy: Sharpe [-8, 3], Beta [0, 2], Alpha [-120, 40], Sortino [-8, 4], Treynor [-1, 0.5], Calmar [-3, 3]. Načítá data přes `useMetrics` hook. Loading spinner. |
| `MetricGauge` | `name`, `value`, `tooltip`, `min`, `max`, `center?`, `format?` | Vizuální ukazatel jedné metriky: název, hodnota, gradientní osa (červená→žlutá→zelená) s markerem. Info ikona s tooltip vysvětlením. **Piecewise lineární mapování:** pokud je zadán `center`, hodnoty pod centrem se mapují na [0%, 40%] osy a nad centrem na [40%, 100%]. Díky tomu je neutrální hodnota (0) vždy na 40 % osy a extrémně záporné hodnoty (Sharpe -4, Alpha -86 %) nejsou přilepené na samém okraji. Bez `center` se použije klasická lineární škála. |
| `DraggableSection` | `id`, `isDragged`, `isDragOver`, `onDragStart`, `onDragOver`, `onDragEnd`, `children` | Wrapper pro drag-and-drop sekcí. HTML5 DnD API. Vizuální zpětná vazba: opacity při přetahování, modrý ring při hoveru. 6-bodová drag handle ikona v pravém horním rohu. |

### Settings (`src/components/settings/`)

| Komponenta | Props | Popis |
|---|---|---|
| `SettingsModal` | `isOpen`, `onClose` | Modální dialog nastavení se dvěma záložkami. **Osobní údaje:** úprava jména, příjmení, e-mailu a změna hesla (s ověřením aktuálního). **Personalizace:** výběr avatara (8 SVG avatarů v mřížce 4×2) a skinu aplikace (6 skinů v mřížce 3×2 s barevnými preview). Živý náhled — změny jsou viditelné okamžitě při výběru (snapshot/revert pattern: `originalSkinRef` + `originalAvatarRef`). Patička: "Zavřít" (revert na uložené hodnoty) a "Uložit" (batch save: profil → e-mail → heslo → `persistPreferences()` → `refreshProfile()`). Úspěch/chyba zobrazeny v patičce. |
| `FunAvatar` | `avatarId: AvatarId`, `className?` | Vykreslí jeden z 8 vtipných SVG avatarů (Ninja, Astronaut, Robot, Pirát, Čaroděj, Mimozemšťan, Cool Kočka, Medvěd). ViewBox 0 0 40 40. Používá se v Header (user menu pill + dropdown) a v SettingsModal (picker). |

### Login (`src/components/login/`)

| Komponenta | Props | Popis |
|---|---|---|
| `BusinessmanAvatars` | — | 8 SVG karikatur známých podnikatelů / finančníků jako dekorace na přihlašovací stránce (Elon Musk, Jeff Bezos, Michael Saylor, Jerome Powell, Aleš Michl, Warren Buffett, Christine Lagarde, Satoshi Nakamoto). ViewBox 0 0 160 220. |

### News (`src/components/news/`)

| Komponenta | Props | Popis |
|---|---|---|
| `NewsCard` | `article: NewsArticle` | Karta zprávy: thumbnail (nebo placeholder), nadpis, shrnutí (2 řádky), vydavatel, datum, související symboly, odkaz. |
| `NewsFeed` | — | Seznam zpráv z aktivního portfolia s multi-select filtrem instrumentů. Dropdown s checkboxy, logy a názvy instrumentů. Defaultně všechny vybrány. Loading, empty a no-selection stavy. |

### Calendar (`src/components/calendar/`)

| Komponenta | Props | Popis |
|---|---|---|
| `CalendarFeed` | — | Seznam nadcházejících a nedávných událostí (earnings, dividendy) pro instrumenty v portfoliu. Barevné ikony dle typu, počet dní do události. |

---

## Stránky

### `src/app/layout.tsx` — Root Layout

- Metadata: title "Portfolio Tracker", description
- Obaluje `<html>` s `suppressHydrationWarning` (dark mode)
- Pouze `ThemeProvider` + `LanguageProvider` (sdílené i pro login)

### `src/app/(app)/layout.tsx` — App Layout (chráněné stránky)

- `'use client'` — client-side layout
- Přidává `AuthProvider` + `PortfolioProvider`
- Renderuje `Header` a `<main>` container
- Všechny stránky v `(app)/` route group vyžadují přihlášení

### `src/app/login/page.tsx` — Přihlašovací stránka

- Animované gradientové pozadí (CSS `@keyframes gradient-shift`)
- Název aplikace "Honzův bombézní portfolio tracker" s bounce animací
- Dvě záložky: Přihlásit se / Vytvořit účet
- Formulář s validací (e-mail, heslo, jméno, příjmení)
- Přepínač jazyků a témat v pravém horním rohu
- Po úspěšném přihlášení/registraci přesměruje na dashboard

### `src/app/(app)/page.tsx` — Dashboard

- Loading stav při `authLoading || portfolioLoading || isSigningOut` (zabraňuje flash při odhlášení)
- Zobrazuje název aktivního portfolia
- Tlačítka: přidat instrument, import CSV, upravit portfolio, smazat portfolio
- `RefreshControl` vedle názvu portfolia (obnoví kotace i graf přes refreshSignal)
- Varovný banner pokud portfolio používá vlastní váhy a jejich součet < 100% (informuje o možném zkreslení statistik)
- Sekce dashboardu obaleny v `DraggableSection` — umožňuje přeřazení myší (drag-and-drop)
- Pořadí sekcí řízeno přes `useDashboardOrder` hook s localStorage a Supabase persistencí
- Sekce: `KeyStats`, `PerformanceChart`, `InstrumentsTable`, `AllocationTable`, `TypeAllocation`, `CountryAllocation`, `PortfolioMetrics`
- Modaly: `AddInstrumentModal`, `EditPortfolioModal`, `ImportCsvModal`
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
- Login animace: `@keyframes gradient-shift` (pozadí), `bounce-gentle` (nadpis), `fade-in-up` (karta), `float` (dekorace)
- CSS třídy: `.login-bg`, `.login-title`, `.login-card`, `.login-float` — podpora dark mode
- **Skin CSS overrides:** `[data-skin="ocean"]`, `[data-skin="sunset"]`, `[data-skin="forest"]`, `[data-skin="cyberpunk"]` — přepisují hlavičku, akcentní barvy (bg-blue-600, text-blue-600), pozadí stránky atd. pomocí `!important`

### Dark mode a skin strategie

Třída `dark` na `<html>` elementu + atribut `data-skin` (spravováno přes `ThemeContext`). Všechny komponenty používají Tailwind `dark:` varianty. Skiny přepisují barvy pomocí `[data-skin="X"]` selektorů s `!important` v `globals.css`. Tmavé skiny (ocean, forest, cyberpunk) automaticky aktivují `dark` třídu.

### Responsive breakpointy

- **Mobile** (< 640px): jednosloupcový layout, skryté méně důležité sloupce tabulky, mobilní navigace
- **Tablet** (640-1024px): více sloupců viditelných, desktop navigace
- **Desktop** (> 1024px): plný layout se všemi sloupci

---

## Lokalizace

### Struktura překladových souborů

Soubory: `public/locales/{en,cs,sk,uk,zh,mn}.json`

```
{
  "app":        { ... }     // Název aplikace
  "header":     { ... }     // Navigace, tlačítka v hlavičce
  "dashboard":  { ... }     // Popisky na dashboardu (vč. compare, portfolio, keyStats, period5y, period1y, period1mo, period1w, typeAllocation, countryAllocation, noCountryData)
  "portfolio":  { ... }     // Dialogy správy portfolia (vč. importCsv)
  "import":     { ... }     // CSV import — pokyny, chybové hlášky, výsledky
  "auth":       { ... }     // Autentizace — přihlášení, registrace, chyby
  "settings":   { ... }     // Nastavení — osobní údaje, personalizace, heslo, avatary, skiny
  "search":     { ... }     // Vyhledávání instrumentů
  "news":       { ... }     // Sekce zpráv
  "calendar":   { ... }     // Kalendář událostí
  "periods":    { ... }     // Časová období (1D, 1T, 1M...)
  "types":      { ... }     // Typy instrumentů
  "metrics":    { ... }     // Finanční metriky portfolia (názvy + tooltips)
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

1. Přidejte klíč do všech 6 jazykových souborů (`en.json`, `cs.json`, `sk.json`, `uk.json`, `zh.json`, `mn.json`)
2. Použijte přes `t('section.key')` v komponentě
