import * as React from 'react';
import { Button } from './Button';

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'center' | 'sheet';
};

export function Modal({ open, title, onClose, children, footer, variant = 'center' }: Props) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div aria-modal className={"fixed inset-0 z-50 " + (variant === 'sheet' ? 'flex items-end' : 'flex items-center justify-center')} role="dialog">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={
        "relative z-10 w-full " +
        (variant === 'sheet' ? 'rounded-t-[4px] border-t border-x border-stroke bg-card p-4' : 'max-w-md rounded-[4px] border border-stroke bg-card p-4')
      }>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <Button variant="ghost" onClick={onClose} aria-label="Cerrar">
            ✕
          </Button>
        </div>
        <div className="mb-4">{children}</div>
        {footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
