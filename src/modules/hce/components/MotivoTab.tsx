import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EncounterWithPatient } from '@/data/types'
import { formatDateTime } from '@/lib/dates'
import { formatDocumentId } from '@/lib/formatters'

interface MotivoTabProps {
  encounter: EncounterWithPatient
}

export function MotivoTab({ encounter }: MotivoTabProps) {
  const { patient } = encounter

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Motivo de consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-ces-text">{encounter.motivo}</p>
          <p className="mt-3 text-xs text-ces-muted">
            Inicio del encuentro · {formatDateTime(encounter.startedAt)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos del paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-ces-muted">Cédula</dt>
              <dd className="font-medium tabular-nums">{formatDocumentId(patient.documentId)}</dd>
            </div>
            {patient.sector ? (
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-ces-muted">Sector</dt>
                <dd className="font-medium">{patient.sector}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-ces-muted">Estado del encuentro</dt>
              <dd className="font-medium">{encounter.status}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
