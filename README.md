# Portfolio Tracker

Online portfolio tracker pro sledování výkonnosti investičních portfolií. Aplikace umožňuje vytvářet a spravovat více portfolií obsahujících akcie, ETF, kryptoměny, dluhopisy a komodity, zobrazovat grafy výkonnosti, cenové změny, sektorovou alokaci a relevantní finanční zprávy.

---

## Funkce

### Správa portfolií
- Vytvoření libovolného počtu portfolií s vlastním názvem
- Přepínání mezi portfolii přes dropdown v hlavičce
- Vytvoření nového portfolia přímo z dropdownu (položka "+ Přidat nové portfolio")
- Pokud neexistuje žádné portfolio, tlačítko pro vytvoření je přímo na dashboardu
- Přidávání instrumentů vyhledáváním podle názvu nebo tickeru (AAPL, BTC-USD, GLD...)
- Hromadný import instrumentů z CSV souboru (tlačítko "Import CSV" vedle "Přidat instrument")
- Úprava portfolia přes modální dialog "Upravit portfolio" — změna vah a odebrání instrumentů (editace probíhá na lokální kopii, uložení přes Save, zrušení přes Cancel)
- Smazání celého portfolia s potvrzovacím dialogem

### Dashboard
- **Hlavní statistiky** — rychlý přehled výkonnosti portfolia za klíčová období
  - Zobrazuje 5 hodnot: 5 let, 1 rok, YTD, Měsíc, Týden
  - Všechny hodnoty vedle sebe pro okamžitý přehled
  - Zelená/červená barva podle zhodnocení
- **Graf výkonnosti** — interaktivní čárový graf (Recharts) zobrazující vážený vývoj portfolia
  - Časová období: 1D, 1T, 1M, 1R, 5L, YTD
  - Zelená/červená barva podle celkového vývoje
  - **Porovnání s jinými instrumenty** — možnost přidat až 5 srovnávacích instrumentů
    - Tlačítko "+ Porovnat" pro vyhledání a přidání instrumentu
    - Každý instrument má vlastní barevně odlišenou čáru
    - Procentuální zhodnocení zobrazené na konci každé čáry
    - Odebrání křížkem, data se neukládají (pouze dočasné srovnání)
- **Tabulka instrumentů** — přehled všech instrumentů v portfoliu:
  - Logo instrumentu — automaticky načtené přes server-side image proxy (apple-touch-icon z webu firmy, Google favicon jako fallback) nebo cryptocurrency-icons CDN (krypto); barevná iniciála jako fallback
  - Název, symbol, typ (barevný badge)
  - Sloupec Zastoupení (% váha, pokud je vyplněna)
  - Aktuální cena
  - Změna za: 24h, 1 týden, 1 měsíc, 1 rok, YTD (v %)
  - Barevné kódování: zelená (kladná) / červená (záporná)
  - Tlačítko pro manuální refresh vedle názvu portfolia (obnoví kotace i graf současně)
  - **Automatické řazení** — instrumenty seřazeny podle procentuálního zastoupení v portfoliu (od největšího po nejmenší)
- **Sektorová alokace** — vizuální rozdělení portfolia dle sektorů (technologie, finance, krypto...)
  - Horizontální stacked bar chart
  - Legenda s procentuálním podílem
- **Alokace dle typu** — rozdělení portfolia podle typu instrumentu (akcie, ETF, krypto, dluhopisy, komodity)
  - Barevně odlišené segmenty s legendou
- **Alokace dle země** — geografické rozložení portfolia podle země původu instrumentů
  - Obrázky vlajek z flagcdn.com CDN
  - Stacked bar chart s legendou
- **Hodnocení portfolia** — 6 finančních metrik s vizuálním ukazatelem:
  - Sharpe Ratio, Beta, Jensenova Alfa, Sortino Ratio, Treynor Ratio, Calmar Ratio
  - Každá metrika se zobrazuje s hodnotou a gradientní osou (červená → žlutá → zelená)
  - Piecewise lineární škála s bodem `center` — neutrální hodnota (0) mapuje na 40 % osy, extrémně záporné hodnoty nejsou přilepené na samém okraji
  - Tooltip s vysvětlením, co daná metrika měří
- **Drag-and-drop** — přetahování sekcí dashboardu myší pro změnu pořadí
  - Pořadí se ukládá do localStorage a přežije zavření prohlížeče
  - Vizuální zpětná vazba při přetahování (zvýrazněný okraj, změna průhlednosti)
- **Import CSV** — hromadné přidání instrumentů z CSV souboru
  - Modal s instrukcemi, nahrání souboru a náhledem
  - Formát: UTF-8 CSV (oddělovač středník), sloupce ticker + váha v %
  - Validace tickerů přes Yahoo Finance API
  - Kontrola nepřekročení 100% váhy
  - Výsledek s počtem úspěšně importovaných a přeskočených instrumentů

