import React, { useState } from "react";
import { Link2, Eye, EyeOff, Info } from "lucide-react";

export interface AssumptionRecord {
  id: string;
  description: string;
  reason: string;
  status: "unverified" | "verified" | "disputed";
  evidenceIds: string[];
}

interface AssumptionsPanelProps {
  assumptions: AssumptionRecord[];
}

export const AssumptionsPanel: React.FC<AssumptionsPanelProps> = ({ assumptions }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="cb-surface p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-cb-border mb-6">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cb-primary" />
            Inferred Relationships
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Forensic assumptions awaiting verification.
          </p>
        </div>
        <span className="cb-badge cb-badge-idle">{assumptions.length}</span>
      </div>

      <div className="space-y-3">
        {assumptions.map((assumption) => (
          <div
            key={assumption.id}
            className={`border rounded-cb-md ${
              assumption.status === "verified"
                ? "bg-cb-success/5 border-cb-success/20"
                : assumption.status === "disputed"
                ? "bg-cb-critical/5 border-cb-critical/20"
                : "bg-cb-bg/40 border-cb-border"
            }`}
          >
            <button
              onClick={() => setExpandedId(expandedId === assumption.id ? null : assumption.id)}
              className="w-full text-left p-3 flex items-center justify-between hover:bg-cb-surface transition-all rounded-cb-md"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-cb-text truncate">{assumption.description}</div>
                <div className="text-[10px] text-cb-muted mt-0.5 uppercase tracking-wide">
                  {assumption.status}
                </div>
              </div>
              {expandedId === assumption.id ? (
                <EyeOff className="w-4 h-4 text-cb-muted shrink-0" />
              ) : (
                <Eye className="w-4 h-4 text-cb-muted shrink-0" />
              )}
            </button>

            {expandedId === assumption.id && (
              <div className="px-3 pb-3 pt-0 border-t border-cb-border-subtle pt-2 space-y-3">
                <div className="text-xs text-cb-text-secondary leading-relaxed bg-cb-surface p-2 rounded-cb-sm border border-cb-border">
                  {assumption.reason}
                </div>
                {assumption.evidenceIds.length > 0 && (
                  <div className="text-[10px] text-cb-muted font-mono flex items-center gap-2">
                    <Info className="w-3 h-3" />
                  Evidence: {assumption.evidenceIds.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
