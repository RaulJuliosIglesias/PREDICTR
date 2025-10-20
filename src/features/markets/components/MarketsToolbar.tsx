import * as React from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { MarketCategory } from '../../../types';

const CATEGORIES: Array<MarketCategory | 'Todos'> = [
  'Todos',
  'Política',
  'Finanzas',
  'Cripto',
  'Deportes',
  'Otros',
];

export function MarketsToolbar({
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
    <div className="sticky top-14 z-30 border-b border-stroke bg-background">
      <div className="mx-auto max-w-7xl p-3">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-96">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>🔎</span>
            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar mercados, temas, activos..."
              className="pl-9"
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => onSearch('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </Button>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="secondary" size="sm">Tendencias</Button>
            <Button variant="secondary" size="sm">Nuevos</Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => onCategory(c)}
              className={
                'rounded-[4px] border px-3 py-1 text-sm ' +
                (c === category ? 'border-primary text-primary' : 'border-stroke text-muted-foreground hover:text-foreground')
              }
              aria-pressed={c === category}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
