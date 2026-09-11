import type { Appointment, Patient } from '@/data/types'
import { formatPatientName } from '@/lib/formatters'

export interface AppointmentRow extends Appointment {
  patient?: Patient
}

export function todayIsoDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function enrichAppointments(
  appointments: Appointment[],
  patients: Patient[],
): AppointmentRow[] {
  const patientMap = new Map(patients.map((patient) => [patient.id, patient]))
  return appointments.map((appointment) => ({
    ...appointment,
    patient: patientMap.get(appointment.patientId),
  }))
}

export function filterAppointments(
  rows: AppointmentRow[],
  filters: {
    specialty: string
    physician: string
    patientSearch: string
  },
): AppointmentRow[] {
  const search = filters.patientSearch.trim().toLowerCase()

  return rows.filter((row) => {
    if (filters.specialty && filters.specialty !== 'all' && row.specialty !== filters.specialty) {
      return false
    }
    if (filters.physician && filters.physician !== 'all' && row.physicianName !== filters.physician) {
      return false
    }
    if (!search) return true

    const patient = row.patient
    if (!patient) return false

    const fullName = formatPatientName(patient.firstName, patient.lastName).toLowerCase()
    return fullName.includes(search) || patient.documentId.includes(search)
  })
}
