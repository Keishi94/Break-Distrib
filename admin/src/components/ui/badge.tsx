import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { StatusDot } from '@/components/bd/status-dot'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-3 text-text-2 border-border',
        ok: 'bg-ok-bg text-ok border-transparent',
        warn: 'bg-warn-bg text-warn border-transparent',
        err: 'bg-err-bg text-err border-transparent',
        info: 'bg-info-bg text-info border-transparent',
        brand: 'bg-bd-orange-50 text-bd-orange-600 border-transparent',
        ink: 'bg-text text-text-inv border-transparent',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10.5px]',
        md: 'px-2 py-[3px] text-[11.5px]',
      },
      mono: {
        true: 'font-mono tracking-[0.02em]',
        false: '',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
      mono: false,
    },
  },
)

type DotTone = 'ok' | 'warn' | 'err' | 'idle'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({
  className,
  tone,
  size,
  mono,
  dot,
  children,
  ...props
}: BadgeProps) {
  const dotTone: DotTone =
    tone === 'ok' || tone === 'warn' || tone === 'err' ? tone : 'idle'
  return (
    <span className={cn(badgeVariants({ tone, size, mono }), className)} {...props}>
      {dot && <StatusDot tone={dotTone} size={6} pulse={false} />}
      {children}
    </span>
  )
}
