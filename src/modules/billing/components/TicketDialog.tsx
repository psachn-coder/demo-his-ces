import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { InvoiceWithPatient } from '@/lib/api/billing'
import { formatCurrency, formatPatientName } from '@/lib/formatters'
import { formatDateTime, guayaquilIsoNow } from '@/lib/dates'
import type { PaymentMethod } from '@/modules/billing/types'
import { PAYMENT_METHOD_LABELS } from '@/modules/billing/types'

interface TicketDialogProps {
  invoice: InvoiceWithPatient | null
  paymentMethod: PaymentMethod
  open: boolean
  paying: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function TicketDialog({
  invoice,
  paymentMethod,
  open,
  paying,
  onOpenChange,
  onConfirm,
}: TicketDialogProps) {
  if (!invoice) return null

  const patientName = formatPatientName(invoice.patient.firstName, invoice.patient.lastName)
  const ticketDateTime = formatDateTime(guayaquilIsoNow())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>C.E.S. · Quito Sur</DialogTitle>
          <DialogDescription>
            {ticketDateTime} · {PAYMENT_METHOD_LABELS[paymentMethod]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-border bg-ces-bg px-4 py-3 text-sm">
            <p className="font-medium text-ces-text">{patientName}</p>
            <p className="text-ces-muted">Factura {invoice.id}</p>
          </div>

          <div className="max-h-48 overflow-y-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <tbody>
                {invoice.lines.map((line) => (
                  <tr key={line.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-ces-text">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{line.description}</span>
                        {line.prescriptionId ? (
                          <span className="rounded-md border border-border px-1.5 py-0.5 text-xs">
                            {line.prescriptionId}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right text-ces-text">
                      {formatCurrency(line.quantity * line.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ces-text">Total</span>
            <span className="text-lg font-semibold text-ces-text">{formatCurrency(invoice.total)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={paying}>
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm} disabled={paying}>
            {paying ? 'Cobrando…' : 'Confirmar cobro'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
