import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PHYSICIANS, SPECIALTIES } from '@/modules/appointments/constants'

export interface AgendaFiltersState {
  date: string
  specialty: string
  physician: string
  patientSearch: string
}

interface AgendaFiltersProps {
  filters: AgendaFiltersState
  onChange: (filters: AgendaFiltersState) => void
}

export function AgendaFilters({ filters, onChange }: AgendaFiltersProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-border bg-ces-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-1.5">
        <Label htmlFor="agenda-date">Fecha</Label>
        <Input
          id="agenda-date"
          type="date"
          value={filters.date}
          onChange={(event) => onChange({ ...filters, date: event.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="agenda-specialty">Especialidad</Label>
        <Select
          value={filters.specialty}
          onValueChange={(value) => onChange({ ...filters, specialty: value })}
        >
          <SelectTrigger id="agenda-specialty">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {SPECIALTIES.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="agenda-physician">Médico</Label>
        <Select
          value={filters.physician}
          onValueChange={(value) => onChange({ ...filters, physician: value })}
        >
          <SelectTrigger id="agenda-physician">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {PHYSICIANS.map((physician) => (
              <SelectItem key={physician} value={physician}>
                {physician}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="agenda-patient-search">Buscar paciente</Label>
        <Input
          id="agenda-patient-search"
          type="search"
          placeholder="Nombre o cédula"
          value={filters.patientSearch}
          onChange={(event) => onChange({ ...filters, patientSearch: event.target.value })}
        />
      </div>
    </div>
  )
}
