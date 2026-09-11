export type { ApiError, ApiResult } from '@/lib/api/types'
export { getPatients, getPatientById } from '@/lib/api/patients'
export {
  addAppointment,
  getAppointments,
  getAppointmentsWithErrorCheck,
  setAppointmentsSimulateError,
  type GetAppointmentsParams,
} from '@/lib/api/appointments'
export {
  addEncounterNote,
  createEncounterOrder,
  getEncounter,
  type AddEncounterNoteInput,
  type CreateEncounterOrderInput,
} from '@/lib/api/encounters'
