import { cn } from '@/lib/utils'

type Tone = 'ok' | 'warn' | 'err' | 'idle'

interface StatusDotProps {
  tone?: Tone
  size?: number
  pulse?: boolean
  className?: string
}

const toneMap: Record<Tone, { bg: string; anim: string | null }> = {
  ok: { bg: 'bg-ok', anim: 'pulse-ok' },
  warn: { bg: 'bg-warn', anim: 'pulse-warn' },
  err: { bg: 'bg-err', anim: 'pulse-err' },
  idle: { bg: 'bg-n-400', anim: null },
}

export function StatusDot({
  tone = 'ok',
  size = 8,
  pulse = true,
  className,
}: StatusDotProps) {
  const { bg, anim } = toneMap[tone]
  return (
    <span
      className={cn('inline-block rounded-full shrink-0', bg, className)}
      style={{
        width: size,
        height: size,
        animation: pulse && anim ? `${anim} 1.8s ease-out infinite` : undefined,
      }}
    />
  )
}
