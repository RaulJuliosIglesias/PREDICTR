export type MarketCategory = 'Deportes' | 'Política' | 'Finanzas' | 'Cripto' | 'Otros';

export type MarketStatus = 'open' | 'resolved_yes' | 'resolved_no';

export interface MarketOutcome {
  id: string;
  label: string;
  probabilityPct: number;
  priceYesCents: number;
  priceNoCents: number;
  volumeUSD: number;
}

export interface Market {
  id: string;
  title: string;
  category: MarketCategory;
  resolutionDate: string; // ISO string
  totalVolumeUSD: number;
  priceYesCents: number; // 1-99
  status: MarketStatus;
  outcomes?: MarketOutcome[];
}

export interface PricePoint {
  t: number; // ms epoch
  yes: number; // cents
}
