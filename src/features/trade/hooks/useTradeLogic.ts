import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { Market } from '../../../types';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePlaceOrder } from '../../../api/portfolioApi';
import { useToastStore } from '../../../store/useToastStore';
import { useGetPortfolio } from '../../../api/portfolioApi';
import { useRealtimePrice } from '../../../hooks/useRealtimePrices';

export type Side = 'YES' | 'NO';
export type By = 'usd' | 'shares';

export interface TradeForm {
  side: Side;
  by: By;
  amount: number; // dollars if by=usd, shares if by=shares
}

function centsToPrice(cents: number) {
  return cents / 100;
}

export function useTradeLogic(market: Market, opts?: { orderType?: 'buy' | 'sell' }) {
  const { balance, debit, credit } = useAuthStore();
  const toast = useToastStore((s) => s.push);
  const placeOrder = usePlaceOrder();
  const { data: portfolio } = useGetPortfolio();
  const { price: yesCentsRt } = useRealtimePrice(market.priceYesCents, 6000);

  const form = useForm<TradeForm>({
    defaultValues: { side: 'YES', by: 'usd', amount: 0 },
    mode: 'onChange',
  });

  const watch = form.watch();
  const yesPrice = centsToPrice(yesCentsRt);
  const noPrice = 1 - yesPrice;
  const price = watch.side === 'YES' ? yesPrice : noPrice;

  const shares = React.useMemo(() => {
    const amt = Number(watch.amount) || 0;
    return watch.by === 'usd' ? (price > 0 ? amt / price : 0) : amt;
  }, [watch.amount, watch.by, price]);

  const costUSD = React.useMemo(() => {
    const amt = Number(watch.amount) || 0;
    return watch.by === 'usd' ? amt : shares * price;
  }, [watch.amount, watch.by, shares, price]);

  const maxProfitUSD = React.useMemo(() => {
    const payoffPerShare = 1 - price; // settlement value (1) - entry price
    return shares * payoffPerShare;
  }, [shares, price]);

  const priceImpactCents = React.useMemo(() => {
    // Simple simulated impact: grows log-scale with shares
    const imp = Math.ceil(Math.log10(shares + 1)) || 0;
    return Math.min(3, Math.max(0, imp));
  }, [shares]);

  const orderType = opts?.orderType ?? 'buy';
  const availableShares = React.useMemo(() => {
    const pos = portfolio?.positions.find((p) => p.marketId === market.id && p.side === watch.side);
    return pos?.shares ?? 0;
  }, [portfolio, market.id, watch.side]);

  const insufficient = orderType === 'buy' ? costUSD > balance : shares > availableShares;
  const invalidAmount = !watch.amount || watch.amount <= 0;

  async function submit() {
    if (invalidAmount) return;
    if (insufficient) return;
    const tx = await placeOrder.mutateAsync({
      market,
      side: watch.side,
      by: watch.by,
      amount: watch.amount,
      orderType,
    });
    if (orderType === 'buy') {
      debit(costUSD);
    } else {
      const proceeds = shares * price;
      credit(proceeds);
    }
    toast({ type: 'success', message: 'Orden completada' });
    form.reset({ ...watch, amount: 0 });
  }

  return {
    form,
    values: watch,
    computed: {
      price,
      shares,
      costUSD,
      maxProfitUSD,
      priceImpactCents,
      insufficient,
      invalidAmount,
      availableShares,
    },
    actions: {
      submit,
    },
  } as const;
}
