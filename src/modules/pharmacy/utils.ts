import type { DispenseWithDetails, Medication } from '@/data/types'

export function formatMedicationLabel(medication: Medication, quantity: number): string {
  return `${medication.name} ${medication.strength} x${quantity}`
}

export function formatDispenseLabel(dispense: DispenseWithDetails): string {
  return formatMedicationLabel(dispense.medication, dispense.quantity)
}
