interface BDMarkProps {
  size?: number
  color?: string
  className?: string
}

export function BDMark({
  size = 22,
  color = 'var(--color-bd-orange)',
  className,
}: BDMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
    >
      <rect x="34" y="22" width="10" height="56" rx="1.5" fill={color} />
      <rect x="56" y="22" width="10" height="56" rx="1.5" fill={color} />
    </svg>
  )
}
