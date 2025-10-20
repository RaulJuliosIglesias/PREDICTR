import * as React from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { Market, MarketOutcome } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { useTradeLogic } from '../hooks/useTradeLogic';
import { OrderSummaryModal } from './OrderSummaryModal';
import { useNavigate } from 'react-router-dom';
import { useRealtimePrice } from '../../../hooks/useRealtimePrices';
import type { Side } from '../hooks/useTradeLogic';
import { cn, formatCurrency } from '../../../lib/utils';

export function TradeBox({ market, selectedOutcome, initialSide, initialOrderType, autoMaxSell }: { market: Market; selectedOutcome?: MarketOutcome; initialSide?: Side; initialOrderType?: 'buy' | 'sell'; autoMaxSell?: boolean }) {
  const { isGuest, balance } = useAuth();
  const [orderType, setOrderType] = React.useState<'buy' | 'sell'>('buy');
  const { form, values, computed, actions } = useTradeLogic(market, { orderType });
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [mode, setMode] = React.useState<'simple' | 'advanced'>('simple');
  const navigate = useNavigate();
  const { price } = useRealtimePrice(market.priceYesCents, 6000);
  const priceNo = 100 - price;

  React.useEffect(() => {
    if (initialSide) {
      form.setValue('side', initialSide);
    }
  }, [initialSide]);

  React.useEffect(() => {
    if (initialOrderType) {
      setOrderType(initialOrderType);
    }
  }, [initialOrderType]);

  React.useEffect(() => {
    if (mode === 'simple') {
      form.setValue('by', orderType === 'buy' ? 'usd' : 'shares');
    }
  }, [mode, orderType]);

  React.useEffect(() => {
    if (mode === 'simple') {
      form.setValue('by', orderType === 'buy' ? 'usd' : 'shares');
    }
  }, [orderType]);

  const autoMaxApplied = React.useRef(false);

  React.useEffect(() => {
    if (!autoMaxSell) {
      autoMaxApplied.current = false;
      return;
    }
    if (!autoMaxApplied.current && orderType === 'sell' && computed.availableShares > 0) {
      autoMaxApplied.current = true;
      form.setValue('by', 'shares');
      form.setValue('amount', Number(computed.availableShares.toFixed(3)), { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    }
  }, [autoMaxSell, orderType, computed.availableShares]);

  const isYes = values.side === 'YES';

  const updateSide = (side: Side) => {
    form.setValue('side', side);
  };

  const addAmount = (delta: number) => {
    const base = Number(values.amount || 0);
    const next = Math.max(0, base + delta);
    const precision = (values.by === 'usd' ? 2 : 3);
    form.setValue('amount', Number(next.toFixed(precision)), { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const setAmount = (amt: number) => {
    const precision = (values.by === 'usd' ? 2 : 3);
    form.setValue('amount', Number(amt.toFixed(precision)), { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const quickOptions = React.useMemo(() => (orderType === 'buy' ? [5, 20, 50, 100] : [1, 5, 10, 25]), [orderType]);

  const handleSubmit = form.handleSubmit(async () => {
    if (isGuest) {
      navigate('/login');
      return;
    }
    if (mode === 'simple') {
      await actions.submit();
      return;
    }
    setConfirmOpen(true);
  });

  const amountUSD = values.by === 'usd' ? Number(values.amount || 0) : computed.costUSD;
  const displayAmount = orderType === 'buy' ? amountUSD : computed.costUSD;

  const segmentGroup = 'flex rounded-[4px] border border-stroke bg-background/70 p-1 text-xs font-medium';
  const segmentOption = (active: boolean) => cn('flex-1 rounded-[3px] px-2 py-1 text-center transition', active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground');

  return (
    <section aria-labelledby="trade-title" className="rounded-[4px] border border-stroke bg-card p-4">
      <div className="mb-3 grid gap-2">
        <div className="flex items-center justify-between">
          <h3 id="trade-title" className="text-sm font-semibold">Operar</h3>
          <div className="text-xs text-muted-foreground">Precio · SÍ {price}¢ · NO {priceNo}¢</div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className={segmentGroup} role="group" aria-label="Tipo de orden">
            <button
              type="button"
              className={segmentOption(orderType === 'buy')}
              onClick={() => setOrderType('buy')}
              aria-pressed={orderType === 'buy'}
            >
              Comprar
            </button>
            <button
              type="button"
              className={segmentOption(orderType === 'sell')}
              onClick={() => setOrderType('sell')}
              aria-pressed={orderType === 'sell'}
            >
              Vender
            </button>
          </div>
          <div className={segmentGroup} role="group" aria-label="Modo de operación">
            <button
              type="button"
              className={segmentOption(mode === 'simple')}
              onClick={() => setMode('simple')}
              aria-pressed={mode === 'simple'}
            >
              Rápido
            </button>
            <button
              type="button"
              className={segmentOption(mode === 'advanced')}
              onClick={() => setMode('advanced')}
              aria-pressed={mode === 'advanced'}
            >
              Avanzado
            </button>
          </div>
        </div>
      </div>
      {selectedOutcome ? (
        <div className="mb-4 flex items-center justify-between rounded-[4px] border border-stroke bg-card/60 px-3 py-2 text-xs text-muted-foreground" aria-live="polite">
          <span className="uppercase tracking-wide text-[11px] text-muted-foreground">Resultado</span>
          <span className="text-foreground font-medium">{selectedOutcome.label}</span>
        </div>
      ) : null}

      {mode === 'simple' ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={isYes ? 'yes' : 'ghost'}
              size="lg"
              className={cn('h-20 border border-stroke text-left', isYes ? 'shadow-none' : 'text-muted-foreground')}
              onClick={() => updateSide('YES')}
            >
              <div className="flex w-full flex-col">
                <span className="text-xs uppercase">SÍ</span>
                <span className="text-2xl font-semibold">{price}¢</span>
              </div>
            </Button>
            <Button
              type="button"
              variant={!isYes ? 'no' : 'ghost'}
              size="lg"
              className={cn('h-20 border border-stroke text-left', !isYes ? 'shadow-none' : 'text-muted-foreground')}
              onClick={() => updateSide('NO')}
            >
              <div className="flex w-full flex-col">
                <span className="text-xs uppercase">NO</span>
                <span className="text-2xl font-semibold">{priceNo}¢</span>
              </div>
            </Button>
          </div>

          <div className="rounded-[4px] border border-stroke px-3 py-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{orderType === 'buy' ? 'Monto a invertir' : 'Monto objetivo'}</span>
              <button type="button" className="underline" onClick={() => setAmount(0)}>Reset</button>
            </div>
            <div className="flex items-end justify-between gap-3 py-2">
              <div className="text-4xl font-semibold">{formatCurrency(displayAmount)}</div>
              <div className="text-right text-[11px] uppercase text-muted-foreground">
                {orderType === 'buy'
                  ? `Saldo: ${formatCurrency(balance)}`
                  : `Acciones disp.: ~${computed.availableShares.toFixed(3)}`}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {orderType === 'buy'
                ? `Acciones estimadas · ~${computed.shares.toFixed(3)}`
                : `Recibirás aprox. · ${formatCurrency(displayAmount)}`}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickOptions.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant="secondary"
                size="sm"
                className="min-w-[80px] border border-stroke bg-background/40 text-xs font-semibold"
                onClick={() => addAmount(amt)}
              >
                {orderType === 'buy' ? `+$${amt}` : `+${amt}`}
              </Button>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="min-w-[80px] border border-stroke bg-background/40 text-xs font-semibold"
              onClick={() => setAmount(orderType === 'buy' ? balance : computed.availableShares)}
            >
              Max
            </Button>
          </div>

          {computed.insufficient ? (
            <div className="text-xs text-danger">
              {orderType === 'buy'
                ? 'Saldo insuficiente para completar esta compra.'
                : `Acciones insuficientes. Dispones de ~${computed.availableShares.toFixed(3)}.`}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-[4px] border border-stroke bg-background/40 p-2">
              <div className="text-muted-foreground">Precio actual</div>
              <div className="text-sm font-semibold">{Math.round(computed.price * 100)}¢</div>
            </div>
            <div className="rounded-[4px] border border-stroke bg-background/40 p-2">
              <div className="text-muted-foreground">{orderType === 'buy' ? 'Costo estimado' : 'Recibirás'}</div>
              <div className="text-sm font-semibold">{formatCurrency(displayAmount)}</div>
            </div>
          </div>

          <Button type="submit" disabled={computed.invalidAmount || computed.insufficient} className="w-full h-12 text-lg">
            {isGuest
              ? 'Inicia sesión'
              : `${orderType === 'buy' ? 'Comprar' : 'Vender'} ${formatCurrency(displayAmount)}`}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">
              {(orderType === 'buy' ? 'Comprar' : 'Vender')} {isYes ? 'SÍ' : 'NO'} · <span className="text-lg">{Math.round(computed.price * 100)}¢</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                className={cn('rounded-[4px] border border-stroke px-2 py-1', isYes ? 'bg-success text-black' : 'text-muted-foreground')}
                onClick={() => updateSide('YES')}
              >
                SÍ
              </button>
              <button
                type="button"
                className={cn('rounded-[4px] border border-stroke px-2 py-1', !isYes ? 'bg-danger text-black' : 'text-muted-foreground')}
                onClick={() => updateSide('NO')}
              >
                NO
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="by"
                checked={values.by === 'usd'}
                onChange={() => form.setValue('by', 'usd')}
              />
              Por dólares
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="by"
                checked={values.by === 'shares'}
                onChange={() => form.setValue('by', 'shares')}
              />
              Por acciones
            </label>
          </div>

          <div>
            <label htmlFor="amount" className="mb-1 block text-xs text-muted-foreground">
              {values.by === 'usd' ? 'Monto (USD)' : 'Acciones'}
            </label>
            <Input
              id="amount"
              type="number"
              step={values.by === 'usd' ? '1' : '0.001'}
              min="0"
              {...form.register('amount', { valueAsNumber: true })}
              aria-invalid={computed.invalidAmount || computed.insufficient}
            />
            <div className="mt-1 text-xs text-danger" aria-live="polite">
              {computed.invalidAmount
                ? 'Ingresa una cantidad válida'
                : computed.insufficient
                  ? orderType === 'buy'
                    ? 'Saldo insuficiente'
                    : `Acciones insuficientes. Dispones de ~${computed.availableShares.toFixed(3)}`
                  : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">Precio actual</div>
              <div>{Math.round(computed.price * 100)}¢</div>
            </div>
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">{orderType === 'buy' ? 'Costo estimado' : 'Recibirás'}</div>
              <div>{formatCurrency(displayAmount)}</div>
            </div>
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">{orderType === 'buy' ? 'Acciones estimadas' : 'Acciones a vender'}</div>
              <div>~{computed.shares.toFixed(3)}</div>
            </div>
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">{orderType === 'buy' ? 'Ganancia máxima' : 'Acciones disponibles'}</div>
              <div>{orderType === 'buy' ? formatCurrency(computed.maxProfitUSD) : `~${computed.availableShares.toFixed(3)}`}</div>
            </div>
          </div>

          <Button type="submit" disabled={computed.invalidAmount || computed.insufficient} className="w-full">
            {isGuest ? 'Inicia sesión para operar' : `${orderType === 'buy' ? 'Comprar' : 'Vender'}`}
          </Button>
        </form>
      )}

      <OrderSummaryModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          try {
            await actions.submit();
          } catch (e) {
          }
        }}
        data={{ side: values.side, shares: computed.shares, costUSD: computed.costUSD, maxProfitUSD: computed.maxProfitUSD }}
      />
    </section>
  );
}
