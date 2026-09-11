import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Patient } from '@/data/types'
import { formatPatientName } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface PatientCardProps {
  patient: Patient
  className?: string
}

function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function PatientCard({ patient, className }: PatientCardProps) {
  const fullName = formatPatientName(patient.firstName, patient.lastName)

  return (
    <article
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-ces-surface p-4 shadow-sm',
        className,
      )}
      aria-label={`Paciente ${fullName}`}
    >
      <Avatar>
        <AvatarFallback aria-hidden="true">
          {initials(patient.firstName, patient.lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium text-ces-text">{fullName}</p>
        <p className="text-sm text-ces-muted">CI: {patient.documentId}</p>
        {patient.phone ? (
          <p className="text-sm text-ces-muted">{patient.phone}</p>
        ) : null}
      </div>
    </article>
  )
}
