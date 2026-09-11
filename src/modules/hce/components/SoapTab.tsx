import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { EncounterWithPatient } from '@/data/types'
import { formatDateTime } from '@/lib/dates'
import type { AddEncounterNoteInput } from '@/lib/api/encounters'

const CIE10_OPTIONS = [
  { code: 'R51', label: 'R51 — Cefalea' },
  { code: 'J06.9', label: 'J06.9 — Infección aguda de vías respiratorias superiores' },
  { code: 'K21.9', label: 'K21.9 — Enfermedad del reflujo gastroesofágico' },
  { code: 'M54.5', label: 'M54.5 — Lumbago no especificado' },
]

interface SoapTabProps {
  encounter: EncounterWithPatient
  onSaveNote: (note: AddEncounterNoteInput) => Promise<void>
  onDiagnosisChange: (code: string) => void
}

export function SoapTab({ encounter, onSaveNote, onDiagnosisChange }: SoapTabProps) {
  const [subjective, setSubjective] = useState('')
  const [objective, setObjective] = useState('')
  const [assessment, setAssessment] = useState('')
  const [plan, setPlan] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await onSaveNote({ subjective, objective, assessment, plan })
      setSubjective('')
      setObjective('')
      setAssessment('')
      setPlan('')
    } finally {
      setSaving(false)
    }
  }

  const latestNote = encounter.notes.at(-1)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico (CIE-10)</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="cie10" className="sr-only">Código CIE-10</Label>
          <Select
            value={encounter.diagnosisCode ?? ''}
            onValueChange={onDiagnosisChange}
          >
            <SelectTrigger id="cie10" className="w-full sm:max-w-md">
              <SelectValue placeholder="Seleccione un código CIE-10" />
            </SelectTrigger>
            <SelectContent>
              {CIE10_OPTIONS.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nota SOAP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjective">Subjetivo (S)</Label>
            <Textarea
              id="subjective"
              value={subjective}
              onChange={(event) => setSubjective(event.target.value)}
              placeholder="Síntomas referidos por el paciente…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo (O)</Label>
            <Textarea
              id="objective"
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              placeholder="Hallazgos del examen físico…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assessment">Análisis (A)</Label>
            <Textarea
              id="assessment"
              value={assessment}
              onChange={(event) => setAssessment(event.target.value)}
              placeholder="Impresión diagnóstica…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Plan (P)</Label>
            <Textarea
              id="plan"
              value={plan}
              onChange={(event) => setPlan(event.target.value)}
              placeholder="Conducta y seguimiento…"
            />
          </div>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar nota SOAP'}
          </Button>
        </CardContent>
      </Card>

      {latestNote ? (
        <Card>
          <CardHeader>
            <CardTitle>Última nota registrada</CardTitle>
            <p className="text-xs text-ces-muted">{formatDateTime(latestNote.recordedAt)}</p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-ces-text">S</p>
              <p className="text-ces-muted">{latestNote.subjective || '—'}</p>
            </div>
            <div>
              <p className="font-medium text-ces-text">O</p>
              <p className="text-ces-muted">{latestNote.objective || '—'}</p>
            </div>
            <div>
              <p className="font-medium text-ces-text">A</p>
              <p className="text-ces-muted">{latestNote.assessment || '—'}</p>
            </div>
            <div>
              <p className="font-medium text-ces-text">P</p>
              <p className="text-ces-muted">{latestNote.plan || '—'}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
