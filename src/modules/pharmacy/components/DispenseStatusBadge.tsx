import { Badge } from '@/components/ui/badge'
import type { DispenseStatus } from '@/data/types'
import { cn } from '@/lib/utils'

const STATUS_VARIANT: Record<DispenseStatus, 'outline' | 'success'> = {
  Pendiente: 'outline',
  Entregado: 'success',
}

interface DispenseStatusBadgeProps {
  status: DispenseStatus
  className?: string
}

export function DispenseStatusBadge({ status, className }: DispenseStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn(className)}>
      {status}
    </Badge>
  )
}
