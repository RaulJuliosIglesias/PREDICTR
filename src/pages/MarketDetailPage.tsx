import { useParams } from 'react-router-dom';
import { useGetMarketById } from '../api';
import { Spinner } from '../components/ui/Spinner';
import { MarketChart, TradeBox } from '../features/trade';
import * as React from 'react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTradeLogic } from '../features/trade/hooks/useTradeLogic';
import { useAuth } from '../hooks/useAuth';
import type { Market } from '../types';

function MarketDetailContent({ data }: { data: Market }) {
  const { isGuest } = useAuth();
  const isResolved = data.status !== 'open';
  const trade = useTradeLogic(data);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetSide, setSheetSide] = React.useState<'YES' | 'NO'>('YES');

  React.useEffect(() => {
    trade.form.setValue('side', sheetSide);
  }, [sheetSide]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-xl font-bold">{data.title}</h1>
        <MarketChart market={data} />
        <section className="rounded-[4px] border border-stroke bg-card p-4 text-sm">
          <h3 className="mb-2 font-semibold">Reglas de resolución</h3>
          <p className="text-muted-foreground">
            Este mercado se resolverá según fuentes confiables públicas. "SÍ" si el evento ocurre antes de la fecha de resolución; de lo contrario "NO".
          </p>
        </section>
      </div>
      <div className="lg:col-span-1">
        {isResolved ? (
          <section className="rounded-[4px] border border-stroke bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">Mercado Resuelto</h3>
            <p className="text-sm text-muted-foreground">
              Este mercado fue resuelto como {data.status === 'resolved_yes' ? '“SÍ” (100¢)' : '“NO” (0¢)'}.
            </p>
          </section>
        ) : (
          <div className="sticky top-14">
            <TradeBox market={data} />
          </div>
        )}
      </div>

      {!isResolved && (
        <div className="fixed inset-x-0 bottom-14 z-40 flex gap-2 border-t border-stroke bg-card p-3 md:hidden">
          <Button
            variant="yes"
            className="w-full"
            onClick={() => { setSheetSide('YES'); setSheetOpen(true); }}
          >
            COMPRAR SÍ
          </Button>
          <Button
            variant="no"
            className="w-full"
            onClick={() => { setSheetSide('NO'); setSheetOpen(true); }}
          >
            COMPRAR NO
          </Button>
        </div>
      )}

      <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title="Orden" variant="sheet">
        <form
          onSubmit={trade.form.handleSubmit(async () => { await trade.actions.submit(); setSheetOpen(false); })}
          className="space-y-3"
        >
          <div className="text-sm font-semibold">
            {sheetSide === 'YES' ? 'Comprar SÍ' : 'Comprar NO'} · {Math.round(trade.computed.price * 100)}¢
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <label className="inline-flex items-center gap-1">
              <input type="radio" name="by_m" checked={trade.values.by === 'usd'} onChange={() => trade.form.setValue('by', 'usd')} />
              Por dólares
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="radio" name="by_m" checked={trade.values.by === 'shares'} onChange={() => trade.form.setValue('by', 'shares')} />
              Por acciones
            </label>
          </div>
          <div>
            <label htmlFor="amount_m" className="mb-1 block text-xs text-muted-foreground">
              {trade.values.by === 'usd' ? 'Monto (USD)' : 'Acciones'}
            </label>
            <Input id="amount_m" type="number" step={trade.values.by === 'usd' ? '1' : '0.001'} min="0" {...trade.form.register('amount', { valueAsNumber: true })} />
            <div className="mt-1 text-xs text-danger" aria-live="polite">
              {trade.computed.invalidAmount ? 'Ingresa una cantidad válida' : trade.computed.insufficient ? 'Saldo insuficiente' : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">Costo Estimado</div>
              <div>${trade.computed.costUSD.toFixed(2)}</div>
            </div>
            <div className="rounded-[4px] border border-stroke p-2">
              <div className="text-muted-foreground">Ganancia Máxima</div>
              <div>${trade.computed.maxProfitUSD.toFixed(2)}</div>
            </div>
          </div>
          <Button type="submit" disabled={trade.computed.invalidAmount || trade.computed.insufficient} className="w-full">
            {isGuest ? 'Inicia sesión para operar' : 'Ejecutar Orden'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default function MarketDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useGetMarketById(id);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
  if (isError || !data) return <div className="text-danger">No se encontró el mercado.</div>;
  return <MarketDetailContent data={data} />;
}
