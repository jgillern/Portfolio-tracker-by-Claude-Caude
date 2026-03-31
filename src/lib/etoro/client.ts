/**
 * eToro API client – server-side only.
 *
 * Two API surfaces are used:
 *  1. Discovery API  (api.etoro.com)          – search public traders, user info
 *  2. Public API     (public-api.etoro.com)    – portfolio data, instrument metadata
 *
 * Both require the same subscription key obtained from api-portal.etoro.com,
 * provided via the ETORO_API_KEY environment variable.
 */

import type {
  EToroUser,
  EToroPosition,
  EToroStats,
  EToroPortfolioData,
} from '@/types/etoro';

const DISCOVERY_BASE = 'https://api.etoro.com';
const PUBLIC_API_BASE = 'https://public-api.etoro.com/api/v1';

// ── helpers ────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.ETORO_API_KEY;
  if (!key) throw new Error('ETORO_API_KEY environment variable is not set');
  return key;
}

function discoveryHeaders() {
  return {
    'Ocp-Apim-Subscription-Key': getApiKey(),
    'Content-Type': 'application/json',
  };
}

function publicApiHeaders() {
  const key = getApiKey();
  return {
    'x-api-key': key,
    'x-user-key': key,
    'x-request-id': crypto.randomUUID(),
    'Content-Type': 'application/json',
  };
}

// ── in-memory cache ────────────────────────────────────

const cache = new Map<string, { data: unknown; expiresAt: number }>();

function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.data as T);
  return fn().then((data) => {
    cache.set(key, { data, expiresAt: Date.now() + ttlMs });
    return data;
  });
}

// ── AutoComplete API (fulltext search) ─────────────────

interface AutoCompleteResult {
  Users?: Array<{
    UserName: string;
    FullName?: string;
    CustomerID?: number;
    CustomerId?: number;
  }>;
  Instruments?: Array<unknown>;
}

// ── Discovery API ──────────────────────────────────────

interface DiscoverSearchResult {
  Items: Array<{
    UserName: string;
    FullName: string;
    CustomerId: number;
    CopiedTrades: number;
    Copiers: number;
    AvatarUrl: string;
    Gain: number;
    RiskScore: number;
    PopularInvestor: boolean;
    Country: string;
    DailyGain: number;
    WeeklyGain: number;
    IsPro?: boolean;
    TopTradedInstrumentId?: number;
  }>;
  TotalRows: number;
}

export async function searchTraders(
  query: string,
): Promise<EToroUser[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Strategy 1: AutoComplete endpoint — supports fulltext search by prefix.
  // GET /System/V1/AutoComplete?Prefix=...&UserCount=10&InstrumentCount=0
  try {
    const autoCompleteUsers = await cached(
      `autocomplete:${trimmed.toLowerCase()}`,
      5 * 60_000,
      async () => {
        const params = new URLSearchParams({
          Prefix: trimmed,
          UserCount: '10',
          InstrumentCount: '0',
        });

        const res = await fetch(
          `${DISCOVERY_BASE}/System/V1/AutoComplete?${params}`,
          { headers: discoveryHeaders() }
        );

        if (!res.ok) {
          console.warn(`[eToro] AutoComplete returned ${res.status}`);
          return [];
        }

        const data: AutoCompleteResult = await res.json();
        const users = data.Users ?? [];
        if (users.length === 0) return [];

        // AutoComplete returns minimal data (username, maybe fullName).
        // Enrich with Discovery data for copiers, gain, risk score etc.
        const usernames = users.map((u) => u.UserName).join(',');
        return enrichUsersViaDiscovery(usernames, users);
      }
    );
    if (autoCompleteUsers.length > 0) return autoCompleteUsers;
  } catch (err) {
    console.warn('[eToro] AutoComplete search failed:', err);
  }

  // Strategy 2: Try Discovery API with exact UserNames filter.
  try {
    const discoveryResult = await cached(
      `discover-user:${trimmed.toLowerCase()}`,
      5 * 60_000,
      async () => {
        const params = new URLSearchParams({
          Period: 'OneYearAgo',
          Page: '1',
          PageSize: '5',
          Sort: '-Copiers',
          UserNames: trimmed,
        });

        const res = await fetch(
          `${DISCOVERY_BASE}/Discover/V1/Search?${params}`,
          { headers: discoveryHeaders() }
        );

        if (!res.ok) return [];

        const data: DiscoverSearchResult = await res.json();
        return (data.Items ?? []).map(mapDiscoverUser);
      }
    );
    if (discoveryResult.length > 0) return discoveryResult;
  } catch (err) {
    console.warn('[eToro] Discovery search failed:', err);
  }

  // Strategy 3: Try exact user info lookup as last resort.
  try {
    const users = await searchUsersByText(trimmed);
    if (users.length > 0) return users;
  } catch {
    // fall through
  }

  return [];
}

