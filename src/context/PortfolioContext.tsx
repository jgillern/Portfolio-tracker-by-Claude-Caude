'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { Portfolio, PortfolioState, Instrument } from '@/types/portfolio';
import { useAuth } from '@/context/AuthContext';
import * as db from '@/lib/supabase/database';

type Action =
  | { type: 'SET_STATE'; payload: PortfolioState }
  | { type: 'SET_PORTFOLIOS'; payload: { portfolios: Portfolio[]; activePortfolioId: string | null } }
  | { type: 'ADD_PORTFOLIO'; payload: Portfolio }
  | { type: 'REMOVE_PORTFOLIO'; payload: { id: string } }
  | { type: 'UPDATE_PORTFOLIO_NAME'; payload: { id: string; name: string } }
  | { type: 'SET_ACTIVE'; payload: { id: string | null } }
  | { type: 'ADD_INSTRUMENT'; payload: { portfolioId: string; instrument: Instrument } }
  | { type: 'REMOVE_INSTRUMENT'; payload: { portfolioId: string; symbol: string } }
  | { type: 'UPDATE_INSTRUMENT_WEIGHT'; payload: { portfolioId: string; symbol: string; weight: number | undefined } };

const initialState: PortfolioState = {
  portfolios: [],
  activePortfolioId: null,
};

function reducer(state: PortfolioState, action: Action): PortfolioState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'SET_PORTFOLIOS':
      return {
        portfolios: action.payload.portfolios,
        activePortfolioId: action.payload.activePortfolioId,
      };

    case 'ADD_PORTFOLIO':
      return {
        portfolios: [...state.portfolios, action.payload],
        activePortfolioId: action.payload.id,
      };

    case 'REMOVE_PORTFOLIO': {
      const portfolios = state.portfolios.filter((p) => p.id !== action.payload.id);
      return {
        portfolios,
        activePortfolioId:
          state.activePortfolioId === action.payload.id
            ? portfolios[0]?.id ?? null
            : state.activePortfolioId,
      };
    }

    case 'UPDATE_PORTFOLIO_NAME':
      return {
        ...state,
        portfolios: state.portfolios.map((p) =>
          p.id === action.payload.id ? { ...p, name: action.payload.name, updatedAt: now } : p
        ),
      };

    case 'SET_ACTIVE':
      return { ...state, activePortfolioId: action.payload.id };

    case 'ADD_INSTRUMENT':
      return {
        ...state,
        portfolios: state.portfolios.map((p) =>
          p.id === action.payload.portfolioId
            ? {
                ...p,
                instruments: [...p.instruments, action.payload.instrument],
                updatedAt: now,
              }
            : p
        ),
      };

    case 'REMOVE_INSTRUMENT':
      return {
        ...state,
        portfolios: state.portfolios.map((p) =>
          p.id === action.payload.portfolioId
            ? {
                ...p,
                instruments: p.instruments.filter((i) => i.symbol !== action.payload.symbol),
                updatedAt: now,
              }
            : p
        ),
      };

    case 'UPDATE_INSTRUMENT_WEIGHT':
      return {
        ...state,
        portfolios: state.portfolios.map((p) =>
          p.id === action.payload.portfolioId
            ? {
                ...p,
                instruments: p.instruments.map((i) =>
                  i.symbol === action.payload.symbol
                    ? { ...i, weight: action.payload.weight }
                    : i
                ),
                updatedAt: now,
              }
            : p
        ),
      };

    default:
      return state;
  }
}

function dbInstrumentToLocal(inst: db.DbInstrument): Instrument {
  return {
    symbol: inst.symbol,
    name: inst.name,
    type: inst.type,
    sector: inst.sector ?? undefined,
    weight: inst.weight != null ? Number(inst.weight) : undefined,
    logoUrl: inst.logo_url ?? undefined,
    addedAt: inst.added_at,
  };
}

interface PortfolioContextValue {
  state: PortfolioState;
  activePortfolio: Portfolio | null;
  isLoading: boolean;
  createPortfolio: (name: string) => Promise<boolean>;
  deletePortfolio: (id: string) => void;
  renamePortfolio: (id: string, name: string) => void;
  setActivePortfolio: (id: string | null) => void;
  addInstrument: (portfolioId: string, instrument: Instrument) => void;
  removeInstrument: (portfolioId: string, symbol: string) => void;
  updateInstrumentWeight: (portfolioId: string, symbol: string, weight: number | undefined) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load portfolios + instruments from Supabase on mount / user change
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET_STATE', payload: initialState });
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const portfolios = await db.getPortfolios(user!.id);
      if (cancelled) return;

