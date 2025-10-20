import * as React from 'react';
import type { MarketCategory } from '../../../types';
import { Input } from '../../../components/ui/Input';

const categories: Array<MarketCategory | 'Todos'> = ['Todos', 'Deportes', 'Política', 'Finanzas', 'Cripto', 'Otros'];

export function MarketFilters({
  category,
  search,
  onCategory,
  onSearch,
}: {
  category: MarketCategory | 'Todos';
  search: string;
  onCategory: (c: MarketCategory | 'Todos') => void;
  onSearch: (q: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onCategory(c)}
            className={`rounded-md border px-3 py-1 text-sm ${
              c === category ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="w-full sm:w-64">
        <label className="mb-1 block text-xs text-muted-foreground" htmlFor="search">
          Buscar mercados
        </label>
        <Input
          id="search"
          value={search}
          placeholder="Ej. Bitcoin, elecciones..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
