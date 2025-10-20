import * as React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../store/useToastStore';

export default function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const loginDemo = useAuthStore((s) => s.loginDemo);
  const setName = useAuthStore((s) => s.setName);
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();
  const toast = useToastStore((s) => s.push);

  const [name, setNameLocal] = React.useState(user?.name ?? 'Demo User');
  const [prefs, setPrefs] = React.useState({
    notifyResolution: true,
    priceAlerts: false,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Cuenta</h1>

      {!user ? (
        <section className="rounded-lg border bg-card p-4">
          <h2 className="mb-2 text-sm font-semibold">Acceso Demo</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Accede como usuario demo y recibe <strong>$5,000</strong> para practicar.
          </p>
          <Button
            onClick={() => {
              loginDemo();
              toast({ type: 'success', message: '¡Bienvenido a Predictr! Saldo demo: $5,000.' });
              navigate('/');
            }}
          >
            Acceder como Demo User
          </Button>
        </section>
      ) : (
        <>
          <section className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 text-sm font-semibold">Perfil</h2>
            <div className="grid max-w-md gap-3">
              <div>
                <label htmlFor="name" className="mb-1 block text-xs text-muted-foreground">Nombre de usuario</label>
                <div className="flex items-center gap-2">
                  <Input id="name" value={name} onChange={(e) => setNameLocal(e.target.value)} />
                  <Button
                    onClick={() => {
                      setName(name.trim() || 'Demo User');
                      toast({ type: 'success', message: 'Nombre actualizado' });
                    }}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 text-sm font-semibold">Apariencia</h2>
            <div className="flex items-center gap-3 text-sm">
              <span>Modo: {theme === 'light' ? 'Claro' : 'Oscuro'}</span>
              <Button variant="secondary" onClick={toggle}>Alternar</Button>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 text-sm font-semibold">Preferencias (simuladas)</h2>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.notifyResolution}
                  onChange={(e) => setPrefs((p) => ({ ...p, notifyResolution: e.target.checked }))}
                />
                Notificarme cuando un mercado se resuelva
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={prefs.priceAlerts}
                  onChange={(e) => setPrefs((p) => ({ ...p, priceAlerts: e.target.checked }))}
                />
                Alertas de precios
              </label>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
