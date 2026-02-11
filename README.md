# Portfolio Tracker

Online portfolio tracker pro sledování výkonnosti investičních portfolií. Aplikace umožňuje vytvářet a spravovat více portfolií obsahujících akcie, ETF, kryptoměny, dluhopisy a komodity, zobrazovat grafy výkonnosti, cenové změny, sektorovou alokaci a relevantní finanční zprávy.

---

## Funkce

### Správa portfolií
- Vytvoření libovolného počtu portfolií s vlastním názvem
- Přepínání mezi portfolii přes dropdown v hlavičce
- Přidávání instrumentů vyhledáváním podle názvu nebo tickeru (AAPL, BTC-USD, GLD...)
- Odebrání jednotlivých instrumentů z portfolia
- Smazání celého portfolia s potvrzovacím dialogem

### Dashboard
- **Graf výkonnosti** — interaktivní čárový graf (Recharts) zobrazující vážený vývoj portfolia
  - Časová období: 1D, 1T, 1M, 1R, 5L, YTD
  - Zelená/červená barva podle celkového vývoje
- **Tabulka instrumentů** — přehled všech instrumentů v portfoliu:
  - Název, symbol, typ (barevný badge)
  - Aktuální cena
  - Změna za: 24h, 1 týden, 1 měsíc, 1 rok, YTD (v %)
  - Barevné kódování: zelená (kladná) / červená (záporná)
  - Možnost odebrání instrumentu
- **Sektorová alokace** — vizuální rozdělení portfolia dle sektorů (technologie, finance, krypto...)
  - Horizontální stacked bar chart
  - Legenda s procentuálním podílem

### Vlastní váhy
- Přepínač rovné / vlastní zastoupení instrumentů
- Při zapnutí vlastních vah: editovatelné pole váhy (%) u každého instrumentu
- Validace: součet vah musí být 100 %
- Váhy ovlivňují graf výkonnosti i sektorovou alokaci

### Zprávy
- Sekce s finančními zprávami relevantními k instrumentům v portfoliu
- Každá zpráva: náhledový obrázek, nadpis, krátký text, vydavatel, datum
- Proklik na zdrojový článek (nová karta)
- Aktualizace při změně portfolia

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
│   └── api/                      # Serverové API routes
│       ├── search/route.ts       # GET /api/search?q=...
│       ├── quote/route.ts        # GET /api/quote?symbols=...
│       ├── chart/route.ts        # GET /api/chart?symbols=...&range=...
│       └── news/route.ts         # GET /api/news?symbols=...
├── components/
│   ├── ui/                       # Znovupoužitelné UI primitiva
│   ├── layout/                   # Header, navigace
│   ├── portfolio/                # Správa portfolií
│   ├── dashboard/                # Graf, tabulky, alokace
│   └── news/                     # Zprávy
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
