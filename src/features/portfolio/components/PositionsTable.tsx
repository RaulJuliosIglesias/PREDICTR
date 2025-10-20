import * as React from 'react';
import { useGetPortfolio } from '../../../api/portfolioApi';
import { useGetMarkets } from '../../../api/marketApi';

export function PositionsTable() {
  const { data } = useGetPortfolio();
  const { data: markets } = useGetMarkets();

  const rows = (data?.positions || []).map((p) => {
    const m = markets?.find((mm) => mm.id === p.marketId);
    const markCents = p.side === 'YES' ? (m?.priceYesCents ?? p.avgPriceCents) : 100 - (m?.priceYesCents ?? 100 - p.avgPriceCents);
    const pnl = p.shares * ((markCents - p.avgPriceCents) / 100);
    return { ...p, markCents, pnl };
  });

  const prevPnlsRef = React.useRef<Map<string, number>>(new Map());
  const [flashes, setFlashes] = React.useState<Record<string, 'up' | 'down'>>({});
  React.useEffect(() => {
    const updates: Record<string, 'up' | 'down'> = {};
    rows.forEach((r) => {
      const k = `${r.marketId}-${r.side}`;
      const prev = prevPnlsRef.current.get(k);
      if (prev !== undefined && r.pnl !== prev) {
        updates[k] = r.pnl > prev ? 'up' : 'down';
      }
      prevPnlsRef.current.set(k, r.pnl);
    });
    const keys = Object.keys(updates);
    if (keys.length) {
      setFlashes((f) => ({ ...f, ...updates }));
      const id = setTimeout(() => {
        setFlashes((f) => {
          const copy = { ...f } as Record<string, 'up' | 'down'>;
          keys.forEach((k) => delete copy[k]);
          return copy;
        });
      }, 300);
      return () => clearTimeout(id);
    }
  }, [rows]);

  if (!rows.length) {
    return (
      <div className="rounded-[4px] border border-stroke bg-card p-4 text-sm">
        <div className="mb-2 font-medium">Tu portafolio está vacío</div>
        <div className="text-muted-foreground">Haz tu primera predicción desde la página de mercados.</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-stroke text-muted-foreground">
          <tr>
            <th className="px-3 py-2">Mercado</th>
            <th className="px-3 py-2">Lado</th>
            <th className="px-3 py-2">Acciones</th>
            <th className="px-3 py-2">Precio Prom. (¢)</th>
            <th className="px-3 py-2">Precio Mark (¢)</th>
            <th className="px-3 py-2">G/P No Realizada</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.marketId}-${r.side}`} className="border-b border-stroke">
              <td className="px-3 py-2">{r.title}</td>
              <td className="px-3 py-2">{r.side}</td>
              <td className="px-3 py-2">{r.shares.toFixed(3)}</td>
              <td className="px-3 py-2">{Math.round(r.avgPriceCents)}</td>
              <td className="px-3 py-2">{Math.round(r.markCents)}</td>
              {(() => {
                const k = `${r.marketId}-${r.side}`;
                const flash = flashes[k];
                return (
                  <td className={`px-3 py-2 ${r.pnl >= 0 ? 'text-success' : 'text-danger'} ${flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''}`}>
                    ${r.pnl.toFixed(2)}
                  </td>
                );
              })()}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
