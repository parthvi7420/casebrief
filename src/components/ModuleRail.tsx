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

  const toggleExpand = (modName: string) => {
    setExpandedModule((prev) => (prev === modName ? null : modName));
  };

  return (
    <div className="cb-surface p-4 no-print space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-cb-border">
        <h2 className="text-xs font-bold text-cb-text uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-cb-primary" />
          Security Modules
        </h2>
        <span className="cb-badge cb-badge-hit">{hitCount} Active Hits</span>
      </div>

      <div className="space-y-2">
        {moduleHits.map((m) => {
          const Icon = MODULE_ICONS[m.module] || Activity;
          const isHit = m.status === "hit";
          const isExpanded = expandedModule === m.module;

          return (
            <div
              key={m.module}
              className={`rounded-cb-md border transition-all ${
                isHit
                  ? "bg-cb-elevated border-cb-border hover:border-cb-primary"
                  : "bg-cb-bg/40 border-cb-border-subtle"
              }`}
            >
              <button
                onClick={() => toggleExpand(m.module)}
                className="w-full p-2.5 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-cb-sm flex items-center justify-center ${isHit ? "bg-cb-success-soft text-cb-success" : "bg-cb-elevated text-cb-muted"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-cb-text">{m.module}</div>
                    <div className="text-[10px] text-cb-muted/70">{isHit ? "Threats detected" : "System normal"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`cb-badge ${isHit ? "cb-badge-hit" : "cb-badge-idle"}`}>{m.status}</span>
                  {m.reasons.length > 0 && (
                    <div className="text-cb-muted">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
                  )}
                </div>
              </button>

              {isExpanded && m.reasons.length > 0 && (
                <div className="px-3 pb-3 pt-0 border-t border-cb-border-subtle bg-cb-bg/50 rounded-b-cb-md">
                   <div className="text-[10px] uppercase font-bold text-cb-muted mt-2 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" />
                      Forensic Findings:
                   </div>
                   <ul className="space-y-1">
                      {m.reasons.map((r, i) => (
                        <li key={i} className="text-xs text-cb-text-secondary bg-cb-surface p-2 rounded-cb-sm border border-cb-border">
                          {r}
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
