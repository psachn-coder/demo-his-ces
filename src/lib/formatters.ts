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
  const digits = documentId.replace(/\D/g, '')
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  if (digits.length === 9) {
    return digits.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
  }
  return documentId
}

export function maskDocumentId(documentId: string): string {
  const digits = documentId.replace(/\D/g, '')
  if (digits.length >= 4) {
    const visible = formatDocumentId(digits.slice(0, 4))
    return `${visible}-****`
  }
  return documentId
}

export function formatAge(age: number): string {
  return `${age} años`
}
