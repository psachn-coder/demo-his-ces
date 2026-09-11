export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia'

export type { Invoice, InvoiceLine, InvoiceStatus } from '@/data/types'
export type { InvoiceWithPatient } from '@/lib/api/billing'

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
}
