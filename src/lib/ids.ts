export function generateId(prefix: string): string {
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${suffix}`
}

export const DEMO_ADMISSION_ID = 'adm-001'
export const DEMO_ENCOUNTER_ID = 'enc-001'
