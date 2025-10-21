import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import type { Market } from '../../../types';
import { formatCents, formatCurrency, formatDate } from '../../../lib/utils';
import { useRealtimePrice } from '../../../hooks/useRealtimePrices';

const trendCopy: Record<NonNullable<Market['trend']>, string> = {
  alcista: 'Alza',
  bajista: 'Baja',
  lateral: 'Lateral',
};

export function MarketCard({ market }: { market: Market }) {
  const { price, dir } = useRealtimePrice(market.priceYesCents, 6000);
  const priceNo = 100 - price;

  const trendLabel = market.trend ? trendCopy[market.trend] : null;

  const yesAccent = dir === 'up' ? 'text-success' : dir === 'down' ? 'text-danger' : 'text-foreground';
  const noAccent = dir === 'up' ? 'text-danger' : dir === 'down' ? 'text-success' : 'text-foreground';

  return (
    <Card className="relative overflow-hidden rounded-[20px] border border-stroke/45 bg-card/92 shadow-[0_18px_50px_rgba(6,10,22,0.65)] transition-all duration-300 hover:-translate-y-[2px] focus-within:ring-2 focus-within:ring-primary/60">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary/70 via-success/50 to-primary/70" aria-hidden="true" />
      <CardHeader className="space-y-4 px-6 pt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="rounded-full border border-stroke/50 bg-card/80 px-3 py-1 font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            {market.category}
          </span>
          {trendLabel ? (
            <span className="rounded-full border border-stroke/50 bg-card/80 px-3 py-1 font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              {trendLabel}
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold leading-tight text-foreground">
          <Link to={`/markets/${market.id}`} className="outline-none transition hover:text-primary focus-visible:underline">
            {market.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <div className="grid grid-cols-2 gap-4" aria-live="polite">
          <div className="rounded-[14px] border border-stroke/45 bg-card/88 p-4 shadow-[0_14px_35px_rgba(7,11,20,0.28)] backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              <span>SÍ</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                {price}%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-3xl font-semibold ${yesAccent}`}>{formatCents(price)}</span>
              <span className="text-xs text-muted-foreground">Último</span>
            </div>
            <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-transparent via-stroke/40 to-transparent" />
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Bid</span>
              <span>{formatCents(Math.max(price - 2, 1))}</span>
            </div>
          </div>
          <div className="rounded-[14px] border border-stroke/45 bg-card/88 p-4 shadow-[0_14px_35px_rgba(7,11,20,0.28)] backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              <span>NO</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-danger/15 px-2.5 py-0.5 text-danger">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden="true" />
                {priceNo}%
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-3xl font-semibold ${noAccent}`}>{formatCents(priceNo)}</span>
              <span className="text-xs text-muted-foreground">Último</span>
            </div>
            <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-transparent via-stroke/40 to-transparent" />
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Bid</span>
              <span>{formatCents(Math.max(priceNo - 2, 1))}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-[12px] border border-stroke/35 bg-card/80 px-4 py-2.5 text-[11px] text-muted-foreground shadow-inner">
          <span>Volumen · {formatCurrency(market.totalVolumeUSD)}</span>
          <span>Resuelve · {formatDate(market.resolutionDate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
