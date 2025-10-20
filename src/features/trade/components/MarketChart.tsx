import * as React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { Market } from '../../../types';
import { useGetMarketHistory } from '../../../api';
import type { HistoryRange } from '../../../api';
import { Spinner } from '../../../components/ui/Spinner';

function tickFormatterFor(range: HistoryRange) {
  return (ts: number) => {
    const d = new Date(ts);
    if (range === '1H') return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    if (range === '1D') return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    if (range === '7D' || range === '1M') return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    return d.toLocaleDateString('es-ES', { month: 'short' });
  };
}

function labelFormatterFor(range: HistoryRange) {
  return (ts: number) => {
    const d = new Date(ts);
    if (range === '1H') return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (range === '1D') return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (range === '7D' || range === '1M') return d.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit' });
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };
}

export function MarketChart({ market }: { market: Market }) {
  const ranges: HistoryRange[] = ['1H', '1D', '7D', '1M', '1Y'];
  const [range, setRange] = React.useState<HistoryRange>('1D');
  const { data: history, isLoading } = useGetMarketHistory(market.id, range);
  const series = history ?? [];
  const tickFormatter = React.useMemo(() => tickFormatterFor(range), [range]);
  const tooltipLabelFormatter = React.useMemo(() => labelFormatterFor(range), [range]);

  return (
    <section aria-labelledby="chart-title" className="rounded-[4px] border border-stroke bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 id="chart-title" className="text-sm font-semibold">Precio SÍ (¢)</h3>
        <div className="flex items-center gap-2">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-[4px] border border-stroke px-2 py-1 text-xs ${r===range ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            <Spinner />
          </div>
        ) : (
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
              <XAxis dataKey="t" tickFormatter={tickFormatter} stroke="currentColor" opacity={0.6} minTickGap={16} />
              <YAxis domain={[0, 100]} stroke="currentColor" opacity={0.6} />
              <Tooltip formatter={(v: any) => [`${Math.round(v as number)}¢`, 'SÍ']} labelFormatter={(l) => tooltipLabelFormatter(l as number)} />
              <Line type="monotone" dataKey="yes" stroke="#F59E0B" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">Historial simulado para rangos 1H · 1D · 7D · 1M · 1Y</div>
    </section>
  );
}
