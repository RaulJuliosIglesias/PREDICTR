import * as React from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { Market } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { useTradeLogic } from '../hooks/useTradeLogic';
import { OrderSummaryModal } from './OrderSummaryModal';
import { useNavigate } from 'react-router-dom';

export function TradeBox({ market }: { market: Market }) {
  const { isGuest } = useAuth();
  const { form, values, computed, actions } = useTradeLogic(market);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const navigate = useNavigate();

  const onSubmit = form.handleSubmit(() => {
    if (isGuest) {
      navigate('/login');
      return;
    }
    setConfirmOpen(true);
  });

  return (
    <section aria-labelledby="trade-title" className="rounded-lg border bg-card p-4">
      <h3 id="trade-title" className="mb-3 text-sm font-semibold">Módulo de Orden</h3>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={values.side === 'YES' ? 'primary' : 'secondary'}
            onClick={() => form.setValue('side', 'YES')}
            aria-pressed={values.side === 'YES'}
          >
            Comprar SÍ
          </Button>
          <Button
            type="button"
            variant={values.side === 'NO' ? 'primary' : 'secondary'}
            onClick={() => form.setValue('side', 'NO')}
            aria-pressed={values.side === 'NO'}
          >
            Comprar NO
          </Button>
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
          <div className="rounded border p-2">
            <div className="text-muted-foreground">Costo Estimado</div>
            <div>${computed.costUSD.toFixed(2)}</div>
          </div>
          <div className="rounded border p-2">
            <div className="text-muted-foreground">Ganancia Máxima</div>
            <div>${computed.maxProfitUSD.toFixed(2)}</div>
          </div>
          <div className="rounded border p-2">
            <div className="text-muted-foreground">Impacto en Precio</div>
            <div>~{computed.priceImpactCents}¢</div>
          </div>
          <div className="rounded border p-2">
            <div className="text-muted-foreground">Precio Actual</div>
            <div>{Math.round(computed.price * 100)}¢</div>
          </div>
        </div>

        <Button type="submit" disabled={computed.invalidAmount || computed.insufficient}>
          {isGuest ? 'Inicia sesión para operar' : 'Ejecutar Orden'}
        </Button>
      </form>

      <OrderSummaryModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          try {
            await actions.submit();
          } catch (e) {
            // Fallback toast via store will show in mutation onError; noop here
          }
        }}
        data={{ side: values.side, shares: computed.shares, costUSD: computed.costUSD, maxProfitUSD: computed.maxProfitUSD }}
      />
    </section>
  );
}
