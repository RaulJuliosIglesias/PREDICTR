import * as React from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { Market } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { useTradeLogic } from '../hooks/useTradeLogic';
import { OrderSummaryModal } from './OrderSummaryModal';
import { useNavigate } from 'react-router-dom';
import { useRealtimePrice } from '../../../hooks/useRealtimePrices';

export function TradeBox({ market }: { market: Market }) {
  const { isGuest } = useAuth();
  const { form, values, computed, actions } = useTradeLogic(market);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const navigate = useNavigate();
  const { price } = useRealtimePrice(market.priceYesCents, 6000);
  const priceNo = 100 - price;
  const [mode, setMode] = React.useState<'idle' | 'YES' | 'NO'>('idle');

  const onSubmit = form.handleSubmit(() => {
    if (isGuest) {
      navigate('/login');
      return;
    }
    setConfirmOpen(true);
  });

  return (
    <section aria-labelledby="trade-title" className="rounded-[4px] border border-stroke bg-card p-4">
      <h3 id="trade-title" className="mb-3 text-sm font-semibold">Operar</h3>

      {mode === 'idle' ? (
        <div className="space-y-2">
          <Button
            type="button"
            variant="yes"
            size="lg"
            className="w-full"
            onClick={() => {
              form.setValue('side', 'YES');
              setMode('YES');
            }}
          >
            Comprar SÍ · {price}¢
          </Button>
          <Button
            type="button"
            variant="no"
            size="lg"
            className="w-full"
            onClick={() => {
              form.setValue('side', 'NO');
              setMode('NO');
            }}
          >
            Comprar NO · {priceNo}¢
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">
              {mode === 'YES' ? 'Comprar SÍ' : 'Comprar NO'} · {mode === 'YES' ? price : priceNo}¢
            </div>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setMode(mode === 'YES' ? 'NO' : 'YES')}
            >
              Cambiar a {mode === 'YES' ? 'NO' : 'SÍ'}
            </button>
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
              {computed.invalidAmount ? 'Ingresa una cantidad válida' : computed.insufficient ? 'Saldo insuficiente' : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">Costo Estimado</div>
              <div>${computed.costUSD.toFixed(2)}</div>
            </div>
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">Ganancia Máxima</div>
              <div>${computed.maxProfitUSD.toFixed(2)}</div>
            </div>
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">Impacto en Precio</div>
              <div>~{computed.priceImpactCents}¢</div>
            </div>
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">Precio Actual</div>
              <div>{Math.round(computed.price * 100)}¢</div>
            </div>
          </div>

          <Button type="submit" disabled={computed.invalidAmount || computed.insufficient} className="w-full">
            {isGuest ? 'Inicia sesión para operar' : 'Ejecutar Orden'}
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
