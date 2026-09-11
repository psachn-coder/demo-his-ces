export type { Bed, BedStatus, BedVitals } from '@/data/types'
export type { BedWithDetails } from '@/lib/api/admissions'

export interface AdmissionSummary {
  id: string
  patientId: string
  ward: string
}