/** Enrich AutoComplete results with Discovery metrics (copiers, gain, risk). */
async function enrichUsersViaDiscovery(
  usernames: string,
  autoCompleteUsers: AutoCompleteResult['Users'] & object,
): Promise<EToroUser[]> {
  try {
    const params = new URLSearchParams({
      Period: 'OneYearAgo',
      Page: '1',
      PageSize: String(autoCompleteUsers.length),
      Sort: '-Copiers',
      UserNames: usernames,
    });

    const res = await fetch(
      `${DISCOVERY_BASE}/Discover/V1/Search?${params}`,
      { headers: discoveryHeaders() }
    );

    if (res.ok) {
      const data: DiscoverSearchResult = await res.json();
      if (data.Items?.length > 0) {
        return data.Items.map(mapDiscoverUser);
      }
    }
  } catch {
    // Fall back to basic data from autocomplete
  }

  // Return basic users from AutoComplete without enrichment
  return autoCompleteUsers.map((u) => ({
    username: u.UserName,
    fullName: u.FullName ?? u.UserName,
    avatarUrl: '',
    copiers: 0,
    gainPct: 0,
    riskScore: 0,
    isPro: false,
    country: '',
  }));
}

async function searchUsersByText(query: string): Promise<EToroUser[]> {
  // Try the user-info search endpoint to resolve usernames
  const res = await fetch(
    `${DISCOVERY_BASE}/API/User/V1/Multiple/Info?Usernames=${encodeURIComponent(query)}`,
    { headers: discoveryHeaders() }
  );
  if (!res.ok) return [];

  const data = await res.json();
  // The response is an array of user info objects
  const users = Array.isArray(data) ? data : data.Users ?? data.items ?? [];
  return users.map((u: Record<string, unknown>) => ({
    username: String(u.UserName ?? u.username ?? ''),
    fullName: String(u.FullName ?? u.fullName ?? u.UserName ?? ''),
    avatarUrl: String(u.AvatarUrl ?? u.avatarUrl ?? ''),
    copiers: Number(u.Copiers ?? u.copiers ?? 0),
    gainPct: Number(u.Gain ?? u.gain ?? 0),
    riskScore: Number(u.RiskScore ?? u.riskScore ?? 0),
    isPro: Boolean(u.PopularInvestor ?? u.IsPro ?? false),
    country: String(u.Country ?? u.country ?? ''),
  }));
}

function mapDiscoverUser(item: DiscoverSearchResult['Items'][0]): EToroUser {
  return {
    username: item.UserName,
    fullName: item.FullName,
    avatarUrl: item.AvatarUrl ?? '',
    copiers: item.Copiers,
    gainPct: item.Gain,
    riskScore: item.RiskScore,
    isPro: item.PopularInvestor || item.IsPro === true,
    country: item.Country ?? '',
  };
}

// ── Public API – portfolio & instrument data ───────────

interface RawPosition {
  InstrumentID?: number;
  instrumentId?: number;
  instrumentID?: number;
  Direction?: string;
  direction?: string;
  Invested?: number;
  invested?: number;
  NetProfit?: number;
  netProfit?: number;
  Value?: number;
  value?: number;
  IsBuy?: boolean;
  isBuy?: boolean;
}

interface RawInstrument {
  InstrumentID?: number;
  instrumentId?: number;
  SymbolFull?: string;
  symbolFull?: string;
  InstrumentDisplayName?: string;
  instrumentDisplayName?: string;
  InstrumentTypeID?: number;
  instrumentTypeId?: number;
}

// Instrument type mapping (eToro InstrumentTypeID -> our types)
function mapInstrumentType(typeId: number): EToroPosition['type'] {
  switch (typeId) {
    case 1: return 'currency';
    case 2: return 'commodity';
    case 4: return 'stock';
    case 5: return 'etf';
    case 10: return 'crypto';
    default: return 'stock';
  }
}

// ── Instrument metadata cache ──────────────────────────

let instrumentCache: Map<number, RawInstrument> | null = null;
let instrumentCacheExpiry = 0;

async function getInstrumentMap(): Promise<Map<number, RawInstrument>> {
  if (instrumentCache && instrumentCacheExpiry > Date.now()) {
    return instrumentCache;
  }

  const res = await fetch(`${DISCOVERY_BASE}/Metadata/V1/Instruments`, {
    headers: discoveryHeaders(),
  });

  if (!res.ok) {
    return instrumentCache ?? new Map();
  }

  const data = await res.json();
  const instruments: RawInstrument[] =
    data.InstrumentData ?? data.Instruments ?? data ?? [];

  const map = new Map<number, RawInstrument>();
  for (const inst of instruments) {
    const id = inst.InstrumentID ?? inst.instrumentId ?? 0;
    if (id > 0) map.set(id, inst);
  }

  instrumentCache = map;
  instrumentCacheExpiry = Date.now() + 24 * 60 * 60_000; // 24 hours
  return map;
}

// ── Fetch public portfolio ─────────────────────────────

