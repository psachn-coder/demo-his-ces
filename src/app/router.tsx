import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppShell } from '@/app/AppShell'
import { DemoSessionProvider } from '@/app/DemoSessionProvider'
import { RoleHomeRedirect } from '@/app/RoleHomeRedirect'
import { LoginPage } from '@/modules/admission/pages/LoginPage'
import { AgendaPage } from '@/modules/appointments/pages/AgendaPage'
import { IngresoPage } from '@/modules/admission/pages/IngresoPage'
import { HcePage } from '@/modules/hce/pages/HcePage'
import { MedicoEvolucionPage } from '@/modules/hce/pages/MedicoEvolucionPage'
import { CamasPage } from '@/modules/hospitalization/pages/CamasPage'
import { EnfermeriaEvolucionPage } from '@/modules/hospitalization/pages/EnfermeriaEvolucionPage'
import { OrdenesPage } from '@/modules/pharmacy/pages/OrdenesPage'
import { CobroPage } from '@/modules/billing/pages/CobroPage'
import { FacturaPage } from '@/modules/billing/pages/FacturaPage'
import { AltaPage } from '@/modules/hospitalization/pages/AltaPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/app" replace />,
  },
  {
    path: '/app',
    element: (
      <DemoSessionProvider>
        <AppShell />
      </DemoSessionProvider>
    ),
    children: [
      {
        index: true,
        element: <RoleHomeRedirect />,
      },
      {
        path: 'recepcion/agenda',
        element: <AgendaPage />,
      },
      {
        path: 'recepcion/ingreso',
        element: <IngresoPage />,
      },
      {
        path: 'medico/hce/:encounterId?',
        element: <HcePage />,
      },
      {
        path: 'medico/evolucion/:admissionId',
        element: <MedicoEvolucionPage />,
      },
      {
        path: 'enfermeria/camas',
        element: <CamasPage />,
      },
      {
        path: 'enfermeria/evolucion/:admissionId',
        element: <EnfermeriaEvolucionPage />,
      },
      {
        path: 'farmacia/ordenes',
        element: <OrdenesPage />,
      },
      {
        path: 'caja/cobro/:encounterId?',
        element: <CobroPage />,
      },
      {
        path: 'caja/factura/:admissionId',
        element: <FacturaPage />,
      },
      {
        path: 'alta/:admissionId',
        element: <AltaPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/app" replace />,
  },
], {
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined,
})