### Vlastní váhy
- Při přidávání instrumentu je možné zadat procentuální zastoupení v portfoliu
- Automatická detekce: pokud má alespoň jeden instrument vyplněnou váhu, stává se povinnou pro všechny
- Pokud žádný instrument nemá váhu, použije se rovné zastoupení
- Váhy ovlivňují graf výkonnosti i sektorovou alokaci
- **Validace vah:**
  - Celková váha nemůže překročit 100% — při přidávání i úpravě se zobrazuje zbývající procento a tlačítko je zablokováno při překročení
  - Pokud je portfolio neúplné (součet vah < 100%), zobrazí se na dashboardu varovný banner informující o možném zkreslení statistik

### Zprávy
- Sekce s finančními zprávami relevantními k instrumentům v portfoliu
- **Multi-select filtr instrumentů** — dropdown v hlavičce sekce umožňuje filtrovat zprávy podle konkrétních instrumentů
  - Defaultně vybrány všechny instrumenty v portfoliu
  - Checkboxy s logem a názvem instrumentu
  - Tlačítko „Vybrat vše" / „Zrušit výběr"
  - Dynamický popisek: „Všechny instrumenty", „2 instrumentů", konkrétní symboly (1-2)
- Každá zpráva: náhledový obrázek, nadpis, krátký text, vydavatel, datum
- Proklik na zdrojový článek (nová karta)
- Aktualizace při změně portfolia nebo filtru

### Kalendář událostí
- Sekce s nadcházejícími klíčovými událostmi pro instrumenty v portfoliu
- Zobrazuje earnings (výsledky hospodaření) a ex-dividend data
- Rozdělení na nadcházející a nedávné události
- U earnings: odhad EPS a rozsah (pokud dostupné)
- Počet dní do/od události, barevné ikony dle typu

### Lokalizace
- 6 jazyků: angličtina, čeština, slovenština, ukrajinština, čínština, mongolština
- **Výchozí jazyk: čeština** — nový návštěvník bez uloženého nastavení uvidí stránku česky
- Přepínání přes dropdown v hlavičce s obrázky vlajek (flagcdn.com CDN) a kódem jazyka
- Všechny popisky, tlačítka, chybové hlášky ve všech podporovaných jazycích

### Vzhled a personalizace
- **7 skinů aplikace:** Light, Dark, Ocean, Sunset, Forest, Cyberpunk, Water
  - Každý skin má vlastní barevné schéma (přebarví hlavičku, akcentní barvy, pozadí)
  - 5 tmavých skinů (Dark, Ocean, Forest, Cyberpunk, Water), 2 světlé (Light, Sunset)
  - **Water** — animovaný skin s vlnící se vodní hladinou (CSS animace kaustik a vln)
- Automatická detekce systémové preference (light/dark) při prvním spuštění
- **8 vtipných avatarů** na výběr: Ninja, Astronaut, Robot, Pirát, Čaroděj, Mimozemšťan, Cool Kočka, Medvěd
  - SVG avatary zobrazené v hlavičce vedle jména uživatele
- Nastavení skinu a avatara přes modální dialog "Nastavení"
- Všechny preference (skin + avatar) se ukládají do Supabase DB a localStorage

### Autentizace a uživatelské účty
- Registrace a přihlášení přes e-mail a heslo (Supabase Auth)
- Registrace vyžaduje: jméno, příjmení, e-mail, heslo
- Vizuálně atraktivní přihlašovací stránka s animovaným gradientovým pozadím
- Název aplikace na login stránce: "Honzův bombézní portfolio tracker"
- Automatická ochrana všech stránek — nepřihlášený uživatel je přesměrován na `/login`
- User menu v hlavičce s avatarem, celým jménem uživatele a dropdown nabídkou
  - Dropdown: uživatelský profil (avatar + jméno + e-mail), Nastavení, Odhlášení
- **Nastavení** — modální dialog přístupný z dropdown menu v hlavičce
  - **Osobní údaje:** úprava jména, příjmení, e-mailu a změna hesla
  - **Personalizace:** výběr avatara (8 SVG avatarů) a skinu aplikace (6 skinů)
  - Živý náhled skinu a avatara (změny viditelné okamžitě při výběru)
  - Tlačítko "Zavřít" zruší neuložené změny, "Uložit" uloží vše do databáze
- Automatická migrace dat z localStorage do Supabase při prvním přihlášení

### Persistence dat
- Všechna data (portfolia, instrumenty, preference) se ukládají v Supabase PostgreSQL databázi
- Data dostupná napříč zařízeními a prohlížeči po přihlášení
- localStorage slouží jako cache pro skin+avatar, jazyk a pořadí sekcí dashboardu (pro okamžitý start)
- Row Level Security (RLS) — každý uživatel vidí pouze svá data

---

## Spuštění

### Požadavky
- Node.js 18+
- npm

### Instalace

```bash
npm install
```

### Development server

