import { InstrumentType } from './portfolio';

export interface SearchResult {
  symbol: string;
  name: string;
  type: InstrumentType;
  exchange: string;
  sector?: string;
}

export interface ApiError {
  error: string;
  status: number;
}
