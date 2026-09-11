import { useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'

export function CobroPage() {
  const { encounterId } = useParams()

  return (
    <>
      <PageHeader
        title="Cobro"
        description={
          encounterId
            ? `Cobro de servicios — encuentro ${encounterId}.`
            : 'Seleccione un encuentro para registrar el cobro.'
        }
      />
      <PlaceholderState
        title="Punto de cobro"
        description="Registro de pagos en efectivo, tarjeta y seguros. Montos en USD."
      />
    </>
  )
}
