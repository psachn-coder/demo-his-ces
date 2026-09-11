import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VitalSigns } from '@/data/types'
import { formatDateTime } from '@/lib/dates'

interface VitalsSidebarProps {
  vitals: VitalSigns[]
}

export function VitalsSidebar({ vitals }: VitalsSidebarProps) {
  const latest = vitals.at(-1)

  if (!latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Signos vitales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ces-muted">Sin registros de signos vitales.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signos vitales</CardTitle>
        <p className="text-xs text-ces-muted">Último registro · {formatDateTime(latest.recordedAt)}</p>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ces-muted">Presión arterial</dt>
            <dd className="font-medium tabular-nums">{latest.bloodPressure} mmHg</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ces-muted">Frecuencia cardíaca</dt>
            <dd className="font-medium tabular-nums">{latest.heartRate} lpm</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ces-muted">Temperatura</dt>
            <dd className="font-medium tabular-nums">{latest.temperature} °C</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ces-muted">Frecuencia respiratoria</dt>
            <dd className="font-medium tabular-nums">{latest.respiratoryRate} rpm</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ces-muted">SpO₂</dt>
            <dd className="font-medium tabular-nums">{latest.oxygenSaturation}%</dd>
          </div>
          {latest.weightKg !== undefined ? (
            <div className="flex justify-between gap-4">
              <dt className="text-ces-muted">Peso</dt>
              <dd className="font-medium tabular-nums">{latest.weightKg} kg</dd>
            </div>
          ) : null}
          {latest.heightCm !== undefined ? (
            <div className="flex justify-between gap-4">
              <dt className="text-ces-muted">Talla</dt>
              <dd className="font-medium tabular-nums">{latest.heightCm} cm</dd>
            </div>
          ) : null}
        </dl>
      </CardContent>
    </Card>
  )
}
