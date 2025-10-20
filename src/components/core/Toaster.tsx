import { useToastStore } from '../../store/useToastStore';
import { Button } from '../ui/Button';

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            'flex items-start justify-between gap-2 rounded-md border bg-card p-3 shadow-card ' +
            (t.type === 'success' ? 'border-green-500' : t.type === 'error' ? 'border-danger' : 'border-muted')
          }
          role="status"
          aria-live="polite"
        >
          <div className="text-sm">
            {t.message}
          </div>
          <Button variant="ghost" size="sm" aria-label="Cerrar" onClick={() => remove(t.id)}>
            ✕
          </Button>
        </div>
      ))}
    </div>
  );
}
