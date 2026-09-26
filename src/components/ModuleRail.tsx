import { ModuleHit } from '../types/incident'
import StatusBadge from './StatusBadge'

interface ModuleRailProps {
  moduleHits: ModuleHit[]
}

export default function ModuleRail({ moduleHits }: ModuleRailProps) {
  const moduleOrder = [
    'Message Analyzer',
    'URL Reputation Check',
    'Network Monitoring',
    'Threat Intelligence Feed',
    'Transaction Auditor',
    'Fraud Attempt Log',
  ]

  return (
    <aside className="w-56 bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 space-y-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Modules</p>
        {moduleOrder.map((moduleName) => {
          const hit = moduleHits.find((m) => m.module === moduleName)
          return (
            <div key={moduleName} className="py-2 px-3 rounded flex items-center justify-between hover:bg-gray-700 transition">
              <span className="text-sm text-gray-300">{moduleName}</span>
              <StatusBadge status={hit?.status || 'idle'} />
            </div>
          )
        })}
      </div>
    </aside>
  )
}
