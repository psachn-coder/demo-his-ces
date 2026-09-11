import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdmissionWithDetails } from '@/lib/api/admissions'
import { formatAge, formatPatientName, resolveAge } from '@/lib/formatters'
import { BedStatusBadge } from '@/modules/hospitalization/components/BedStatusBadge'

interface AdmissionSummaryCardProps {
  admission: AdmissionWithDetails | null
}

export function AdmissionSummaryCard({ admission }: AdmissionSummaryCardProps) {
  if (!admission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumen del ingreso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ces-muted">
            Confirme el formulario para ver aquí el ID de ingreso y la cama asignada.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-ces-primary/40">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Resumen del ingreso</CardTitle>
          <Badge variant="default">{admission.id}</Badge>
          <BedStatusBadge status={admission.bed.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ces-muted">Paciente</p>
          <p className="mt-1 font-medium text-ces-text">
            {formatPatientName(admission.patient.firstName, admission.patient.lastName)}
          </p>
          <p className="text-ces-muted">
            {admission.patientId} · {formatAge(resolveAge(admission.patient))}
            {admission.patient.sector ? ` · ${admission.patient.sector}` : ''}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ces-muted">Cama</p>
            <p className="mt-1 font-semibold text-ces-text">{admission.bedId}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ces-muted">Servicio</p>
            <p className="mt-1 text-ces-text">{admission.service}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ces-muted">Motivo</p>
          <p className="mt-1 text-ces-text">{admission.reason}</p>
        </div>
      </CardContent>
    </Card>
  )
}
