import { EvidenceItem } from '../types/incident'

interface EvidencePanelProps {
  evidence: EvidenceItem[]
}

export default function EvidencePanel({ evidence }: EvidencePanelProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Unorganized Evidence</h2>
      <p className="text-gray-400 mb-6">Raw data collected from multiple sources</p>
      <div className="space-y-3">
        {evidence.length === 0 ? (
          <div className="border border-dashed border-gray-600 rounded p-8 text-center">
            <p className="text-gray-400">No evidence loaded</p>
          </div>
        ) : (
          evidence.map((item, idx) => (
            <div key={item.id} className="border border-gray-700 rounded p-4 hover:bg-gray-800/50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-mono text-gray-400">#{String(idx + 1).padStart(2, '0')}</div>
                  <div className="font-bold text-white mt-1">{item.content.split('\n')[0].substring(0, 60)}</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{item.type}</div>
                </div>
                <div className="text-xs font-mono text-gray-500">{item.hash?.substring(0, 8) || 'pending'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
