import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBeds } from '@/hooks/useAdmissions'
import type { BedWithDetails } from '@/lib/api/admissions'
import { BedCard } from '@/modules/hospitalization/components/BedCard'
import { BedDetailSheet } from '@/modules/hospitalization/components/BedDetailSheet'
import { BedStatusBadge } from '@/modules/hospitalization/components/BedStatusBadge'

export function CamasPage() {
  const { beds, loading, error, retry } = useBeds()
  const [selectedBed, setSelectedBed] = useState<BedWithDetails | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const counts = useMemo(() => {
    return beds.reduce(
      (acc, bed) => {
        acc[bed.status] += 1
        return acc
      },
      { Libre: 0, Ocupada: 0, Limpieza: 0 },
    )
  }, [beds])

  const handleSelect = (bed: BedWithDetails) => {
    setSelectedBed(bed)
    setSheetOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Tablero de camas"
        description="Ocupación hospitalaria · Enfermería."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <BedStatusBadge status="Libre" />
            <span className="text-xs text-ces-muted">{counts.Libre}</span>
            <BedStatusBadge status="Ocupada" />
            <span className="text-xs text-ces-muted">{counts.Ocupada}</span>
            <BedStatusBadge status="Limpieza" />
            <span className="text-xs text-ces-muted">{counts.Limpieza}</span>
          </div>
        }
      />

      {error ? (
        <div className="mb-4 flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-ces-surface px-6 py-8">
          <p className="text-sm text-ces-muted">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={retry}>
            Reintentar
          </Button>
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </div>
      ) : beds.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-ces-surface px-6 py-12 text-center">
          <p className="text-sm font-medium text-ces-text">Sin camas</p>
          <p className="mt-1 text-sm text-ces-muted">No hay camas configuradas en el seed.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {beds.map((bed) => (
            <BedCard
              key={bed.id}
              bed={bed}
              selected={selectedBed?.id === bed.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <BedDetailSheet bed={selectedBed} open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  )
}
