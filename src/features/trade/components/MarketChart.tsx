import * as React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { Market } from '../../../types';
import { useRealtimeSeries } from '../../../hooks/useRealtimePrices';

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function MarketChart({ market }: { market: Market }) {
  const [range, setRange] = React.useState<'1H' | '1D' | '7D'>('1D');
  const interval = range === '1H' ? 10_000 : range === '1D' ? 10_000 : 10_000; // keep simple 10s
  const maxPoints = range === '1H' ? 60 : range === '1D' ? 180 : 240;
  const series = useRealtimeSeries(market.priceYesCents, interval, maxPoints);

  return (
    <section aria-labelledby="chart-title" className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 id="chart-title" className="text-sm font-semibold">Precio SÍ (¢)</h3>
        <div className="flex items-center gap-2">
          {(['1H','1D','7D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded border px-2 py-1 text-xs ${r===range ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={series} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="t" tickFormatter={formatTime} stroke="currentColor" opacity={0.6} />
            <YAxis domain={[0, 100]} stroke="currentColor" opacity={0.6} />
            <Tooltip
              formatter={(v: any) => [`${Math.round(v as number)}¢`, 'SÍ']}
              labelFormatter={(l) => formatTime(l as number)}
            />
            <Area type="monotone" dataKey="yes" stroke="#3b82f6" fill="url(#colorYes)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">Actualizando cada ~10s (simulado)</div>
    </section>
  );
}
