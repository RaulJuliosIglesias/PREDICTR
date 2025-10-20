import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Market } from '../types';
import { useToastStore } from '../store/useToastStore';

type Side = 'YES' | 'NO';

type Position = {
  marketId: string;
  title: string;
  side: Side;
  shares: number;
  avgPriceCents: number;
};

type Transaction = {
  id: string;
  marketId: string;
  title: string;
  side: Side;
  shares: number; // negative for sell
  priceCents: number;
  costUSD: number; // negative for sell (proceeds)
  ts: number;
};

const state: { positions: Position[]; history: Transaction[] } = {
  positions: [],
  history: [],
};

function upsertPosition(p: Position) {
  const i = state.positions.findIndex((x) => x.marketId === p.marketId && x.side === p.side);
  if (i >= 0) {
    const cur = state.positions[i];
    const totalShares = cur.shares + p.shares;
    const newAvg = (cur.avgPriceCents * cur.shares + p.avgPriceCents * p.shares) / totalShares;
    state.positions[i] = { ...cur, shares: totalShares, avgPriceCents: newAvg };
  } else {
    state.positions.push(p);
  }
}

function decreasePosition(marketId: string, side: Side, sharesToSell: number) {
  const i = state.positions.findIndex((x) => x.marketId === marketId && x.side === side);
  if (i < 0) return 0;
  const cur = state.positions[i];
  const sell = Math.min(cur.shares, sharesToSell);
  const remaining = cur.shares - sell;
  if (remaining <= 0.00001) {
    state.positions.splice(i, 1);
  } else {
    state.positions[i] = { ...cur, shares: remaining };
  }
  return sell;
}

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

export function useGetPortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => ({ positions: state.positions, history: state.history }),
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { market: Market; side: Side; by: 'usd' | 'shares'; amount: number; orderType: 'buy' | 'sell' }) => {
      await new Promise((r) => setTimeout(r, 400));
      if (Math.random() < 0.08) throw new Error('Error en la transacción simulada');
      const priceCents = input.side === 'YES' ? input.market.priceYesCents : 100 - input.market.priceYesCents;
      const price = priceCents / 100;
      if (input.orderType === 'buy') {
        const shares = input.by === 'usd' ? input.amount / price : input.amount;
        const costUSD = shares * price;
        const tx: Transaction = {
          id: rid(),
          marketId: input.market.id,
          title: input.market.title,
          side: input.side,
          shares,
          priceCents,
          costUSD,
          ts: Date.now(),
        };
        state.history.unshift(tx);
        upsertPosition({ marketId: input.market.id, title: input.market.title, side: input.side, shares, avgPriceCents: priceCents });
        return tx;
      } else {
        // sell
        const desiredShares = input.by === 'usd' ? input.amount / price : input.amount;
        const sold = decreasePosition(input.market.id, input.side, desiredShares);
        if (sold <= 0) throw new Error('No tienes acciones suficientes para vender.');
        const proceedsUSD = sold * price;
        const tx: Transaction = {
          id: rid(),
          marketId: input.market.id,
          title: input.market.title,
          side: input.side,
          shares: -sold,
          priceCents,
          costUSD: -proceedsUSD,
          ts: Date.now(),
        };
        state.history.unshift(tx);
        return tx;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio'] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Error en la transacción. Inténtalo de nuevo.';
      useToastStore.getState().push({ type: 'error', message });
    },
  });
}
