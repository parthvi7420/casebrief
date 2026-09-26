import React from "react";
import { Gap } from "../types/incident";
import { AlertCircle, FileKey, Landmark, Radio, ArrowRight } from "lucide-react";

interface MissingPanelProps {
  gaps: Gap[];
}

export const MissingPanel: React.FC<MissingPanelProps> = ({ gaps }) => {
  return (
    <div className="cb-surface p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-cb-border mb-6">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-cb-critical" />
            Investigatory Gaps
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Incomplete data fields requiring forensic attention.
          </p>
        </div>
        <span className="cb-badge cb-badge-critical">{gaps.length}</span>
      </div>

      <div className="space-y-4">
        {gaps.map((gap) => {
          const isHigh = gap.severity === "high";

          return (
            <div
              key={gap.id}
              className={`rounded-cb-md p-4 border ${
                isHigh ? "bg-cb-critical/5 border-cb-critical/20" : "bg-cb-bg/40 border-cb-border"
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-cb-border-subtle">
                <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
                  {gap.field.includes("UTR") ? (
                    <FileKey className="w-4 h-4 text-cb-primary" />
                  ) : gap.field.includes("Bank") || gap.field.includes("IFSC") ? (
                    <Landmark className="w-4 h-4 text-cb-primary" />
                  ) : (
                    <Radio className="w-4 h-4 text-cb-primary" />
                  )}
                  {gap.field}
                </div>
                <span className={`cb-badge ${isHigh ? "cb-badge-critical" : "cb-badge-warning"}`}>
                  {gap.severity}
                </span>
              </div>
              <p className="text-xs text-cb-text-secondary leading-relaxed mb-3">
                {gap.description}
              </p>
              <div className="text-[10px] text-cb-muted font-mono bg-cb-surface rounded p-2 border border-cb-border-subtle italic">
                {gap.field.includes("UTR")
                  ? "File Form 1420 / Chargeback Notice..."
                  : "Issue Notice under Section 91 CrPC..."}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
