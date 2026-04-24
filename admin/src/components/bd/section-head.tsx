import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadProps {
  title: ReactNode
  subtitle?: ReactNode
  right?: ReactNode
  className?: string
}

export function SectionHead({
  title,
  subtitle,
  right,
  className,
}: SectionHeadProps) {
  return (
    <div
      className={cn(
        'flex items-end justify-between gap-4 mb-3.5',
        className,
      )}
    >
      <div>
        <div className="text-[14.5px] font-semibold -tracking-[0.1px]">
          {title}
        </div>
        {subtitle && (
          <div className="text-text-3 text-[12.5px] mt-0.5">{subtitle}</div>
        )}
      </div>
      {right}
    </div>
  )
}
