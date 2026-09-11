import { useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'

export function EnfermeriaEvolucionPage() {
  const { admissionId } = useParams()

  return (
    <>
      <PageHeader
        title="Evolución de enfermería"
        description={`Cuidados y signos vitales — admisión ${admissionId ?? '—'}.`}
      />
      <PlaceholderState
        title="Evolución de enfermería"
        description="Registro de cuidados, balance hídrico y administración de medicamentos."
      />
    </>
  )
}
