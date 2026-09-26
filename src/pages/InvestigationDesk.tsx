import { Incident } from '../types/incident'

interface InvestigationDeskProps {
  incident: Incident | null
  setIncident: (incident: Incident | null) => void
}

export default function InvestigationDesk({ incident, setIncident }: InvestigationDeskProps) {
  const handleLoadDemo = async () => {
    // MEMBER 2 will replace this with actual implementation
    // For now, placeholder
    console.log('Load demo clicked')
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CASEBRIEF</h1>
            <p className="text-sm text-gray-500">Digital Fraud Evidence Reconstruction</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLoadDemo}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Load Demo
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Stepper - MEMBER 1 BUILDS */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-600 mb-2">INVESTIGATION STEPS</p>
        <div className="flex justify-between text-sm">
          {['Evidence', 'Extract', 'Timeline', 'Gaps', 'Conflicts', 'Redact', 'Report'].map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs">
                {i + 1}
              </div>
              <span className="ml-2 text-gray-700">{step}</span>
              {i < 6 && <div className="ml-4 flex-1 h-px bg-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Module Rail - MEMBER 1 BUILDS */}
        <aside className="w-48 bg-white border-r border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-600 mb-4">MODULES</p>
          <div className="space-y-2">
            {['Message Analyzer', 'URL Reputation', 'Network Monitoring', 'Threat Intelligence', 'Transaction Auditor', 'Fraud Attempt Log'].map((module) => (
              <div key={module} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                {module}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Investigation Panel - MEMBER 1 BUILDS */}
        <main className="flex-1 overflow-auto p-6">
          {incident ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Case: {incident.caseNumber}</h2>
              {/* MEMBER 1: Add components here */}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-gray-500 mb-4">No case loaded</p>
                <button
                  onClick={handleLoadDemo}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Load Phishing Demo
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
