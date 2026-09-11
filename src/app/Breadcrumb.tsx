import { Link, useLocation } from 'react-router-dom'

interface BreadcrumbCrumb {
  path: string
  label: string
  isLast: boolean
}

const HCE_BREADCRUMBS: BreadcrumbCrumb[] = [
  { path: '/app', label: 'App', isLast: false },
  { path: '/app/medico/hce', label: 'HCE', isLast: true },
]

const ROUTE_BREADCRUMBS: Record<string, BreadcrumbCrumb[]> = {
  '/app/recepcion/agenda': [
    { path: '/app', label: 'App', isLast: false },
    { path: '/app/recepcion/agenda', label: 'Agenda', isLast: true },
  ],
}

const SEGMENT_LABELS: Record<string, string> = {
  app: 'App',
  recepcion: 'Recepción',
  agenda: 'Agenda',
  ingreso: 'Ingreso',
  medico: 'Médico',
  hce: 'Historia clínica',
  evolucion: 'Evolución',
  enfermeria: 'Enfermería',
  camas: 'Camas',
  farmacia: 'Farmacia',
  ordenes: 'Órdenes',
  caja: 'Caja',
  cobro: 'Cobro',
  factura: 'Factura',
  alta: 'Alta',
}

function labelForSegment(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment
}

function crumbsFromPath(pathname: string): BreadcrumbCrumb[] {
  if (ROUTE_BREADCRUMBS[pathname]) {
    return ROUTE_BREADCRUMBS[pathname]
  }

  const normalized = pathname.replace(/\/$/, '') || '/'
  if (normalized === '/app/medico/hce' || /^\/app\/medico\/hce\/[^/]+$/.test(normalized)) {
    return HCE_BREADCRUMBS
  }

  const segments = pathname.split('/').filter(Boolean)
  return segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1
    const label = labelForSegment(segment)
    return { path, label, isLast }
  })
}

export function Breadcrumb() {
  const { pathname } = useLocation()
  const crumbs = crumbsFromPath(pathname)

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-ces-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-1">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {crumb.isLast ? (
              <span aria-current="page" className="font-medium text-ces-text">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="rounded-sm text-ces-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
