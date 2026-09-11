import { useCallback, useEffect, useState } from 'react'

import type { EncounterOrder, EncounterWithPatient, SoapNote } from '@/data/types'
import {
  addEncounterNote,
  createEncounterOrder,
  getEncounter,
  type AddEncounterNoteInput,
  type CreateEncounterOrderInput,
} from '@/lib/api/encounters'

export function useEncounter(encounterId: string | undefined) {
  const [encounter, setEncounter] = useState<EncounterWithPatient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!encounterId) {
      setEncounter(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    const result = await getEncounter(encounterId)
    if (result.ok) {
      setEncounter(result.data)
    } else {
      setError(result.error.message)
      setEncounter(null)
    }
    setLoading(false)
  }, [encounterId])

  useEffect(() => {
    let cancelled = false

    async function fetchEncounter() {
      if (!encounterId) {
        setEncounter(null)
        setLoading(false)
        setError(null)
        return
      }

      setLoading(true)
      setError(null)
      const result = await getEncounter(encounterId)
      if (cancelled) return

      if (result.ok) {
        setEncounter(result.data)
      } else {
        setError(result.error.message)
        setEncounter(null)
      }
      setLoading(false)
    }

    fetchEncounter()
    return () => {
      cancelled = true
    }
  }, [encounterId])

  const saveNote = useCallback(
    async (note: AddEncounterNoteInput): Promise<SoapNote | null> => {
      if (!encounterId) return null
      const result = await addEncounterNote(encounterId, note)
      if (result.ok) {
        setEncounter((prev) =>
          prev
            ? { ...prev, notes: [...prev.notes, result.data] }
            : prev,
        )
        return result.data
      }
      throw new Error(result.error.message)
    },
    [encounterId],
  )

  const addOrder = useCallback(
    async (input: CreateEncounterOrderInput): Promise<EncounterOrder | null> => {
      if (!encounterId) return null
      const result = await createEncounterOrder(encounterId, input)
      if (result.ok) {
        setEncounter((prev) => {
          if (!prev) return prev
          const exists = prev.orders.some((order) => order.id === result.data.id)
          if (exists) return prev
          return { ...prev, orders: [...prev.orders, result.data] }
        })
        return result.data
      }
      throw new Error(result.error.message)
    },
    [encounterId],
  )

  return { encounter, loading, error, retry: load, saveNote, addOrder }
}
