import { WalletBalance, PositionsTable } from '../features/portfolio';

export default function PortfolioPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Portafolio</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <WalletBalance />
        </div>
        <div className="lg:col-span-2">
          <PositionsTable />
        </div>
      </div>
    </div>
  );
}
