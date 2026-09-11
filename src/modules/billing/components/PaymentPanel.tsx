import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { PaymentMethod } from '@/modules/billing/types'
import { PAYMENT_METHOD_LABELS } from '@/modules/billing/types'

interface PaymentPanelProps {
  method: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  onCobrar: () => void
  disabled: boolean
  loading: boolean
  paying: boolean
}

export function PaymentPanel({
  method,
  onMethodChange,
  onCobrar,
  disabled,
  loading,
  paying,
}: PaymentPanelProps) {
  if (loading) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-ces-surface p-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-ces-surface p-6">
      <div className="space-y-2">
        <Label htmlFor="payment-method">Método de pago</Label>
        <Select value={method} onValueChange={(value) => onMethodChange(value as PaymentMethod)}>
          <SelectTrigger id="payment-method">
            <SelectValue placeholder="Seleccione método" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((key) => (
              <SelectItem key={key} value={key}>
                {PAYMENT_METHOD_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="button" className="w-full" onClick={onCobrar} disabled={disabled || paying}>
        {paying ? 'Procesando…' : 'Cobrar'}
      </Button>
    </div>
  )
}
