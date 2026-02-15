/**
 * Predefined index definitions.
 *
 * For MSCI / FTSE / thematic indexes that Yahoo Finance doesn't cover directly,
 * the `ticker` field points to a proxy ETF that closely tracks the index.
 * Data is fetched via the proxy ticker but presented to users under the index name.
 */

export interface IndexDefinition {
  /** Display name of the index (e.g. "MSCI World") */
  name: string;
  /** Short description in Czech */
  description: string;
  /** Yahoo Finance ticker – either a direct index (^GSPC) or proxy ETF (URTH) */
  ticker: string;
}

export const ALL_INDEXES: IndexDefinition[] = [
  // ── MSCI ──────────────────────────────────────────────────
  { name: 'MSCI ACWI', description: 'Celý svět - Rozvinuté i rozvojové', ticker: 'ACWI' },
  { name: 'MSCI ACWI ex-US', description: 'Celý svět bez USA', ticker: 'ACWX' },
  { name: 'MSCI World', description: 'Svět - Pouze rozvinuté trhy', ticker: 'URTH' },
  { name: 'MSCI World ex-USA', description: 'Rozvinuté trhy bez USA', ticker: 'TOK' },
  { name: 'MSCI EAFE', description: 'Evropa, Australasie, Dálný východ', ticker: 'EFA' },
  { name: 'MSCI Emerging Markets', description: 'Rozvojové trhy - Široký', ticker: 'EEM' },
  { name: 'MSCI Frontier Markets', description: 'Hraniční/Nové trhy', ticker: 'FM' },
  { name: 'MSCI BRIC', description: 'Brazílie, Rusko, Indie, Čína', ticker: 'BKF' },
  { name: 'MSCI EM Asia', description: 'Rozvojové trhy Asie', ticker: 'EEMA' },
  { name: 'MSCI EM Latin America', description: 'Rozvojové trhy Latinské Ameriky', ticker: 'ILF' },
  { name: 'MSCI Europe', description: 'Evropa - Rozvinuté trhy', ticker: 'IEUR' },
  { name: 'MSCI EMU', description: 'Evropská hospodářská a měnová unie - Eurozóna', ticker: 'EZU' },
  { name: 'MSCI Pacific ex-Japan', description: 'Pacifik bez Japonska', ticker: 'EPP' },
  { name: 'MSCI EAFE Small Cap', description: 'Malé firmy - Rozvinuté trhy mimo USA', ticker: 'SCZ' },
  { name: 'MSCI EAFE Value', description: 'Hodnotové akcie - Rozvinuté trhy mimo USA', ticker: 'EFV' },
  { name: 'MSCI EAFE Growth', description: 'Růstové akcie - Rozvinuté trhy mimo USA', ticker: 'EFG' },
  { name: 'MSCI Emerging Markets Small Cap', description: 'Malé firmy - Rozvojové trhy', ticker: 'EEMS' },
  { name: 'MSCI Emerging Markets Minimum Volatility', description: 'EM s nízkou kolísavostí', ticker: 'EEMV' },
  { name: 'MSCI World Minimum Volatility', description: 'Svět s nízkou kolísavostí', ticker: 'ACWV' },
  { name: 'MSCI USA', description: 'Spojené státy', ticker: 'EUSA' },
  { name: 'MSCI Japan', description: 'Japonsko', ticker: 'EWJ' },
  { name: 'MSCI United Kingdom', description: 'Velká Británie', ticker: 'EWU' },
  { name: 'MSCI Germany', description: 'Německo', ticker: 'EWG' },
  { name: 'MSCI France', description: 'Francie', ticker: 'EWQ' },
  { name: 'MSCI Switzerland', description: 'Švýcarsko', ticker: 'EWL' },
  { name: 'MSCI Australia', description: 'Austrálie', ticker: 'EWA' },
  { name: 'MSCI Canada', description: 'Kanada', ticker: 'EWC' },
  { name: 'MSCI Italy', description: 'Itálie', ticker: 'EWI' },
  { name: 'MSCI Spain', description: 'Španělsko', ticker: 'EWP' },
  { name: 'MSCI Netherlands', description: 'Nizozemsko', ticker: 'EWN' },
  { name: 'MSCI Sweden', description: 'Švédsko', ticker: 'EWD' },
  { name: 'MSCI China', description: 'Čína', ticker: 'MCHI' },
  { name: 'MSCI India', description: 'Indie', ticker: 'INDA' },
  { name: 'MSCI Taiwan', description: 'Tchaj-wan', ticker: 'EWT' },
  { name: 'MSCI South Korea', description: 'Jižní Korea', ticker: 'EWY' },
  { name: 'MSCI Brazil', description: 'Brazílie', ticker: 'EWZ' },
  { name: 'MSCI Mexico', description: 'Mexiko', ticker: 'EWW' },
  { name: 'MSCI South Africa', description: 'Jižní Afrika', ticker: 'EZA' },
  { name: 'MSCI Saudi Arabia', description: 'Saúdská Arábie', ticker: 'KSA' },

  // ── FTSE ──────────────────────────────────────────────────
  { name: 'FTSE Global All Cap', description: 'Celý svět - Všechny velikosti firem', ticker: 'VT' },
  { name: 'FTSE All-World ex-US', description: 'Celý svět bez USA', ticker: 'VEU' },
  { name: 'FTSE Developed Markets', description: 'Rozvinuté trhy', ticker: 'VEA' },
  { name: 'FTSE Emerging Markets', description: 'Rozvojové trhy', ticker: 'VWO' },
  { name: 'FTSE Europe', description: 'Evropa', ticker: 'VGK' },
  { name: 'FTSE Pacific', description: 'Pacifik', ticker: 'VPL' },
  { name: 'FTSE All-World High Dividend Yield', description: 'Svět - Vysoká dividenda', ticker: 'VYM' },
  { name: 'FTSE International High Dividend Yield', description: 'Svět bez USA - Dividenda', ticker: 'VYMI' },
  { name: 'FTSE Global All Cap ex US Small Cap', description: 'Svět bez USA - Malé firmy', ticker: 'VSS' },
  { name: 'FTSE EPRA Nareit Global Real Estate', description: 'Svět - Nemovitosti/REITs', ticker: 'VNQI' },
  { name: 'FTSE EPRA Nareit US Real Estate', description: 'USA - Nemovitosti/REITs', ticker: 'VNQ' },

  // ── S&P ───────────────────────────────────────────────────
  { name: 'S&P 500', description: 'USA - Velké firmy', ticker: '^GSPC' },
  { name: 'S&P 500 Equal Weight', description: 'USA - Rovnoměrně vážený', ticker: 'RSP' },
  { name: 'S&P MidCap 400', description: 'USA - Střední firmy', ticker: '^MID' },
  { name: 'S&P SmallCap 600', description: 'USA - Malé firmy', ticker: '^SML' },
  { name: 'S&P 500 Dividend Aristocrats', description: 'Dividendoví aristokraté', ticker: 'NOBL' },

  // ── S&P 500 Sectors ──────────────────────────────────────
  { name: 'S&P 500 Informační technologie', description: 'Technology', ticker: 'XLK' },
  { name: 'S&P 500 Zdravotnictví', description: 'Health Care', ticker: 'XLV' },
  { name: 'S&P 500 Finance', description: 'Financials', ticker: 'XLF' },
  { name: 'S&P 500 Zbytná spotřeba', description: 'Consumer Discretionary', ticker: 'XLY' },
  { name: 'S&P 500 Běžná spotřeba', description: 'Consumer Staples', ticker: 'XLP' },
  { name: 'S&P 500 Průmysl', description: 'Industrials', ticker: 'XLI' },
  { name: 'S&P 500 Energetika', description: 'Energy', ticker: 'XLE' },
  { name: 'S&P 500 Utility', description: 'Utilities', ticker: 'XLU' },
  { name: 'S&P 500 Komunikace', description: 'Communication Services', ticker: 'XLC' },
  { name: 'S&P 500 Materiály', description: 'Materials', ticker: 'XLB' },
  { name: 'S&P 500 Nemovitosti', description: 'Real Estate', ticker: 'XLRE' },

  // ── NASDAQ ────────────────────────────────────────────────
  { name: 'NASDAQ Composite', description: 'USA - Technologie a širší trh', ticker: '^IXIC' },
  { name: 'NASDAQ 100', description: 'USA - Top 100 nefinančních', ticker: '^NDX' },

  // ── Dow Jones ─────────────────────────────────────────────
  { name: 'Dow Jones Industrial Average', description: 'USA - 30 Blue Chips', ticker: '^DJI' },

  // ── Russell ───────────────────────────────────────────────
  { name: 'Russell 3000', description: 'USA - Celý trh, 3000 firem', ticker: '^RUA' },
  { name: 'Russell 2000', description: 'USA - Malé firmy', ticker: '^RUT' },
  { name: 'Russell 1000', description: 'USA - Velké firmy', ticker: '^RUI' },
  { name: 'Russell Microcap', description: 'USA - Mikro firmy', ticker: 'IWC' },

  // ── US Factors & Thematic ─────────────────────────────────
  { name: 'US Momentum Factor', description: 'USA - Růstové/Momentum akcie', ticker: 'MTUM' },
  { name: 'US Quality Factor', description: 'USA - Kvalitní akcie s vysokou marží', ticker: 'QUAL' },
  { name: 'US Value Factor', description: 'USA - Podhodnocené akcie', ticker: 'VLUE' },
  { name: 'Vanguard Dividend Appreciation', description: 'USA - Růst dividend', ticker: 'VIG' },

  // ── Thematic / Sector ─────────────────────────────────────
  { name: 'Global Robotics & AI', description: 'Umělá inteligence a Robotika', ticker: 'BOTZ' },
  { name: 'Cybersecurity', description: 'Kybernetická bezpečnost', ticker: 'CIBR' },
  { name: 'Cloud Computing', description: 'Cloudové služby', ticker: 'SKYY' },
  { name: 'Semiconductors (VanEck)', description: 'Polovodiče a čipy - VanEck', ticker: 'SMH' },
  { name: 'Semiconductors (iShares)', description: 'Polovodiče a čipy - iShares', ticker: 'SOXX' },
  { name: 'Genomic Revolution', description: 'Biotechnologie a Genomika', ticker: 'ARKG' },
  { name: 'Global Lithium', description: 'Baterie a Těžba lithia', ticker: 'LIT' },
  { name: 'Global Clean Energy', description: 'Čistá energie a Solár', ticker: 'ICLN' },
  { name: 'Global Uranium', description: 'Uran a Jaderná energie', ticker: 'URA' },
  { name: 'Blockchain & Crypto Ecosystem', description: 'Blockchain a Krypto ekosystém', ticker: 'BLOK' },
  { name: 'Space Exploration', description: 'Průzkum vesmíru a Letectví', ticker: 'ARKX' },
  { name: 'Video Gaming & eSports', description: 'E-sport a Videohry', ticker: 'ESPO' },
  { name: 'Global Water', description: 'Vodohospodářství', ticker: 'CGW' },
  { name: 'Global Agriculture', description: 'Zemědělství a Agrotech', ticker: 'VEGI' },

  // ── European Indexes ──────────────────────────────────────
  { name: 'EURO STOXX 50', description: 'Eurozóna - Blue Chips', ticker: '^STOXX50E' },
  { name: 'STOXX Europe 600', description: 'Široký evropský trh', ticker: '^STOXX' },
  { name: 'DAX 40', description: 'Německo', ticker: '^GDAXI' },
  { name: 'MDAX', description: 'Německo - Střední firmy', ticker: '^MDAXI' },
  { name: 'FTSE 100', description: 'Velká Británie', ticker: '^FTSE' },
  { name: 'FTSE 250', description: 'Velká Británie - Střední firmy', ticker: '^FTMC' },
  { name: 'FTSE All-Share', description: 'Velká Británie - Široký trh', ticker: '^FTAS' },
  { name: 'CAC 40', description: 'Francie', ticker: '^FCHI' },
  { name: 'SMI', description: 'Švýcarsko', ticker: '^SSMI' },
  { name: 'IBEX 35', description: 'Španělsko', ticker: '^IBEX' },
  { name: 'AEX', description: 'Nizozemsko', ticker: '^AEX' },
];

