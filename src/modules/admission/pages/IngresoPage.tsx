import { PageHeader } from '@/components/shared/PageHeader'
import { PlaceholderState } from '@/components/shared/PlaceholderState'

export function IngresoPage() {
  return (
    <>
      <PageHeader
        title="Ingreso de pacientes"
        description="Registro de admisión ambulatoria y hospitalaria."
      />
      <PlaceholderState
        title="Módulo en construcción"
        description="Aquí se registrarán los datos de ingreso, acompañante y motivo de consulta."
      />
    </>
  )
}
