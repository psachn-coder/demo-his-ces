import dispensesSeed from '@/data/dispenses.json'
import medicationsSeed from '@/data/medications.json'
import type { Dispense, DispenseStatus, DispenseWithDetails, Medication } from '@/data/types'
import { getPatientById } from '@/lib/api/patients'
import { fail, ok, type ApiResult } from '@/lib/api/types'
import { guayaquilIsoNow } from '@/lib/dates'

const medications: Medication[] = medicationsSeed
const dispenses: Dispense[] = dispensesSeed.map((item) => ({
  ...item,
  status: item.status as DispenseStatus,
}))

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findMedication(id: string): Medication | undefined {
  return medications.find((medication) => medication.id === id)
}

function findDispense(id: string): Dispense | undefined {
  return dispenses.find((dispense) => dispense.id === id)
}

async function enrichDispense(dispense: Dispense): Promise<ApiResult<DispenseWithDetails>> {
  const medication = findMedication(dispense.medicationId)
  if (!medication) {
    return fail({
      code: 'NOT_FOUND',
      message: `Medicamento ${dispense.medicationId} no encontrado`,
    })
  }

  const patientResult = await getPatientById(dispense.patientId)
  if (!patientResult.ok) {
    return fail(patientResult.error)
  }

  return ok({
    ...dispense,
    medication,
    patient: patientResult.data,
  })
}

export interface GetDispensesParams {
  status?: DispenseStatus
}

export async function getMedications(): Promise<ApiResult<Medication[]>> {
  await delay()
  return ok([...medications])
}

export async function getDispenses(
  params: GetDispensesParams = {},
): Promise<ApiResult<DispenseWithDetails[]>> {
  await delay()
  const filtered = params.status
    ? dispenses.filter((dispense) => dispense.status === params.status)
    : dispenses

  const enriched: DispenseWithDetails[] = []
  for (const dispense of filtered) {
    const result = await enrichDispense(dispense)
    if (!result.ok) {
      return fail(result.error)
    }
    enriched.push(result.data)
  }

  return ok(enriched)
}

export async function fulfillDispense(id: string): Promise<ApiResult<DispenseWithDetails>> {
  await delay(80)
  const dispense = findDispense(id)
  if (!dispense) {
    return fail({
      code: 'NOT_FOUND',
      message: `Dispensa ${id} no encontrada`,
    })
  }

  if (dispense.status === 'delivered') {
    return fail({
      code: 'ALREADY_FULFILLED',
      message: 'Esta dispensa ya fue entregada.',
    })
  }

  dispense.status = 'delivered'
  dispense.dispensedAt = guayaquilIsoNow()

  return enrichDispense(dispense)
}
