import { TimelineEvent } from '../types/incident'

interface PhishingTimelineProps {
  timeline: TimelineEvent[]
}

export default function PhishingTimeline({ timeline }: PhishingTimelineProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Chronological Timeline</h2>
      <p className="text-gray-400 mb-6">Events reconstructed from evidence</p>
      <div className="space-y-4">
        {timeline.map((event, idx) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
              {idx < timeline.length - 1 && <div className="w-px h-16 bg-gray-700 my-2" />}
            </div>
            <div className="pb-4 flex-1">
              <div className="text-sm font-bold text-gray-400">{event.time}</div>
              <h3 className="text-lg font-bold text-white mt-1">{event.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{event.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {event.modulesFired.map((module) => (
                  <span key={module} className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
