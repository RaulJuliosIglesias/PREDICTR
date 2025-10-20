import { NavLink } from 'react-router-dom';

export function MobileTabBar() {
  const item = (to: string, label: string, icon: string, props?: Partial<React.ComponentProps<typeof NavLink>>) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'flex flex-1 flex-col items-center justify-center text-xs ' +
        (isActive ? 'text-primary' : 'text-muted-foreground')
      }
      {...props}
    >
      <div aria-hidden className="text-base">{icon}</div>
      <div>{label}</div>
    </NavLink>
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 border-t border-stroke bg-card md:hidden">
      {item('/', 'Mercados', '🏦', { end: true })}
      {item('/portfolio', 'Portafolio', '📊')}
      {item('/search', 'Buscar', '🔎')}
      {item('/login', 'Perfil', '👤')}
    </nav>
  );
}
