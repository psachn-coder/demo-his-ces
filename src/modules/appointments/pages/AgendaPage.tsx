import { PageHeader } from '@/components/shared/PageHeader'
import { PatientCard } from '@/components/shared/PatientCard'
import { PlaceholderState } from '@/components/shared/PlaceholderState'
import { Skeleton } from '@/components/ui/skeleton'
import { usePatients } from '@/hooks/usePatients'

export function AgendaPage() {
  const { patients, loading, error } = usePatients()
  const demoPatient = patients.find((p) => p.id === 'pat-001')

  return (
    <>
      <PageHeader
        title="Agenda del día"
        description="Citas programadas y confirmadas para recepción."
      />

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          <Skeleton className="h-24 w-full max-w-md" />
        </div>
      ) : error ? (
        <PlaceholderState title="Error al cargar" description={error} />
      ) : demoPatient ? (
        <div className="space-y-4">
          <p className="text-sm text-ces-muted">Paciente de demostración:</p>
          <PatientCard patient={demoPatient} className="max-w-md" />
          <PlaceholderState
            title="Agenda vacía"
            description="Las citas del día se mostrarán aquí. Estados: Programada, Confirmada, En espera, En consulta, Atendida, No show."
          />
        </div>
      ) : (
        <PlaceholderState
          title="Agenda vacía"
          description="No hay citas programadas para hoy."
        />
      )}
    </>
  )
}
