import React from "react";
import { Incident } from "../types/incident";
import { FileText, Download, Printer, Share2, ShieldCheck } from "lucide-react";
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
    <div className="cb-surface p-8 shadow-sm space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-cb-border">
        <h2 className="text-xl font-bold text-cb-text flex items-center gap-3">
          <FileText className="w-6 h-6 text-cb-primary" />
          Incident Report Dossier
        </h2>
        <span className="cb-badge cb-badge-idle font-mono">
          {incident.meta.caseId}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cb-text uppercase tracking-wider">1. Case Summary</h3>
            <div className="bg-cb-bg/40 rounded-cb-md p-4 border border-cb-border space-y-2">
              <div className="flex justify-between text-xs"><span className="text-cb-muted">Status</span><span className="text-cb-primary font-bold">{incident.meta.status.toUpperCase()}</span></div>
              <div className="flex justify-between text-xs"><span className="text-cb-muted">Fraud Type</span><span className="text-cb-text-secondary">{incident.summary.fraudType}</span></div>
              <div className="flex justify-between text-xs"><span className="text-cb-muted">Loss</span><span className="text-cb-critical font-bold">₹{incident.summary.estimatedLoss.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cb-text uppercase tracking-wider">2. Timeline</h3>
            <div className="space-y-2">
              {incident.timeline.slice(0, 3).map((event) => (
                <div key={event.id} className="flex gap-3 text-xs bg-cb-surface p-2 rounded-cb-sm border border-cb-border">
                  <div className="font-mono text-cb-muted shrink-0 w-12">{event.time}</div>
                  <div className="text-cb-text-secondary truncate">{event.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cb-text uppercase tracking-wider">3. Evidence Overview</h3>
            <div className="bg-cb-surface rounded-cb-md p-4 border border-cb-border text-xs text-cb-text-secondary">
              {incident.evidence.length} forensic artifacts ingested. Hash-chain integrity verified.
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cb-text uppercase tracking-wider">4. Transactions</h3>
            <div className="space-y-2">
                {incident.transactions.slice(0, 3).map(t => (
                    <div key={t.id} className="flex justify-between p-2 bg-cb-bg/40 border border-cb-border rounded-cb-sm text-xs">
                        <span className="font-mono text-cb-text">₹{t.amount?.toLocaleString()}</span>
                        <span className="text-cb-muted">{t.upiId}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-cb-border flex gap-3 justify-end no-print">
        <button onClick={() => exportShareableRedactedJSON(incident)} className="cb-btn-primary flex items-center gap-2 text-xs">
          <Share2 className="w-4 h-4" /> Export Redacted
        </button>
        <button onClick={() => exportFullForensicJSON(incident)} className="cb-btn-ghost flex items-center gap-2 text-xs">
          <Download className="w-4 h-4" /> Export Full
        </button>
        <button onClick={printIncidentReport} className="cb-btn-ghost flex items-center gap-2 text-xs">
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>
    </div>
  );
};