```bash
npm run dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000).

### Produkční build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Tech stack

| Technologie | Verze | Účel |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.1.6 | Full-stack React framework (App Router) |
| [React](https://react.dev) | 19.2.3 | UI knihovna |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Typová bezpečnost |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS framework |
| [Supabase](https://supabase.com) | 2.x | PostgreSQL databáze + autentizace |
| [@supabase/ssr](https://github.com/supabase/auth-helpers) | 0.x | Cookie-based session management |
| [Recharts](https://recharts.org) | 3.7.0 | Knihovna pro grafy |
| [yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2) | 3.13.0 | Yahoo Finance API klient |
| [date-fns](https://date-fns.org) | 4.1.0 | Práce s daty |
| [clsx](https://github.com/lukeed/clsx) | 2.1.1 | Podmíněné CSS třídy |

---

## Struktura projektu

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Theme + Language providers)
│   ├── globals.css               # Tailwind + globální styly + login animace
│   ├── login/page.tsx            # Přihlašovací stránka (veřejná)
│   ├── (app)/                    # Route group — chráněné stránky
│   │   ├── layout.tsx            # Auth + Portfolio providers + Header
│   │   ├── page.tsx              # Dashboard (hlavní stránka)
│   │   ├── news/page.tsx         # Stránka se zprávami
│   │   └── calendar/page.tsx     # Stránka s kalendářem událostí
│   └── api/                      # Serverové API routes
│       ├── auth/signout/route.ts # POST /api/auth/signout (server-side session cleanup)
│       ├── search/route.ts       # GET /api/search?q=...
│       ├── quote/route.ts        # GET /api/quote?symbols=...
│       ├── chart/route.ts        # GET /api/chart?symbols=...&range=...
│       ├── news/route.ts         # GET /api/news?symbols=...
│       ├── calendar/route.ts     # GET /api/calendar?symbols=...
│       ├── logo/route.ts         # GET /api/logo?symbol=...&type=... (image proxy)
│       ├── countries/route.ts    # GET /api/countries?symbols=...
│       └── metrics/route.ts      # GET /api/metrics?symbols=...&weights=...
├── components/
│   ├── ui/                       # Znovupoužitelné UI primitiva (Button, Modal, Badge, InstrumentLogo...)
│   ├── layout/                   # Header, navigace
│   ├── portfolio/                # Správa portfolií (modaly, vyhledávání, CSV import)
│   ├── dashboard/                # Graf, tabulky, alokace, metriky, drag-and-drop, refresh
│   ├── settings/                 # Nastavení (SettingsModal, FunAvatars)
│   ├── login/                    # Přihlašovací stránka (BusinessmanAvatars)
│   ├── news/                     # Zprávy
│   └── calendar/                 # Kalendář událostí
├── hooks/                        # Custom React hooks
├── context/                      # React Context providers (Auth, Portfolio, Language, Theme)
├── lib/                          # Utility funkce a integrace
│   └── supabase/                 # Supabase klientské soubory (client, server, middleware, database, migration)
├── middleware.ts                  # Next.js middleware — ochrana routes + session refresh
├── types/                        # TypeScript definice typů (vč. auth.ts)
└── config/                       # Konfigurace a konstanty
public/
└── locales/                      # Jazykové soubory (en.json, cs.json, sk.json, uk.json, zh.json, mn.json)
```

Podrobnou technickou dokumentaci najdete v [TECHNICAL.md](./TECHNICAL.md).
Dokumentaci API najdete v [API.md](./API.md).
Popis architektury najdete v [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Nastavení Supabase

Pro zprovoznění aplikace je potřeba:

### 1. Vytvořte projekt v Supabase
- Přejděte na [supabase.com](https://supabase.com) a vytvořte nový projekt

### 2. Nastavte proměnné prostředí
Vytvořte soubor `.env.local` v kořenu projektu:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Vytvořte databázové tabulky
V Supabase Dashboard → SQL Editor spusťte SQL schema (viz `TECHNICAL.md` sekce "Databázové schéma").

### 4. Vypněte potvrzení e-mailu
V Supabase Dashboard → Authentication → Settings → Email Auth:
- Vypněte "Confirm email" (pro zjednodušení registrace)

---

## Plán dalšího vývoje

### Budoucí funkce
- Zadávání nákupních cen a množství pro výpočet P&L
- Sledování dividendového příjmu
- Export portfolia do CSV/PDF
- Notifikace o cenových pohybech
- Porovnání výkonnosti portfolia s benchmarkem (S&P 500, BTC)

---

## Vývojový tým

| Člen | Role | Popis |
|---|---|---|
| **Opus** | Seniorní vývojář, hlavní architekt | Návrh architektury, implementace komplexních funkcí, klíčová rozhodnutí o technologiích a datových tocích. |
| **Sonnet** | Juniorní vývojář | Zpracovává menší a méně komplexní úpravy. Pokud si něčím není jistý, nebude machrovat a požádá zadavatele o předání na Opuse. |

---

## Licence

Soukromý projekt.
