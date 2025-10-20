import { useQuery } from '@tanstack/react-query';
import type { Market, MarketCategory, MarketOutcome, PricePoint } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

const baseMarkets: Market[] = [
  {
    id: 'm1',
    title: '¿Superará Bitcoin los $100k en 2025?',
    category: 'Cripto',
    resolutionDate: new Date(Date.now() + 90 * DAY_MS).toISOString(),
    totalVolumeUSD: 1245000,
    priceYesCents: 65,
    status: 'open',
    trend: 'alcista',
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
    resolutionDate: new Date(Date.now() + 14 * DAY_MS).toISOString(),
    totalVolumeUSD: 345000,
    priceYesCents: 58,
    status: 'open',
    trend: 'alcista',
  },
  {
    id: 'm3',
    title: '¿Subirá la tasa de interés en la próxima reunión?',
    category: 'Finanzas',
    resolutionDate: new Date(Date.now() + 30 * DAY_MS).toISOString(),
    totalVolumeUSD: 670000,
    priceYesCents: 42,
    status: 'open',
    trend: 'lateral',
    outcomes: [
      { id: 'm3o1', label: '-25 bps', probabilityPct: 5, priceYesCents: 5, priceNoCents: 95, volumeUSD: 82000 },
      { id: 'm3o2', label: '0 bps', probabilityPct: 38, priceYesCents: 38, priceNoCents: 62, volumeUSD: 120000 },
      { id: 'm3o3', label: '+25 bps', probabilityPct: 44, priceYesCents: 44, priceNoCents: 56, volumeUSD: 230000 },
      { id: 'm3o4', label: '+50 bps', probabilityPct: 13, priceYesCents: 13, priceNoCents: 87, volumeUSD: 238000 },
    ],
  },
  {
    id: 'm4',
    title: '¿Ganará el candidato Y las elecciones?',
    category: 'Política',
    resolutionDate: new Date(Date.now() + 120 * DAY_MS).toISOString(),
    totalVolumeUSD: 1980000,
    priceYesCents: 52,
    status: 'open',
    trend: 'lateral',
  },
  {
    id: 'm5',
    title: '¿Lloverá en Londres mañana?',
    category: 'Otros',
    resolutionDate: new Date(Date.now() + 1 * DAY_MS).toISOString(),
    totalVolumeUSD: 12500,
    priceYesCents: 35,
    status: 'open',
    trend: 'bajista',
  },
  {
    id: 'm6',
    title: '¿ETH superará los $10k este año?',
    category: 'Cripto',
    resolutionDate: new Date(Date.now() + 200 * DAY_MS).toISOString(),
    totalVolumeUSD: 845000,
    priceYesCents: 48,
    status: 'open',
    trend: 'alcista',
  },
];

const topicDeck: Array<{ category: MarketCategory; subject: string }> = [
  { category: 'Cripto', subject: 'Bitcoin mantendrá una capitalización superior a $1T' },
  { category: 'Cripto', subject: 'Ethereum activará Proto-Danksharding en mainnet' },
  { category: 'Cripto', subject: 'Solana duplicará su volumen de stablecoins' },
  { category: 'Cripto', subject: 'Un país del G20 adoptará un stablecoin nacional' },
  { category: 'Cripto', subject: 'Los activos tokenizados superarán los $30B en TVL' },
  { category: 'Finanzas', subject: 'La Reserva Federal recortará tasas en 50 puntos básicos' },
  { category: 'Finanzas', subject: 'El S&P 500 cerrará el año por encima de 5,800' },
  { category: 'Finanzas', subject: 'El oro superará los $2,500 por onza' },
  { category: 'Finanzas', subject: 'Los bonos del Tesoro a 10 años caerán por debajo del 3%' },
  { category: 'Finanzas', subject: 'La inflación de la eurozona estará por debajo del 2%' },
  { category: 'Política', subject: 'El partido gobernante retendrá la mayoría en el parlamento alemán' },
  { category: 'Política', subject: 'México aprobará una reforma fiscal progresiva' },
  { category: 'Política', subject: 'El Reino Unido convocará elecciones anticipadas' },
  { category: 'Política', subject: 'Brasil aprobará una reforma climática ambiciosa' },
  { category: 'Política', subject: 'Taiwán firmará un nuevo acuerdo de defensa con EE.UU.' },
  { category: 'Deportes', subject: 'El Real Madrid ganará la Champions League' },
  { category: 'Deportes', subject: 'Francia ganará la Eurocopa' },
  { category: 'Deportes', subject: 'Un novato será MVP en la NBA' },
  { category: 'Deportes', subject: 'Max Verstappen ganará más de 18 carreras en la temporada' },
  { category: 'Deportes', subject: 'Brasil ganará el Mundial Femenino' },
  { category: 'Otros', subject: 'Una misión privada aterrizará en la Luna' },
  { category: 'Otros', subject: 'Los vehículos eléctricos superarán el 35% de ventas globales' },
  { category: 'Otros', subject: 'Se lanzará una IA open source con más de 2T de parámetros' },
  { category: 'Otros', subject: 'La temperatura media global superará el récord de 2023' },
  { category: 'Otros', subject: 'Se aprobará la primera terapia genética contra el Alzheimer' },
];

const timeframes = [
  'este trimestre',
  'antes de finalizar 2025',
  'en los próximos 90 días',
  'durante el primer semestre de 2026',
  'antes de 2030',
];

const trendCycle: Array<NonNullable<Market['trend']>> = ['alcista', 'lateral', 'bajista'];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pseudoRandomInt(seed: number, min: number, max: number) {
  return Math.round(min + pseudoRandom(seed) * (max - min));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createScenarioOutcomes(seed: number, basePrice: number): MarketOutcome[] {
  const labels = ['Escenario conservador', 'Escenario base', 'Escenario optimista'];
  const probabilities = [35, 40, 25];
  const adjustments = [-8, 0, 10];
  return labels.map((label, idx) => {
    const price = clamp(basePrice + adjustments[idx], 5, 95);
    const volume = pseudoRandomInt(seed * (idx + 11), 25_000, 450_000);
    return {
      id: `o${seed}${idx}`,
      label,
      probabilityPct: probabilities[idx],
      priceYesCents: price,
      priceNoCents: 100 - price,
      volumeUSD: volume,
    };
  });
}

const generatedMarkets: Market[] = Array.from({ length: 100 }, (_, idx) => {
  const topic = topicDeck[idx % topicDeck.length];
  const variation = Math.floor(idx / topicDeck.length);
  const timeframe = timeframes[(idx + variation) % timeframes.length];
  const trend = trendCycle[(idx + variation) % trendCycle.length];
  const idNumber = baseMarkets.length + idx + 1;
  const price = clamp(pseudoRandomInt(idx + 13, 10, 92), 5, 95);
  const volume = pseudoRandomInt(idx + 200, 60_000, 2_750_000);
  const resolutionDays = 40 + ((idx * 9) % 540);

  const market: Market = {
    id: `m${idNumber}`,
    title: `¿${topic.subject} ${timeframe}?`,
    category: topic.category,
    resolutionDate: new Date(Date.now() + resolutionDays * DAY_MS).toISOString(),
    totalVolumeUSD: volume,
    priceYesCents: price,
    status: 'open',
    trend,
  };

  if ((idx + topic.subject.length) % 4 === 0) {
    market.outcomes = createScenarioOutcomes(idNumber, price);
  }

  return market;
});

const mockMarkets: Market[] = [...baseMarkets, ...generatedMarkets];

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
