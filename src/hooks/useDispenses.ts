import { useCallback, useEffect, useState } from 'react'

import type { DispenseWithDetails } from '@/data/types'
import { fulfillDispense, getDispenses } from '@/lib/api/pharmacy'

export function useDispenses() {
  const [dispenses, setDispenses] = useState<DispenseWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fulfillingId, setFulfillingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getDispenses()
    if (result.ok) {
      setDispenses(result.data)
    } else {
      setError(result.error.message)
      setDispenses([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchDispenses() {
      setLoading(true)
      setError(null)
      const result = await getDispenses()
      if (cancelled) return

      if (result.ok) {
        setDispenses(result.data)
      } else {
        setError(result.error.message)
        setDispenses([])
      }
      setLoading(false)
    }

    fetchDispenses()
    return () => {
      cancelled = true
    }
  }, [])

  const fulfill = useCallback(async (id: string): Promise<DispenseWithDetails | null> => {
    setFulfillingId(id)
    const result = await fulfillDispense(id)
    setFulfillingId(null)

    if (result.ok) {
      setDispenses((prev) =>
        prev.map((dispense) => (dispense.id === id ? result.data : dispense)),
      )
      return result.data
    }

    throw new Error(result.error.message)
  }, [])

  return { dispenses, loading, error, fulfillingId, retry: load, fulfill }
}
