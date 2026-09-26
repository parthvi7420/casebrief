import React, { useState } from "react";
import { ModuleHit, SecurityModuleName } from "../types/incident";
import {
  MessageSquareWarning,
  Globe,
  Network,
  ShieldAlert,
  CreditCard,
  History,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle,
} from "lucide-react";

interface ModuleRailProps {
  moduleHits: ModuleHit[];
}

const MODULE_ICONS: Record<SecurityModuleName, React.ElementType> = {
  "Message Analyzer": MessageSquareWarning,
  "URL Reputation Check": Globe,
  "Network Monitoring": Network,
  "Threat Intelligence Feed": ShieldAlert,
  "Transaction Auditor": CreditCard,
  "Fraud Attempt Log": History,
};

export const ModuleRail: React.FC<ModuleRailProps> = ({ moduleHits }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const hitCount = moduleHits.filter((m) => m.status === "hit").length;
  const totalCount = moduleHits.length;

  const toggleExpand = (modName: string) => {
    setExpandedModule((prev) => (prev === modName ? null : modName));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm no-print">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            6-Module Security Engine
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">System Coverage:</span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              hitCount === totalCount && totalCount > 0
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                : "bg-blue-950/80 text-blue-300 border-blue-500/40"
            }`}
          >
            {hitCount}/{totalCount} MODULES FIRED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
        {moduleHits.map((m) => {
          const Icon = MODULE_ICONS[m.module] || Activity;
          const isHit = m.status === "hit";
          const isExpanded = expandedModule === m.module;

          return (
            <div
              key={m.module}
              className={`rounded-lg border transition-all ${
                isHit
                  ? "bg-slate-800/80 border-slate-700/80 hover:border-blue-500/50"
                  : "bg-slate-900/40 border-slate-800/60 opacity-70"
              }`}
            >
              <div
                onClick={() => toggleExpand(m.module)}
                className="p-3 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      isHit
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      {m.module}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isHit
                        ? `${m.reasons.length} signature match${m.reasons.length > 1 ? "es" : ""}`
                        : "No threats flagged"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                      isHit
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {m.status}
                  </span>
                  {m.reasons.length > 0 && (
                    <button className="text-slate-400 hover:text-slate-200">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && m.reasons.length > 0 && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-700/50 bg-slate-900/50 rounded-b-lg">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-rose-400" />
                    Forensic Detections:
                  </div>
                  <ul className="space-y-1">
                    {m.reasons.map((r, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-slate-300 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/50 flex items-start gap-1.5"
                      >
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
