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
      <div className="cb-surface p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-cb-border">
          <h2 className="text-xl font-bold text-cb-text flex items-center gap-2">
            <FileText className="w-5 h-5 text-cb-primary" />
            Forensic Incident Brief & Audit Report
          </h2>
          <span className="cb-badge cb-badge-hit font-mono text-xs">
            {incident.meta.caseId}
          </span>
        </div>

        {/* Report Content Grid */}
        <div className="space-y-6">
          {/* Section 1: Case Summary */}
          <div className="border-l-2 border-cb-primary pl-4 space-y-3">
            <h3 className="text-sm font-bold text-cb-text">1. Case Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-cb-bg/40 p-3 rounded-cb-md border border-cb-border">
                <div className="text-[10px] uppercase font-bold text-cb-muted mb-0.5">Case ID</div>
                <div className="font-mono font-bold text-cb-text">{incident.meta.caseId}</div>
              </div>
              <div className="bg-cb-bg/40 p-3 rounded-cb-md border border-cb-border">
                <div className="text-[10px] uppercase font-bold text-cb-muted mb-0.5">Status</div>
                <div className="font-bold text-cb-primary uppercase">{incident.meta.status}</div>
              </div>
              <div className="bg-cb-bg/40 p-3 rounded-cb-md border border-cb-border">
                <div className="text-[10px] uppercase font-bold text-cb-muted mb-0.5">Fraud Type</div>
                <div className="font-bold text-cb-text">{incident.summary.fraudType}</div>
              </div>
              <div className="bg-cb-bg/40 p-3 rounded-cb-md border border-cb-border">
                <div className="text-[10px] uppercase font-bold text-cb-muted mb-0.5">Estimated Loss</div>
                <div className="font-bold text-cb-critical font-mono">
                  ₹{incident.summary.estimatedLoss.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Incident Timeline */}
          <div className="border-l-2 border-cb-success pl-4 space-y-3">
            <h3 className="text-sm font-bold text-cb-text">2. Incident Timeline</h3>
            <div className="space-y-2">
              {incident.timeline.slice(0, 5).map((event) => (
                <div key={event.id} className="text-xs flex items-start gap-3 bg-cb-bg/40 p-2.5 rounded-cb-md border border-cb-border">
                  <div className="font-mono text-cb-primary font-bold w-20 shrink-0">{event.time}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-cb-text">{event.title}</div>
                    <div className="text-[11px] text-cb-muted mt-0.5">{event.description}</div>
                  </div>
                </div>
              ))}
              {incident.timeline.length > 5 && (
                <div className="text-[10px] text-cb-muted italic">
                  +{incident.timeline.length - 5} more events in full timeline
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Evidence Summary */}
          <div className="border-l-2 border-cb-primary pl-4 space-y-2">
            <h3 className="text-sm font-bold text-cb-text">3. Evidence Summary</h3>
            <div className="text-xs text-cb-text-secondary bg-cb-bg/40 p-3 rounded-cb-md border border-cb-border">
              <strong>{incident.evidence.length}</strong> forensic evidence item(s) ingested, verified via SHA-256 integrity checks, and indexed.
            </div>
          </div>

          {/* Section 4: Transactions */}
          {incident.transactions.length > 0 && (
            <div className="border-l-2 border-cb-warning pl-4 space-y-3">
              <h3 className="text-sm font-bold text-cb-text">4. Transactions Audit</h3>
              <div className="space-y-2">
                {incident.transactions.map((txn) => (
                  <div key={txn.id} className="text-xs bg-cb-bg/40 p-3 rounded-cb-md border border-cb-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold font-mono text-cb-text">₹{(txn.amount || 0).toLocaleString()}</span>
                      {txn.upiId && <span className="text-[10px] text-cb-muted ml-2 font-mono">({txn.upiId})</span>}
                    </div>
                    <span className="text-[10px] font-mono text-cb-muted">{txn.time || txn.date || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Missing Information */}
          {incident.gaps.length > 0 && (
            <div className="border-l-2 border-cb-warning pl-4 space-y-2">
              <h3 className="text-sm font-bold text-cb-text">5. Missing Information (Gaps)</h3>
              <div className="space-y-1.5">
                {incident.gaps.map((gap) => (
                  <div key={gap.field} className="text-xs text-cb-warning bg-cb-warning/10 p-2.5 rounded-cb-md border border-cb-warning/30 flex items-center justify-between">
                    <span>• {gap.field} — {gap.description}</span>
                    <span className="cb-badge cb-badge-warning text-[9px]">Severity: {gap.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Duplicate Records */}
          <div className="border-l-2 border-cb-warning pl-4 space-y-3">
            <h3 className="text-sm font-bold text-cb-text">6. Duplicate Records (Non-Destructive)</h3>
            {incident.duplicates && incident.duplicates.length > 0 ? (
              <div className="space-y-2">
                {incident.duplicates.map((dup) => (
                  <div key={dup.id} className="text-xs bg-cb-bg/40 p-3 rounded-cb-md border border-cb-border">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cb-text">{dup.description}</span>
                      <span className="cb-badge cb-badge-warning text-[9px]">
                        {dup.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-cb-muted mt-1">
                      Matched Attributes: {dup.duplicateFields.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-cb-muted">No duplicate records detected</div>
            )}
          </div>

          {/* Section 7: Contradictions */}
          {incident.conflicts.length > 0 && (
            <div className="border-l-2 border-cb-critical pl-4 space-y-3">
              <h3 className="text-sm font-bold text-cb-text">7. Contradictions & Discrepancies</h3>
              <div className="space-y-2">
                {incident.conflicts.map((conflict) => (
                  <div key={conflict.id} className="text-xs bg-cb-critical/10 p-3 rounded-cb-md border border-cb-critical/30">
                    <div className="font-bold text-cb-critical">{conflict.type}</div>
                    <div className="text-cb-text mt-1 text-xs font-mono">
                      {conflict.sourceA.value} vs {conflict.sourceB.value}
                    </div>
                    <div className="text-[10px] text-cb-muted mt-1">Severity: {conflict.severity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 8: Assumptions & Inferences */}
          <div className="border-l-2 border-cb-primary pl-4 space-y-3">
            <h3 className="text-sm font-bold text-cb-text">8. Assumptions & Forensic Truth Classification</h3>
            {incident.assumptions && incident.assumptions.length > 0 ? (
              <div className="space-y-2">
                {incident.assumptions.map((assertion) => (
                  <div key={assertion.id} className="text-xs bg-cb-bg/40 p-3 rounded-cb-md border border-cb-border">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-cb-text">{assertion.claim}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          assertion.level === "CONFIRMED"
                            ? "bg-cb-success/20 text-cb-success border border-cb-success/30"
                            : "bg-cb-warning/20 text-cb-warning border border-cb-warning/30"
                        }`}
                      >
                        {assertion.displayBadge || assertion.level}
                      </span>
                    </div>
                    <div className="text-[10px] text-cb-muted mt-1">{assertion.rationale}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-cb-muted">No inferred relationships documented</div>
            )}
          </div>

          {/* Section 9: Reporting Checklist */}
          <div className="border-l-2 border-cb-primary pl-4 space-y-3">
            <h3 className="text-sm font-bold text-cb-text">9. Incident Reporting Checklist Status</h3>
            {incident.checklist ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-cb-text font-semibold">
                    Readiness: <strong>{incident.checklist.completionPercentage}%</strong> Complete
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      incident.checklist.overallComplete
                        ? "bg-cb-success/20 text-cb-success border border-cb-success/30"
                        : "bg-cb-warning/20 text-cb-warning border border-cb-warning/30"
                    }`}
                  >
                    {incident.checklist.overallComplete ? "PASSED MANDATORY VALIDATION" : "PENDING DETAILS"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {incident.checklist.items.map((item) => (
                    <div key={item.id} className="text-xs flex items-center gap-2 p-2 rounded-cb-sm bg-cb-bg/40 border border-cb-border">
                      <span className={item.status === "pass" ? "text-cb-success font-bold" : "text-cb-warning font-bold"}>
                        {item.status === "pass" ? "✓" : "⚠"}
                      </span>
                      <span className="text-cb-text truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-cb-muted">See detailed checklist before export</div>
            )}
          </div>

          {/* Section 10: Source Traceability Matrix */}
          <div className="border-l-2 border-cb-primary pl-4 space-y-3">
            <h3 className="text-sm font-bold text-cb-text">10. Granular Source Traceability Matrix</h3>
            {incident.sourceReferences && incident.sourceReferences.length > 0 ? (
              <div className="space-y-1.5 text-xs">
                {incident.sourceReferences.slice(0, 8).map((ref) => (
                  <div key={ref.id} className="flex justify-between items-center p-2 rounded-cb-sm bg-cb-bg/40 border border-cb-border">
                    <span className="font-mono text-cb-primary font-bold">{ref.extractedValue}</span>
                    <span className="text-cb-muted font-mono text-[10px]">
                      {ref.filename} ({ref.location})
                    </span>
                  </div>
                ))}
                {incident.sourceReferences.length > 8 && (
                  <div className="text-[10px] text-cb-muted italic mt-1">
                    +{incident.sourceReferences.length - 8} more granular source coordinates mapped in full audit export
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1 text-xs">
                {incident.evidence.map((ev) => (
                  <div key={ev.id} className="text-cb-text-secondary">
                    • {ev.filename || ev.id} ({ev.type})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 11: Privacy / Redaction Status */}
          <div className="border-l-2 border-cb-success pl-4 space-y-2">
            <h3 className="text-sm font-bold text-cb-text">11. Privacy / Redaction Status</h3>
            <div className="text-xs text-cb-success bg-cb-success/10 p-3 rounded-cb-md border border-cb-success/30 space-y-1">
              <div>✓ Sensitive data redacted by default</div>
              <div>✓ Shareable export available</div>
              <div>✓ Full local export available</div>
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-8 pt-6 border-t border-cb-border flex flex-wrap gap-3 no-print">
          <button
            onClick={() => exportShareableRedactedJSON(incident)}
            className="cb-btn-primary flex items-center gap-2 text-xs cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Export Shareable Redacted JSON
          </button>

          <button
            onClick={() => exportFullForensicJSON(incident)}
            className="cb-btn-ghost flex items-center gap-2 text-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Full Forensic JSON
          </button>

          <button
            onClick={printIncidentReport}
            className="cb-btn-ghost flex items-center gap-2 text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};
