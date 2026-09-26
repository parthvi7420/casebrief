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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Stage 3: Forensic Chronological Attack Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reconstructed sequential incident chain linking evidence timestamps, victim actions, and security detections.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-500/30 w-fit">
            {timeline.length} Chronological Milestones
          </span>
        </div>

        {/* Timeline Stream */}
        <div className="relative mt-8 pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {timeline.map((event, idx) => (
            <div key={event.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 sm:-left-10 top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-blue-500 text-blue-400 flex items-center justify-center text-[10px] font-bold shadow-md shadow-blue-950">
                {idx + 1}
              </div>

              {/* Event Card */}
              <div className="bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 rounded-xl p-5 shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 bg-blue-950/80 border border-blue-800/60 text-blue-300 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">
                      {event.title}
                    </h4>
                  </div>

                  {/* Sources */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Source: {event.sourceIds.join(", ")}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {event.description}
                </p>

                {/* Modules Fired */}
                {event.modulesFired && event.modulesFired.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      Triggered Modules:
                    </span>
                    {event.modulesFired.map((mod, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 text-blue-300 font-medium text-[11px] rounded"
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
