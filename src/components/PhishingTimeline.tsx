import React from "react";
import { TimelineEvent } from "../types/incident";
import { Clock, FileText, ShieldCheck } from "lucide-react";

interface PhishingTimelineProps {
  timeline: TimelineEvent[];
}

export const PhishingTimeline: React.FC<PhishingTimelineProps> = ({ timeline }) => {
  return (
    <div className="cb-surface p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
        <div>
          <h3 className="text-lg font-bold text-cb-text flex items-center gap-2">
            <Clock className="w-5 h-5 text-cb-primary" />
            Forensic Chronological Timeline
          </h3>
          <p className="text-xs text-cb-muted mt-1">Sequential incident chain: timestamps, victim actions, and security detections.</p>
        </div>
        <span className="cb-badge cb-badge-idle">{timeline.length} Milestones</span>
      </div>

      {/* Timeline Stream */}
      <div className="relative mt-8 pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-px before:bg-cb-border">
        {timeline.map((event, idx) => (
          <div key={event.id} className="relative group">
            {/* Timeline Marker Dot */}
            <div className="absolute -left-[30px] sm:-left-[42px] top-0 w-6 h-6 rounded-full bg-cb-surface border-2 border-cb-primary text-cb-primary flex items-center justify-center font-forensic text-[10px] font-bold shadow-sm">
              {idx + 1}
            </div>

            {/* Event Card */}
            <div className="cb-elevated p-5 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cb-border mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 bg-cb-primary-soft border border-cb-primary/30 text-cb-primary font-forensic text-xs rounded-cb-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {event.time}
                  </span>
                  <h4 className="text-sm font-bold text-cb-text">{event.title}</h4>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-forensic text-cb-muted">
                    <FileText className="w-3.5 h-3.5" />
                    Source: {event.sourceIds.join(", ")}
                </div>
              </div>

              <p className="text-xs text-cb-text-secondary leading-relaxed">{event.description}</p>

              {/* Modules Fired */}
              {event.modulesFired && event.modulesFired.length > 0 && (
                <div className="mt-4 pt-3 border-t border-cb-border flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold text-cb-muted uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Modules Triggered:
                  </span>
                  {event.modulesFired.map((mod, i) => (
                    <span key={i} className="px-2 py-0.5 bg-cb-bg border border-cb-border text-cb-primary rounded-cb-sm text-[10px] font-bold tracking-wider uppercase">
                      {mod}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
