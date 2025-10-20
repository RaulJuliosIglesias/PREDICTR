import * as React from 'react';
import type { Market, MarketOutcome } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../lib/utils';

export function OutcomesTable({
  market,
  selectedId,
  onSelect,
}: {
  market: Market;
  selectedId?: string;
  onSelect: (o: MarketOutcome, side: 'YES' | 'NO') => void;
}) {
  const outcomes = market.outcomes || [];
  if (!outcomes.length) return null;

  return (
    <section aria-labelledby="outcomes-title" className="rounded-[4px] border border-stroke bg-card">
      <div className="border-b border-stroke px-3 py-2">
        <h3 id="outcomes-title" className="text-sm font-semibold">Resultados</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stroke text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Outcome</th>
              <th className="px-3 py-2">% Chance</th>
              <th className="px-3 py-2">Operar</th>
            </tr>
          </thead>
          <tbody>
            {outcomes.map((o) => {
              const disabled = o.probabilityPct < 1;
              const probLabel = o.probabilityPct < 1 ? '<1%' : `${o.probabilityPct}%`;
              return (
                <tr
                  key={o.id}
                  className={`border-b border-stroke ${selectedId === o.id ? 'bg-muted/10' : 'hover:bg-muted/5'}`}
                  aria-selected={selectedId === o.id}
                >
                  <td className="px-3 py-2">
                    <div className="font-medium">{o.label}</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(o.volumeUSD)} Vol.</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-2xl font-semibold">{probLabel}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="yes"
                        onClick={() => onSelect(o, 'YES')}
                        aria-label={`Comprar SÍ ${o.priceYesCents}¢ en ${o.label}`}
                        disabled={disabled}
                      >
                        <span className="font-medium">Yes</span> <span className="ml-1 font-semibold">{o.priceYesCents}¢</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="no"
                        onClick={() => onSelect(o, 'NO')}
                        aria-label={`Comprar NO ${o.priceNoCents}¢ en ${o.label}`}
                        disabled={disabled}
                      >
                        <span className="font-medium">No</span> <span className="ml-1 font-semibold">{o.priceNoCents}¢</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
