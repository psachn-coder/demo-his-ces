import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatPatientName } from '@/lib/formatters'
import { formatTime } from '@/lib/dates'
import type { AppointmentRow } from '@/modules/appointments/utils'

interface AppointmentsTableProps {
  rows: AppointmentRow[]
  loading: boolean
  onViewPatient: (patientId: string) => void
}

export function AppointmentsTable({ rows, loading, onViewPatient }: AppointmentsTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-ces-surface" aria-busy="true">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Hora</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead className="hidden sm:table-cell">Cédula</TableHead>
              <TableHead className="hidden md:table-cell">Especialidad</TableHead>
              <TableHead className="hidden lg:table-cell">Médico</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-28 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-36" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="ml-auto h-8 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-ces-surface">
      <Table>
        <caption className="sr-only">Citas del día</caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Hora</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead className="hidden sm:table-cell">Cédula</TableHead>
            <TableHead className="hidden md:table-cell">Especialidad</TableHead>
            <TableHead className="hidden lg:table-cell">Médico</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-28 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const patient = row.patient
            const patientName = patient
              ? formatPatientName(patient.firstName, patient.lastName)
              : '—'

            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium tabular-nums">
                  {formatTime(row.scheduledAt)}
                </TableCell>
                <TableCell>{patientName}</TableCell>
                <TableCell className="hidden sm:table-cell tabular-nums">
                  {patient?.documentId ?? '—'}
                </TableCell>
                <TableCell className="hidden md:table-cell">{row.specialty}</TableCell>
                <TableCell className="hidden lg:table-cell">{row.physicianName}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!patient}
                    onClick={() => onViewPatient(row.patientId)}
                  >
                    Ver paciente
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
