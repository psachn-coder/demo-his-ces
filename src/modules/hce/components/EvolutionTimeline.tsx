import type { AdmissionNote } from '@/data/types'
import { formatDateTime } from '@/lib/dates'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface EvolutionTimelineProps {
  notes: AdmissionNote[]
  loading?: boolean
}

const ROLE_LABEL: Record<AdmissionNote['authorRole'], string> = {
  Medico: 'Médico',
  Enfermeria: 'Enfermería',
}

export function EvolutionTimeline({ notes, loading }: EvolutionTimelineProps) {
  if (loading) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-ces-surface p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-border bg-ces-surface px-6 py-10">
        <p className="text-sm text-ces-muted">Sin notas de evolución todavía.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-ces-surface">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-ces-text">Línea de tiempo</h2>
        <p className="text-xs text-ces-muted">{notes.length} nota(s)</p>
      </div>
      <ol className="divide-y divide-border">
        {notes.map((note) => (
          <li key={note.id} className="px-6 py-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={note.authorRole === 'Medico' ? 'default' : 'secondary'}>
                {ROLE_LABEL[note.authorRole]}
              </Badge>
              <span className="text-xs text-ces-muted">{formatDateTime(note.recordedAt)}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-ces-text">{note.text}</p>
            {note.vitals ? (
              <p className="mt-2 text-xs text-ces-muted">
                TA {note.vitals.bloodPressure} · FC {note.vitals.heartRate} · SpO2{' '}
                {note.vitals.oxygenSaturation}%
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
