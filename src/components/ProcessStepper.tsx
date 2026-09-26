interface ProcessStepperProps {
  activeStep: number
  onStepClick: (step: number) => void
}

export default function ProcessStepper({ activeStep, onStepClick }: ProcessStepperProps) {
  const steps = [
    'Unorganized Evidence',
    'Information Extraction',
    'Chronological Timeline',
    'Missing Information',
    'Contradiction Detection',
    'Redaction',
    'Incident Report',
  ]

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-[100px] z-40">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Investigation Steps</p>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onStepClick(i + 1)}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition ${
                activeStep === i + 1
                  ? 'bg-blue-600 text-white'
                  : activeStep > i + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
              title={step}
            >
              {activeStep > i + 1 ? '✓' : i + 1}
            </button>
            <span className="text-sm text-gray-400 hidden md:inline whitespace-nowrap">{step.split(' ')[0]}</span>
            {i < steps.length - 1 && <div className="w-4 h-px bg-gray-700 hidden lg:block" />}
          </div>
        ))}
      </div>
    </div>
  )
}
