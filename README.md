# Demo HIS — C.E.S.

Front-only clinical demo for **Clínica de Especialidades Sur · Quito Sur**. React + Vite shell with role-based navigation, mock data, and no real backend.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use **Entrar al sistema** on `/login`, then switch roles from the top bar.

## Build

```bash
npm run build        # local / production (base: /)
npm run build:pages  # GitHub Pages (base: /demo-his-ces/)
```

## Demo roles

| Rol | Home route | Sidebar |
|-----|------------|---------|
| Recepción | `/app/recepcion/agenda` | Agenda, Ingreso, Alta |
| Médico | `/app/medico/hce` | Historia clínica, Evolución, Alta |
| Enfermería | `/app/enfermeria/camas` | Camas, Evolución enfermería |
| Farmacia | `/app/farmacia/ordenes` | Órdenes |
| Caja | `/app/caja/cobro` | Cobro, Factura |

Changing role updates the sidebar instantly and redirects if the current route is not allowed for that role.

## P0 routes

```
/login
/app
/app/recepcion/agenda
/app/recepcion/ingreso
/app/medico/hce/:encounterId?
/app/medico/evolucion/:admissionId
/app/enfermeria/camas
/app/enfermeria/evolucion/:admissionId
/app/farmacia/ordenes
/app/caja/cobro/:encounterId?
/app/caja/factura/:admissionId
/app/alta/:admissionId
```

## Folder structure

```
src/
  app/                 # shell, providers, router
  modules/
    admission/
    appointments/
    hce/
    hospitalization/
    pharmacy/
    billing/
  components/ui/       # shadcn/ui primitives
  components/shared/     # PatientCard, StatusBadge, RoleSwitcher, PageHeader, DataTable
  data/                # JSON seeds + types.ts
  lib/                 # formatters, dates, ids + api/ mock port
  hooks/
```

Each module contains `pages/`, `components/`, and `types.ts`.

## Mock data & API

- Seeds live in `src/data/` (e.g. `patients.json` with `pat-001` María Fernanda Quishpe).
- Hooks call `src/lib/api/` ports (`ApiResult<T>`, `ApiError`) — never import JSON directly from UI code.

## Locale

UI helpers use `es-EC`: dates `dd/MM/yyyy`, 24-hour time, currency `USD` with 2 decimals.

## GitHub Pages ($0 deploy)

1. In repo **Settings → Pages**, set source to **GitHub Actions** or deploy the `dist/` folder from the `build:pages` artifact.
2. The Vite `base` is `/demo-his-ces/` when `GITHUB_PAGES=true` (see `vite.config.ts`).
3. Build for Pages: `npm run build:pages`
4. Preview locally with Pages base: `npm run preview:pages`

Published URL: `https://<user>.github.io/demo-his-ces/`

## Branching

- `main` — stable scaffold
- `develop` — integration branch (created from scaffold tip)

## Stack

- React 18 + Vite + TypeScript
- React Router
- Tailwind CSS v4 + shadcn/ui (Button, Badge, Separator, Avatar, DropdownMenu, Skeleton)
