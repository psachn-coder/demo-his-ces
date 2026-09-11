export type { AdmissionRecord as Admission, BedStatus } from '@/data/types'

export const DEMO_INGRESO_PATIENT_ID = 'pat-002'
export const DEMO_INGRESO_BED_ID = '204-B'
export const DEMO_INGRESO_REASON = 'Neumonía comunitaria'
export const DEMO_INGRESO_SERVICE = 'Medicina'

export const INGRESO_SERVICES = ['Medicina', 'Cirugía', 'Pediatría', 'Ginecología'] as const
