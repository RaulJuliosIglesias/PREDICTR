import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';

function titleFromPath(pathname: string) {
  if (pathname.startsWith('/portfolio')) return 'Portafolio';
  if (pathname.startsWith('/markets/')) return 'Mercado';
  if (pathname.startsWith('/login')) return 'Cuenta';
  return 'Mercados';
}

export function StatusBar() {
  const { pathname } = useLocation();
  const title = titleFromPath(pathname);
  const { user, balance, credit } = useAuthStore();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-stroke bg-card">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 md:pl-[88px]">
        <div className="text-sm font-semibold">{title}</div>
        <div className="flex items-center gap-3 text-sm">
          <div aria-live="polite" className="text-muted-foreground">
            {user ? `Saldo: $${balance.toFixed(2)}` : 'Invitado'}
          </div>
          <Button size="sm" onClick={() => credit(500)}>
            Depositar
          </Button>
        </div>
      </div>
    </header>
  );
}
