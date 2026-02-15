/** Market index definitions used across the app */

export interface MarketIndex {
  symbol: string;
  name: string;
  shortName: string;
}

/** Indexes available for the dashboard comparison chart */
export const COMPARISON_INDEXES: MarketIndex[] = [
  { symbol: '^GSPC', name: 'S&P 500', shortName: 'S&P 500' },
  { symbol: '^IXIC', name: 'Nasdaq Composite', shortName: 'Nasdaq' },
  { symbol: 'URTH', name: 'MSCI World (URTH)', shortName: 'MSCI World' },
  { symbol: 'ACWI', name: 'MSCI ACWI (ACWI)', shortName: 'MSCI ACWI' },
];

/** Indexes displayed on the Markets page (daily movements + chart) */
export const MARKET_INDEXES: MarketIndex[] = [
  { symbol: '^GSPC', name: 'S&P 500', shortName: 'S&P 500' },
  { symbol: '^IXIC', name: 'Nasdaq Composite', shortName: 'Nasdaq' },
  { symbol: 'URTH', name: 'MSCI World (URTH)', shortName: 'MSCI World' },
  { symbol: 'EEM', name: 'MSCI Emerging Markets (EEM)', shortName: 'MSCI EM' },
  { symbol: 'ACWI', name: 'MSCI ACWI (ACWI)', shortName: 'MSCI ACWI' },
];

/** Default-enabled indexes on Markets chart */
export const DEFAULT_ENABLED_INDEXES = ['^GSPC', 'URTH'];

/**
 * Curated set of the world's most important market indices.
 * These get priority in search results and are marked with a star.
 */
export const FEATURED_INDICES = new Set([
  // --- US ---
  '^GSPC',      // S&P 500
  '^DJI',       // Dow Jones Industrial Average
  '^IXIC',      // NASDAQ Composite
  '^RUT',       // Russell 2000
  '^VIX',       // CBOE Volatility Index
  '^TNX',       // 10-Year Treasury Yield
  '^TYX',       // 30-Year Treasury Yield
  '^IRX',       // 13 Week Treasury Bill
  '^FVX',       // 5-Year Treasury Yield
  // --- Europe ---
  '^STOXX50E',  // Euro Stoxx 50
  '^STOXX',     // Stoxx Europe 600
  '^FTSE',      // FTSE 100 (UK)
  '^GDAXI',     // DAX (Germany)
  '^FCHI',      // CAC 40 (France)
  'FTSEMIB.MI', // FTSE MIB (Italy)
  '^IBEX',      // IBEX 35 (Spain)
  '^AEX',       // AEX (Netherlands)
  '^SSMI',      // SMI (Switzerland)
  '^BFX',       // BEL 20 (Belgium)
  '^ATX',       // ATX (Austria)
  '^OMX',       // OMX Stockholm 30 (Sweden)
  '^OMXSPI',    // OMX Stockholm All-Share (Sweden)
  '^OMXH25',    // OMX Helsinki 25 (Finland)
  '^OMXC25',    // OMX Copenhagen 25 (Denmark)
  'OBX.OL',     // OBX (Norway)
  '^ISEQ',      // ISEQ All Share (Ireland)
  'BVL.LS',     // PSI All-Share (Portugal)
  // --- Asia-Pacific ---
  '^N225',      // Nikkei 225 (Japan)
  '^HSI',       // Hang Seng (Hong Kong)
  '^HSCE',      // Hang Seng China Enterprises
  '399001.SZ',  // Shenzhen Component (China)
  '^BSESN',     // BSE SENSEX (India)
  '^NSEI',      // NIFTY 50 (India)
  '^KS11',      // KOSPI (South Korea)
  '^TWII',      // TSEC Weighted Index (Taiwan)
  '^STI',       // STI (Singapore)
  '^JKSE',      // Jakarta Composite (Indonesia)
  '^KLSE',      // FTSE Bursa Malaysia KLCI
  '^SET.BK',    // SET Index (Thailand)
  '^AXJO',      // S&P/ASX 200 (Australia)
  '^AORD',      // All Ordinaries (Australia)
  '^NZ50',      // S&P/NZX 50 (New Zealand)
  'PSEI.PS',    // PSEi (Philippines)
  // --- Americas ---
  '^GSPTSE',    // S&P/TSX Composite (Canada)
  '^BVSP',      // IBOVESPA (Brazil)
  '^MXX',       // IPC Mexico
  // --- Middle East & Africa ---
  '^TASI.SR',   // Tadawul All Shares (Saudi Arabia)
  '^TA125.TA',  // TA-125 (Israel)
  '^CASE30',    // EGX 30 (Egypt)
  '^J203.JO',   // JSE All Share (South Africa)
  // --- Eastern Europe & Other ---
  'IMOEX.ME',   // MOEX Russia
  'RTSI.ME',    // RTS Index (Russia)
  'XU100.IS',   // BIST 100 (Turkey)
  'XU030.IS',   // BIST 30 (Turkey)
  '^OMXV',      // OMX Vilnius (Lithuania)
  '^OMXR',      // OMX Riga (Latvia)
  '^OMXT',      // OMX Tallinn (Estonia)
  // --- Sector / Thematic ---
  '399006.SZ',  // ChiNext (China tech)
  '^DJSH',      // Dow Jones Shanghai
]);
