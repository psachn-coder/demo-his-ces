const LOCALE = 'es-EC'
const CURRENCY = 'USD'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPatientName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

export function formatDocumentId(documentId: string): string {
  return documentId.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
}
