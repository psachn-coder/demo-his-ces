import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { useDispenses } from '@/hooks/useDispenses'
import { toast } from '@/hooks/use-toast'
import { DispenseDetail } from '@/modules/pharmacy/components/DispenseDetail'
import { DispenseQueue } from '@/modules/pharmacy/components/DispenseQueue'
import { FulfillDispenseDialog } from '@/modules/pharmacy/components/FulfillDispenseDialog'

export function OrdenesPage() {
  const { dispenses, loading, error, fulfillingId, retry, fulfill } = useDispenses()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const selectedDispense = useMemo(
    () => dispenses.find((dispense) => dispense.id === selectedId) ?? null,
    [dispenses, selectedId],
  )

  useEffect(() => {
    if (!loading && dispenses.length > 0 && !selectedId) {
      setSelectedId(dispenses[0].id)
    }
  }, [loading, dispenses, selectedId])

  const handleFulfillRequest = () => {
    if (!selectedDispense || selectedDispense.status === 'delivered') return
    setDialogOpen(true)
  }

  const handleConfirmFulfill = async () => {
    if (!selectedDispense) return

    try {
      await fulfill(selectedDispense.id)
      setDialogOpen(false)
      toast({
        title: 'Demo · no persistido',
        description: 'La dispensa se marcó como entregada en memoria para esta sesión.',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'No se pudo entregar',
        description: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }

  return (
    <>
      <PageHeader
        title="Órdenes de farmacia"
        description="Dispensación de medicamentos según prescripción médica."
      />

      {error ? (
        <div className="mb-4 flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-ces-surface px-6 py-8">
          <p className="text-sm text-ces-muted">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={retry}>
            Reintentar
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <DispenseQueue
          dispenses={dispenses}
          selectedId={selectedId}
          loading={loading}
          onSelect={setSelectedId}
        />
        <DispenseDetail
          dispense={selectedDispense}
          loading={loading}
          fulfilling={fulfillingId === selectedDispense?.id}
          onFulfill={handleFulfillRequest}
        />
      </div>

      <FulfillDispenseDialog
        dispense={selectedDispense}
        open={dialogOpen}
        loading={fulfillingId !== null}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmFulfill}
      />
    </>
  )
}