      const portfolioIds = portfolios.map((p) => p.id);
      const allInstruments = await db.getAllInstruments(portfolioIds);
      if (cancelled) return;

      const localPortfolios: Portfolio[] = portfolios.map((p) => ({
        id: p.id,
        name: p.name,
        instruments: allInstruments
          .filter((inst) => inst.portfolio_id === p.id)
          .map(dbInstrumentToLocal),
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      const activePortfolio = portfolios.find((p) => p.is_active);
      dispatch({
        type: 'SET_PORTFOLIOS',
        payload: {
          portfolios: localPortfolios,
          activePortfolioId: activePortfolio?.id ?? localPortfolios[0]?.id ?? null,
        },
      });
      setIsLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  const activePortfolio =
    state.portfolios.find((p) => p.id === state.activePortfolioId) ?? null;

  const createPortfolio = useCallback(
    async (name: string): Promise<boolean> => {
      if (!user) return false;
      const newPortfolio = await db.createPortfolio(user.id, name, true);
      if (!newPortfolio) return false;

      await db.setActivePortfolio(user.id, newPortfolio.id);

      dispatch({
        type: 'ADD_PORTFOLIO',
        payload: {
          id: newPortfolio.id,
          name: newPortfolio.name,
          instruments: [],
          createdAt: newPortfolio.created_at,
          updatedAt: newPortfolio.updated_at,
        },
      });
      return true;
    },
    [user]
  );

  const deletePortfolioFn = useCallback(
    async (id: string) => {
      await db.deletePortfolio(id);
      dispatch({ type: 'REMOVE_PORTFOLIO', payload: { id } });

      if (user && state.activePortfolioId === id) {
        const remaining = state.portfolios.filter((p) => p.id !== id);
        const newActive = remaining[0]?.id ?? null;
        if (newActive) await db.setActivePortfolio(user.id, newActive);
      }
    },
    [user, state.activePortfolioId, state.portfolios]
  );

  const renamePortfolioFn = useCallback(
    async (id: string, name: string) => {
      await db.renamePortfolio(id, name);
      dispatch({ type: 'UPDATE_PORTFOLIO_NAME', payload: { id, name } });
    },
    []
  );

  const setActivePortfolioFn = useCallback(
    async (id: string | null) => {
      if (user) await db.setActivePortfolio(user.id, id);
      dispatch({ type: 'SET_ACTIVE', payload: { id } });
    },
    [user]
  );

  const addInstrumentFn = useCallback(
    async (portfolioId: string, instrument: Instrument) => {
      const added = await db.addInstrument(portfolioId, {
        symbol: instrument.symbol,
        name: instrument.name,
        type: instrument.type,
        sector: instrument.sector,
        weight: instrument.weight,
        logoUrl: instrument.logoUrl,
      });
      if (!added) return;

      dispatch({
        type: 'ADD_INSTRUMENT',
        payload: { portfolioId, instrument: { ...instrument, addedAt: added.added_at } },
      });
    },
    []
  );

  const removeInstrumentFn = useCallback(
    async (portfolioId: string, symbol: string) => {
      await db.removeInstrument(portfolioId, symbol);
      dispatch({ type: 'REMOVE_INSTRUMENT', payload: { portfolioId, symbol } });
    },
    []
  );

  const updateInstrumentWeightFn = useCallback(
    async (portfolioId: string, symbol: string, weight: number | undefined) => {
      await db.updateInstrumentWeight(portfolioId, symbol, weight ?? null);
      dispatch({ type: 'UPDATE_INSTRUMENT_WEIGHT', payload: { portfolioId, symbol, weight } });
    },
    []
  );

  const value: PortfolioContextValue = {
    state,
    activePortfolio,
    isLoading,
    createPortfolio,
    deletePortfolio: deletePortfolioFn,
    renamePortfolio: renamePortfolioFn,
    setActivePortfolio: setActivePortfolioFn,
    addInstrument: addInstrumentFn,
    removeInstrument: removeInstrumentFn,
    updateInstrumentWeight: updateInstrumentWeightFn,
  };

  return (
    <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
