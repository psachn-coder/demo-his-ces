import { useCallback, useEffect, useState } from 'react'

import type { Bed } from '@/data/types'
import {
  createAdmission,
  getBeds,
  getLibreBeds,
  type AdmissionWithDetails,
  type BedWithDetails,
  type CreateAdmissionInput,
} from '@/lib/api/admissions'

export function useBeds() {
  const [beds, setBeds] = useState<BedWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getBeds()
    if (result.ok) {
      setBeds(result.data)
    } else {
      setError(result.error.message)
      setBeds([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchBeds() {
      setLoading(true)
      setError(null)
      const result = await getBeds()
      if (cancelled) return
      if (result.ok) {
        setBeds(result.data)
      } else {
        setError(result.error.message)
        setBeds([])
      }
      setLoading(false)
    }

    fetchBeds()
    return () => {
      cancelled = true
    }
  }, [])

  return { beds, loading, error, retry: load }
}

export function useLibreBeds() {
  const [beds, setBeds] = useState<Bed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getLibreBeds()
    if (result.ok) {
      setBeds(result.data)
    } else {
      setError(result.error.message)
      setBeds([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchLibre() {
      setLoading(true)
      setError(null)
      const result = await getLibreBeds()
      if (cancelled) return
      if (result.ok) {
        setBeds(result.data)
      } else {
        setError(result.error.message)
        setBeds([])
      }
      setLoading(false)
    }

    fetchLibre()
    return () => {
      cancelled = true
    }
  }, [])

  return { beds, loading, error, retry: load }
}

export function useCreateAdmission() {
  const [submitting, setSubmitting] = useState(false)

  const submit = useCallback(async (input: CreateAdmissionInput): Promise<AdmissionWithDetails> => {
    setSubmitting(true)
    try {
      const result = await createAdmission(input)
      if (!result.ok) {
        throw new Error(result.error.message)
      }
      return result.data
    } finally {
      setSubmitting(false)
    }
  }, [])

  return { submitting, submit }
}
