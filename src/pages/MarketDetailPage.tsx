import { useParams } from 'react-router-dom';
import { useGetMarketById } from '../api';
import { Spinner } from '../components/ui/Spinner';
import { MarketChart, TradeBox } from '../features/trade';

export default function MarketDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useGetMarketById(id);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
  if (isError || !data) return <div className="text-danger">No se encontró el mercado.</div>;

  const isResolved = data.status !== 'open';

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-xl font-bold">{data.title}</h1>
        <MarketChart market={data} />
        <section className="rounded-lg border bg-card p-4 text-sm">
          <h3 className="mb-2 font-semibold">Reglas de resolución</h3>
          <p className="text-muted-foreground">
            Este mercado se resolverá según fuentes confiables públicas. "SÍ" si el evento ocurre antes de la fecha de resolución; de lo contrario "NO".
          </p>
        </section>
      </div>
      <div className="lg:col-span-1">
        {isResolved ? (
          <section className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">Mercado Resuelto</h3>
            <p className="text-sm text-muted-foreground">
              Este mercado fue resuelto como {data.status === 'resolved_yes' ? '“SÍ” (100¢)' : '“NO” (0¢)'}.
            </p>
          </section>
        ) : (
          <TradeBox market={data} />
        )}
      </div>
    </div>
  );
}
