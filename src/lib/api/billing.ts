import invoicesSeed from '@/data/invoices.json'
import type { Invoice, InvoiceStatus, Patient } from '@/data/types'
import { getPatientById } from '@/lib/api/patients'
import { fail, ok, type ApiResult } from '@/lib/api/types'

export interface InvoiceWithPatient extends Invoice {
  patient: Patient
}

export interface GetInvoiceParams {
  encounterId: string
}

const invoices: Invoice[] = invoicesSeed.map((item) => ({
  ...item,
  status: item.status as InvoiceStatus,
}))

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findInvoiceByEncounter(encounterId: string): Invoice | undefined {
  return invoices.find((invoice) => invoice.encounterId === encounterId)
}

function findInvoiceById(id: string): Invoice | undefined {
  return invoices.find((invoice) => invoice.id === id)
}

async function enrichInvoice(invoice: Invoice): Promise<ApiResult<InvoiceWithPatient>> {
  const patientResult = await getPatientById(invoice.patientId)
  if (!patientResult.ok) {
    return fail(patientResult.error)
  }

  return ok({
    ...invoice,
    patient: patientResult.data,
  })
}

export async function getInvoice(params: GetInvoiceParams): Promise<ApiResult<InvoiceWithPatient>> {
  await delay()
  const invoice = findInvoiceByEncounter(params.encounterId)
  if (!invoice) {
    return fail({
      code: 'NOT_FOUND',
      message: `Factura para encuentro ${params.encounterId} no encontrada`,
    })
  }

  return enrichInvoice(invoice)
}

export async function payInvoice(id: string): Promise<ApiResult<InvoiceWithPatient>> {
  await delay(80)
  const invoice = findInvoiceById(id)
  if (!invoice) {
    return fail({
      code: 'NOT_FOUND',
      message: `Factura ${id} no encontrada`,
    })
  }

  if (invoice.status === 'Pagada') {
    return fail({
      code: 'ALREADY_PAID',
      message: 'Esta factura ya fue pagada.',
    })
  }

  invoice.status = 'Pagada'

  return enrichInvoice(invoice)
}
