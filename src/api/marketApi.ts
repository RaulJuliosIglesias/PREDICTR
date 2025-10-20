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
    outcomes: [
      { id: 'o1', label: '<$60k', probabilityPct: 12, priceYesCents: 12, priceNoCents: 88, volumeUSD: 351784 },
      { id: 'o2', label: '$60k-$80k', probabilityPct: 31, priceYesCents: 31, priceNoCents: 69, volumeUSD: 90786 },
      { id: 'o3', label: '$80k-$100k', probabilityPct: 28, priceYesCents: 28, priceNoCents: 72, volumeUSD: 117441 },
      { id: 'o4', label: '$100k-$120k', probabilityPct: 18, priceYesCents: 18, priceNoCents: 82, volumeUSD: 100613 },
      { id: 'o5', label: '>$120k', probabilityPct: 11, priceYesCents: 11, priceNoCents: 89, volumeUSD: 141774 },
    ],
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
    outcomes: [
      { id: 'o1', label: '-25 bps', probabilityPct: 5, priceYesCents: 5, priceNoCents: 95, volumeUSD: 82000 },
      { id: 'o2', label: '0 bps', probabilityPct: 38, priceYesCents: 38, priceNoCents: 62, volumeUSD: 120000 },
      { id: 'o3', label: '+25 bps', probabilityPct: 44, priceYesCents: 44, priceNoCents: 56, volumeUSD: 230000 },
      { id: 'o4', label: '+50 bps', probabilityPct: 13, priceYesCents: 13, priceNoCents: 87, volumeUSD: 238000 },
    ],
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

function seriesFromInitial(initial: number, points: number, stepMs: number, maxDelta = 2): PricePoint[] {
  const arr: PricePoint[] = [];
  let p = initial;
  let t = Date.now() - points * stepMs;
  for (let i = 0; i < points; i++) {
    const delta = Math.round((Math.random() * 2 - 1) * maxDelta);
    p = Math.max(1, Math.min(99, p + delta));
    t += stepMs;
    arr.push({ t, yes: p });
  }
  return arr;
}

export type HistoryRange = '1H' | '1D' | '7D' | '1M' | '1Y';

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

export function useGetMarketHistory(id: string, range: HistoryRange = '1D') {
  const base = mockMarkets.find((m) => m.id === id)?.priceYesCents ?? 50;
  const config: Record<HistoryRange, { points: number; stepMs: number; delta: number }> = {
    '1H': { points: 60, stepMs: 60_000, delta: 3 },
    '1D': { points: 288, stepMs: 5 * 60_000, delta: 2 },
    '7D': { points: 336, stepMs: 30 * 60_000, delta: 2 },
    '1M': { points: 240, stepMs: 3 * 60 * 60_000, delta: 1.5 },
    '1Y': { points: 365, stepMs: 24 * 60 * 60_000, delta: 1 },
  };
  const { points, stepMs, delta } = config[range];
  return useQuery({
    queryKey: ['market-history', id, range],
    queryFn: async () => seriesFromInitial(base, points, stepMs, delta),
    enabled: !!id,
  });
}
