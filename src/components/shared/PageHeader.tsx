import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  titleAddon?: ReactNode
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, titleAddon, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-ces-text">{title}</h1>
          {titleAddon}
        </div>
        {description ? (
          <p className="mt-1 text-sm text-ces-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  )
}
