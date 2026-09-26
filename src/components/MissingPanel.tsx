import { Gap } from '../types/incident'

interface MissingPanelProps {
  gaps: Gap[]
}

export default function MissingPanel({ gaps }: MissingPanelProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Missing Information</h2>
      <p className="text-gray-400 mb-6">Required fields not found in evidence</p>
      {gaps.length === 0 ? (
        <div className="border border-dashed border-gray-600 rounded p-8 text-center">
          <p className="text-gray-400">No missing information detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {gaps.map((gap) => (
            <div key={gap.field} className="border border-amber-900/50 bg-amber-950/30 rounded p-4">
              <div className="flex items-start gap-3">
                <div className="text-xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{gap.field.toUpperCase()}</h3>
                  <p className="text-sm text-gray-400 mt-1">Status: {gap.status === 'missing' ? 'Not found' : 'Incomplete'}</p>
                  {gap.transaction && <p className="text-xs text-gray-500 mt-2">From: {gap.transaction}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
