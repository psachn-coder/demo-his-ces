import type { BedStatus } from '@/data/types'
import { Badge } from '@/components/ui/badge'

const STATUS_VARIANT: Record<BedStatus, 'success' | 'default' | 'warning'> = {
  Libre: 'success',
  Ocupada: 'default',
  Limpieza: 'warning',
}

interface BedStatusBadgeProps {
  status: BedStatus
  className?: string
}

export function BedStatusBadge({ status, className }: BedStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={className}>
      {status}
    </Badge>
  )
}
