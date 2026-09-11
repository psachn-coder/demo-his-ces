import { useCallback, useEffect, useState } from 'react'

import type { InvoiceWithPatient } from '@/lib/api/billing'
import { getInvoice, payInvoice } from '@/lib/api/billing'

export function useInvoice(encounterId: string) {
  const [invoice, setInvoice] = useState<InvoiceWithPatient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await getInvoice({ encounterId })
    if (result.ok) {
      setInvoice(result.data)
    } else {
      setError(result.error.message)
      setInvoice(null)
    }
    setLoading(false)
  }, [encounterId])

  useEffect(() => {
    let cancelled = false

    async function fetchInvoice() {
      setLoading(true)
      setError(null)
      const result = await getInvoice({ encounterId })
      if (cancelled) return

      if (result.ok) {
        setInvoice(result.data)
      } else {
        setError(result.error.message)
        setInvoice(null)
      }
      setLoading(false)
    }

    fetchInvoice()
    return () => {
      cancelled = true
    }
  }, [encounterId])

  const pay = useCallback(async (): Promise<InvoiceWithPatient | null> => {
    if (!invoice) return null

    setPaying(true)
    const result = await payInvoice(invoice.id)
    setPaying(false)

    if (result.ok) {
      setInvoice(result.data)
      return result.data
    }

    throw new Error(result.error.message)
  }, [invoice])

  return { invoice, loading, error, paying, retry: load, pay }
}
