import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/formatters'

interface InvoiceTotalsProps {
  total: number | undefined
  loading: boolean
}

export function InvoiceTotals({ total, loading }: InvoiceTotalsProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-ces-surface p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-8 w-32" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-ces-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-ces-muted">Total a cobrar</p>
      <p className="mt-2 text-2xl font-semibold text-ces-text">
        {formatCurrency(total ?? 0)}
      </p>
    </div>
  )
}
