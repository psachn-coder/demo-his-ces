import { Badge } from '@/components/ui/badge'
import type { DispenseStatus } from '@/data/types'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<DispenseStatus, string> = {
  pending: 'Pendiente',
  delivered: 'Entregado',
}

const STATUS_VARIANT: Record<DispenseStatus, 'outline' | 'success'> = {
  pending: 'outline',
  delivered: 'success',
}

interface DispenseStatusBadgeProps {
  status: DispenseStatus
  className?: string
}

export function DispenseStatusBadge({ status, className }: DispenseStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn(className)}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
