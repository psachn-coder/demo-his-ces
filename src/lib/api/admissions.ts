import bedsSeed from '@/data/beds.json'
import type {
  AdmissionNote,
  AdmissionNoteAuthorRole,
  AdmissionRecord,
  Bed,
  BedStatus,
  BedVitals,
  Patient,
} from '@/data/types'
import { getPatientById } from '@/lib/api/patients'
import { fail, ok, type ApiResult } from '@/lib/api/types'
import { guayaquilIsoNow } from '@/lib/dates'
import { DEMO_ADMISSION_ID, generateId } from '@/lib/ids'
import {
  DEMO_INGRESO_BED_ID,
  DEMO_INGRESO_PATIENT_ID,
  DEMO_INGRESO_REASON,
  DEMO_INGRESO_SERVICE,
} from '@/modules/admission/types'

export interface BedWithDetails extends Bed {
  patient?: Patient
}

export interface CreateAdmissionInput {
  patientId: string
  bedId: string
  reason: string
  service: string
}

export interface AdmissionWithDetails extends AdmissionRecord {
  patient: Patient
  bed: Bed
}

export interface AddAdmissionNoteInput {
  authorRole: AdmissionNoteAuthorRole
  text: string
  vitals?: BedVitals
}

const beds: Bed[] = bedsSeed.map((item) => ({
  ...item,
  status: item.status as BedStatus,
}))

const admissions: AdmissionRecord[] = []
const admissionNotes: AdmissionNote[] = []

const DEMO_BED_ID = DEMO_INGRESO_BED_ID
const DEMO_PATIENT_ID = DEMO_INGRESO_PATIENT_ID

/** ENTREGA: TA 128/78, FC 88, SpO2 94% */
const DEMO_VITALS: BedVitals = {
  bloodPressure: '128/78',
  heartRate: 88,
  oxygenSaturation: 94,
}

/** ENTREGA P-FE-S0-008 — nota seed médica (texto oficial). */
export const DEMO_MEDICAL_NOTE_TEXT =
  'Paciente estable, continúa antibiótico IV; plan alta probable 48h'

function seedDemoMedicalNote(admissionId: string): void {
  if (
    admissionNotes.some(
      (note) => note.admissionId === admissionId && note.authorRole === 'Medico',
    )
  ) {
    return
  }
  admissionNotes.push({
    id: 'note-seed-med-001',
    admissionId,
    authorRole: 'Medico',
    text: DEMO_MEDICAL_NOTE_TEXT,
    recordedAt: guayaquilIsoNow(),
  })
}

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findBed(id: string): Bed | undefined {
  return beds.find((bed) => bed.id === id)
}

async function enrichBed(bed: Bed): Promise<ApiResult<BedWithDetails>> {
  if (!bed.patientId) {
    return ok({ ...bed })
  }

  const patientResult = await getPatientById(bed.patientId)
  if (!patientResult.ok) {
    return fail(patientResult.error)
  }

  return ok({
    ...bed,
    patient: patientResult.data,
  })
}

export async function getBeds(): Promise<ApiResult<BedWithDetails[]>> {
  await delay()
  const enriched: BedWithDetails[] = []
  for (const bed of beds) {
    const result = await enrichBed(bed)
    if (!result.ok) {
      return fail(result.error)
    }
    enriched.push(result.data)
  }
  return ok(enriched)
}

export async function getLibreBeds(): Promise<ApiResult<Bed[]>> {
  await delay()
  return ok(beds.filter((bed) => bed.status === 'Libre').map((bed) => ({ ...bed })))
}

export async function createAdmission(
  input: CreateAdmissionInput,
): Promise<ApiResult<AdmissionWithDetails>> {
  await delay(120)

  const reason = input.reason.trim()
  const service = input.service.trim()
  if (!input.patientId || !input.bedId || !reason || !service) {
    return fail({
      code: 'VALIDATION',
      message: 'Paciente, cama, motivo y servicio son obligatorios.',
    })
  }

  const bed = findBed(input.bedId)
  if (!bed) {
    return fail({
      code: 'NOT_FOUND',
      message: `Cama ${input.bedId} no encontrada`,
    })
  }

  if (bed.status !== 'Libre') {
    return fail({
      code: 'BED_UNAVAILABLE',
      message: `La cama ${bed.id} no está Libre.`,
    })
  }

  const patientResult = await getPatientById(input.patientId)
  if (!patientResult.ok) {
    return fail(patientResult.error)
  }

  const existingActive = admissions.find(
    (admission) =>
      admission.patientId === input.patientId && admission.status === 'Activo',
  )
  if (existingActive) {
    return fail({
      code: 'ALREADY_ADMITTED',
      message: `El paciente ya tiene ingreso activo (${existingActive.id}).`,
    })
  }

  const admissionId =
    input.patientId === DEMO_PATIENT_ID && input.bedId === DEMO_BED_ID
      ? DEMO_ADMISSION_ID
      : `adm-${Math.random().toString(36).slice(2, 5)}`

  if (admissions.some((admission) => admission.id === admissionId)) {
    return fail({
      code: 'CONFLICT',
      message: `Ya existe el ingreso ${admissionId}.`,
    })
  }

  const admission: AdmissionRecord = {
    id: admissionId,
    patientId: input.patientId,
    bedId: input.bedId,
    reason,
    service,
    admittedAt: guayaquilIsoNow(),
    status: 'Activo',
  }

  admissions.push(admission)

  bed.status = 'Ocupada'
  bed.patientId = input.patientId
  bed.admissionId = admission.id
  if (bed.id === DEMO_BED_ID && input.patientId === DEMO_PATIENT_ID) {
    bed.vitals = { ...DEMO_VITALS }
    seedDemoMedicalNote(admission.id)
  }

  return ok({
    ...admission,
    patient: patientResult.data,
    bed: { ...bed },
  })
}

