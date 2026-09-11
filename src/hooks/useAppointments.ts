import { useCallback, useEffect, useState } from 'react'

import type { Appointment } from '@/data/types'
import { addAppointment, getAppointmentsWithErrorCheck } from '@/lib/api/appointments'

export function useAppointments(date: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getAppointmentsWithErrorCheck({ date })
    if (result.ok) {
      setAppointments(result.data)
    } else {
      setError(result.error.message)
      setAppointments([])
    }
    setLoading(false)
  }, [date])

  useEffect(() => {
    let cancelled = false

    async function fetchAppointments() {
      setLoading(true)
      setError(null)
      const result = await getAppointmentsWithErrorCheck({ date })
      if (cancelled) return

      if (result.ok) {
        setAppointments(result.data)
      } else {
        setError(result.error.message)
        setAppointments([])
      }
      setLoading(false)
    }

    fetchAppointments()
    return () => {
      cancelled = true
    }
  }, [date])

  const createAppointment = useCallback(
    async (appointment: Omit<Appointment, 'id'>) => {
      const result = await addAppointment(appointment)
      if (result.ok) {
        if (datePart(result.data.scheduledAt) === date) {
          setAppointments((prev) =>
            [...prev, result.data].sort(
              (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
            ),
          )
        }
        return result.data
      }
      throw new Error(result.error.message)
    },
    [date],
  )

  return { appointments, loading, error, retry: load, createAppointment }
}

function datePart(iso: string): string {
  return iso.slice(0, 10)
}
