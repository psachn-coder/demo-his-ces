import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface DischargeChecklistItem {
  id: string
  label: string
  checked: boolean
}

interface DischargeChecklistProps {
  items: DischargeChecklistItem[]
  onToggle: (id: string) => void
  onConfirm: () => void
  confirming: boolean
  disabled?: boolean
  discharged?: boolean
}

export function DischargeChecklist({
  items,
  onToggle,
  onConfirm,
  confirming,
  disabled,
  discharged,
}: DischargeChecklistProps) {
  const completed = items.filter((item) => item.checked).length
  const allDone = completed === items.length

  return (
    <div className="space-y-4 rounded-lg border border-border bg-ces-surface p-6">
      <div>
        <h2 className="text-sm font-semibold text-ces-text">Checklist de alta</h2>
        <p className="text-xs text-ces-muted">
          Confirme los 4 ítems para habilitar el alta hospitalaria.
        </p>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              disabled={disabled || discharged || confirming}
              className={cn(
                'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors',
                item.checked
                  ? 'border-[var(--ces-success)]/40 bg-[var(--ces-success)]/10 text-ces-text'
                  : 'border-border bg-ces-bg text-ces-text hover:bg-muted/40',
                (disabled || discharged) && 'cursor-not-allowed opacity-70',
              )}
              aria-pressed={item.checked}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold',
                  item.checked
                    ? 'border-[var(--ces-success)] bg-[var(--ces-success)] text-white'
                    : 'border-border bg-ces-surface text-transparent',
                )}
                aria-hidden="true"
              >
                ✓
              </span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        className="w-full"
        onClick={onConfirm}
        disabled={!allDone || confirming || discharged || disabled}
      >
        {discharged
          ? 'Alta confirmada'
          : confirming
            ? 'Confirmando…'
            : allDone
              ? 'Confirmar alta'
              : `Completar checklist (${completed}/4)`}
      </Button>
    </div>
  )
}
