import appointmentsSeed from '@/data/appointments.json'
import type { Appointment, AppointmentStatus } from '@/data/types'
import { generateId } from '@/lib/ids'
import { fail, ok, type ApiResult } from '@/lib/api/types'

export interface GetAppointmentsParams {
  date: string
}

const appointments: Appointment[] = appointmentsSeed.map((appointment) => ({
  ...appointment,
  status: appointment.status as AppointmentStatus,
}))

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function datePart(iso: string): string {
  return iso.slice(0, 10)
}

function withDate(iso: string, date: string): string {
  const time = iso.includes('T') ? iso.slice(11) : '09:30:00'
  return `${date}T${time}`
}

function normalizeForDate(appointment: Appointment, date: string): Appointment {
  if (appointment.id === 'apt-001') {
    return { ...appointment, scheduledAt: withDate(appointment.scheduledAt, date) }
  }
  return appointment
}

function matchesDate(appointment: Appointment, date: string): boolean {
  const normalized = normalizeForDate(appointment, date)
  return datePart(normalized.scheduledAt) === date
}

export async function getAppointments(
  params: GetAppointmentsParams,
): Promise<ApiResult<Appointment[]>> {
  await delay()
  const results = appointments
    .map((appointment) => normalizeForDate(appointment, params.date))
    .filter((appointment) => matchesDate(appointment, params.date))
  return ok(results)
}

export async function addAppointment(
  appointment: Omit<Appointment, 'id'> & { id?: string },
): Promise<ApiResult<Appointment>> {
  await delay(80)
  const newAppointment: Appointment = {
    ...appointment,
    id: appointment.id ?? generateId('apt'),
  }
  appointments.push(newAppointment)
  return ok(newAppointment)
}

let simulateError = false

export function setAppointmentsSimulateError(value: boolean): void {
  simulateError = value
}

export async function getAppointmentsWithErrorCheck(
  params: GetAppointmentsParams,
): Promise<ApiResult<Appointment[]>> {
  if (simulateError) {
    await delay()
    return fail({ code: 'DEMO_ERROR', message: 'No se pudo cargar la agenda. Intente de nuevo.' })
  }
  return getAppointments(params)
}
