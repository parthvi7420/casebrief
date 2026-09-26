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
    <div className="cb-surface border border-cb-border rounded-cb-md p-4 shadow-sm no-print">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-cb-border gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cb-primary" />
          <h2 className="text-sm font-bold text-cb-text uppercase tracking-wider">
            6-Module Security Engine
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-cb-muted">System Coverage:</span>
          <span
            className={`cb-badge ${
              hitCount === totalCount && totalCount > 0
                ? "cb-badge-hit"
                : "cb-badge-idle"
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
              className={`rounded-cb-md border transition-all ${
                isHit
                  ? "bg-cb-bg/60 border-cb-border hover:border-cb-border-hover shadow-sm"
                  : "bg-cb-bg/30 border-cb-border opacity-70"
              }`}
            >
              <div
                onClick={() => toggleExpand(m.module)}
                className="p-3 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-cb-sm flex items-center justify-center ${
                      isHit
                        ? "bg-cb-critical/10 text-cb-critical border border-cb-critical/30"
                        : "bg-cb-surface text-cb-muted border border-cb-border"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-cb-text">
                      {m.module}
                    </div>
                    <div className="text-[10px] text-cb-muted">
                      {isHit
                        ? `${m.reasons.length} signature match${m.reasons.length > 1 ? "es" : ""}`
                        : "No threats flagged"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`cb-badge text-[10px] ${
                      isHit
                        ? "cb-badge-critical"
                        : "cb-badge-idle"
                    }`}
                  >
                    {m.status}
                  </span>
                  {m.reasons.length > 0 && (
                    <button className="text-cb-muted hover:text-cb-text p-0.5">
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
                <div className="px-3 pb-3 pt-1 border-t border-cb-border bg-cb-surface rounded-b-cb-md">
                  <div className="text-[11px] font-medium text-cb-muted mb-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-cb-critical" />
                    Forensic Detections:
                  </div>
                  <ul className="space-y-1">
                    {m.reasons.map((r, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-cb-text-secondary bg-cb-bg/60 px-2 py-1 rounded-cb-sm border border-cb-border flex items-start gap-1.5"
                      >
                        <span className="text-cb-critical font-bold">•</span>
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
