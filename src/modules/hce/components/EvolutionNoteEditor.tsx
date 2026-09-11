import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface EvolutionNoteEditorProps {
  onSubmit: (text: string) => Promise<void>
  submitting: boolean
  placeholder?: string
  submitLabel?: string
}

export function EvolutionNoteEditor({
  onSubmit,
  submitting,
  placeholder = 'Escriba la nota de evolución…',
  submitLabel = 'Agregar nota',
}: EvolutionNoteEditorProps) {
  const [text, setText] = useState('')

  const canSubmit = text.trim().length > 0 && !submitting

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    await onSubmit(text.trim())
    setText('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-border bg-ces-surface p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="evolucion-nota">Nueva nota</Label>
        <Textarea
          id="evolucion-nota"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={placeholder}
          rows={4}
          disabled={submitting}
        />
      </div>
      <Button type="submit" disabled={!canSubmit}>
        {submitting ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  )
}
