import { Badge } from '@/components/ui/badge'
import type { Patient } from '@/data/types'
import { formatAge } from '@/lib/formatters'

function resolveAge(patient: Patient): number {
  if (patient.age !== undefined) {
    return patient.age
  }
  const birth = new Date(patient.birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

interface HcePatientHeaderProps {
  patient: Patient
}

export function HcePatientHeader({ patient }: HcePatientHeaderProps) {
  const age = resolveAge(patient)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-ces-text">{formatAge(age)}</span>
      {patient.allergy ? (
        <Badge
          className="border-transparent bg-[var(--ces-warning)] text-white"
          aria-label={`Alergia: ${patient.allergy}`}
        >
          {patient.allergy}
        </Badge>
      ) : null}
    </div>
  )
}
