import { useQuery } from '@tanstack/react-query';
import type { Market, MarketCategory, PricePoint } from '../types';

const mockMarkets: Market[] = [
  {
    id: 'm1',
    title: '¿Superará Bitcoin los $100k en 2025?',
    category: 'Cripto',
    resolutionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
    totalVolumeUSD: 1245000,
    priceYesCents: 65,
    status: 'open',
  },
  {
    id: 'm2',
    title: '¿Ganará el Equipo X la final de liga?',
    category: 'Deportes',
    resolutionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    totalVolumeUSD: 345000,
    priceYesCents: 58,
    status: 'open',
  },
  {
    id: 'm3',
    title: '¿Subirá la tasa de interés en la próxima reunión?',
    category: 'Finanzas',
    resolutionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    totalVolumeUSD: 670000,
    priceYesCents: 42,
    status: 'open',
  },
  {
    id: 'm4',
    title: '¿Ganará el candidato Y las elecciones?',
    category: 'Política',
    resolutionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(),
    totalVolumeUSD: 1980000,
    priceYesCents: 52,
    status: 'open',
  },
  {
    id: 'm5',
    title: '¿Lloverá en Londres mañana?',
    category: 'Otros',
    resolutionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    totalVolumeUSD: 12500,
    priceYesCents: 35,
    status: 'open',
  },
  {
    id: 'm6',
    title: '¿ETH superará los $10k este año?',
    category: 'Cripto',
    resolutionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 200).toISOString(),
    totalVolumeUSD: 845000,
    priceYesCents: 48,
    status: 'open',
  },
];

function filterMarkets(
  markets: Market[],
  category?: MarketCategory | 'Todos',
  search?: string
): Market[] {
  let out = [...markets];
  if (category && category !== 'Todos') out = out.filter((m) => m.category === category);
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    out = out.filter((m) => m.title.toLowerCase().includes(q));
  }
  return out;
}

function seriesFromInitial(initial: number, points: number, stepMs: number): PricePoint[] {
  const arr: PricePoint[] = [];
  let p = initial;
  let t = Date.now() - points * stepMs;
  for (let i = 0; i < points; i++) {
    const delta = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
    p = Math.max(1, Math.min(99, p + delta));
    t += stepMs;
    arr.push({ t, yes: p });
  }
  return arr;
}

export function useGetMarkets(params?: { category?: MarketCategory | 'Todos'; search?: string }) {
  return useQuery({
    queryKey: ['markets', params],
    queryFn: async () => filterMarkets(mockMarkets, params?.category, params?.search),
    initialData: filterMarkets(mockMarkets, params?.category, params?.search),
  });
}

export function useGetMarketById(id: string) {
  return useQuery({
    queryKey: ['market', id],
    queryFn: async () => mockMarkets.find((m) => m.id === id)!,
    enabled: !!id,
  });
}

export function useGetMarketHistory(id: string, range: '1H' | '1D' | '7D' = '1D') {
  const base = mockMarkets.find((m) => m.id === id)?.priceYesCents ?? 50;
  const points = range === '1H' ? 60 : range === '1D' ? 180 : 240;
  const stepMs = range === '1H' ? 60_000 : range === '1D' ? 5 * 60_000 : 30 * 60_000;
  return useQuery({
    queryKey: ['market-history', id, range],
    queryFn: async () => seriesFromInitial(base, points, stepMs),
    enabled: !!id,
  });
}
