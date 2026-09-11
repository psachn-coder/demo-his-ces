import type { Patient } from '@/data/types'

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

export function resolveAge(patient: Patient): number {
  if (patient.age !== undefined) {
    return patient.age
  }
  const birth = new Date(patient.birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}
