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
export {
  fulfillDispense,
  getDispenses,
  getMedications,
  type GetDispensesParams,
} from '@/lib/api/pharmacy'
export {
  getInvoice,
  payInvoice,
  type GetInvoiceParams,
  type InvoiceWithPatient,
} from '@/lib/api/billing'
export {
  addAdmissionNote,
  createAdmission,
  dischargeAdmission,
  ensureDemoAdmission,
  getAdmissionById,
  getAdmissionNotes,
  getBeds,
  getLibreBeds,
  type AddAdmissionNoteInput,
  type AdmissionWithDetails,
  type BedWithDetails,
  type CreateAdmissionInput,
  DEMO_MEDICAL_NOTE_TEXT,
} from '@/lib/api/admissions'
