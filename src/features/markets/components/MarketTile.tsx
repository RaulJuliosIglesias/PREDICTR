import * as React from 'react';
import { Link } from 'react-router-dom';
import type { Market } from '../../../types';
import { formatCents, formatCurrency, formatDate } from '../../../lib/utils';
import { useRealtimePrice } from '../../../hooks/useRealtimePrices';

export function MarketTile({ market }: { market: Market }) {
  const { price, dir } = useRealtimePrice(market.priceYesCents, 6000);
  const no = 100 - price;
  const [flash, setFlash] = React.useState<string>('');
  const [metaOpen, setMetaOpen] = React.useState(false);

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

  return (
    <div
      className="group relative rounded-[4px] border border-stroke bg-card p-3 transition-[border-color,transform] duration-150 hover:border-primary md:hover:translate-y-[1px]"
      onClick={() => setMetaOpen((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMetaOpen((v) => !v); }}
      aria-label={`Mercado ${market.title}`}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2" aria-live="polite">
          <span className={"text-3xl font-semibold " + flash}>{formatCents(price)}</span>
          <span className="text-sm text-muted-foreground">NO {formatCents(no)}</span>
        </div>
        <span className="text-[10px] font-medium uppercase text-muted-foreground">{market.category}</span>
      </div>
      <div className="text-sm">
        <Link to={`/markets/${market.id}`} className="hover:underline focus:outline-none">
          {market.title}
        </Link>
      </div>

      <div
        className={
          'mt-2 hidden text-xs text-muted-foreground md:block ' +
          'md:max-h-0 md:overflow-hidden md:transition-[max-height] md:duration-150 md:ease-out ' +
          'group-hover:md:max-h-24'
        }
      >
        <div className="flex items-center justify-between">
          <div>Volumen: {formatCurrency(market.totalVolumeUSD)}</div>
          <div>Resuelve: {formatDate(market.resolutionDate)}</div>
        </div>
      </div>

      <div className={(metaOpen ? 'block' : 'hidden') + ' mt-2 text-xs text-muted-foreground md:hidden'}>
        <div className="flex items-center justify-between">
          <div>Volumen: {formatCurrency(market.totalVolumeUSD)}</div>
          <div>Resuelve: {formatDate(market.resolutionDate)}</div>
        </div>
      </div>
    </div>
  );
}
