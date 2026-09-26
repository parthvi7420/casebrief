interface StatusBadgeProps {
  status: 'hit' | 'idle'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'hit') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-1 rounded">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        HIT
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">
      <span className="w-2 h-2 rounded-full bg-gray-600" />
      IDLE
    </span>
  )
}
