import { Incident } from '../types/incident'

interface RedactionPanelProps {
  // incident: Incident  // Reserved for future use
  redacted: boolean
  onToggleRedaction: (redacted: boolean) => void
}

export default function RedactionPanel({ incident, redacted, onToggleRedaction }: RedactionPanelProps) {
  const redactValue = (value: string, pattern: 'phone' | 'email' | 'upi' | 'account') => {
    if (!redacted) return value
    switch (pattern) {
      case 'phone':
        return value.replace(/(\d{2})(\d+)(\d{4})/, '$1***$3')
      case 'email':
        return value.replace(/(.{2})(.+)(@.+)/, '$1***$3')
      case 'upi':
        return value.replace(/(.{2})(.+)(@.+)/, '$1***$3')
      case 'account':
        return value.replace(/(\d{4})(\d+)(\d{4})/, '$1****$3')
      default:
        return value
    }
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Redaction</h2>
          <p className="text-gray-400">Privacy protection and safe sharing</p>
        </div>
        <button
          onClick={() => onToggleRedaction(!redacted)}
          className={`px-4 py-2 rounded font-medium transition ${
            redacted ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-red-900/30 text-red-300 border border-red-700'
          }`}
        >
          {redacted ? '🔒 Redacted' : '🔓 Reveal All'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-700 rounded p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Default View</div>
          <p className="text-sm text-green-400 mb-4">✓ Safe to share</p>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-400">Phone</div>
              <div className="font-mono text-white">{redactValue('+91-9876-543210', 'phone')}</div>
            </div>
            <div>
              <div className="text-gray-400">Email</div>
              <div className="font-mono text-white">{redactValue('user@gmail.com', 'email')}</div>
            </div>
            <div>
              <div className="text-gray-400">UPI</div>
              <div className="font-mono text-white">{redactValue('user@oksbi', 'upi')}</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-700 rounded p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Local Only</div>
          <p className="text-sm text-amber-400 mb-4">⚠️ Unredacted data</p>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-400">Full Evidence</div>
              <div className="text-xs text-gray-500">Complete investigative record</div>
            </div>
            <div>
              <div className="text-gray-400">All Entities</div>
              <div className="text-xs text-gray-500">Unmasked personal information</div>
            </div>
            <div>
              <div className="text-gray-400">Raw Data</div>
              <div className="text-xs text-gray-500">Original source files</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition">
          📊 Export Shareable
        </button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-medium transition">
          💾 Export Full Local
        </button>
      </div>
    </div>
  )
}
