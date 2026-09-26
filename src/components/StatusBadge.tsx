interface StatusBadgeProps {
  status: 'hit' | 'idle'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'hit') {
    return (
      <span className="cb-badge cb-badge-hit">
        <span className="w-1.5 h-1.5 rounded-full bg-cb-primary animate-pulse" />
        HIT
      </span>
    )
  }

  return (
    <span className="cb-badge cb-badge-idle">
      <span className="w-1.5 h-1.5 rounded-full bg-cb-muted" />
      IDLE
    </span>
  )
}

