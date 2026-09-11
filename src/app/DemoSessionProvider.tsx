import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { isRouteAllowedForRole, ROLE_HOME } from '@/app/navigation'
import type { StaffRole } from '@/data/types'

const STORAGE_KEY = 'ces-demo-role'

interface DemoSessionContextValue {
  role: StaffRole
  setRole: (role: StaffRole) => void
}

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null)

function readStoredRole(): StaffRole {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (
    stored === 'Recepción' ||
    stored === 'Médico' ||
    stored === 'Enfermería' ||
    stored === 'Farmacia' ||
    stored === 'Caja'
  ) {
    return stored
  }
  return 'Recepción'
}

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<StaffRole>(readStoredRole)
  const navigate = useNavigate()
  const location = useLocation()

  const setRole = useCallback(
    (nextRole: StaffRole) => {
      setRoleState(nextRole)
      localStorage.setItem(STORAGE_KEY, nextRole)

      if (!isRouteAllowedForRole(location.pathname, nextRole)) {
        navigate(ROLE_HOME[nextRole], { replace: true })
      }
    },
    [location.pathname, navigate],
  )

  useEffect(() => {
    if (!isRouteAllowedForRole(location.pathname, role)) {
      navigate(ROLE_HOME[role], { replace: true })
    }
  }, [location.pathname, role, navigate])

  const value = useMemo(() => ({ role, setRole }), [role, setRole])

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>
}

export function useDemoSession(): DemoSessionContextValue {
  const ctx = useContext(DemoSessionContext)
  if (!ctx) {
    throw new Error('useDemoSession must be used within DemoSessionProvider')
  }
  return ctx
}
