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

export interface Bed {
  id: string
  ward: string
  number: string
  status: 'Libre' | 'Ocupada' | 'Limpieza'
  patientId?: string
}

export interface Medication {
  id: string
  name: string
  form: string
  strength: string
}

export type DispenseStatus = 'pending' | 'delivered'

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

export interface InvoiceLine {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  admissionId: string
  patientId: string
  issuedAt: string
  status: 'Borrador' | 'Emitida' | 'Pagada'
  lines: InvoiceLine[]
  total: number
}
