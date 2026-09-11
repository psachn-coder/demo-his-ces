import { useEffect, useMemo, useRef, useState } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import type { Patient } from '@/data/types'
import { useAppointments } from '@/hooks/useAppointments'
import { usePatients } from '@/hooks/usePatients'
import { toast } from '@/hooks/use-toast'
import { generateId } from '@/lib/ids'
import { AgendaFilters, type AgendaFiltersState } from '@/modules/appointments/components/AgendaFilters'
import { AppointmentsTable } from '@/modules/appointments/components/AppointmentsTable'
import {
  NewAppointmentSheet,
  type NewAppointmentFormValues,
} from '@/modules/appointments/components/NewAppointmentSheet'
import { PatientDetailSheet } from '@/modules/appointments/components/PatientDetailSheet'
import {
  enrichAppointments,
  filterAppointments,
  todayIsoDate,
} from '@/modules/appointments/utils'

export function AgendaPage() {
  const [filters, setFilters] = useState<AgendaFiltersState>({
    date: todayIsoDate(),
    specialty: 'all',
    physician: 'all',
    patientSearch: '',
  })
  const [newSheetOpen, setNewSheetOpen] = useState(false)
  const [patientSheetOpen, setPatientSheetOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [extraPatients, setExtraPatients] = useState<Patient[]>([])

  const { patients, loading: patientsLoading } = usePatients()
  const { appointments, loading, error, retry, createAppointment } = useAppointments(filters.date)

  const allPatients = useMemo(
    () => [...patients, ...extraPatients],
    [patients, extraPatients],
  )

  const enrichedRows = useMemo(
    () => enrichAppointments(appointments, allPatients),
    [appointments, allPatients],
  )

  const filteredRows = useMemo(
    () =>
      filterAppointments(enrichedRows, {
        specialty: filters.specialty,
        physician: filters.physician,
        patientSearch: filters.patientSearch,
      }),
    [enrichedRows, filters.specialty, filters.physician, filters.patientSearch],
  )

  const selectedPatient = useMemo(
    () => allPatients.find((patient) => patient.id === selectedPatientId) ?? null,
    [allPatients, selectedPatientId],
  )

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId)
    setPatientSheetOpen(true)
  }

  const handleCreateAppointment = async (values: NewAppointmentFormValues) => {
    const existing = allPatients.find((patient) => patient.documentId === values.documentId.trim())
    let patientId = existing?.id

    if (!patientId) {
      const [firstName, ...rest] = values.patientName.trim().split(' ')
      const lastName = rest.join(' ') || '—'
      const newPatient: Patient = {
        id: generateId('pat'),
        firstName,
        lastName,
        documentId: values.documentId.trim(),
        birthDate: '1990-01-01',
      }
      patientId = newPatient.id
      setExtraPatients((prev) => [...prev, newPatient])
    }

    const created = await createAppointment({
      patientId,
      scheduledAt: `${values.date}T${values.time}:00-05:00`,
      status: 'Programada',
      specialty: values.specialty,
      physicianName: values.physicianName,
    })

    toast({
      title: 'Demo · no persistido',
      description: 'La cita se agregó en memoria para esta sesión.',
    })

    return created
  }

  const handleRetry = () => {
    retry()
  }

  const lastErrorRef = useRef<string | null>(null)
  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error
      toast({
        variant: 'destructive',
        title: 'Error al cargar la agenda',
        description: error,
      })
    }
    if (!error) {
      lastErrorRef.current = null
    }
  }, [error])

  const showEmpty = !loading && !error && filteredRows.length === 0
  const isToday = filters.date === todayIsoDate()
  const hasActiveFilters =
    filters.specialty !== 'all' ||
    filters.physician !== 'all' ||
    filters.patientSearch.trim() !== ''

  const emptyMessage = isToday && !hasActiveFilters
    ? 'No hay citas para este día.'
    : 'No hay citas que coincidan con los filtros seleccionados.'

  return (
    <>
      <PageHeader
        title="Agenda del día"
        description="Citas programadas y confirmadas para recepción."
        actions={
          <Button type="button" onClick={() => setNewSheetOpen(true)}>
            Nueva cita
          </Button>
        }
      />

      <div className="space-y-4">
        <AgendaFilters filters={filters} onChange={setFilters} />

        {error ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-ces-surface px-6 py-8">
            <p className="text-sm text-ces-muted">No se pudo cargar la agenda.</p>
            <Button type="button" variant="outline" size="sm" onClick={handleRetry}>
              Reintentar
            </Button>
          </div>
        ) : showEmpty ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-ces-surface px-6 py-12 text-center">
            <p className="text-sm text-ces-muted">{emptyMessage}</p>
            <Button type="button" onClick={() => setNewSheetOpen(true)}>
              Nueva cita
            </Button>
          </div>
        ) : (
          <AppointmentsTable
            rows={filteredRows}
            loading={loading || patientsLoading}
            onViewPatient={handleViewPatient}
          />
        )}
      </div>

      <NewAppointmentSheet
        open={newSheetOpen}
        onOpenChange={setNewSheetOpen}
        defaultDate={filters.date}
        onSubmit={handleCreateAppointment}
      />

      <PatientDetailSheet
        open={patientSheetOpen}
        onOpenChange={setPatientSheetOpen}
        patient={selectedPatient}
        loading={patientsLoading}
      />
    </>
  )
}
