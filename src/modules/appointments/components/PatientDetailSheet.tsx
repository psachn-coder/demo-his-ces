import { PatientCard } from '@/components/shared/PatientCard'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type { Patient } from '@/data/types'
import { formatDate } from '@/lib/dates'
import { formatPatientName } from '@/lib/formatters'

interface PatientDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  loading: boolean
}

export function PatientDetailSheet({
  open,
  onOpenChange,
  patient,
  loading,
}: PatientDetailSheetProps) {
  const fullName = patient ? formatPatientName(patient.firstName, patient.lastName) : ''

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Ficha del paciente</SheetTitle>
          <SheetDescription>
            {patient ? fullName : 'Cargando información del paciente…'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-3" aria-busy="true">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : patient ? (
            <>
              <PatientCard patient={patient} />
              <dl className="grid gap-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-ces-muted">ID</dt>
                  <dd className="font-medium text-ces-text">{patient.id}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-ces-muted">Cédula</dt>
                  <dd className="font-medium tabular-nums text-ces-text">{patient.documentId}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-ces-muted">Fecha de nacimiento</dt>
                  <dd className="font-medium text-ces-text">{formatDate(patient.birthDate)}</dd>
                </div>
                {patient.age !== undefined ? (
                  <div className="flex justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-ces-muted">Edad</dt>
                    <dd className="font-medium text-ces-text">{patient.age} años</dd>
                  </div>
                ) : null}
                {patient.sector ? (
                  <div className="flex justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-ces-muted">Sector</dt>
                    <dd className="font-medium text-ces-text">{patient.sector}</dd>
                  </div>
                ) : null}
                {patient.allergy ? (
                  <div className="flex justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-ces-muted">Alergia</dt>
                    <dd className="font-medium text-ces-text">{patient.allergy}</dd>
                  </div>
                ) : null}
                {patient.phone ? (
                  <div className="flex justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-ces-muted">Teléfono</dt>
                    <dd className="font-medium text-ces-text">{patient.phone}</dd>
                  </div>
                ) : null}
                {patient.email ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ces-muted">Correo</dt>
                    <dd className="font-medium text-ces-text">{patient.email}</dd>
                  </div>
                ) : null}
              </dl>
            </>
          ) : (
            <p className="text-sm text-ces-muted">No se encontró el paciente.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
