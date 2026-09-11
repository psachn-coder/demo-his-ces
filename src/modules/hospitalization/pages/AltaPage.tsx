import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdmission, useDischargeAdmission } from '@/hooks/useAdmissions'
import { toast } from '@/hooks/use-toast'
import { DEMO_ADMISSION_ID } from '@/lib/ids'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import {
  DischargeChecklist,
  type DischargeChecklistItem,
} from '@/modules/hospitalization/components/DischargeChecklist'

const INITIAL_ITEMS: DischargeChecklistItem[] = [
  { id: 'alta-medica', label: 'Alta médica', checked: false },
  { id: 'alta-enfermeria', label: 'Alta de enfermería', checked: false },
  { id: 'pertenencias', label: 'Pertenencias entregadas', checked: false },
  { id: 'recetas', label: 'Recetas listas', checked: false },
]

export function AltaPage() {
  const { admissionId } = useParams()
  const resolvedId = admissionId ?? DEMO_ADMISSION_ID
  const { admission, loading, error, retry, setAdmission } = useAdmission(resolvedId, {
    ensureDemo: true,
  })
  const { submitting, discharge } = useDischargeAdmission()
  const [items, setItems] = useState<DischargeChecklistItem[]>(INITIAL_ITEMS)

  if (!admissionId) {
    return <Navigate to={`/app/alta/${DEMO_ADMISSION_ID}`} replace />
  }

  const completed = items.filter((item) => item.checked).length
  const discharged = admission?.status === 'Alta'

  const handleToggle = (id: string) => {
    if (discharged) return
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    )
  }

  const handleConfirm = async () => {
    try {
      const updated = await discharge(resolvedId)
      setAdmission(updated)
      toast({
        title: 'Demo · no persistido',
        description: `Alta de ${updated.id}: cama ${updated.bedId} en Limpieza.`,
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'No se pudo confirmar el alta',
        description: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }

  if (loading) {
    return (
      <>
        <div className="mb-6 space-y-3 border-b border-border pb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-72 w-full" />
      </>
    )
  }

  if (error || !admission) {
    return (
      <>
        <PageHeader title="Alta hospitalaria" description="No se pudo cargar el ingreso." />
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
        title="Alta hospitalaria"
        description={`${patientName} · ${patientAge} · cama ${admission.bedId}`}
        actions={
          <Badge variant={discharged ? 'success' : completed === 4 ? 'default' : 'secondary'}>
            {discharged ? 'Alta' : `${completed}/4`}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)]">
        <DischargeChecklist
          items={items}
          onToggle={handleToggle}
          onConfirm={handleConfirm}
          confirming={submitting}
          discharged={discharged}
        />

        <div className="space-y-4 rounded-lg border border-border bg-ces-surface p-6 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ces-muted">Estado</p>
            <p className="mt-1 font-medium text-ces-text">{admission.status}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ces-muted">Cama</p>
            <p className="mt-1 font-medium text-ces-text">
              {admission.bedId} · {admission.bed.status}
            </p>
          </div>
          {discharged ? (
            <Button asChild className="w-full">
              <Link to={`/app/caja/factura/${resolvedId}`}>Ir a Factura</Link>
            </Button>
          ) : (
            <p className="text-xs text-ces-muted">
              Al confirmar el alta, la cama {admission.bedId} pasa a Limpieza.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
