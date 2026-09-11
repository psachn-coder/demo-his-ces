import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Appointment } from '@/data/types'
import { PHYSICIANS, SPECIALTIES } from '@/modules/appointments/constants'

export interface NewAppointmentFormValues {
  patientName: string
  documentId: string
  date: string
  time: string
  specialty: string
  physicianName: string
}

interface NewAppointmentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate: string
  onSubmit: (values: NewAppointmentFormValues) => Promise<Appointment>
}

const EMPTY_FORM: NewAppointmentFormValues = {
  patientName: '',
  documentId: '',
  date: '',
  time: '',
  specialty: '',
  physicianName: '',
}

export function NewAppointmentSheet({
  open,
  onOpenChange,
  defaultDate,
  onSubmit,
}: NewAppointmentSheetProps) {
  const [form, setForm] = useState<NewAppointmentFormValues>({
    ...EMPTY_FORM,
    date: defaultDate,
  })
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setForm({ ...EMPTY_FORM, date: defaultDate })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  const updateField = <K extends keyof NewAppointmentFormValues>(
    key: K,
    value: NewAppointmentFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const isValid =
    form.patientName.trim() &&
    form.documentId.trim() &&
    form.date &&
    form.time &&
    form.specialty &&
    form.physicianName

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isValid || submitting) return

    setSubmitting(true)
    try {
      await onSubmit(form)
      handleOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Nueva cita</SheetTitle>
          <SheetDescription>Registre una cita para el día seleccionado.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-apt-patient">Paciente (nombre)</Label>
            <Input
              id="new-apt-patient"
              value={form.patientName}
              onChange={(event) => updateField('patientName', event.target.value)}
              placeholder="Nombre completo"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-apt-document">Cédula</Label>
            <Input
              id="new-apt-document"
              value={form.documentId}
              onChange={(event) => updateField('documentId', event.target.value)}
              placeholder="1712345678"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-apt-date">Fecha</Label>
              <Input
                id="new-apt-date"
                type="date"
                value={form.date}
                onChange={(event) => updateField('date', event.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-apt-time">Hora</Label>
              <Input
                id="new-apt-time"
                type="time"
                value={form.time}
                onChange={(event) => updateField('time', event.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-apt-specialty">Especialidad</Label>
            <Select value={form.specialty} onValueChange={(value) => updateField('specialty', value)}>
              <SelectTrigger id="new-apt-specialty">
                <SelectValue placeholder="Seleccione especialidad" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-apt-physician">Médico</Label>
            <Select
              value={form.physicianName}
              onValueChange={(value) => updateField('physicianName', value)}
            >
              <SelectTrigger id="new-apt-physician">
                <SelectValue placeholder="Seleccione médico" />
              </SelectTrigger>
              <SelectContent>
                {PHYSICIANS.map((physician) => (
                  <SelectItem key={physician} value={physician}>
                    {physician}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || submitting}>
              Guardar cita
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
