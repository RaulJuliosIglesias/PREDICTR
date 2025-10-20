import * as React from 'react';
import type { PricePoint } from '../types';

const clamp = (n: number, min = 1, max = 99) => Math.max(min, Math.min(max, n));

export function useRealtimePrice(initialCents: number, intervalMs = 5000) {
  const [price, setPrice] = React.useState(initialCents);
  const [dir, setDir] = React.useState<'up' | 'down' | 'none'>('none');

  React.useEffect(() => {
    let p = initialCents;
    const id = setInterval(() => {
      const delta = [-3, -2, -1, 1, 2, 3][Math.floor(Math.random() * 6)];
      const np = clamp(p + delta);
      setDir(np >= p ? (np === p ? 'none' : 'up') : 'down');
      p = np;
      setPrice(np);
    }, intervalMs);
    return () => clearInterval(id);
  }, [initialCents, intervalMs]);

  return { price, dir };
}

export function useRealtimeSeries(initialCents: number, intervalMs = 5000, maxPoints = 120) {
  const { price } = useRealtimePrice(initialCents, intervalMs);
  const [series, setSeries] = React.useState<PricePoint[]>(() => [{ t: Date.now(), yes: initialCents }]);

  React.useEffect(() => {
    setSeries((s) => {
      const next = [...s, { t: Date.now(), yes: price }];
      if (next.length > maxPoints) next.shift();
      return next;
    });
  }, [price, maxPoints]);

  return series;
}
