import React from "react";
import { Conflict } from "../types/incident";
import { Scale, ArrowRightLeft, FileText, FileSpreadsheet, Info } from "lucide-react";

interface ConflictPanelProps {
  conflicts: Conflict[];
}

export const ConflictPanel: React.FC<ConflictPanelProps> = ({ conflicts }) => {
  return (
    <div className="cb-surface p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-cb-border mb-6">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <Scale className="w-5 h-5 text-cb-warning" />
            Evidence Contradictions
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Detecting mismatched financial figures & timestamps.
          </p>
        </div>
        <span className="cb-badge cb-badge-warning">{conflicts.length}</span>
      </div>

      <div className="space-y-6">
        {conflicts.map((c) => (
          <div key={c.id} className="bg-cb-bg/40 rounded-cb-md border border-cb-border p-4">
            <div className="flex items-center justify-between pb-3 border-b border-cb-border mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
                <ArrowRightLeft className="w-4 h-4 text-cb-warning" />
                {c.type}
              </div>
              <span className="cb-badge cb-badge-warning">{c.severity}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-cb-surface rounded p-3 border border-cb-border">
                <div className="text-[10px] text-cb-muted mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Source A
                </div>
                <div className="text-xs font-mono font-bold text-cb-critical">{c.sourceA.value}</div>
              </div>
              <div className="bg-cb-surface rounded p-3 border border-cb-border">
                <div className="text-[10px] text-cb-muted mb-1 flex items-center gap-1">
                  <FileSpreadsheet className="w-3 h-3" /> Source B
                </div>
                <div className="text-xs font-mono font-bold text-cb-success">{c.sourceB.value}</div>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-cb-elevated p-3 rounded-cb-md text-[11px] text-cb-text-secondary border border-cb-border">
              <Info className="w-4 h-4 text-cb-primary shrink-0" />
              {c.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
