import React, { useState } from "react";
import { Incident } from "../types/incident";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Share2,
  Download,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  exportShareableRedactedJSON,
  exportFullForensicJSON,
} from "../utils/export";
import {
  maskPhoneNumber,
  maskUPI,
  maskAccountNumber,
  redactText,
} from "../logic/redaction";

interface RedactionPanelProps {
  incident: Incident;
}

export const RedactionPanel: React.FC<RedactionPanelProps> = ({ incident }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const suspect = incident.parties.find((p) => p.id === "party-suspect");
  const phone = suspect?.phones?.[0] || "+919876543210";
  const upi = suspect?.upiIds?.[0] || "user@oksbi";
  const account = incident.transactions[0]?.accountLast4 || "4521";
  const rawMsg = incident.evidence[0]?.extractedText || "";

  return (
    <div className="cb-surface p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
        <div>
          <h3 className="text-lg font-bold text-cb-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cb-primary" />
            Stage 6: Privacy Sandbox
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Securely mask PII for safe cross-agency distribution.
          </p>
        </div>

        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className={`px-4 py-2 rounded-cb-md text-xs font-bold flex items-center gap-2 border transition-all ${
            isRevealed
              ? "bg-cb-critical/10 text-cb-critical border-cb-critical/30"
              : "bg-cb-success/10 text-cb-success border-cb-success/30"
          }`}
        >
          {isRevealed ? (
            <>
              <Unlock className="w-4 h-4" />
              <span>UNMASKED</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>REDACTED</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "MSISDN", value: isRevealed ? phone : maskPhoneNumber(phone) },
          { label: "Beneficiary UPI", value: isRevealed ? upi : maskUPI(upi) },
          { label: "Account ID", value: isRevealed ? `XXXX${account}` : maskAccountNumber(account) },
        ].map((item) => (
          <div key={item.label} className="bg-cb-bg/40 p-4 rounded-cb-md border border-cb-border">
            <div className="text-[10px] uppercase font-bold text-cb-muted mb-1">{item.label}</div>
            <div className="text-sm font-mono font-bold text-cb-text">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-4">
        <div className="text-xs font-bold text-cb-text mb-3 flex items-center gap-2">
           <FileText className="w-4 h-4 text-cb-primary" /> Evidence Buffer
        </div>
        <pre className="text-xs font-mono text-cb-text-secondary p-4 bg-cb-surface rounded-cb-sm border border-cb-border overflow-x-auto whitespace-pre-wrap">
          {isRevealed ? rawMsg : redactText(rawMsg)}
        </pre>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-cb-border">
        <button
          onClick={() => exportShareableRedactedJSON(incident)}
          className="cb-btn-primary flex items-center gap-2 text-xs"
        >
          <Share2 className="w-4 h-4" /> Export Redacted JSON
        </button>
        <button
          onClick={() => exportFullForensicJSON(incident)}
          className="cb-btn-ghost flex items-center gap-2 text-xs"
        >
          <Download className="w-4 h-4" /> Export Full JSON
        </button>
      </div>
    </div>
  );
};
