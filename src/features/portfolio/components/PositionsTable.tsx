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

  if (!rows.length) {
    return (
      <div className="rounded-lg border bg-card p-4 text-sm">
        <div className="mb-2 font-medium">Tu portafolio está vacío</div>
        <div className="text-muted-foreground">Haz tu primera predicción desde la página de mercados.</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b text-muted-foreground">
          <tr>
            <th className="px-3 py-2">Mercado</th>
            <th className="px-3 py-2">Lado</th>
            <th className="px-3 py-2">Acciones</th>
            <th className="px-3 py-2">Precio Prom. (¢)</th>
            <th className="px-3 py-2">Precio Mark (¢)</th>
            <th className="px-3 py-2">PnL no realizado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.marketId}-${r.side}`} className="border-b">
              <td className="px-3 py-2">{r.title}</td>
              <td className="px-3 py-2">{r.side}</td>
              <td className="px-3 py-2">{r.shares.toFixed(3)}</td>
              <td className="px-3 py-2">{Math.round(r.avgPriceCents)}</td>
              <td className="px-3 py-2">{Math.round(r.markCents)}</td>
              <td className={`px-3 py-2 ${r.pnl >= 0 ? 'text-success' : 'text-danger'}`}>${r.pnl.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
