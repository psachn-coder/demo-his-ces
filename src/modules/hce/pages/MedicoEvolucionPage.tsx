import { useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'

export function MedicoEvolucionPage() {
  const { admissionId } = useParams()

  return (
    <>
      <PageHeader
        title="Evolución médica"
        description={`Notas de evolución para admisión ${admissionId ?? '—'}.`}
      />
      <PlaceholderState
        title="Evolución médica"
        description="Registro de notas SOAP, signos vitales y plan de tratamiento."
      />
    </>
  )
}
