import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useInvoice } from '@/hooks/useInvoice'
import { toast } from '@/hooks/use-toast'
import { DEMO_ENCOUNTER_ID } from '@/lib/ids'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import { InvoiceLinesTable } from '@/modules/billing/components/InvoiceLinesTable'
import { InvoiceStatusBadge } from '@/modules/billing/components/InvoiceStatusBadge'
import { InvoiceTotals } from '@/modules/billing/components/InvoiceTotals'
import { PaymentPanel } from '@/modules/billing/components/PaymentPanel'
import { TicketDialog } from '@/modules/billing/components/TicketDialog'
import type { PaymentMethod } from '@/modules/billing/types'

export function CobroPage() {
  const { encounterId } = useParams()
  const resolvedId = encounterId ?? DEMO_ENCOUNTER_ID
  const { invoice, loading, error, paying, retry, pay } = useInvoice(resolvedId)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo')
  const [ticketOpen, setTicketOpen] = useState(false)

  if (!encounterId) {
    return <Navigate to={`/app/caja/cobro/${DEMO_ENCOUNTER_ID}`} replace />
  }

  const handleConfirmPay = async () => {
    try {
      await pay()
      setTicketOpen(false)
      toast({
        title: 'Demo · no persistido',
        description: 'El cobro se registró en memoria para esta sesión.',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'No se pudo cobrar',
        description: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }

  if (loading) {
    return (
      <>
        <div className="mb-6 space-y-3 border-b border-border pb-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <InvoiceLinesTable lines={undefined} loading />
          <div className="space-y-4">
            <InvoiceTotals total={undefined} loading />
            <PaymentPanel
              method={paymentMethod}
              onMethodChange={setPaymentMethod}
              onCobrar={() => setTicketOpen(true)}
              disabled
              loading
              paying={false}
            />
          </div>
        </div>
      </>
    )
  }

  if (error || !invoice) {
    return (
      <>
        <PageHeader
          title="Cobro ambulatorio"
          description="No se pudo cargar la factura del encuentro."
        />
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-ces-surface px-6 py-8">
          <p className="text-sm text-ces-muted">{error ?? 'Factura no encontrada.'}</p>
          <Button type="button" variant="outline" size="sm" onClick={retry}>
            Reintentar
          </Button>
        </div>
      </>
    )
  }

  const patientName = formatPatientName(invoice.patient.firstName, invoice.patient.lastName)
  const patientAge = formatAge(resolveAge(invoice.patient))
  const isPaid = invoice.status === 'Pagada'

  return (
    <>
      <PageHeader
        title="Cobro ambulatorio"
        description={`${patientName} · ${patientAge}`}
        actions={<InvoiceStatusBadge status={invoice.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <InvoiceLinesTable lines={invoice.lines} loading={false} />
        <div className="space-y-4">
          <InvoiceTotals total={invoice.total} loading={false} />
          <PaymentPanel
            method={paymentMethod}
            onMethodChange={setPaymentMethod}
            onCobrar={() => setTicketOpen(true)}
            disabled={isPaid}
            loading={false}
            paying={paying}
          />
        </div>
      </div>

      <TicketDialog
        invoice={invoice}
        paymentMethod={paymentMethod}
        open={ticketOpen}
        paying={paying}
        onOpenChange={setTicketOpen}
        onConfirm={handleConfirmPay}
      />
    </>
  )
}
