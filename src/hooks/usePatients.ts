import { useEffect, useState } from 'react'

import type { Patient } from '@/data/types'
import { getPatients } from '@/lib/api'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const result = await getPatients()
      if (cancelled) return

      if (result.ok) {
        setPatients(result.data)
        setError(null)
      } else {
        setError(result.error.message)
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { patients, loading, error }
}
