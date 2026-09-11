import { useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'

export function HcePage() {
  const { encounterId } = useParams()

  return (
    <>
      <PageHeader
        title="Historia clínica electrónica"
        description={
          encounterId
            ? `Encuentro ${encounterId} — consulta ambulatoria.`
            : 'Seleccione un encuentro para ver la historia clínica.'
        }
      />
      <PlaceholderState
        title="Historia clínica"
        description="Aquí se visualizarán antecedentes, diagnósticos, órdenes y documentos del paciente."
      />
    </>
  )
}
