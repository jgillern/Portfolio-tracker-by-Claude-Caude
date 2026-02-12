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
- Úprava portfolia přes modální dialog "Upravit portfolio" — změna vah a odebrání instrumentů
- Smazání celého portfolia s potvrzovacím dialogem

### Dashboard
- **Graf výkonnosti** — interaktivní čárový graf (Recharts) zobrazující vážený vývoj portfolia
  - Časová období: 1D, 1T, 1M, 1R, 5L, YTD
  - Zelená/červená barva podle celkového vývoje
- **Tabulka instrumentů** — přehled všech instrumentů v portfoliu:
  - Logo instrumentu (barevná iniciála dle typu, nebo vlastní logo)
  - Název, symbol, typ (barevný badge)
  - Sloupec Zastoupení (% váha, pokud je vyplněna)
  - Aktuální cena
  - Změna za: 24h, 1 týden, 1 měsíc, 1 rok, YTD (v %)
  - Barevné kódování: zelená (kladná) / červená (záporná)
  - Odpočítávání automatického obnovení dat (10 min) + tlačítko pro manuální refresh
- **Sektorová alokace** — vizuální rozdělení portfolia dle sektorů (technologie, finance, krypto...)
  - Horizontální stacked bar chart
  - Legenda s procentuálním podílem

### Vlastní váhy
- Při přidávání instrumentu je možné zadat procentuální zastoupení v portfoliu
- Automatická detekce: pokud má alespoň jeden instrument vyplněnou váhu, stává se povinnou pro všechny
- Pokud žádný instrument nemá váhu, použije se rovné zastoupení
- Váhy ovlivňují graf výkonnosti i sektorovou alokaci

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
- Čeština a angličtina s okamžitým přepínáním
- Všechny popisky, tlačítka, chybové hlášky ve dvou jazycích

### Tmavý režim
- Přepínání světlý / tmavý režim
- Automatická detekce systémové preference
- Všechny komponenty podporují oba režimy

### Persistence dat
- Portfolia, jazyk a téma se ukládají do `localStorage`
- Data přežijí zavření a znovuotevření prohlížeče
- Připraveno pro budoucí migraci na databázi + autentizaci

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
| [Recharts](https://recharts.org) | 3.7.0 | Knihovna pro grafy |
| [yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2) | 3.13.0 | Yahoo Finance API klient |
| [date-fns](https://date-fns.org) | 4.1.0 | Práce s daty |
| [clsx](https://github.com/lukeed/clsx) | 2.1.1 | Podmíněné CSS třídy |

---

## Struktura projektu

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Providers, Header)
│   ├── page.tsx                  # Dashboard (hlavní stránka)
│   ├── globals.css               # Tailwind + globální styly
│   ├── news/page.tsx             # Stránka se zprávami
│   ├── calendar/page.tsx         # Stránka s kalendářem událostí
│   └── api/                      # Serverové API routes
│       ├── search/route.ts       # GET /api/search?q=...
│       ├── quote/route.ts        # GET /api/quote?symbols=...
│       ├── chart/route.ts        # GET /api/chart?symbols=...&range=...
│       ├── news/route.ts         # GET /api/news?symbols=...
│       └── calendar/route.ts     # GET /api/calendar?symbols=...
├── components/
│   ├── ui/                       # Znovupoužitelné UI primitiva (Button, Modal, Badge, InstrumentLogo...)
│   ├── layout/                   # Header, navigace
│   ├── portfolio/                # Správa portfolií
│   ├── dashboard/                # Graf, tabulky, alokace, refresh
│   ├── news/                     # Zprávy
│   └── calendar/                 # Kalendář událostí
├── hooks/                        # Custom React hooks
├── context/                      # React Context providers
├── lib/                          # Utility funkce a integrace
├── types/                        # TypeScript definice typů
└── config/                       # Konfigurace a konstanty
public/
└── locales/                      # Jazykové soubory (en.json, cs.json)
```

Podrobnou technickou dokumentaci najdete v [TECHNICAL.md](./TECHNICAL.md).
Dokumentaci API najdete v [API.md](./API.md).
Popis architektury najdete v [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Plán dalšího vývoje

### Fáze 2 — Autentizace a databáze
- Registrace / přihlášení uživatelů (NextAuth.js)
- Migrace z localStorage na databázi (PostgreSQL / Supabase)
- Synchronizace portfolií napříč zařízeními

### Budoucí funkce
- Zadávání nákupních cen a množství pro výpočet P&L
- Sledování dividendového příjmu
- Export portfolia do CSV/PDF
- Notifikace o cenových pohybech
- Porovnání výkonnosti portfolia s benchmarkem (S&P 500, BTC)

---

## Licence

Soukromý projekt.
