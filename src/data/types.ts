export type StaffRole = 'Recepción' | 'Médico' | 'Enfermería' | 'Farmacia' | 'Caja'

export type AppointmentStatus =
  | 'Programada'
  | 'Confirmada'
  | 'En espera'
  | 'En consulta'
  | 'Atendida'
  | 'No show'

export interface Patient {
  id: string
  firstName: string
  lastName: string
  documentId: string
  birthDate: string
  age?: number
  sector?: string
  allergy?: string
  phone?: string
  email?: string
}

export interface Appointment {
  id: string
  patientId: string
  scheduledAt: string
  status: AppointmentStatus
  specialty: string
  physicianName: string
}

export interface Encounter {
  id: string
  patientId: string
  appointmentId?: string
  startedAt: string
  status: 'Abierto' | 'Cerrado'
  motivo: string
}

export interface SoapNote {
  subjective: string
  objective: string
  assessment: string
  plan: string
  recordedAt: string
}

export interface VitalSigns {
  recordedAt: string
  bloodPressure: string
  heartRate: number
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
  weightKg?: number
  heightCm?: number
}

export type EncounterOrderType = 'Medicamento' | 'Laboratorio'
export type EncounterOrderStatus = 'Pendiente' | 'Dispensada' | 'Completada'

export interface EncounterOrder {
  id: string
  encounterId: string
  type: EncounterOrderType
  description: string
  status: EncounterOrderStatus
  createdAt: string
  medicationName?: string
  medicationDose?: string
  quantity?: number
}

export interface EncounterDetail extends Encounter {
  vitals: VitalSigns[]
  notes: SoapNote[]
  orders: EncounterOrder[]
  diagnosisCode?: string
}

export interface EncounterWithPatient extends EncounterDetail {
  patient: Patient
}

export type BedStatus = 'Libre' | 'Ocupada' | 'Limpieza'

export interface BedVitals {
  bloodPressure: string
  heartRate: number
  oxygenSaturation: number
}

export interface Bed {
  id: string
  ward: string
  number: string
  status: BedStatus
  patientId?: string
  admissionId?: string
  vitals?: BedVitals
}

export interface AdmissionRecord {
  id: string
  patientId: string
  bedId: string
  reason: string
  service: string
  admittedAt: string
  status: 'Activo' | 'Alta' | 'Cancelado'
}

export interface Medication {
  id: string
  name: string
  form: string
  strength: string
}

export type DispenseStatus = 'Pendiente' | 'Entregado'

export interface Dispense {
  id: string
  medicationId: string
  patientId: string
  encounterId: string
  quantity: number
  status: DispenseStatus
  createdAt: string
  dispensedAt?: string
}

export interface DispenseWithDetails extends Dispense {
  medication: Medication
  patient: Patient
}

export type InvoiceStatus = 'Borrador' | 'Emitida' | 'Pagada'

export interface InvoiceLine {
  id: string
  description: string
  quantity: number
  unitPrice: number
  prescriptionId?: string
}

export interface Invoice {
  id: string
  encounterId?: string
  admissionId?: string
  patientId: string
  issuedAt: string
  status: InvoiceStatus
  lines: InvoiceLine[]
  total: number
}
