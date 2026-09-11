import { useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'

export function AltaPage() {
  const { admissionId } = useParams()

  return (
    <>
      <PageHeader
        title="Alta médica"
        description={`Proceso de egreso para admisión ${admissionId ?? '—'}.`}
      />
      <PlaceholderState
        title="Alta médica"
        description="Resumen de hospitalización, indicaciones al egreso y documentos de alta."
      />
    </>
  )
}
