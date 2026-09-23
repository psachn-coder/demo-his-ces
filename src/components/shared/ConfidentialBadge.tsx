import { Shield } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const TOOLTIP =
  'Los datos de salud son información de categoría especial (LOPDP / A.M. 5216). Uso exclusivo para atención clínica autorizada.'

const COPY = {
  short: 'Confidencial',
  legend: 'Información confidencial — uso clínico autorizado',
} as const

export type ConfidentialBadgeVariant = keyof typeof COPY

interface ConfidentialBadgeProps {
  variant: ConfidentialBadgeVariant
  size?: 'sm' | 'default'
  className?: string
}

export function ConfidentialBadge({
  variant,
  size = 'default',
  className,
}: ConfidentialBadgeProps) {
  const label = COPY[variant]

  return (
    <Badge
      variant="outline"
      title={TOOLTIP}
      aria-label={label}
      className={cn(
        'gap-1 border-[var(--ces-border)] bg-[var(--ces-accent)] font-medium text-[var(--ces-primary)]',
        size === 'sm' && 'px-1.5 py-0 text-[10px]',
        className,
      )}
    >
      <Shield className="size-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  )
}
