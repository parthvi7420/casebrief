import { Incident } from '../types/incident'
import ProcessStepper from '../components/ProcessStepper'
import ModuleRail from '../components/ModuleRail'
import EvidencePanel from '../components/EvidencePanel'
import ExtractionPanel from '../components/ExtractionPanel'
import PhishingTimeline from '../components/PhishingTimeline'
import MissingPanel from '../components/MissingPanel'
import ConflictPanel from '../components/ConflictPanel'
import RedactionPanel from '../components/RedactionPanel'
import IncidentReport from '../components/IncidentReport'
import { useState } from 'react'

interface InvestigationDeskProps {
  incident: Incident | null
  setIncident: (incident: Incident | null) => void
}

export default function InvestigationDesk({ incident, setIncident }: InvestigationDeskProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [redacted, setRedacted] = useState(true)

  const handleLoadDemo = async () => {
    // Import from Person 2's investigation engine
    try {
      const { loadDemoCase } = await import('../logic/incident')
      const demoIncident = loadDemoCase()
      setIncident(demoIncident)
      setActiveStep(1)
    } catch (error) {
      console.error('Failed to load demo:', error)
    }
  }

  const handleReset = () => {
    setIncident(null)
    setActiveStep(1)
  }

  const scrollToStep = (stepNumber: number) => {
    setActiveStep(stepNumber)
    const stepId = ['evidence', 'extraction', 'timeline', 'gaps', 'conflicts', 'redaction', 'report'][stepNumber - 1]
    const element = document.getElementById(stepId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-700 bg-gray-800/95 backdrop-blur px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">CASEBRIEF</h1>
            <p className="text-sm text-gray-400">Digital Fraud Evidence Reconstruction</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLoadDemo}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
            >
              Load Phishing Demo
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded font-medium transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Case Summary */}
        {incident && (
          <div className="mt-4 grid grid-cols-6 gap-4 text-sm">
            <div className="border-l border-blue-500 pl-3">
              <div className="text-gray-400">CASE</div>
              <div className="font-bold text-white">{incident.caseNumber}</div>
            </div>
            <div className="border-l border-amber-500 pl-3">
              <div className="text-gray-400">FRAUD TYPE</div>
              <div className="font-bold text-white">{incident.summary.fraudType}</div>
            </div>
            <div className="border-l border-red-500 pl-3">
              <div className="text-gray-400">LOSS</div>
              <div className="font-bold text-white">₹{incident.summary.estimatedLoss.toLocaleString()}</div>
            </div>
            <div className="border-l border-gray-500 pl-3">
              <div className="text-gray-400">EVENTS</div>
              <div className="font-bold text-white">{incident.timeline.length}</div>
            </div>
            <div className="border-l border-gray-500 pl-3">
              <div className="text-gray-400">GAPS</div>
              <div className="font-bold text-white">{incident.gaps.length}</div>
            </div>
            <div className="border-l border-gray-500 pl-3">
              <div className="text-gray-400">CONFLICTS</div>
              <div className="font-bold text-white">{incident.conflicts.length}</div>
            </div>
          </div>
        )}
      </header>

      {/* Process Stepper */}
      <ProcessStepper activeStep={activeStep} onStepClick={scrollToStep} />

      {!incident ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Active Investigation</h2>
            <p className="text-gray-400 mb-8">Load evidence or start with the phishing demo</p>
            <button
              onClick={handleLoadDemo}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-lg transition"
            >
              Load Phishing Demo
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Module Rail */}
          <ModuleRail moduleHits={incident.moduleHits} />

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto p-6 space-y-8">
              {/* Step 1: Evidence */}
              <section id="evidence" className="scroll-mt-32">
                <EvidencePanel evidence={incident.evidence} />
              </section>

              {/* Step 2: Extraction */}
              <section id="extraction" className="scroll-mt-32">
                <ExtractionPanel evidence={incident.evidence} />
              </section>

              {/* Step 3: Timeline */}
              <section id="timeline" className="scroll-mt-32">
                <PhishingTimeline timeline={incident.timeline} />
              </section>

              {/* Step 4: Gaps */}
              <section id="gaps" className="scroll-mt-32">
                <MissingPanel gaps={incident.gaps} />
              </section>

              {/* Step 5: Conflicts */}
              <section id="conflicts" className="scroll-mt-32">
                <ConflictPanel conflicts={incident.conflicts} />
              </section>

              {/* Step 6: Redaction */}
              <section id="redaction" className="scroll-mt-32">
                <RedactionPanel incident={incident} redacted={redacted} onToggleRedaction={setRedacted} />
              </section>

              {/* Step 7: Report */}
              <section id="report" className="scroll-mt-32 pb-12">
                <IncidentReport incident={incident} redacted={redacted} />
              </section>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
