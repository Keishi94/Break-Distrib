import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  count?: number
}

interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  tabs?: Tab[]
  activeTab?: string
  onTab?: (id: string) => void
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  actions,
  tabs,
  activeTab,
  onTab,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('px-8 pt-6', className)}>
      <div
        className={cn(
          'flex items-end justify-between gap-6',
          tabs ? 'mb-[18px]' : 'mb-5',
        )}
      >
        <div>
          <h1 className="text-[22px] font-semibold -tracking-[0.4px]">
            {title}
          </h1>
          {subtitle && (
            <div className="text-text-3 text-[13px] mt-1">{subtitle}</div>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {tabs && (
        <div className="flex gap-0.5 border-b border-border -mb-px">
          {tabs.map((t) => {
            const on = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTab?.(t.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium -mb-px transition-colors',
                  'border-b-2',
                  on
                    ? 'text-text border-bd-orange'
                    : 'text-text-3 border-transparent hover:text-text-2',
                )}
              >
                {t.label}
                {t.count !== undefined && (
                  <span className="font-mono tabular text-[11px] text-text-3">
                    {t.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}
