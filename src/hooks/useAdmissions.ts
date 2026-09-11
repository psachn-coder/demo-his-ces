import { useCallback, useEffect, useState } from 'react'

import type { AdmissionNote, Bed } from '@/data/types'
import {
  addAdmissionNote,
  createAdmission,
  dischargeAdmission,
  ensureDemoAdmission,
  getAdmissionById,
  getAdmissionNotes,
  getBeds,
  getLibreBeds,
  type AddAdmissionNoteInput,
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

export function useAdmission(admissionId: string | undefined, options?: { ensureDemo?: boolean }) {
  const ensureDemo = options?.ensureDemo ?? false
  const [admission, setAdmission] = useState<AdmissionWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!admissionId) {
      setAdmission(null)
      setError('Falta el ID de ingreso.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    if (ensureDemo) {
      const ensured = await ensureDemoAdmission()
      if (!ensured.ok) {
        setError(ensured.error.message)
        setAdmission(null)
        setLoading(false)
        return
      }
    }

    const result = await getAdmissionById(admissionId)
    if (result.ok) {
      setAdmission(result.data)
    } else {
      setError(result.error.message)
      setAdmission(null)
    }
    setLoading(false)
  }, [admissionId, ensureDemo])

  useEffect(() => {
    let cancelled = false

    async function fetchAdmission() {
      if (!admissionId) {
        setAdmission(null)
        setError('Falta el ID de ingreso.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      if (ensureDemo) {
        const ensured = await ensureDemoAdmission()
        if (cancelled) return
        if (!ensured.ok) {
          setError(ensured.error.message)
          setAdmission(null)
          setLoading(false)
          return
        }
      }

      const result = await getAdmissionById(admissionId)
      if (cancelled) return
      if (result.ok) {
        setAdmission(result.data)
      } else {
        setError(result.error.message)
        setAdmission(null)
      }
      setLoading(false)
    }

    fetchAdmission()
    return () => {
      cancelled = true
    }
  }, [admissionId, ensureDemo])

  return { admission, loading, error, retry: load, setAdmission }
}

export function useAdmissionNotes(admissionId: string | undefined) {
  const [notes, setNotes] = useState<AdmissionNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!admissionId) {
      setNotes([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    const result = await getAdmissionNotes(admissionId)
    if (result.ok) {
      setNotes(result.data)
    } else {
      setError(result.error.message)
      setNotes([])
    }
    setLoading(false)
  }, [admissionId])

  useEffect(() => {
    let cancelled = false

    async function fetchNotes() {
      if (!admissionId) {
        setNotes([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const result = await getAdmissionNotes(admissionId)
      if (cancelled) return
      if (result.ok) {
        setNotes(result.data)
      } else {
        setError(result.error.message)
        setNotes([])
      }
      setLoading(false)
    }

    fetchNotes()
    return () => {
      cancelled = true
    }
  }, [admissionId])

  const addNote = useCallback(
    async (input: AddAdmissionNoteInput): Promise<AdmissionNote> => {
      if (!admissionId) {
        throw new Error('Falta el ID de ingreso.')
      }
      setSaving(true)
      try {
        const result = await addAdmissionNote(admissionId, input)
        if (!result.ok) {
          throw new Error(result.error.message)
        }
        setNotes((prev) => [...prev, result.data])
        return result.data
      } finally {
        setSaving(false)
      }
    },
    [admissionId],
  )

  return { notes, loading, error, saving, retry: load, addNote }
}

export function useDischargeAdmission() {
  const [submitting, setSubmitting] = useState(false)

  const discharge = useCallback(async (admissionId: string): Promise<AdmissionWithDetails> => {
    setSubmitting(true)
    try {
      const result = await dischargeAdmission(admissionId)
      if (!result.ok) {
        throw new Error(result.error.message)
      }
      return result.data
    } finally {
      setSubmitting(false)
    }
  }, [])

  return { submitting, discharge }
}
