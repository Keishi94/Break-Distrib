interface BDLoaderProps {
  size?: number
  /** Full cycle duration. Design default is 2.2s. */
  dur?: string
  color?: string
  inline?: boolean
  className?: string
  label?: string
}

/**
 * Animated brand mark: the two pause bars morph into a right-pointing play
 * triangle while rotating 720° per cycle. Derived from Spinner.html.
 */
export function BDLoader({
  size = 28,
  dur = '2.2s',
  color = 'var(--color-bd-orange)',
  inline = false,
  className,
  label = 'Chargement',
}: BDLoaderProps) {
  const keyTimes = '0; 0.10; 0.45; 0.65; 1'
  const keySplines =
    '0.5 0 0.5 1; 0.65 0 0.35 1; 0.5 0 0.5 1; 0.65 0 0.35 1'
  const barLeft =
    'M 36 26 L 44 26 L 44 74 L 36 74 Z;M 36 26 L 44 26 L 44 74 L 36 74 Z;M 32 22 L 74 50 L 74 50 L 32 78 Z;M 32 22 L 74 50 L 74 50 L 32 78 Z;M 36 26 L 44 26 L 44 74 L 36 74 Z'
  const barRight =
    'M 56 26 L 64 26 L 64 74 L 56 74 Z;M 56 26 L 64 26 L 64 74 L 56 74 Z;M 32 22 L 74 50 L 74 50 L 32 78 Z;M 32 22 L 74 50 L 74 50 L 32 78 Z;M 56 26 L 64 26 L 64 74 L 56 74 Z'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
      className={className}
      style={{
        display: inline ? 'inline-block' : 'block',
        verticalAlign: 'middle',
      }}
    >
      <g transform="rotate(0 50 50)">
        <path fill={color} d="M 36 26 L 44 26 L 44 74 L 36 74 Z">
          <animate
            attributeName="d"
            dur={dur}
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes={keyTimes}
            keySplines={keySplines}
            values={barLeft}
          />
        </path>
        <path fill={color} d="M 56 26 L 64 26 L 64 74 L 56 74 Z">
          <animate
            attributeName="d"
            dur={dur}
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes={keyTimes}
            keySplines={keySplines}
            values={barRight}
          />
        </path>
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur={dur}
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes={keyTimes}
          keySplines={keySplines}
          values="0 50 50; 0 50 50; 360 50 50; 360 50 50; 720 50 50"
        />
      </g>
    </svg>
  )
}
