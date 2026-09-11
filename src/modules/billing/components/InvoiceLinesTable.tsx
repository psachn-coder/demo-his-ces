import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { InvoiceLine } from '@/data/types'
import { formatCurrency } from '@/lib/formatters'

interface InvoiceLinesTableProps {
  lines: InvoiceLine[] | undefined
  loading: boolean
}

export function InvoiceLinesTable({ lines, loading }: InvoiceLinesTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-ces-surface p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!lines || lines.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-border bg-ces-surface px-6 py-12">
        <p className="text-sm text-ces-muted">Sin ítems</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-ces-surface">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-ces-text">Ítems facturables</h2>
        <p className="text-xs text-ces-muted">{lines.length} línea(s)</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead className="w-20 text-right">Cant.</TableHead>
            <TableHead className="w-28 text-right">P. unit.</TableHead>
            <TableHead className="w-28 text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => {
            const subtotal = line.quantity * line.unitPrice
            return (
              <TableRow key={line.id}>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-ces-text">{line.description}</span>
                    {line.prescriptionId ? (
                      <Badge variant="outline">{line.prescriptionId}</Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm">{line.quantity}</TableCell>
                <TableCell className="text-right text-sm">{formatCurrency(line.unitPrice)}</TableCell>
                <TableCell className="text-right text-sm font-medium">
                  {formatCurrency(subtotal)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