export async function fetchPortfolio(username: string): Promise<EToroPortfolioData | null> {
  const cacheKey = `portfolio:${username.toLowerCase()}`;

  return cached(cacheKey, 10 * 60_000, async () => {
    // Step 1: Get user profile via Discovery search
    let profile: EToroUser | null = null;
    try {
      const users = await searchUsersByText(username);
      profile = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      ) ?? users[0] ?? null;
    } catch {
      // continue without profile
    }

    if (!profile) {
      profile = {
        username,
        fullName: username,
        avatarUrl: '',
        copiers: 0,
        gainPct: 0,
        riskScore: 0,
        isPro: false,
        country: '',
      };
    }

    // Step 2: Fetch portfolio positions via Public API
    let positions: EToroPosition[] = [];
    try {
      const res = await fetch(
        `${PUBLIC_API_BASE}/copytrader/users/${encodeURIComponent(username)}/positions`,
        { headers: publicApiHeaders() }
      );

      if (res.ok) {
        const data = await res.json();
        const rawPositions: RawPosition[] =
          data.Positions ?? data.positions ?? data ?? [];

        // Get instrument metadata for mapping
        const instrumentMap = await getInstrumentMap();

        let totalInvested = 0;
        for (const p of rawPositions) {
          totalInvested += p.Invested ?? p.invested ?? 0;
        }

        positions = rawPositions.map((p) => {
          const instId = p.InstrumentID ?? p.instrumentId ?? p.instrumentID ?? 0;
          const inst = instrumentMap.get(instId);
          const invested = p.Invested ?? p.invested ?? 0;
          const netProfit = p.NetProfit ?? p.netProfit ?? 0;
          const currentValue = p.Value ?? p.value ?? invested + netProfit;
          const isBuy = p.IsBuy ?? p.isBuy ?? (p.Direction ?? p.direction) === 'Buy';
          const ticker = inst?.SymbolFull ?? inst?.symbolFull ?? `ID_${instId}`;
          const typeId = inst?.InstrumentTypeID ?? inst?.instrumentTypeId ?? 4;

          return {
            instrumentId: instId,
            instrumentName:
              inst?.InstrumentDisplayName ?? inst?.instrumentDisplayName ?? ticker,
            ticker,
            yahooSymbol: mapEToroTickerToYahoo(ticker, typeId),
            direction: isBuy ? 'buy' as const : 'sell' as const,
            invested,
            currentValue,
            pnl: netProfit,
            pnlPct: invested > 0 ? (netProfit / invested) * 100 : 0,
            allocationPct: totalInvested > 0 ? (invested / totalInvested) * 100 : 0,
            type: mapInstrumentType(typeId),
          };
        });

        positions.sort((a, b) => b.allocationPct - a.allocationPct);
      }
    } catch {
      // positions remain empty
    }

    // Step 3: Build stats from Discovery data
    const stats: EToroStats = {
      yearlyReturns: {},
      winRatio: 0,
      profitableWeeks: 0,
      riskScore: profile.riskScore,
      maxDailyDrawdown: 0,
      maxWeeklyDrawdown: 0,
      totalTrades: 0,
      copiers: profile.copiers,
    };

    // Try to enrich stats from Discovery search
    try {
      const params = new URLSearchParams({
        Period: 'OneYearAgo',
        Page: '1',
        PageSize: '1',
        Sort: '-Copiers',
        UserNames: username,
      });
      const res = await fetch(
        `${DISCOVERY_BASE}/Discover/V1/Search?${params}`,
        { headers: discoveryHeaders() }
      );
      if (res.ok) {
        const data: DiscoverSearchResult = await res.json();
        const item = data.Items?.[0];
        if (item) {
          stats.copiers = item.Copiers;
          stats.riskScore = item.RiskScore;
          if (item.Gain) stats.yearlyReturns['1Y'] = item.Gain;
          if (item.DailyGain) stats.yearlyReturns['1D'] = item.DailyGain;
          if (item.WeeklyGain) stats.yearlyReturns['1W'] = item.WeeklyGain;
        }
      }
    } catch {
      // use defaults
    }

    return { profile, positions, stats };
  });
}

// ── Symbol mapping ─────────────────────────────────────

function mapEToroTickerToYahoo(ticker: string, typeId: number): string | null {
  if (!ticker || ticker.startsWith('ID_')) return null;

  // Crypto: BTCUSD → BTC-USD, ETHUSD → ETH-USD
  if (typeId === 10) {
    const cryptoMatch = ticker.match(/^([A-Z]+)(USD|EUR|GBP)$/);
    if (cryptoMatch) return `${cryptoMatch[1]}-${cryptoMatch[2]}`;
  }

  // Forex: EURUSD → EURUSD=X
  if (typeId === 1) {
    return `${ticker}=X`;
  }

  // Commodities lookup
  const commodityMap: Record<string, string> = {
    GOLD: 'GC=F',
    SILVER: 'SI=F',
    OIL: 'CL=F',
    NGAS: 'NG=F',
    COPPER: 'HG=F',
    PLATINUM: 'PL=F',
    PALLADIUM: 'PA=F',
  };
  if (typeId === 2 && commodityMap[ticker]) {
    return commodityMap[ticker];
  }

  // Stocks & ETFs: most eToro tickers match Yahoo Finance directly
  // Remove exchange suffixes if present (e.g., AAPL.US → AAPL)
  const cleaned = ticker.replace(/\.\w+$/, '');
  return cleaned || null;
}
