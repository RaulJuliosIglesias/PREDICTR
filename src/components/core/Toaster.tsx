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
            'flex items-start justify-between gap-2 rounded-[4px] border bg-card p-3 ' +
            (t.type === 'success' ? 'border-success' : t.type === 'error' ? 'border-danger' : 'border-stroke')
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
