interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fill?: boolean
  strokeWidth?: number
  className?: string
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = 'var(--color-bd-orange)',
  fill = true,
  strokeWidth = 1.5,
  className,
}: SparklineProps) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = Math.max(0.0001, max - min)
  const pad = 2
  const pts = data.map<[number, number]>((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2)
    const y = height - pad - ((v - min) / span) * (height - pad * 2)
    return [x, y]
  })
  const d = pts
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(' ')
  const last = pts[pts.length - 1]!
  const first = pts[0]!
  const fillD = `${d} L ${last[0]} ${height} L ${first[0]} ${height} Z`
  return (
    <svg width={width} height={height} className={className}>
      {fill && <path d={fillD} fill={color} fillOpacity="0.12" />}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  )
}
