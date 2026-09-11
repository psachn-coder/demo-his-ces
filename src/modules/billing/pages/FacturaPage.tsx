import { useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'
import { formatCurrency } from '@/lib/formatters'

export function FacturaPage() {
  const { admissionId } = useParams()

  return (
    <>
      <PageHeader
        title="Factura"
        description={`Facturación para admisión ${admissionId ?? '—'}. Ejemplo: ${formatCurrency(0)}.`}
      />
      <PlaceholderState
        title="Facturación"
        description="Emisión de factura con detalle de servicios, medicamentos y procedimientos."
      />
    </>
  )
}
