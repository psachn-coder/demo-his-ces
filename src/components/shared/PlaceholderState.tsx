import { FileSearch } from 'lucide-react'

interface PlaceholderStateProps {
  title: string
  description: string
}

export function PlaceholderState({ title, description }: PlaceholderStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-ces-surface px-6 py-16 text-center"
      role="status"
    >
      <FileSearch className="mb-4 h-10 w-10 text-ces-muted" aria-hidden="true" />
      <h2 className="text-lg font-medium text-ces-text">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-ces-muted">{description}</p>
    </div>
  )
}
