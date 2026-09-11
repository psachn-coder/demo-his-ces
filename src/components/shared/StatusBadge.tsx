import { Badge } from '@/components/ui/badge'
import type { AppointmentStatus } from '@/data/types'
import { cn } from '@/lib/utils'

const STATUS_VARIANT: Record<
  AppointmentStatus,
  'default' | 'secondary' | 'outline' | 'muted' | 'success'
> = {
  Programada: 'outline',
  Confirmada: 'success',
  'En espera': 'secondary',
  'En consulta': 'secondary',
  Atendida: 'muted',
  'No show': 'muted',
}

interface StatusBadgeProps {
  status: AppointmentStatus | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant =
    status in STATUS_VARIANT
      ? STATUS_VARIANT[status as AppointmentStatus]
      : 'outline'

  return (
    <Badge variant={variant} className={cn(className)}>
      {status}
    </Badge>
  )
}
