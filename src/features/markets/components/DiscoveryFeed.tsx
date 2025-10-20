import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGetMarkets } from '../../../api';
import type { Market } from '../../../types';

export function DiscoveryFeed({ current, limit = 5 }: { current: Market; limit?: number }) {
  const { data } = useGetMarkets({ category: current.category });
  const items = (data || []).filter((m) => m.id !== current.id).slice(0, limit);
  if (!items.length) return null;

  return (
    <section aria-labelledby="discover-title" className="rounded-[4px] border border-stroke bg-card">
      <div className="border-b border-stroke px-3 py-2">
        <h3 id="discover-title" className="text-sm font-semibold">Descubrir</h3>
      </div>
      <ul className="divide-y divide-stroke">
        {items.map((m) => (
          <li key={m.id} className="px-3 py-2">
            <Link to={`/markets/${m.id}`} className="block">
              <div className="truncate text-sm">{m.title}</div>
              <div className="text-xs text-muted-foreground">{m.category} · {Math.round(m.priceYesCents)}¢</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