/** Set of all known index tickers for quick lookup */
export const ALL_INDEX_TICKERS = new Set(ALL_INDEXES.map((i) => i.ticker));

/** Look up index definition by ticker */
export function getIndexByTicker(ticker: string): IndexDefinition | undefined {
  return ALL_INDEXES.find((i) => i.ticker === ticker);
}

/** Search predefined indexes by query (name or ticker) */
export function searchPredefinedIndexes(query: string): IndexDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 1) return [];

  const tokens = q.split(/\s+/).filter((t) => t.length > 0);

  const scored: { index: IndexDefinition; score: number }[] = [];

  for (const index of ALL_INDEXES) {
    const tickerLower = index.ticker.toLowerCase().replace('^', '');
    const nameLower = index.name.toLowerCase();
    const descLower = index.description.toLowerCase();

    let score = 0;

    // Exact ticker match
    if (tickerLower === q || index.ticker.toLowerCase() === q) {
      score = 100;
    }
    // Ticker starts with query
    else if (tickerLower.startsWith(q)) {
      score = 60;
    }
    // Name contains exact phrase
    else if (nameLower.includes(q)) {
      score = 40;
    }
    // Description contains query
    else if (descLower.includes(q)) {
      score = 30;
    }
    // All tokens match across name + description
    else if (tokens.length > 1 && tokens.every((t) => (nameLower + ' ' + descLower).includes(t))) {
      score = 25;
    }
    // Ticker contains query
    else if (tickerLower.includes(q)) {
      score = 20;
    } else {
      continue;
    }

    scored.push({ index, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index.name.length - b.index.name.length;
  });

  return scored.slice(0, 20).map((s) => s.index);
}
