import { Incident } from '../types/incident'

interface IncidentReportProps {
  incident: Incident
  // redacted: boolean  // Reserved for future use
}

export default function IncidentReport({ incident, redacted }: IncidentReportProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleExportShareable = () => {
    const redactedIncident = JSON.parse(JSON.stringify(incident))
    const dataStr = JSON.stringify(redactedIncident, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `casebrief-${incident.caseNumber}-shareable.json`
    link.click()
  }

  const handleExportFull = () => {
    const dataStr = JSON.stringify(incident, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `casebrief-${incident.caseNumber}-full.json`
    link.click()
  }

  return (
    <div className="print:break-before-page">
      <h2 className="text-2xl font-bold mb-6">Incident Report</h2>

      {/* Report Header */}
      <div className="border border-gray-700 rounded p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Case Number</div>
            <div className="text-2xl font-bold text-white">{incident.caseNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Status</div>
            <div className="text-lg font-bold text-blue-400">Investigation Active</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Fraud Type</div>
            <div className="font-bold text-white mt-1">{incident.summary.fraudType}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Estimated Loss</div>
            <div className="font-bold text-red-400 mt-1">₹{incident.summary.estimatedLoss.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Timeline Summary */}
      <div className="mb-6 print:break-inside-avoid">
        <h3 className="text-lg font-bold mb-3">Timeline</h3>
        <div className="border border-gray-700 rounded p-4 space-y-2">
          {incident.timeline.map((event) => (
            <div key={event.id} className="text-sm">
              <span className="font-mono text-gray-400">{event.time}</span>
              <span className="mx-2">→</span>
              <span className="font-bold text-white">{event.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps & Conflicts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Missing Information */}
        <div className="print:break-inside-avoid">
          <h3 className="text-lg font-bold mb-3">Missing Information</h3>
          <div className="border border-gray-700 rounded p-4">
            {incident.gaps.length === 0 ? (
              <p className="text-sm text-gray-400">None detected</p>
            ) : (
              <ul className="space-y-1">
                {incident.gaps.map((gap) => (
                  <li key={gap.field} className="text-sm text-gray-300">
                    • {gap.field}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Contradictions */}
        <div className="print:break-inside-avoid">
          <h3 className="text-lg font-bold mb-3">Contradictions</h3>
          <div className="border border-gray-700 rounded p-4">
            {incident.conflicts.length === 0 ? (
              <p className="text-sm text-gray-400">None detected</p>
            ) : (
              <ul className="space-y-2">
                {incident.conflicts.map((conflict) => (
                  <li key={`${conflict.source1}-${conflict.source2}`} className="text-sm text-gray-300">
                    <span className="font-bold">{conflict.type}</span>
                    <br />
                    <span className="text-xs text-gray-400">{conflict.value1} vs {conflict.value2}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modules Fired */}
      <div className="mb-6 print:break-inside-avoid">
        <h3 className="text-lg font-bold mb-3">Modules Fired</h3>
        <div className="border border-gray-700 rounded p-4">
          <div className="flex flex-wrap gap-2">
            {incident.moduleHits.map((hit) => (
              <span
                key={hit.module}
                className={`text-xs px-3 py-1 rounded font-medium ${
                  hit.status === 'hit'
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {hit.module}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Summary */}
      <div className="mb-6 print:break-inside-avoid">
        <h3 className="text-lg font-bold mb-3">Evidence</h3>
        <div className="border border-gray-700 rounded p-4">
          <p className="text-sm text-gray-300">{incident.evidence.length} item(s) collected</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-medium transition"
        >
          🖨️ Print Report
        </button>
        <button
          onClick={handleExportShareable}
          className="px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 border border-green-700 rounded font-medium transition"
        >
          📊 Export Shareable
        </button>
        <button
          onClick={handleExportFull}
          className="px-4 py-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-300 border border-amber-700 rounded font-medium transition"
        >
          💾 Export Full Local
        </button>
      </div>
    </div>
  )
}
