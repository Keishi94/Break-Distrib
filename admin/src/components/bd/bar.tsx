import { cn } from '@/lib/utils'

type BarTone = 'ok' | 'warn' | 'err' | 'brand'

interface BarProps {
  value: number
  tone?: BarTone
  height?: number
  className?: string
}

const toneMap: Record<BarTone, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  err: 'bg-err',
  brand: 'bg-bd-orange',
}

export function Bar({
  value,
  tone = 'ok',
  height = 6,
  className,
}: BarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('bg-surface-3 rounded-full overflow-hidden', className)}
      style={{ height }}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-300 ease-[var(--ease-bd)]',
          toneMap[tone],
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
