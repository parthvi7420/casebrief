import React from "react";
import { Incident } from "../types/incident";
import { FileText, Download, Printer, Share2 } from "lucide-react";
import {
  exportShareableRedactedJSON,
  exportFullForensicJSON,
  printIncidentReport,
} from "../utils/export";

interface EnhancedIncidentReportProps {
  incident: Incident;
}

export const EnhancedIncidentReport: React.FC<EnhancedIncidentReportProps> = ({
  incident,
}) => {
  return (
    <div className="space-y-6 print:space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Incident Report
          </h2>
          <span className="text-xs font-mono px-3 py-1 bg-blue-950 text-blue-300 rounded border border-blue-800">
            {incident.meta.caseId}
          </span>
        </div>

        {/* Section 1: Case Summary */}
        <div className="mt-6 space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-bold text-white mb-3">1. Case Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400">Case ID</div>
                <div className="font-mono text-white">{incident.meta.caseId}</div>
              </div>
              <div>
                <div className="text-slate-400">Status</div>
                <div className="font-bold text-blue-400">{incident.meta.status.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-slate-400">Fraud Type</div>
                <div className="text-white">{incident.summary.fraudType}</div>
              </div>
              <div>
                <div className="text-slate-400">Estimated Loss</div>
                <div className="text-red-400 font-bold">
                  ₹{incident.summary.estimatedLoss.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Incident Timeline */}
          <div className="border-l-4 border-green-500 pl-4 pt-4">
            <h3 className="text-lg font-bold text-white mb-3">2. Incident Timeline</h3>
            <div className="space-y-2">
              {incident.timeline.slice(0, 5).map((event) => (
                <div key={event.id} className="text-sm flex gap-3">
                  <div className="font-mono text-slate-400 w-20">{event.time}</div>
                  <div>
                    <div className="font-bold text-white">{event.title}</div>
                    <div className="text-xs text-slate-400">{event.description}</div>
                  </div>
                </div>
              ))}
              {incident.timeline.length > 5 && (
                <div className="text-xs text-slate-500 italic">
                  +{incident.timeline.length - 5} more events
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Evidence Summary */}
          <div className="border-l-4 border-purple-500 pl-4 pt-4">
            <h3 className="text-lg font-bold text-white mb-3">3. Evidence Summary</h3>
            <div className="text-sm text-slate-300">
              {incident.evidence.length} evidence item(s) ingested and processed
            </div>
          </div>

          {/* Section 4: Transactions */}
          {incident.transactions.length > 0 && (
            <div className="border-l-4 border-emerald-500 pl-4 pt-4">
              <h3 className="text-lg font-bold text-white mb-3">4. Transactions</h3>
              <div className="space-y-2">
                {incident.transactions.map((txn) => (
                  <div key={txn.id} className="text-sm bg-slate-950/60 p-2 rounded border border-slate-800">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">₹{(txn.amount || 0).toLocaleString()}</span>
                      <span className="text-slate-400">{txn.time || txn.date || "N/A"}</span>
                    </div>
                    {txn.upiId && <div className="text-xs text-slate-400">UPI: {txn.upiId}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Missing Information */}
          {incident.gaps.length > 0 && (
            <div className="border-l-4 border-amber-500 pl-4 pt-4">
              <h3 className="text-lg font-bold text-white mb-3">5. Missing Information</h3>
              <div className="space-y-1">
                {incident.gaps.map((gap) => (
                  <div key={gap.field} className="text-sm text-amber-300">
                    • {gap.field} — Severity: {gap.severity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Duplicate Records */}
          <div className="border-l-4 border-orange-500 pl-4 pt-4">
            <h3 className="text-lg font-bold text-white mb-3">6. Duplicate Records</h3>
            {incident.duplicates && incident.duplicates.length > 0 ? (
              <div className="space-y-2">
                {incident.duplicates.map((dup) => (
                  <div key={dup.id} className="text-sm bg-orange-950/30 p-3 rounded border border-orange-800/60">
                    <div className="font-bold text-white">{dup.type}: {dup.description}</div>
                    <div className="text-xs text-orange-300 mt-1">
                      {dup.recordA.sourceEvidenceId} ↔ {dup.recordB.sourceEvidenceId}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Matched on: {dup.duplicateFields.join(", ")} — Severity: {dup.severity}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-400">No duplicates detected</div>
            )}
          </div>

          {/* Section 7: Contradictions */}
          {incident.conflicts.length > 0 && (
            <div className="border-l-4 border-red-500 pl-4 pt-4">
              <h3 className="text-lg font-bold text-white mb-3">7. Contradictions</h3>
              <div className="space-y-2">
                {incident.conflicts.map((conflict) => (
                  <div key={conflict.id} className="text-sm bg-red-950/30 p-3 rounded border border-red-800/60">
                    <div className="font-bold text-white">{conflict.type}</div>
                    <div className="text-red-300 mt-1">
                      {conflict.sourceA.value} vs {conflict.sourceB.value}
                    </div>
                    <div className="text-xs text-red-400 mt-1">Severity: {conflict.severity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 8: Assumptions */}
          <div className="border-l-4 border-indigo-500 pl-4 pt-4">
            <h3 className="text-lg font-bold text-white mb-3">8. Assumptions</h3>
            {incident.assumptions && incident.assumptions.length > 0 ? (
              <div className="space-y-2">
                {incident.assumptions.map((asm) => (
                  <div key={asm.id} className="text-sm bg-indigo-950/30 p-3 rounded border border-indigo-800/60">
                    <div className="font-bold text-white">{asm.claim}</div>
                    <div className="text-xs text-indigo-300 mt-1">{asm.rationale}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex justify-between">
                      <span>Sources: {asm.sourceEvidenceIds.join(", ")}</span>
                      <span className="font-semibold text-indigo-400">{asm.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-400">No inferred relationships documented</div>
            )}
          </div>

          {/* Section 9: Reporting Checklist */}
          <div className="border-l-4 border-cyan-500 pl-4 pt-4">
            <h3 className="text-lg font-bold text-white mb-3">9. Reporting Checklist</h3>
            <div className="text-sm text-slate-400">See detailed checklist before export</div>
          </div>

          {/* Section 10: Source References */}
          <div className="border-l-4 border-pink-500 pl-4 pt-4">
            <h3 className="text-lg font-bold text-white mb-3">10. Source References</h3>
            <div className="space-y-1 text-sm">
              {incident.evidence.map((ev) => (
                <div key={ev.id} className="text-slate-300">
                  • {ev.filename || ev.id} ({ev.type})
                </div>
              ))}
            </div>
          </div>

          {/* Section 11: Privacy / Redaction Status */}
          <div className="border-l-4 border-green-500 pl-4 pt-4">
            <h3 className="text-lg font-bold text-white mb-3">11. Privacy / Redaction Status</h3>
            <div className="text-sm text-emerald-300">
              ✓ Sensitive data redacted by default
              <br />✓ Shareable export available
              <br />✓ Full local export available
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-3 no-print">
          <button
            onClick={() => exportShareableRedactedJSON(incident)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            Export Shareable
          </button>

          <button
            onClick={() => exportFullForensicJSON(incident)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold rounded-lg flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            Export Full Local
          </button>

          <button
            onClick={printIncidentReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};
