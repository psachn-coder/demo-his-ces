import { useEffect, useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateAdmission, useLibreBeds } from '@/hooks/useAdmissions'
import { usePatients } from '@/hooks/usePatients'
import { toast } from '@/hooks/use-toast'
import type { AdmissionWithDetails } from '@/lib/api/admissions'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import { AdmissionSummaryCard } from '@/modules/admission/components/AdmissionSummaryCard'
import {
  DEMO_INGRESO_BED_ID,
  DEMO_INGRESO_PATIENT_ID,
  DEMO_INGRESO_REASON,
  DEMO_INGRESO_SERVICE,
  INGRESO_SERVICES,
} from '@/modules/admission/types'

export function IngresoPage() {
  const { patients, loading: patientsLoading, error: patientsError } = usePatients()
  const { beds, loading: bedsLoading, error: bedsError, retry: retryBeds } = useLibreBeds()
  const { submitting, submit } = useCreateAdmission()

  const [patientId, setPatientId] = useState(DEMO_INGRESO_PATIENT_ID)
  const [reason, setReason] = useState(DEMO_INGRESO_REASON)
  const [service, setService] = useState(DEMO_INGRESO_SERVICE)
  const [bedId, setBedId] = useState(DEMO_INGRESO_BED_ID)
  const [summary, setSummary] = useState<AdmissionWithDetails | null>(null)

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === patientId) ?? null,
    [patients, patientId],
  )

  useEffect(() => {
    if (bedsLoading) return
    if (beds.some((bed) => bed.id === bedId)) return
    setBedId(beds[0]?.id ?? '')
  }, [beds, bedsLoading, bedId])

  const canSubmit =
    Boolean(patientId && reason.trim() && service && bedId) && !submitting && !summary

  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    try {
      const admission = await submit({
        patientId,
        bedId,
        reason,
        service,
      })
      // Card resumen ANTES del toast (DoD Lara / ENTREGA).
      setSummary(admission)
      await retryBeds()
      toast({
        title: 'Demo · no persistido',
        description: `Ingreso ${admission.id} en cama ${admission.bedId} (memoria de sesión).`,
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'No se pudo registrar el ingreso',
        description: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }

  const loading = patientsLoading || bedsLoading

  return (
    <>
      <PageHeader
        title="Ingreso hospitalario"
        description="Admisión a cama · demo pat-002 / adm-001 / 204-B."
      />

      {patientsError || bedsError ? (
        <div className="mb-4 rounded-lg border border-dashed border-border bg-ces-surface px-6 py-8">
          <p className="text-sm text-ces-muted">{patientsError ?? bedsError}</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={retryBeds}>
            Reintentar camas
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Datos del ingreso</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3" aria-busy="true">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-2/3" />
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleConfirm}>
                <div className="space-y-1.5">
                  <Label htmlFor="ingreso-paciente">Paciente</Label>
                  <Select
                    value={patientId}
                    onValueChange={setPatientId}
                    disabled={Boolean(summary)}
                  >
                    <SelectTrigger id="ingreso-paciente" aria-label="Paciente">
                      <SelectValue placeholder="Seleccione paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {formatPatientName(patient.firstName, patient.lastName)} · {patient.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPatient ? (
                    <p className="text-xs text-ces-muted">
                      {formatAge(resolveAge(selectedPatient))}
                      {selectedPatient.sector ? ` · ${selectedPatient.sector}` : ''}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ingreso-motivo">Motivo</Label>
                  <Input
                    id="ingreso-motivo"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Motivo de internación"
                    disabled={Boolean(summary)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ingreso-servicio">Servicio</Label>
                  <Select
                    value={service}
                    onValueChange={setService}
                    disabled={Boolean(summary)}
                  >
                    <SelectTrigger id="ingreso-servicio" aria-label="Servicio">
                      <SelectValue placeholder="Seleccione servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {INGRESO_SERVICES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ingreso-cama">Cama (solo Libre)</Label>
                  <Select
                    value={bedId}
                    onValueChange={setBedId}
                    disabled={Boolean(summary) || beds.length === 0}
                  >
                    <SelectTrigger id="ingreso-cama" aria-label="Cama libre">
                      <SelectValue placeholder="Seleccione cama libre" />
                    </SelectTrigger>
                    <SelectContent>
                      {beds.map((bed) => (
                        <SelectItem key={bed.id} value={bed.id}>
                          {bed.id} · {bed.ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {beds.length === 0 ? (
                    <p className="text-xs text-ces-muted">No hay camas Libre disponibles.</p>
                  ) : null}
                </div>

                <Button type="submit" disabled={!canSubmit}>
                  {submitting ? 'Registrando…' : 'Confirmar ingreso'}
                </Button>

                {summary ? (
                  <p className="text-xs text-ces-muted">
                    Para ver el tablero, cambie el rol a Enfermería con el selector superior y abra
                    Camas.
                  </p>
                ) : null}
              </form>
            )}
          </CardContent>
        </Card>

        <AdmissionSummaryCard admission={summary} />
      </div>
    </>
  )
}
