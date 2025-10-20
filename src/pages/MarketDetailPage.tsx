import { useParams } from 'react-router-dom';
import { useGetMarketById } from '../api';
import { Spinner } from '../components/ui/Spinner';
import { MarketChart, TradeBox } from '../features/trade';
import * as React from 'react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useTradeLogic } from '../features/trade/hooks/useTradeLogic';
import { useAuth } from '../hooks/useAuth';
import type { Market } from '../types';
import { OutcomesTable } from '../features/trade/components/OutcomesTable';
import { DiscoveryFeed } from '../features/markets/components/DiscoveryFeed';
import { formatCurrency } from '../lib/utils';
import { useRealtimePrice } from '../hooks/useRealtimePrices';

function MarketDetailContent({ data }: { data: Market }) {
  const { isGuest, balance } = useAuth();
  const isResolved = data.status !== 'open';
  const [selectedOutcome, setSelectedOutcome] = React.useState(data.outcomes?.[0]);
  const [selectedSide, setSelectedSide] = React.useState<'YES' | 'NO'>('YES');
  const [sheetOrderType, setSheetOrderType] = React.useState<'buy' | 'sell'>('buy');
  const trade = useTradeLogic(data, { orderType: sheetOrderType });
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetSide, setSheetSide] = React.useState<'YES' | 'NO'>('YES');
  const { price: sheetYesPrice } = useRealtimePrice(data.priceYesCents, 6000);
  const sheetNoPrice = 100 - sheetYesPrice;
  const quickAmounts = [5, 20, 50, 100];

  React.useEffect(() => {
    trade.form.register('amount', { valueAsNumber: true });
    return () => {
      trade.form.unregister('amount');
    };
  }, [trade.form]);

  React.useEffect(() => {
    trade.form.setValue('side', sheetSide);
    trade.form.setValue('by', 'usd');
  }, [sheetSide]);

  React.useEffect(() => {
    if (sheetOpen) {
      trade.form.setValue('by', 'usd');
    }
  }, [sheetOpen]);

  const addSheetAmount = (delta: number) => {
    const base = Number(trade.values.amount || 0);
    const next = Math.max(0, base + delta);
    trade.form.setValue('amount', Number(next.toFixed(2)), { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const setSheetAmount = (amt: number) => {
    trade.form.setValue('amount', Number(amt.toFixed(2)), { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-4">
        <h1 className="text-xl font-bold">{data.title}</h1>
        <MarketChart market={data} />
        <OutcomesTable
          market={data}
          selectedId={selectedOutcome?.id}
          onSelect={(o, side) => {
            setSelectedOutcome(o);
            setSelectedSide(side);
            setSheetSide(side);
          }}
        />
      </div>
      <div className="lg:col-span-3">
        {isResolved ? (
          <section className="rounded-[4px] border border-stroke bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">Mercado Resuelto</h3>
            <p className="text-sm text-muted-foreground">
              Este mercado fue resuelto como {data.status === 'resolved_yes' ? '“SÍ” (100¢)' : '“NO” (0¢)'}.
            </p>
          </section>
        ) : (
          <div className="sticky top-14">
            <TradeBox market={data} selectedOutcome={selectedOutcome} initialSide={selectedSide} />
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <DiscoveryFeed current={data} />
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
          onSubmit={trade.form.handleSubmit(async () => {
            if (isGuest) {
              setSheetOpen(false);
              return;
            }
            await trade.actions.submit();
            setSheetOpen(false);
          })}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex rounded-[4px] border border-stroke text-xs">
              <button
                type="button"
                className={`px-2 py-1 ${sheetOrderType === 'buy' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setSheetOrderType('buy')}
                aria-pressed={sheetOrderType === 'buy'}
              >
                Comprar
              </button>
              <button
                type="button"
                className={`px-2 py-1 ${sheetOrderType === 'sell' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setSheetOrderType('sell')}
                aria-pressed={sheetOrderType === 'sell'}
              >
                Vender
              </button>
            </div>
            <div className="text-xs text-muted-foreground">{selectedOutcome ? selectedOutcome.label : ''}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={sheetSide === 'YES' ? 'yes' : 'ghost'}
              className={`h-14 border border-stroke text-left ${sheetSide === 'YES' ? '' : 'text-muted-foreground'}`}
              onClick={() => setSheetSide('YES')}
            >
              <div className="flex flex-col">
                <span className="text-[11px] uppercase">SÍ</span>
                <span className="text-xl font-semibold">{sheetYesPrice}¢</span>
              </div>
            </Button>
            <Button
              type="button"
              variant={sheetSide === 'NO' ? 'no' : 'ghost'}
              className={`h-14 border border-stroke text-left ${sheetSide === 'NO' ? '' : 'text-muted-foreground'}`}
              onClick={() => setSheetSide('NO')}
            >
              <div className="flex flex-col">
                <span className="text-[11px] uppercase">NO</span>
                <span className="text-xl font-semibold">{sheetNoPrice}¢</span>
              </div>
            </Button>
          </div>

          <div className="rounded-[4px] border border-stroke px-3 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Monto</span>
              <button type="button" className="underline" onClick={() => setSheetAmount(0)}>Reset</button>
            </div>
            <div className="py-2 text-3xl font-semibold">{formatCurrency(Number(trade.values.amount || 0))}</div>
            <div className="text-xs text-muted-foreground">
              {sheetOrderType === 'buy'
                ? `Acciones estimadas: ~${trade.computed.shares.toFixed(3)}`
                : `Venderás: ~${trade.computed.shares.toFixed(3)} acciones`}
            </div>
            <div className="text-xs text-muted-foreground">Saldo disponible: {formatCurrency(balance)}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amt) => (
              <Button key={amt} type="button" variant="secondary" size="sm" onClick={() => addSheetAmount(amt)}>
                +${amt}
              </Button>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={() => setSheetAmount(balance)}>
              Max
            </Button>
          </div>

          <Button
            type="submit"
            disabled={trade.computed.invalidAmount || trade.computed.insufficient}
            className="w-full h-12 text-lg"
          >
            {isGuest ? 'Inicia sesión' : `${sheetOrderType === 'buy' ? 'Comprar' : 'Vender'} ${formatCurrency(Number(trade.values.amount || 0))}`}
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
