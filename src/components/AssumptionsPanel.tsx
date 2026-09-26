import React, { useState } from "react";
import { Link2, Eye, EyeOff, Info } from "lucide-react";
import { ForensicAssertion } from "../types/incident";

export interface AssumptionRecord {
  id: string;
  description?: string;
  claim?: string;
  reason?: string;
  rationale?: string;
  status?: "unverified" | "verified" | "disputed" | "CONFIRMED" | "INFERRED" | "ASSUMPTION" | "MISSING" | string;
  displayBadge?: string;
  evidenceIds?: string[];
  sourceEvidenceIds?: string[];
}

interface AssumptionsPanelProps {
  assumptions: (AssumptionRecord | ForensicAssertion)[];
}

export const AssumptionsPanel: React.FC<AssumptionsPanelProps> = ({
  assumptions,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (assumptions.length === 0) {
    return (
      <div className="cb-surface p-6 shadow-sm">
        <h3 className="text-sm font-bold text-cb-text mb-2 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-cb-primary" />
          Stage 4d: Assumptions & Inferred Relationships
        </h3>
        <p className="text-xs text-cb-muted">No inferred relationships documented</p>
      </div>
    );
  }

  return (
    <div className="cb-surface p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-cb-border">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cb-primary" />
            Stage 4d: Inferred Relationships & Assumptions
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Forensic assumptions evaluated with confidence badges & source traceability.
          </p>
        </div>
        <span className="cb-badge cb-badge-idle">{assumptions.length} Evaluated</span>
      </div>

      <div className="space-y-3">
        {assumptions.map((item) => {
          const id = item.id;
          const title =
            ("claim" in item && item.claim) ||
            ("description" in item && item.description) ||
            "Forensic Assertion";
          const reason =
            ("rationale" in item && item.rationale) ||
            ("reason" in item && item.reason) ||
            "";
          const badge =
            ("displayBadge" in item && item.displayBadge) ||
            ("status" in item && String(item.status).toUpperCase()) ||
            "UNVERIFIED";
          const evidence =
            ("sourceEvidenceIds" in item && item.sourceEvidenceIds) ||
            ("evidenceIds" in item && item.evidenceIds) ||
            [];

          const isVerified =
            badge.includes("CONFIRMED") ||
            badge === "VERIFIED" ||
            ("level" in item && String(item.level) === "CONFIRMED");
          const isDisputed =
            badge === "DISPUTED" ||
            badge === "MISSING" ||
            ("level" in item && String(item.level) === "MISSING");

          return (
            <div
              key={id}
              className={`border rounded-cb-md transition-all ${
                isVerified
                  ? "bg-cb-success/5 border-cb-success/20"
                  : isDisputed
                  ? "bg-cb-critical/5 border-cb-critical/20"
                  : "bg-cb-bg/40 border-cb-border"
              }`}
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === id ? null : id)
                }
                className="w-full text-left p-3 flex items-center justify-between hover:bg-cb-surface transition-all rounded-cb-md cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <div className="text-xs font-bold text-cb-text truncate">{title}</div>
                  <div className="text-[10px] mt-1 flex items-center gap-2">
                    <span className="text-cb-muted">Status:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        isVerified
                          ? "bg-cb-success/20 text-cb-success border border-cb-success/30"
                          : isDisputed
                          ? "bg-cb-critical/20 text-cb-critical border border-cb-critical/30"
                          : "bg-cb-warning/20 text-cb-warning border border-cb-warning/30"
                      }`}
                    >
                      {badge}
                    </span>
                  </div>
                </div>
                {expandedId === id ? (
                  <EyeOff className="w-4 h-4 text-cb-muted shrink-0" />
                ) : (
                  <Eye className="w-4 h-4 text-cb-muted shrink-0" />
                )}
              </button>

              {expandedId === id && (
                <div className="px-3 pb-3 pt-2 border-t border-cb-border-subtle space-y-2">
                  {reason && (
                    <div className="text-xs text-cb-text-secondary leading-relaxed bg-cb-surface p-2.5 rounded-cb-sm border border-cb-border">
                      <div className="text-[10px] font-bold text-cb-muted uppercase tracking-wider mb-1">
                        Forensic Rationale
                      </div>
                      {reason}
                    </div>
                  )}
                  {evidence.length > 0 && (
                    <div className="text-[10px] text-cb-muted font-mono flex items-center gap-2 bg-cb-bg/60 p-2 rounded-cb-sm border border-cb-border-subtle">
                      <Info className="w-3 h-3 text-cb-primary shrink-0" />
                      <span>Supporting Evidence: <strong>{evidence.join(", ")}</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
