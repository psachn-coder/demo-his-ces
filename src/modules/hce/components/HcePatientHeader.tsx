import { Badge } from '@/components/ui/badge'
import type { Patient } from '@/data/types'
import { formatAge, resolveAge } from '@/lib/formatters'

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
