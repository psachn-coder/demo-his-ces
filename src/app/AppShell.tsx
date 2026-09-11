import { NavLink, Outlet } from 'react-router-dom'

import { Breadcrumb } from '@/app/Breadcrumb'
import { useDemoSession } from '@/app/DemoSessionProvider'
import { getNavItemsForRole } from '@/app/navigation'
import { RoleSwitcher } from '@/components/shared/RoleSwitcher'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { role } = useDemoSession()
  const navItems = getNavItemsForRole(role)

  return (
    <div className="flex min-h-screen flex-col bg-ces-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-ces-surface">
        <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ces-primary text-sm font-bold text-white"
              aria-hidden="true"
            >
              CES
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ces-text">C.E.S.</p>
              <p className="hidden truncate text-xs text-ces-muted sm:block">
                Clínica de Especialidades Sur · Quito Sur
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Badge variant="muted" className="hidden sm:inline-flex">
              Demo · datos ficticios
            </Badge>
            <RoleSwitcher />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className="hidden w-56 shrink-0 border-r border-border bg-ces-surface md:block"
          aria-label="Navegación principal"
        >
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-ces-primary text-white'
                      : 'text-ces-text hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="border-b border-border bg-ces-surface px-4 py-2 md:hidden">
            <nav className="flex gap-2 overflow-x-auto" aria-label="Navegación móvil">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive
                        ? 'bg-ces-primary text-white'
                        : 'bg-muted text-ces-text',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
            <Breadcrumb />
            <Separator className="mb-6" />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
