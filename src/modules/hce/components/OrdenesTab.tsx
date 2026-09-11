import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDemoSession } from '@/app/DemoSessionProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { EncounterWithPatient } from '@/data/types'
import { formatDateTime } from '@/lib/dates'
import { OrderStatusBadge } from '@/modules/hce/components/OrderStatusBadge'

interface OrdenesTabProps {
  encounter: EncounterWithPatient
  onCreateMedication: () => Promise<void>
  onCreateLab: () => Promise<void>
}

export function OrdenesTab({
  encounter,
  onCreateMedication,
  onCreateLab,
}: OrdenesTabProps) {
  const navigate = useNavigate()
  const { setRole } = useDemoSession()
  const [creating, setCreating] = useState<'med' | 'lab' | null>(null)
  const hasRx = encounter.orders.some((order) => order.id === 'rx-001')

  const handleGoToPharmacy = () => {
    setRole('Farmacia')
    navigate('/app/farmacia/ordenes')
  }

  const handleMedication = async () => {
    setCreating('med')
    try {
      await onCreateMedication()
    } finally {
      setCreating(null)
    }
  }

  const handleLab = async () => {
    setCreating('lab')
    try {
      await onCreateLab()
    } finally {
      setCreating(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle>Órdenes médicas</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleMedication}
              disabled={creating !== null}
            >
              {creating === 'med' ? 'Creando…' : 'Recetar Paracetamol'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleLab}
              disabled={creating !== null}
            >
              {creating === 'lab' ? 'Creando…' : 'Ordenar hemograma'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {encounter.orders.length === 0 ? (
            <p className="text-sm text-ces-muted">No hay órdenes registradas para este encuentro.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encounter.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{order.description}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-ces-muted">{formatDateTime(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {hasRx ? (
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={handleGoToPharmacy}>
            Ir a Farmacia
          </Button>
        </div>
      ) : null}
    </div>
  )
}
