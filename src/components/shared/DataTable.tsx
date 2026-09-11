import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  caption?: string
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Sin registros para mostrar.',
  className,
  caption,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={cn('space-y-2', className)} aria-busy="true" aria-label="Cargando tabla">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-dashed border-border bg-ces-surface px-6 py-10 text-center text-sm text-ces-muted',
          className,
        )}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border bg-ces-surface', className)}>
      <table className="w-full text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="border-b border-border bg-muted/40">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={cn('px-4 py-3 font-medium text-ces-text', column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-0">
              {columns.map((column) => (
                <td key={column.key} className={cn('px-4 py-3 text-ces-text', column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
