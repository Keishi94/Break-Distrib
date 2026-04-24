import { ArrowDown, ArrowUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Sparkline } from './sparkline'
import { cn } from '@/lib/utils'

interface KPIProps {
  label: string
  value: string | number
  unit?: string
  delta?: number
  deltaLabel?: string
  spark?: number[]
  tone?: 'neutral' | 'brand' | 'ok'
  className?: string
}

const sparkColor: Record<NonNullable<KPIProps['tone']>, string> = {
  neutral: 'var(--color-text-2)',
  brand: 'var(--color-bd-orange)',
  ok: 'var(--color-ok)',
}

export function KPI({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  spark,
  tone = 'neutral',
  className,
}: KPIProps) {
  const up = (delta ?? 0) >= 0
  return (
    <Card
      className={cn('flex flex-col gap-2.5 p-4 min-h-[126px]', className)}
    >
      <div className="label-caps">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <div className="tabular text-[28px] font-semibold -tracking-[0.8px] leading-none">
          {value}
        </div>
        {unit && <div className="text-text-3 text-[13px]">{unit}</div>}
      </div>
      <div className="flex items-center justify-between gap-2 mt-auto">
        {delta !== undefined && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 text-[12px] font-medium',
              up ? 'text-ok' : 'text-err',
            )}
          >
            {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            <span className="tabular">{Math.abs(delta)}%</span>
            {deltaLabel && (
              <span className="text-text-3 font-normal">{deltaLabel}</span>
            )}
          </div>
        )}
        {spark && (
          <Sparkline
            data={spark}
            width={96}
            height={28}
            color={sparkColor[tone]}
          />
        )}
      </div>
    </Card>
  )
}
