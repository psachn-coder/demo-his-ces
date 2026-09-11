import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEncounter } from '@/hooks/useEncounter'
import { toast } from '@/hooks/use-toast'
import { DEMO_ENCOUNTER_ID } from '@/lib/ids'
import { formatPatientName } from '@/lib/formatters'
import { HcePatientHeader } from '@/modules/hce/components/HcePatientHeader'
import { MotivoTab } from '@/modules/hce/components/MotivoTab'
import { OrdenesTab } from '@/modules/hce/components/OrdenesTab'
import { SoapTab } from '@/modules/hce/components/SoapTab'
import { VitalsSidebar } from '@/modules/hce/components/VitalsSidebar'

export function HcePage() {
  const { encounterId } = useParams()
  const resolvedId = encounterId ?? DEMO_ENCOUNTER_ID
  const { encounter, loading, error, retry, saveNote, addOrder } = useEncounter(
    encounterId ? resolvedId : undefined,
  )
  const [diagnosisCode, setDiagnosisCode] = useState<string | undefined>()

  useEffect(() => {
    if (encounter?.diagnosisCode) {
      setDiagnosisCode(encounter.diagnosisCode)
    }
  }, [encounter?.diagnosisCode])

  if (!encounterId) {
    return <Navigate to={`/app/medico/hce/${DEMO_ENCOUNTER_ID}`} replace />
  }

  if (loading) {
    return (
      <>
        <div className="mb-6 space-y-3 border-b border-border pb-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </>
    )
  }

  if (error || !encounter) {
    return (
      <>
        <PageHeader
          title="Historia clínica electrónica"
          description="No se pudo cargar el encuentro clínico."
        />
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-ces-surface px-6 py-8">
          <p className="text-sm text-ces-muted">{error ?? 'Encuentro no encontrado.'}</p>
          <Button type="button" variant="outline" size="sm" onClick={retry}>
            Reintentar
          </Button>
        </div>
      </>
    )
  }

  const fullName = formatPatientName(encounter.patient.firstName, encounter.patient.lastName)
  const encounterWithDiagnosis = { ...encounter, diagnosisCode }

  const handleSaveNote = async (note: {
    subjective: string
    objective: string
    assessment: string
    plan: string
  }) => {
    await saveNote(note)
    toast({
      title: 'Demo · no persistido',
      description: 'La nota SOAP se guardó en memoria para esta sesión.',
    })
  }

  const handleCreateMedication = async () => {
    const order = await addOrder({ type: 'Medicamento' })
    if (order) {
      toast({
        title: 'Orden creada',
        description: `${order.description} — Dispensa Pendiente.`,
      })
    }
  }

  const handleCreateLab = async () => {
    const order = await addOrder({ type: 'Laboratorio' })
    if (order) {
      toast({
        title: 'Orden creada',
        description: `${order.description} — Pendiente.`,
      })
    }
  }

  return (
    <>
      <PageHeader
        title={fullName}
        description="Consulta ambulatoria — historia clínica electrónica."
        actions={<HcePatientHeader patient={encounter.patient} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <Tabs defaultValue="motivo">
            <TabsList>
              <TabsTrigger value="motivo">Motivo</TabsTrigger>
              <TabsTrigger value="soap">SOAP</TabsTrigger>
              <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
            </TabsList>

            <TabsContent value="motivo">
              <MotivoTab encounter={encounterWithDiagnosis} />
            </TabsContent>

            <TabsContent value="soap">
              <SoapTab
                encounter={encounterWithDiagnosis}
                onSaveNote={handleSaveNote}
                onDiagnosisChange={setDiagnosisCode}
              />
            </TabsContent>

            <TabsContent value="ordenes">
              <OrdenesTab
                encounter={encounterWithDiagnosis}
                onCreateMedication={handleCreateMedication}
                onCreateLab={handleCreateLab}
              />
            </TabsContent>
          </Tabs>
        </div>

        <aside>
          <VitalsSidebar vitals={encounter.vitals} />
        </aside>
      </div>
    </>
  )
}
