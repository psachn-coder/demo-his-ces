import patientsSeed from '@/data/patients.json'
import type { Patient } from '@/data/types'
import { ok, type ApiResult } from '@/lib/api/types'

const patients: Patient[] = patientsSeed

function delay(ms = 120): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getPatients(): Promise<ApiResult<Patient[]>> {
  await delay()
  return ok([...patients])
}

export async function getPatientById(id: string): Promise<ApiResult<Patient>> {
  await delay()
  const patient = patients.find((p) => p.id === id)
  if (!patient) {
    return {
      ok: false,
      error: { code: 'NOT_FOUND', message: `Paciente ${id} no encontrado` },
    }
  }
  return ok(patient)
}
