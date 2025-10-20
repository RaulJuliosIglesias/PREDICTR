import { useAuth } from '../../../hooks/useAuth';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';

export function WalletBalance() {
  const { balance, isAuthed } = useAuth();
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold">Saldo de Billetera</h3>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" aria-live="polite">
          {isAuthed ? `$${balance.toFixed(2)}` : 'Invitado'}
        </div>
        {!isAuthed && (
          <div className="mt-1 text-sm text-muted-foreground">Inicia sesión demo para obtener $5,000.</div>
        )}
      </CardContent>
    </Card>
  );
}
