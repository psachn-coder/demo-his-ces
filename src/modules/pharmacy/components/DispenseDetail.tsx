import { useNavigate } from 'react-router-dom'

import { useDemoSession } from '@/app/DemoSessionProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { DispenseWithDetails } from '@/data/types'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import { DispenseStatusBadge } from '@/modules/pharmacy/components/DispenseStatusBadge'
import { formatDispenseLabel } from '@/modules/pharmacy/utils'

interface DispenseDetailProps {
  dispense: DispenseWithDetails | null
  loading: boolean
  fulfilling: boolean
  onFulfill: () => void
}

export function DispenseDetail({ dispense, loading, fulfilling, onFulfill }: DispenseDetailProps) {
  const navigate = useNavigate()
  const { setRole } = useDemoSession()

  const handleGoToBilling = () => {
    if (!dispense) return
    setRole('Caja')
    navigate(`/app/caja/cobro/${dispense.encounterId}`)
  }

  if (loading) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-ces-surface p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-9 w-28" />
      </div>
    )
  }

  if (!dispense) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-ces-surface px-6 py-12 text-center">
        <p className="text-sm text-ces-muted">Seleccione una orden de la cola para ver el detalle.</p>
      </div>
    )
  }

  const patientName = formatPatientName(dispense.patient.firstName, dispense.patient.lastName)
  const age = resolveAge(dispense.patient)
  const isDelivered = dispense.status === 'Entregado'

  return (
    <div className="rounded-lg border border-border bg-ces-surface">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-ces-text">{formatDispenseLabel(dispense)}</h2>
          <p className="text-sm text-ces-muted">Receta · {dispense.medication.form}</p>
        </div>
        <DispenseStatusBadge status={dispense.status} />
      </div>

      <div className="space-y-6 px-6 py-5">
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ces-muted">Paciente</h3>
          <p className="text-sm font-medium text-ces-text">{patientName}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ces-muted">{formatAge(age)}</span>
            {dispense.patient.allergy ? (
              <Badge
                className="border-transparent bg-[var(--ces-warning)] text-white"
                aria-label={`Alergia: ${dispense.patient.allergy}`}
              >
                {dispense.patient.allergy}
              </Badge>
            ) : null}
          </div>
        </section>

        <section className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ces-muted">Encuentro</h3>
          <p className="text-sm text-ces-text">Consulta ambulatoria</p>
        </section>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          <Button
            type="button"
            onClick={onFulfill}
            disabled={isDelivered || fulfilling}
          >
            {isDelivered ? 'Entregado' : fulfilling ? 'Entregando…' : 'Entregar'}
          </Button>
          {isDelivered ? (
            <Button type="button" variant="outline" onClick={handleGoToBilling}>
              Ir a Caja
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
