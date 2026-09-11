import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BedWithDetails } from '@/lib/api/admissions'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { BedStatusBadge } from '@/modules/hospitalization/components/BedStatusBadge'

interface BedCardProps {
  bed: BedWithDetails
  selected?: boolean
  onSelect?: (bed: BedWithDetails) => void
}

function shortPatientName(firstName: string, lastName: string): string {
  const initial = firstName.trim().charAt(0)
  return initial ? `${initial}. ${lastName}` : lastName
}

export function BedCard({ bed, selected = false, onSelect }: BedCardProps) {
  const interactive = Boolean(onSelect)
  const patientLabel = bed.patient
    ? shortPatientName(bed.patient.firstName, bed.patient.lastName)
    : null

  return (
    <Card
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      onClick={interactive ? () => onSelect?.(bed) : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect?.(bed)
              }
            }
          : undefined
      }
      className={cn(
        'transition-colors',
        interactive &&
          'cursor-pointer hover:border-ces-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected && 'border-ces-primary ring-2 ring-ces-primary/30',
      )}
    >
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">{bed.id}</CardTitle>
          <p className="mt-1 text-xs text-ces-muted">{bed.ward}</p>
        </div>
        <BedStatusBadge status={bed.status} />
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {bed.status === 'Ocupada' && bed.patient ? (
          <>
            <p className="font-medium text-ces-text">{patientLabel}</p>
            <p className="text-ces-muted">
              {formatPatientName(bed.patient.firstName, bed.patient.lastName)} ·{' '}
              {formatAge(resolveAge(bed.patient))}
            </p>
            {bed.vitals ? (
              <p className="text-xs text-ces-muted">
                TA {bed.vitals.bloodPressure} · FC {bed.vitals.heartRate} · SpO2{' '}
                {bed.vitals.oxygenSaturation}%
              </p>
            ) : (
              <p className="text-xs text-ces-muted">Sin signos vitales registrados</p>
            )}
            {bed.admissionId ? (
              <p className="text-xs text-ces-muted">Ingreso {bed.admissionId}</p>
            ) : null}
          </>
        ) : bed.status === 'Limpieza' ? (
          <p className="text-ces-muted">En limpieza — no asignable</p>
        ) : (
          <p className="text-ces-muted">Disponible para ingreso</p>
        )}
      </CardContent>
    </Card>
  )
}