export async function getAdmissionById(
  id: string,
): Promise<ApiResult<AdmissionWithDetails>> {
  await delay()
  const admission = admissions.find((item) => item.id === id)
  if (!admission) {
    return fail({
      code: 'NOT_FOUND',
      message: `Ingreso ${id} no encontrado`,
    })
  }

  const patientResult = await getPatientById(admission.patientId)
  if (!patientResult.ok) {
    return fail(patientResult.error)
  }

  const bed = findBed(admission.bedId)
  if (!bed) {
    return fail({
      code: 'NOT_FOUND',
      message: `Cama ${admission.bedId} no encontrada`,
    })
  }

  return ok({
    ...admission,
    patient: patientResult.data,
    bed: { ...bed },
  })
}

/**
 * Garantiza adm-001 + 204-B ocupada + vitals + nota seed para rutas 008
 * si el guion no pasó antes por ingreso en esta sesión.
 */
export async function ensureDemoAdmission(): Promise<ApiResult<AdmissionWithDetails>> {
  const existing = admissions.find((item) => item.id === DEMO_ADMISSION_ID)
  if (existing) {
    seedDemoMedicalNote(existing.id)
    return getAdmissionById(existing.id)
  }

  return createAdmission({
    patientId: DEMO_PATIENT_ID,
    bedId: DEMO_BED_ID,
    reason: DEMO_INGRESO_REASON,
    service: DEMO_INGRESO_SERVICE,
  })
}

export async function getAdmissionNotes(
  admissionId: string,
): Promise<ApiResult<AdmissionNote[]>> {
  await delay()
  const admission = admissions.find((item) => item.id === admissionId)
  if (!admission) {
    return fail({
      code: 'NOT_FOUND',
      message: `Ingreso ${admissionId} no encontrado`,
    })
  }

  const notes = admissionNotes
    .filter((note) => note.admissionId === admissionId)
    .map((note) => ({ ...note, vitals: note.vitals ? { ...note.vitals } : undefined }))
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))

  return ok(notes)
}

export async function addAdmissionNote(
  admissionId: string,
  input: AddAdmissionNoteInput,
): Promise<ApiResult<AdmissionNote>> {
  await delay(100)

  const admission = admissions.find((item) => item.id === admissionId)
  if (!admission) {
    return fail({
      code: 'NOT_FOUND',
      message: `Ingreso ${admissionId} no encontrado`,
    })
  }

  if (admission.status !== 'Activo') {
    return fail({
      code: 'NOT_ACTIVE',
      message: `El ingreso ${admissionId} no está activo.`,
    })
  }

  const text = input.text.trim()
  if (!text) {
    return fail({
      code: 'VALIDATION',
      message: 'La nota no puede estar vacía.',
    })
  }

  const note: AdmissionNote = {
    id: generateId('note'),
    admissionId,
    authorRole: input.authorRole,
    text,
    recordedAt: guayaquilIsoNow(),
    vitals: input.vitals ? { ...input.vitals } : undefined,
  }

  admissionNotes.push(note)

  if (input.vitals) {
    const bed = findBed(admission.bedId)
    if (bed) {
      bed.vitals = { ...input.vitals }
    }
  }

  return ok({ ...note, vitals: note.vitals ? { ...note.vitals } : undefined })
}

export async function dischargeAdmission(
  admissionId: string,
): Promise<ApiResult<AdmissionWithDetails>> {
  await delay(120)

  const admission = admissions.find((item) => item.id === admissionId)
  if (!admission) {
    return fail({
      code: 'NOT_FOUND',
      message: `Ingreso ${admissionId} no encontrado`,
    })
  }

  if (admission.status !== 'Activo') {
    return fail({
      code: 'NOT_ACTIVE',
      message: `El ingreso ${admissionId} ya no está activo.`,
    })
  }

  const bed = findBed(admission.bedId)
  if (!bed) {
    return fail({
      code: 'NOT_FOUND',
      message: `Cama ${admission.bedId} no encontrada`,
    })
  }

  admission.status = 'Alta'
  bed.status = 'Limpieza'
  delete bed.patientId
  delete bed.admissionId
  delete bed.vitals

  const patientResult = await getPatientById(admission.patientId)
  if (!patientResult.ok) {
    return fail(patientResult.error)
  }

  return ok({
    ...admission,
    patient: patientResult.data,
    bed: { ...bed },
  })
}
