import { Badge } from '@/components/ui/badge'
import type { InvoiceStatus } from '@/data/types'
import { cn } from '@/lib/utils'

const STATUS_VARIANT: Record<InvoiceStatus, 'outline' | 'secondary' | 'success'> = {
  Borrador: 'outline',
  Emitida: 'secondary',
  Pagada: 'success',
}

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
  className?: string
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn(className)}>
      {status}
    </Badge>
  )
}
