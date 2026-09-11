import type { StaffRole } from '@/data/types'
import { DEMO_ADMISSION_ID, DEMO_ENCOUNTER_ID } from '@/lib/ids'

export interface NavItem {
  label: string
  path: string
  roles: StaffRole[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Agenda',
    path: '/app/recepcion/agenda',
    roles: ['Recepción'],
  },
  {
    label: 'Ingreso',
    path: '/app/recepcion/ingreso',
    roles: ['Recepción'],
  },
  {
    label: 'Historia clínica',
    path: `/app/medico/hce/${DEMO_ENCOUNTER_ID}`,
    roles: ['Médico'],
  },
  {
    label: 'Evolución médica',
    path: `/app/medico/evolucion/${DEMO_ADMISSION_ID}`,
    roles: ['Médico'],
  },
  {
    label: 'Alta',
    path: `/app/alta/${DEMO_ADMISSION_ID}`,
    roles: ['Médico', 'Recepción', 'Enfermería'],
  },
  {
    label: 'Camas',
    path: '/app/enfermeria/camas',
    roles: ['Enfermería'],
  },
  {
    label: 'Evolución enfermería',
    path: `/app/enfermeria/evolucion/${DEMO_ADMISSION_ID}`,
    roles: ['Enfermería'],
  },
  {
    label: 'Órdenes',
    path: '/app/farmacia/ordenes',
    roles: ['Farmacia'],
  },
  {
    label: 'Cobro',
    path: `/app/caja/cobro/${DEMO_ENCOUNTER_ID}`,
    roles: ['Caja'],
  },
  {
    label: 'Factura',
    path: `/app/caja/factura/${DEMO_ADMISSION_ID}`,
    roles: ['Caja'],
  },
]

export const ROLE_HOME: Record<StaffRole, string> = {
  Recepción: '/app/recepcion/agenda',
  Médico: `/app/medico/hce/${DEMO_ENCOUNTER_ID}`,
  Enfermería: '/app/enfermeria/camas',
  Farmacia: '/app/farmacia/ordenes',
  Caja: `/app/caja/cobro/${DEMO_ENCOUNTER_ID}`,
}

export const STAFF_ROLES: StaffRole[] = [
  'Recepción',
  'Médico',
  'Enfermería',
  'Farmacia',
  'Caja',
]

export function getNavItemsForRole(role: StaffRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role))
}

const ROUTE_PERMISSIONS: { pattern: RegExp; roles: StaffRole[] }[] = [
  { pattern: /^\/app\/recepcion(?:\/|$)/, roles: ['Recepción'] },
  { pattern: /^\/app\/medico(?:\/|$)/, roles: ['Médico'] },
  { pattern: /^\/app\/enfermeria(?:\/|$)/, roles: ['Enfermería'] },
  { pattern: /^\/app\/farmacia(?:\/|$)/, roles: ['Farmacia'] },
  { pattern: /^\/app\/caja(?:\/|$)/, roles: ['Caja'] },
  { pattern: /^\/app\/alta(?:\/|$)/, roles: ['Médico', 'Recepción', 'Enfermería'] },
]

export function isRouteAllowedForRole(pathname: string, role: StaffRole): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/'

  if (normalized === '/app') return true

  const match = ROUTE_PERMISSIONS.find(({ pattern }) => pattern.test(normalized))
  if (!match) return false

  return match.roles.includes(role)
}
