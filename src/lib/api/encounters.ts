import encountersSeed from '@/data/encounters.json'
import type {
  EncounterDetail,
  EncounterOrder,
  EncounterWithPatient,
  SoapNote,
} from '@/data/types'
import { getPatientById } from '@/lib/api/patients'
import { fail, ok, type ApiResult } from '@/lib/api/types'
import { guayaquilIsoNow } from '@/lib/dates'
import { generateId } from '@/lib/ids'

const encounters: EncounterDetail[] = encountersSeed.map((encounter) => ({
  ...encounter,
  status: encounter.status as EncounterDetail['status'],
  vitals: encounter.vitals ?? [],
  notes: encounter.notes ?? [],
  orders: encounter.orders ?? [],
}))

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findEncounter(id: string): EncounterDetail | undefined {
  return encounters.find((encounter) => encounter.id === id)
}

export async function getEncounter(id: string): Promise<ApiResult<EncounterWithPatient>> {
  await delay()
  const encounter = findEncounter(id)
  if (!encounter) {
    return fail({
      code: 'NOT_FOUND',
      message: `Encuentro ${id} no encontrado`,
    })
  }

  const patientResult = await getPatientById(encounter.patientId)
  if (!patientResult.ok) {
    return fail(patientResult.error)
  }

  return ok({ ...encounter, patient: patientResult.data })
}

export interface AddEncounterNoteInput {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export async function addEncounterNote(
  encounterId: string,
  note: AddEncounterNoteInput,
): Promise<ApiResult<SoapNote>> {
  await delay(80)
  const encounter = findEncounter(encounterId)
  if (!encounter) {
    return fail({
      code: 'NOT_FOUND',
      message: `Encuentro ${encounterId} no encontrado`,
    })
  }

  const soapNote: SoapNote = {
    ...note,
    recordedAt: guayaquilIsoNow(),
  }
  encounter.notes.push(soapNote)
  return ok(soapNote)
}

export type CreateEncounterOrderInput =
  | { type: 'Medicamento' }
  | { type: 'Laboratorio'; description?: string }

export async function createEncounterOrder(
  encounterId: string,
  input: CreateEncounterOrderInput,
): Promise<ApiResult<EncounterOrder>> {
  await delay(80)
  const encounter = findEncounter(encounterId)
  if (!encounter) {
    return fail({
      code: 'NOT_FOUND',
      message: `Encuentro ${encounterId} no encontrado`,
    })
  }

  const createdAt = guayaquilIsoNow()

  let order: EncounterOrder
  if (input.type === 'Medicamento') {
    const existingRx = encounter.orders.find((item) => item.id === 'rx-001')
    if (existingRx) {
      return ok(existingRx)
    }
    order = {
      id: 'rx-001',
      encounterId,
      type: 'Medicamento',
      description: 'Paracetamol 500 mg x20',
      status: 'Pendiente',
      createdAt,
      medicationName: 'Paracetamol',
      medicationDose: '500 mg',
      quantity: 20,
    }
  } else {
    order = {
      id: generateId('lab'),
      encounterId,
      type: 'Laboratorio',
      description: input.description ?? 'Hemograma completo',
      status: 'Pendiente',
      createdAt,
    }
  }

  encounter.orders.push(order)
  return ok(order)
}
