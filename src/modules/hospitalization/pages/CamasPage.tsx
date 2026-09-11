import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'

export function CamasPage() {
  return (
    <>
      <PageHeader
        title="Gestión de camas"
        description="Mapa de ocupación hospitalaria por pabellón."
      />
      <PlaceholderState
        title="Mapa de camas"
        description="Visualización de camas libres, ocupadas y en mantenimiento."
      />
    </>
  )
}
