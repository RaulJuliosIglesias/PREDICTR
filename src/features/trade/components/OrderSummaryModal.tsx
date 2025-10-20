import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

export function OrderSummaryModal({
  open,
  onClose,
  onConfirm,
  data,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: { side: 'YES' | 'NO'; shares: number; costUSD: number; maxProfitUSD: number };
}) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmar Orden" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm}>Confirmar</Button>
      </>
    }>
      <div className="space-y-2 text-sm">
        <div><span className="text-muted-foreground">Lado:</span> {data.side}</div>
        <div><span className="text-muted-foreground">Acciones:</span> {data.shares.toFixed(3)}</div>
        <div><span className="text-muted-foreground">Costo Estimado:</span> ${data.costUSD.toFixed(2)}</div>
        <div><span className="text-muted-foreground">Ganancia Máxima:</span> ${data.maxProfitUSD.toFixed(2)}</div>
      </div>
    </Modal>
  );
}
