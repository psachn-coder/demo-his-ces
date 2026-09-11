import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { BedWithDetails } from '@/lib/api/admissions'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import { BedStatusBadge } from '@/modules/hospitalization/components/BedStatusBadge'

interface BedDetailSheetProps {
  bed: BedWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BedDetailSheet({ bed, open, onOpenChange }: BedDetailSheetProps) {
  const occupied = bed?.status === 'Ocupada' && bed.patient

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {bed ? (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                Cama {bed.id}
                <BedStatusBadge status={bed.status} />
              </SheetTitle>
              <SheetDescription>
                {bed.ward} · resumen de ocupación.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4 text-sm">
              {occupied ? (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ces-muted">
                      Paciente
                    </p>
                    <p className="mt-1 font-medium text-ces-text">
                      {formatPatientName(bed.patient!.firstName, bed.patient!.lastName)}
                    </p>
                    <p className="text-ces-muted">
                      {bed.patientId} · {formatAge(resolveAge(bed.patient!))}
                      {bed.patient!.sector ? ` · ${bed.patient!.sector}` : ''}
                    </p>
                  </div>

                  {bed.admissionId ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-ces-muted">
                        Ingreso
                      </p>
                      <p className="mt-1 font-medium text-ces-text">{bed.admissionId}</p>
                    </div>
                  ) : null}

                  {bed.vitals ? (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-ces-muted">
                        Signos vitales
                      </p>
                      <ul className="mt-1 space-y-1 text-ces-text">
                        <li>TA {bed.vitals.bloodPressure}</li>
                        <li>FC {bed.vitals.heartRate} lpm</li>
                        <li>SpO2 {bed.vitals.oxygenSaturation}%</li>
                      </ul>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-ces-muted">
                  {bed.status === 'Libre'
                    ? 'Cama libre. Asigne un ingreso desde Recepción.'
                    : 'Cama en limpieza. No disponible para ingreso.'}
                </p>
              )}
            </div>

            <SheetFooter className="mt-8 flex-col items-stretch gap-2 sm:flex-col">
              {occupied && bed.admissionId ? (
                <Button asChild type="button">
                  <Link to={`/app/enfermeria/evolucion/${bed.admissionId}`}>Abrir evolución</Link>
                </Button>
              ) : null}
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
