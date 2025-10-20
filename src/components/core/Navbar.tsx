import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, balance, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm ${isActive ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-primary">
            Predictr
          </Link>
          <div className="hidden items-center gap-4 sm:flex">
            <NavLink to="/" className={linkClass} end>
              Mercados
            </NavLink>
            <NavLink to="/portfolio" className={linkClass}>
              Portafolio
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Cuenta
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div aria-live="polite" className="text-sm text-muted-foreground">
            {user ? `Saldo: $${balance.toFixed(2)}` : 'Invitado'}
          </div>
          <Button variant="ghost" aria-label="Alternar tema" onClick={toggle}>
            {theme === 'light' ? '🌞' : '🌙'}
          </Button>
          {user ? (
            <Button onClick={() => { logout(); navigate('/'); }}>Salir</Button>
          ) : (
            <Button onClick={() => navigate('/login')}>Acceder</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
