import { useState } from 'react'
import { Incident } from './types/incident'
import InvestigationDesk from './pages/InvestigationDesk'

function App() {
  const [incident, setIncident] = useState<Incident | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <InvestigationDesk incident={incident} setIncident={setIncident} />
    </div>
  )
}

export default App
