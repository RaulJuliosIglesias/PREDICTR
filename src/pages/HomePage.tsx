import { MarketList } from '../features/markets';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Mercados</h1>
      <MarketList />
    </div>
  );
}
