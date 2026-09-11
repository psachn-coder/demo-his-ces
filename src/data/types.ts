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
}

export interface Bed {
  id: string
  ward: string
  number: string
  status: 'Libre' | 'Ocupada' | 'Mantenimiento'
  patientId?: string
}

export interface Medication {
  id: string
  name: string
  form: string
  strength: string
}

export interface Dispense {
  id: string
  medicationId: string
  patientId: string
  quantity: number
  dispensedAt: string
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
  status: 'Pendiente' | 'Pagada' | 'Anulada'
  lines: InvoiceLine[]
  total: number
}
