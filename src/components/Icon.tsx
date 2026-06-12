import iconSet from '@/lib/icon-set.json'

const ICONS: Record<string, { bg: string; fg: string }> = iconSet

/**
 * Two-tone Phosphor icon: the "fg" shape in full `color`, the "bg" shape
 * in the same `color` at low opacity — gives icons depth instead of a flat silhouette.
 */
export function Icon({ name, size = 24, color = 'currentColor', className, style }: { name?: string | null; size?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  const icon = name ? ICONS[name] : null
  if (!icon) return null
  return (
    <svg viewBox="0 0 256 256" width={size} height={size} className={className} style={{ flexShrink: 0, ...style }}>
      {icon.bg && <path d={icon.bg} fill={color} opacity={0.3} />}
      {icon.fg && <path d={icon.fg} fill={color} />}
    </svg>
  )
}

/** Icon rendered inside a white circular badge, colored with `color` — for feature/day cards. */
export function IconBadge({ name, color, size = 26, badgeSize, className, style }: { name?: string | null; color: string; size?: number; badgeSize?: number; className?: string; style?: React.CSSProperties }) {
  const icon = name ? ICONS[name] : null
  if (!icon) return null
  const dim = badgeSize ?? Math.round(size * 1.7)
  return (
    <div
      className={className}
      style={{
        width: dim, height: dim, borderRadius: '50%', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,.12)',
        ...style,
      }}
    >
      <Icon name={name} size={size} color={color} />
    </div>
  )
}
