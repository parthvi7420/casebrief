import { Conflict } from '../types/incident'

interface ConflictPanelProps {
  conflicts: Conflict[]
}

export default function ConflictPanel({ conflicts }: ConflictPanelProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Contradiction Detection</h2>
      <p className="text-gray-400 mb-6">Conflicting information across evidence sources</p>
      {conflicts.length === 0 ? (
        <div className="border border-dashed border-gray-600 rounded p-8 text-center">
          <p className="text-gray-400">No contradictions detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conflicts.map((conflict) => (
            <div key={`${conflict.source1}-${conflict.source2}`} className="border border-red-900/50 bg-red-950/30 rounded p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-xl">⚠️</div>
                <h3 className="font-bold text-white">{conflict.type.toUpperCase()} CONFLICT</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-3 rounded">
                  <div className="text-xs text-gray-400 mb-1">{conflict.source1}</div>
                  <div className="text-lg font-bold text-white">{conflict.value1}</div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-lg font-bold text-red-400">VS</div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded">
                  <div className="text-xs text-gray-400 mb-1">{conflict.source2}</div>
                  <div className="text-lg font-bold text-white">{conflict.value2}</div>
                </div>
              </div>
              {conflict.difference && (
                <div className="mt-3 pt-3 border-t border-red-900/50">
                  <div className="text-xs text-gray-400">Difference</div>
                  <div className="font-bold text-red-400">{conflict.difference}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
