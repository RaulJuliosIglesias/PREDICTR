import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { Market } from '../../../types';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePlaceOrder } from '../../../api/portfolioApi';
import { useToastStore } from '../../../store/useToastStore';

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

export function useTradeLogic(market: Market) {
  const { balance, debit } = useAuthStore();
  const toast = useToastStore((s) => s.push);
  const placeOrder = usePlaceOrder();

  const form = useForm<TradeForm>({
    defaultValues: { side: 'YES', by: 'usd', amount: 10 },
    mode: 'onChange',
  });

  const watch = form.watch();
  const yesPrice = centsToPrice(market.priceYesCents);
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

  const insufficient = costUSD > balance;
  const invalidAmount = !watch.amount || watch.amount <= 0;

  async function submit() {
    if (invalidAmount) return;
    if (insufficient) return;
    await placeOrder.mutateAsync({
      market,
      side: watch.side,
      by: watch.by,
      amount: watch.amount,
    });
    // Deduct cost from balance to reflect immediate spend
    debit(costUSD);
    toast({ type: 'success', message: 'Orden completada' });
    form.reset({ ...watch, amount: 10 });
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
    },
    actions: {
      submit,
    },
  } as const;
}
