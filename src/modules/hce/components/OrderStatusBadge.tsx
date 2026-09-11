import { Badge } from '@/components/ui/badge'
import type { EncounterOrderStatus } from '@/data/types'
import { cn } from '@/lib/utils'

const STATUS_VARIANT: Record<
  EncounterOrderStatus,
  'default' | 'secondary' | 'outline' | 'muted' | 'success'
> = {
  Pendiente: 'outline',
  Dispensada: 'success',
  Completada: 'muted',
}

interface OrderStatusBadgeProps {
  status: EncounterOrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const variant = STATUS_VARIANT[status] ?? 'outline'

  return (
    <Badge variant={variant} className={cn(className)}>
      {status === 'Pendiente' ? 'Dispensa Pendiente' : status}
    </Badge>
  )
}
