'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Portfolio, PortfolioState, Instrument } from '@/types/portfolio';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/config/constants';

type Action =
  | { type: 'SET_STATE'; payload: PortfolioState }
  | { type: 'CREATE_PORTFOLIO'; payload: { name: string } }
  | { type: 'DELETE_PORTFOLIO'; payload: { id: string } }
  | { type: 'RENAME_PORTFOLIO'; payload: { id: string; name: string } }
  | { type: 'SET_ACTIVE'; payload: { id: string | null } }
  | { type: 'ADD_INSTRUMENT'; payload: { portfolioId: string; instrument: Instrument } }
  | { type: 'REMOVE_INSTRUMENT'; payload: { portfolioId: string; symbol: string } }
  | { type: 'UPDATE_INSTRUMENT_WEIGHT'; payload: { portfolioId: string; symbol: string; weight: number } }
  | { type: 'TOGGLE_CUSTOM_WEIGHTS'; payload: { portfolioId: string } };

const initialState: PortfolioState = {
  portfolios: [],
  activePortfolioId: null,
};

function reducer(state: PortfolioState, action: Action): PortfolioState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'CREATE_PORTFOLIO': {
      const newPortfolio: Portfolio = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        instruments: [],
        useCustomWeights: false,
        createdAt: now,
        updatedAt: now,
      };
      const portfolios = [...state.portfolios, newPortfolio];
      return {
        portfolios,
        activePortfolioId: newPortfolio.id,
      };
    }

    case 'DELETE_PORTFOLIO': {
      const portfolios = state.portfolios.filter((p) => p.id !== action.payload.id);
      return {
        portfolios,
        activePortfolioId:
          state.activePortfolioId === action.payload.id
            ? portfolios[0]?.id ?? null
            : state.activePortfolioId,
      };
    }

    case 'RENAME_PORTFOLIO':
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

    case 'TOGGLE_CUSTOM_WEIGHTS':
      return {
        ...state,
        portfolios: state.portfolios.map((p) =>
          p.id === action.payload.portfolioId
            ? { ...p, useCustomWeights: !p.useCustomWeights, updatedAt: now }
            : p
        ),
      };

    default:
      return state;
  }
}

interface PortfolioContextValue {
  state: PortfolioState;
  activePortfolio: Portfolio | null;
  createPortfolio: (name: string) => void;
  deletePortfolio: (id: string) => void;
  renamePortfolio: (id: string, name: string) => void;
  setActivePortfolio: (id: string | null) => void;
  addInstrument: (portfolioId: string, instrument: Instrument) => void;
  removeInstrument: (portfolioId: string, symbol: string) => void;
  updateInstrumentWeight: (portfolioId: string, symbol: string, weight: number) => void;
  toggleCustomWeights: (portfolioId: string) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getItem<PortfolioState>(STORAGE_KEYS.PORTFOLIO_STATE, initialState);
    dispatch({ type: 'SET_STATE', payload: saved });
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setItem(STORAGE_KEYS.PORTFOLIO_STATE, state);
    }
  }, [state, mounted]);

  const activePortfolio =
    state.portfolios.find((p) => p.id === state.activePortfolioId) ?? null;

  const value: PortfolioContextValue = {
    state,
    activePortfolio,
    createPortfolio: (name) => dispatch({ type: 'CREATE_PORTFOLIO', payload: { name } }),
    deletePortfolio: (id) => dispatch({ type: 'DELETE_PORTFOLIO', payload: { id } }),
    renamePortfolio: (id, name) =>
      dispatch({ type: 'RENAME_PORTFOLIO', payload: { id, name } }),
    setActivePortfolio: (id) => dispatch({ type: 'SET_ACTIVE', payload: { id } }),
    addInstrument: (portfolioId, instrument) =>
      dispatch({ type: 'ADD_INSTRUMENT', payload: { portfolioId, instrument } }),
    removeInstrument: (portfolioId, symbol) =>
      dispatch({ type: 'REMOVE_INSTRUMENT', payload: { portfolioId, symbol } }),
    updateInstrumentWeight: (portfolioId, symbol, weight) =>
      dispatch({ type: 'UPDATE_INSTRUMENT_WEIGHT', payload: { portfolioId, symbol, weight } }),
    toggleCustomWeights: (portfolioId) =>
      dispatch({ type: 'TOGGLE_CUSTOM_WEIGHTS', payload: { portfolioId } }),
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
