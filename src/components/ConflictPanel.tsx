import React from "react";
import { Conflict } from "../types/incident";
import {
  Scale,
  AlertTriangle,
  ArrowRightLeft,
  FileText,
  FileSpreadsheet,
  Info,
} from "lucide-react";

interface ConflictPanelProps {
  conflicts: Conflict[];
}

export const ConflictPanel: React.FC<ConflictPanelProps> = ({ conflicts }) => {
  return (
    <div className="cb-surface p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <Scale className="w-5 h-5 text-cb-warning" />
            Stage 5: Evidence Contradictions & Discrepancies
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Cross-source discrepancy analysis detecting mismatched financial figures, altered timestamps, or conflicting narratives.
          </p>
        </div>
        <span className="cb-badge cb-badge-warning">
          {conflicts.length} Discrepancy Identified
        </span>
      </div>

      {/* Conflicts List */}
      <div className="grid grid-cols-1 gap-4">
        {conflicts.map((c) => (
          <div
            key={c.id}
            className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-5 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cb-border gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-cb-sm bg-cb-warning/10 text-cb-warning border border-cb-warning/30 flex items-center justify-center shrink-0">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cb-text">{c.type}</h4>
                  <span className="text-[10px] font-mono text-cb-muted">
                    ID: {c.id}
                  </span>
                </div>
              </div>

              <span className="cb-badge cb-badge-warning text-[10px]">
                {c.severity} Severity Contradiction
              </span>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source A */}
              <div className="bg-cb-surface border border-cb-border rounded-cb-sm p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-cb-border">
                    <span className="text-xs font-bold text-cb-muted flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cb-primary" />
                      Source A: Evidence Demand
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-bg text-cb-muted border border-cb-border-subtle">
                      {c.sourceA.evidenceId}
                    </span>
                  </div>
                  <div className="mt-3 text-lg font-mono font-bold text-cb-critical">
                    {c.sourceA.value}
                  </div>
                </div>
                <div className="text-[10px] text-cb-muted mt-2">
                  Lure claimed: Exact ₹5,000 fee required for unblocking.
                </div>
              </div>

              {/* Source B */}
              <div className="bg-cb-surface border border-cb-border rounded-cb-sm p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-cb-border">
                    <span className="text-xs font-bold text-cb-muted flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-cb-success" />
                      Source B: Financial Ledger
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-bg text-cb-muted border border-cb-border-subtle">
                      {c.sourceB.evidenceId}
                    </span>
                  </div>
                  <div className="mt-3 text-lg font-mono font-bold text-cb-success">
                    {c.sourceB.value}
                  </div>
                </div>
                <div className="text-[10px] text-cb-muted mt-2">
                  Bank debit recorded: ₹4,999 (Net Discrepancy: ₹1).
                </div>
              </div>
            </div>

            {/* Forensic Rationale */}
            <div className="p-3 bg-cb-warning/5 border border-cb-warning/20 rounded-cb-sm flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cb-warning shrink-0 mt-0.5" />
              <div className="text-xs text-cb-text-secondary leading-relaxed">
                <strong className="text-cb-text">Forensic Modus Operandi Analysis: </strong>
                {c.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
