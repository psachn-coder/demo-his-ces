import { Navigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdmission, useAdmissionNotes } from '@/hooks/useAdmissions'
import { toast } from '@/hooks/use-toast'
import { DEMO_ADMISSION_ID } from '@/lib/ids'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import { EvolutionTimeline } from '@/modules/hce/components/EvolutionTimeline'
import { NursingVitalsForm } from '@/modules/hospitalization/components/NursingVitalsForm'

export function EnfermeriaEvolucionPage() {
  const { admissionId } = useParams()
  const resolvedId = admissionId ?? DEMO_ADMISSION_ID
  const { admission, loading, error, retry, setAdmission } = useAdmission(resolvedId, {
    ensureDemo: true,
  })
  const {
    notes,
    loading: notesLoading,
    saving,
    addNote,
  } = useAdmissionNotes(admission ? resolvedId : undefined)

  if (!admissionId) {
    return <Navigate to={`/app/enfermeria/evolucion/${DEMO_ADMISSION_ID}`} replace />
  }

  const handleSubmit = async (payload: {
    text: string
    vitals: { bloodPressure: string; heartRate: number; oxygenSaturation: number }
  }) => {
    try {
      await addNote({
        authorRole: 'Enfermeria',
        text: payload.text,
        vitals: payload.vitals,
      })
      setAdmission((current) =>
        current
          ? {
              ...current,
              bed: { ...current.bed, vitals: { ...payload.vitals } },
            }
          : current,
      )
      toast({
        title: 'Demo · no persistido',
        description: 'Evolución de enfermería guardada en memoria para esta sesión.',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'No se pudo registrar',
        description: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }

  if (loading) {
    return (
      <>
        <div className="mb-6 space-y-3 border-b border-border pb-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </>
    )
  }

  if (error || !admission) {
    return (
      <>
        <PageHeader
          title="Evolución de enfermería"
          description="No se pudo cargar el ingreso hospitalario."
        />
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-ces-surface px-6 py-8">
          <p className="text-sm text-ces-muted">{error ?? 'Ingreso no encontrado.'}</p>
          <Button type="button" variant="outline" size="sm" onClick={retry}>
            Reintentar
          </Button>
        </div>
      </>
    )
  }

  const patientName = formatPatientName(admission.patient.firstName, admission.patient.lastName)
  const patientAge = formatAge(resolveAge(admission.patient))
  const seedVitals = admission.bed.vitals

  return (
    <>
      <PageHeader
        title="Evolución de enfermería"
        description={`${patientName} · ${patientAge} · cama ${admission.bedId}`}
      />

      {seedVitals ? (
        <div className="mb-6 rounded-lg border border-border bg-ces-surface px-6 py-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ces-muted">
            Signos vitales (seed)
          </p>
          <p className="mt-1 text-ces-text">
            TA {seedVitals.bloodPressure} · FC {seedVitals.heartRate} lpm · SpO2{' '}
            {seedVitals.oxygenSaturation}%
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <NursingVitalsForm
          initialVitals={seedVitals}
          onSubmit={handleSubmit}
          submitting={saving}
        />
        <EvolutionTimeline notes={notes} loading={notesLoading} />
      </div>
    </>
  )
}
