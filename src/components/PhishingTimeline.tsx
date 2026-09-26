import React from "react";
import { TimelineEvent } from "../types/incident";
import {
  Clock,
  ShieldCheck,
  FileText,
  AlertOctagon,
  ArrowDown,
  Sparkles,
} from "lucide-react";

interface PhishingTimelineProps {
  timeline: TimelineEvent[];
}

export const PhishingTimeline: React.FC<PhishingTimelineProps> = ({ timeline }) => {
  return (
    <div className="space-y-6">
      <div className="cb-surface p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
          <div>
            <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
              <Clock className="w-5 h-5 text-cb-primary" />
              Stage 3: Forensic Chronological Attack Timeline
            </h3>
            <p className="text-xs text-cb-muted mt-1">
              Reconstructed sequential incident chain linking evidence timestamps, victim actions, and security detections.
            </p>
          </div>
          <span className="cb-badge cb-badge-hit">
            {timeline.length} Chronological Milestones
          </span>
        </div>

        {/* Timeline Stream */}
        <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-cb-border">
          {timeline.map((event, idx) => (
            <div key={event.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 sm:-left-10 top-1 w-6 h-6 rounded-full bg-cb-surface border-2 border-cb-primary text-cb-primary flex items-center justify-center text-[10px] font-bold shadow-md">
                {idx + 1}
              </div>

              {/* Event Card */}
              <div className="bg-cb-bg/40 border border-cb-border hover:border-cb-border-hover rounded-cb-md p-5 shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-cb-border">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 bg-cb-primary/10 border border-cb-primary/30 text-cb-primary font-mono text-xs font-bold rounded-cb-sm flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                    <h4 className="text-xs font-bold text-cb-text">
                      {event.title}
                    </h4>
                  </div>

                  {/* Sources */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cb-muted">
                    <FileText className="w-3.5 h-3.5 text-cb-muted" />
                    <span>Source: {event.sourceIds.join(", ")}</span>
                  </div>
                </div>

                <p className="text-xs text-cb-text-secondary mt-3 leading-relaxed">
                  {event.description}
                </p>

                {/* Modules Fired */}
                {event.modulesFired && event.modulesFired.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-cb-border flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold text-cb-muted flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cb-primary" />
                      Triggered Modules:
                    </span>
                    {event.modulesFired.map((mod, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-cb-surface border border-cb-border text-cb-primary font-medium text-[10px] rounded-cb-sm"
                      >
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
    </div>
  );
};
