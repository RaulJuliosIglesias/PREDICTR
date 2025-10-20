import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import type { Market } from '../../../types';
import { formatCents, formatCurrency, formatDate } from '../../../lib/utils';
import { useRealtimePrice } from '../../../hooks/useRealtimePrices';

export function MarketCard({ market }: { market: Market }) {
  const { price, dir } = useRealtimePrice(market.priceYesCents, 6000);
  const no = 100 - price;

  return (
    <Card className="focus-within:ring-2 focus-within:ring-primary/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            <Link to={`/markets/${market.id}`} className="hover:underline focus:outline-none">
              {market.title}
            </Link>
          </h3>
          <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{market.category}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-end justify-between" aria-live="polite">
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold ${dir === 'up' ? 'text-success' : dir === 'down' ? 'text-danger' : ''}`}>SÍ: {formatCents(price)}</span>
            <span className="text-sm text-muted-foreground">NO: {formatCents(no)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Volumen: {formatCurrency(market.totalVolumeUSD)}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Resuelve: {formatDate(market.resolutionDate)}</span>
          {market.status !== 'open' && <span className="rounded bg-muted px-2 py-0.5">Resuelto</span>}
        </div>
      </CardContent>
    </Card>
  );
}
