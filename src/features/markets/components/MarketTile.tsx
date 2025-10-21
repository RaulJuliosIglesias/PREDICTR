import * as React from 'react';
import { Link } from 'react-router-dom';
import type { Market } from '../../../types';
import { formatCents, formatCurrency, formatDate } from '../../../lib/utils';
import { useRealtimePrice } from '../../../hooks/useRealtimePrices';

const trendCopy: Record<NonNullable<Market['trend']>, string> = {
  alcista: 'Alza',
  bajista: 'Baja',
  lateral: 'Lateral',
};

export function MarketTile({ market }: { market: Market }) {
  const { price, dir } = useRealtimePrice(market.priceYesCents, 6000);
  const priceNo = 100 - price;
  const [flash, setFlash] = React.useState('');

  React.useEffect(() => {
    if (dir === 'up') {
      setFlash('flash-up');
      const id = setTimeout(() => setFlash(''), 300);
      return () => clearTimeout(id);
    }
    if (dir === 'down') {
      setFlash('flash-down');
      const id = setTimeout(() => setFlash(''), 300);
      return () => clearTimeout(id);
    }
  }, [dir]);

  const trendLabel = market.trend ? trendCopy[market.trend] : null;
  const yesColor = dir === 'up' ? 'text-success' : dir === 'down' ? 'text-danger' : 'text-foreground';
  const noColor = dir === 'up' ? 'text-danger' : dir === 'down' ? 'text-success' : 'text-foreground';
  const bidYes = Math.max(price - 2, 1);
  const bidNo = Math.max(priceNo - 2, 1);

  return (
    <Link
      to={`/markets/${market.id}`}
      className="group relative block overflow-hidden rounded-[18px] border border-stroke/45 bg-card/92 p-5 text-center shadow-[0_16px_44px_rgba(6,10,20,0.55)] transition-all duration-300 hover:-translate-y-[2px] hover:border-primary/60 hover:shadow-[0_24px_60px_rgba(6,10,22,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      aria-label={`Mercado ${market.title}`}
    >
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary/70 via-success/45 to-primary/70" aria-hidden="true" />
      <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        <span className="rounded-full border border-stroke/55 bg-card/80 px-3 py-1 font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          {market.category}
        </span>
        {trendLabel ? (
          <span className="rounded-full border border-stroke/55 bg-card/80 px-3 py-1 font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            {trendLabel}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug text-foreground transition group-hover:text-primary">
        {market.title}
      </h3>

      <div className="mt-5 grid grid-cols-2 gap-4" aria-live="polite">
        <div className={`rounded-[14px] border border-stroke/45 bg-card/88 p-4 shadow-[0_14px_32px_rgba(7,11,20,0.28)] backdrop-blur-sm ${flash}`}>
          <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            <span>SÍ</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/18 px-2.5 py-0.5 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              {price}%
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-semibold ${yesColor}`}>{formatCents(price)}</span>
            <span className="text-xs text-muted-foreground">Último</span>
          </div>
          <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-transparent via-stroke/40 to-transparent" />
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Bid</span>
            <span>{formatCents(bidYes)}</span>
          </div>
        </div>
        <div className="rounded-[14px] border border-stroke/45 bg-card/88 p-4 shadow-[0_14px_32px_rgba(7,11,20,0.28)] backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            <span>NO</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-danger/18 px-2.5 py-0.5 text-danger">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden="true" />
              {priceNo}%
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-semibold ${noColor}`}>{formatCents(priceNo)}</span>
            <span className="text-xs text-muted-foreground">Último</span>
          </div>
          <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-transparent via-stroke/40 to-transparent" />
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Bid</span>
            <span>{formatCents(bidNo)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-1 rounded-[12px] border border-stroke/40 bg-card/80 px-4 py-2.5 text-[11px] text-muted-foreground shadow-inner">
        <div>Volumen · {formatCurrency(market.totalVolumeUSD)}</div>
        <div>Resuelve · {formatDate(market.resolutionDate)}</div>
      </div>
    </Link>
  );
}
