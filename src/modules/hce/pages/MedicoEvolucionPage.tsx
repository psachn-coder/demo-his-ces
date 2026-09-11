import { Navigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdmission, useAdmissionNotes } from '@/hooks/useAdmissions'
import { toast } from '@/hooks/use-toast'
import { DEMO_ADMISSION_ID } from '@/lib/ids'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import { EvolutionNoteEditor } from '@/modules/hce/components/EvolutionNoteEditor'
import { EvolutionTimeline } from '@/modules/hce/components/EvolutionTimeline'

export function MedicoEvolucionPage() {
  const { admissionId } = useParams()
  const resolvedId = admissionId ?? DEMO_ADMISSION_ID
  const { admission, loading, error, retry } = useAdmission(resolvedId, { ensureDemo: true })
  const {
    notes,
    loading: notesLoading,
    saving,
    addNote,
  } = useAdmissionNotes(admission ? resolvedId : undefined)

  if (!admissionId) {
    return <Navigate to={`/app/medico/evolucion/${DEMO_ADMISSION_ID}`} replace />
  }

  const handleAddNote = async (text: string) => {
    try {
      await addNote({ authorRole: 'Medico', text })
      toast({
        title: 'Demo · no persistido',
        description: 'Nota médica guardada en memoria para esta sesión.',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'No se pudo guardar la nota',
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
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </>
    )
  }

  if (error || !admission) {
    return (
      <>
        <PageHeader
          title="Evolución médica"
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

  return (
    <>
      <PageHeader
        title="Evolución médica"
        description={`${patientName} · ${patientAge} · ${admission.patient.sector ?? '—'} · ${admission.bedId}`}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <EvolutionTimeline notes={notes} loading={notesLoading} />
        <EvolutionNoteEditor
          onSubmit={handleAddNote}
          submitting={saving}
          placeholder="Evolución, plan y ajustes de tratamiento…"
          submitLabel="Agregar nota médica"
        />
      </div>
    </>
  )
}
