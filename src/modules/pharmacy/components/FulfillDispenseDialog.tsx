import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { DispenseWithDetails } from '@/data/types'
import { formatPatientName } from '@/lib/formatters'
import { formatDispenseLabel } from '@/modules/pharmacy/utils'

interface FulfillDispenseDialogProps {
  dispense: DispenseWithDetails | null
  open: boolean
  loading: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function FulfillDispenseDialog({
  dispense,
  open,
  loading,
  onOpenChange,
  onConfirm,
}: FulfillDispenseDialogProps) {
  if (!dispense) return null

  const patientName = formatPatientName(dispense.patient.firstName, dispense.patient.lastName)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar entrega</DialogTitle>
          <DialogDescription>
            ¿Confirma la entrega de esta receta al paciente?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-md border border-border bg-ces-bg px-4 py-3 text-sm">
          <p className="font-medium text-ces-text">{formatDispenseLabel(dispense)}</p>
          <p className="text-ces-muted">Paciente: {patientName}</p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Entregando…' : 'Confirmar entrega'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
