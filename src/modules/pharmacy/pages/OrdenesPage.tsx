import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'

export function OrdenesPage() {
  return (
    <>
      <PageHeader
        title="Órdenes de farmacia"
        description="Dispensación de medicamentos según prescripción médica."
      />
      <PlaceholderState
        title="Órdenes pendientes"
        description="Listado de recetas y órdenes de medicamentos por dispensar."
      />
    </>
  )
}
