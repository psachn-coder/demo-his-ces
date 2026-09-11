import { Skeleton } from '@/components/ui/skeleton'
import type { DispenseWithDetails } from '@/data/types'
import { formatPatientName } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { DispenseStatusBadge } from '@/modules/pharmacy/components/DispenseStatusBadge'
import { formatDispenseLabel } from '@/modules/pharmacy/utils'

interface DispenseQueueProps {
  dispenses: DispenseWithDetails[]
  selectedId: string | null
  loading: boolean
  onSelect: (id: string) => void
}

export function DispenseQueue({ dispenses, selectedId, loading, onSelect }: DispenseQueueProps) {
  if (loading) {
    return (
      <div className="space-y-2 rounded-lg border border-border bg-ces-surface p-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (dispenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-ces-surface px-4 py-8 text-center">
        <p className="text-sm text-ces-muted">No hay órdenes en la cola.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-ces-surface">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-ces-text">Cola de dispensación</h2>
        <p className="text-xs text-ces-muted">{dispenses.length} orden(es)</p>
      </div>
      <ul className="divide-y divide-border">
        {dispenses.map((dispense) => {
          const isSelected = dispense.id === selectedId
          const patientName = formatPatientName(
            dispense.patient.firstName,
            dispense.patient.lastName,
          )

          return (
            <li key={dispense.id}>
              <button
                type="button"
                onClick={() => onSelect(dispense.id)}
                className={cn(
                  'flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-ces-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected && 'bg-ces-accent',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-ces-text">
                    {formatDispenseLabel(dispense)}
                  </span>
                  <DispenseStatusBadge status={dispense.status} />
                </div>
                <span className="text-xs text-ces-muted">{patientName}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
