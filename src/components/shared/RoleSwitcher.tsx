import { ChevronDown, UserCircle2 } from 'lucide-react'

import { useDemoSession } from '@/app/DemoSessionProvider'
import { STAFF_ROLES } from '@/app/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function RoleSwitcher() {
  const { role, setRole } = useDemoSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Rol actual: ${role}. Abrir selector de rol`}
          aria-haspopup="menu"
        >
          <UserCircle2 aria-hidden="true" />
          <span>{role}</span>
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label="Selector de rol de demostración">
        <DropdownMenuLabel>Perfil de demostración</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={role} onValueChange={(value) => setRole(value as typeof role)}>
          {STAFF_ROLES.map((staffRole) => (
            <DropdownMenuRadioItem key={staffRole} value={staffRole}>
              {staffRole}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
