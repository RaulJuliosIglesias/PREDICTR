import * as React from 'react';
import { useGetMarkets } from '../../../api';
import type { MarketCategory } from '../../../types';
import { MarketCard } from './MarketCard';
import { MarketFilters } from './MarketFilters';
import { Spinner } from '../../../components/ui/Spinner';

export function MarketList() {
  const [category, setCategory] = React.useState<MarketCategory | 'Todos'>('Todos');
  const [search, setSearch] = React.useState('');
  const { data, isLoading, isError, refetch } = useGetMarkets({ category, search });

  return (
    <section aria-labelledby="markets-title">
      <h2 id="markets-title" className="sr-only">Mercados</h2>
      <MarketFilters category={category} search={search} onCategory={setCategory} onSearch={setSearch} />
      {isLoading ? (
        <div className="flex h-40 items-center justify-center"><Spinner /></div>
      ) : isError ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm">
          <div className="text-danger">No se pudieron cargar los mercados.</div>
          <button className="rounded border px-3 py-1" onClick={() => refetch()}>Reintentar</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data!.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      )}
    </section>
  );
}
