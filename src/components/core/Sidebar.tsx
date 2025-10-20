import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  props?: Partial<React.ComponentProps<typeof NavLink>>;
};

const primaryNav: NavItem[] = [
  { to: '/', label: 'Mercados', icon: '🏦', props: { end: true } },
  { to: '/portfolio', label: 'Portafolio', icon: '📊' },
];

const insightsNav: NavItem[] = [
  { to: '/activity', label: 'Actividad', icon: '📈' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/dashboards', label: 'Dashboards', icon: '📊' },
  { to: '/rewards', label: 'Recompensas', icon: '🎁' },
];

const accountNav: NavItem[] = [
  { to: '/settings', label: 'Configuración', icon: '⚙️' },
  { to: '/login', label: 'Perfil', icon: '👤' },
];

function NavButton({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        'flex items-center gap-3 rounded-[4px] px-3 py-2 text-sm transition-colors hover:bg-muted ' +
        (isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground')
      }
      {...item.props}
    >
      <span className="w-6 text-center" aria-hidden>
        {item.icon}
      </span>
      <span className="hidden whitespace-nowrap md:inline opacity-0 transition-opacity group-hover:opacity-100">
        {item.label}
      </span>
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside
      className="group fixed left-0 top-0 z-40 hidden h-screen w-[72px] flex-col border-r border-stroke bg-card transition-[width] duration-200 hover:w-[220px] md:flex"
      aria-label="Barra lateral"
    >
      <div className="flex h-12 items-center px-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-6 text-center text-primary font-semibold" aria-hidden>
            ●
          </span>
          <span className="hidden text-sm font-semibold md:inline opacity-0 transition-opacity group-hover:opacity-100">
            Predictr
          </span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-4 px-2 py-3">
        <div className="space-y-1">
          {primaryNav.map((item) => (
            <NavButton key={item.to} item={item} />
          ))}
        </div>
        <div className="space-y-1 border-t border-stroke pt-4">
          {insightsNav.map((item) => (
            <NavButton key={item.to} item={item} />
          ))}
        </div>
        <div className="flex-1" />
        <div className="space-y-1 border-t border-stroke pt-4">
          {accountNav.map((item) => (
            <NavButton key={item.to} item={item} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
