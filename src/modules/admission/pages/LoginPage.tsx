import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-ces-bg px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-ces-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ces-primary text-sm font-bold text-white"
            aria-hidden="true"
          >
            CES
          </div>
          <h1 className="text-2xl font-semibold text-ces-text">C.E.S.</h1>
          <p className="mt-1 text-sm text-ces-muted">
            Clínica de Especialidades Sur · Quito Sur
          </p>
          <Badge variant="muted" className="mt-3">
            Demo · datos ficticios
          </Badge>
        </div>

        <Separator className="my-6" />

        <p className="mb-6 text-center text-sm text-ces-muted">
          Acceso de demostración sin autenticación real. Seleccione su perfil al ingresar.
        </p>

        <Button className="w-full" onClick={() => navigate('/app')}>
          Entrar al sistema
        </Button>
      </div>
    </div>
  )
}
