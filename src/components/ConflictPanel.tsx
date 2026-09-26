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
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              Stage 5: Evidence Contradictions & Discrepancies
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-source discrepancy analysis detecting mismatched financial figures, altered timestamps, or conflicting narratives.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-950/80 text-amber-300 rounded-full border border-amber-500/30 w-fit">
            {conflicts.length} Discrepancy Identified
          </span>
        </div>

        {/* Conflicts List */}
        <div className="grid grid-cols-1 gap-6 mt-6">
          {conflicts.map((c) => (
            <div
              key={c.id}
              className="bg-slate-950/80 border border-amber-800/60 rounded-xl p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center justify-center shrink-0">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{c.type}</h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {c.id}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider w-fit">
                  {c.severity} Severity Contradiction
                </span>
              </div>

              {/* Side-by-Side Comparison Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Source A */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        Source A: Evidence Demand
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {c.sourceA.evidenceId}
                      </span>
                    </div>
                    <div className="mt-3 text-lg font-mono font-bold text-rose-400">
                      {c.sourceA.value}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Lure claimed: Exact ₹5,000 fee required for unblocking.
                  </div>
                </div>

                {/* Source B */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        Source B: Financial Ledger
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {c.sourceB.evidenceId}
                      </span>
                    </div>
                    <div className="mt-3 text-lg font-mono font-bold text-emerald-400">
                      {c.sourceB.value}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Bank debit recorded: ₹4,999 (Net Discrepancy: ₹1).
                  </div>
                </div>
              </div>

              {/* Forensic Rationale */}
              <div className="mt-4 p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-lg flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong>Forensic Modus Operandi Analysis: </strong>
                  {c.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
