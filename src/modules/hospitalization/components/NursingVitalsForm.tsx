import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { BedVitals } from '@/data/types'

interface NursingVitalsFormProps {
  initialVitals?: BedVitals
  onSubmit: (payload: { text: string; vitals: BedVitals }) => Promise<void>
  submitting: boolean
}

export function NursingVitalsForm({
  initialVitals,
  onSubmit,
  submitting,
}: NursingVitalsFormProps) {
  const [bloodPressure, setBloodPressure] = useState(initialVitals?.bloodPressure ?? '128/78')
  const [heartRate, setHeartRate] = useState(String(initialVitals?.heartRate ?? 88))
  const [oxygenSaturation, setOxygenSaturation] = useState(
    String(initialVitals?.oxygenSaturation ?? 94),
  )
  const [text, setText] = useState('')

  const canSubmit =
    bloodPressure.trim().length > 0 &&
    Number(heartRate) > 0 &&
    Number(oxygenSaturation) > 0 &&
    text.trim().length > 0 &&
    !submitting

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    await onSubmit({
      text: text.trim(),
      vitals: {
        bloodPressure: bloodPressure.trim(),
        heartRate: Number(heartRate),
        oxygenSaturation: Number(oxygenSaturation),
      },
    })
    setText('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-border bg-ces-surface p-6"
    >
      <div>
        <h2 className="text-sm font-semibold text-ces-text">Signos vitales + nota</h2>
        <p className="text-xs text-ces-muted">Seed demo: TA 128/78 · FC 88 · SpO2 94%</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="ta">TA</Label>
          <Input
            id="ta"
            value={bloodPressure}
            onChange={(event) => setBloodPressure(event.target.value)}
            placeholder="128/78"
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fc">FC</Label>
          <Input
            id="fc"
            type="number"
            min={1}
            value={heartRate}
            onChange={(event) => setHeartRate(event.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spo2">SpO2 %</Label>
          <Input
            id="spo2"
            type="number"
            min={1}
            max={100}
            value={oxygenSaturation}
            onChange={(event) => setOxygenSaturation(event.target.value)}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enf-nota">Nota de enfermería</Label>
        <Textarea
          id="enf-nota"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Cuidados, observaciones, administración de medicación…"
          rows={3}
          disabled={submitting}
        />
      </div>

      <Button type="submit" disabled={!canSubmit}>
        {submitting ? 'Guardando…' : 'Registrar evolución'}
      </Button>
    </form>
  )
}
