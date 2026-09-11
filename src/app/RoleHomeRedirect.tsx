import { Navigate } from 'react-router-dom'

import { useDemoSession } from '@/app/DemoSessionProvider'
import { ROLE_HOME } from '@/app/navigation'

export function RoleHomeRedirect() {
  const { role } = useDemoSession()
  return <Navigate to={ROLE_HOME[role]} replace />
}
