import React, { useState } from "react";
import { Incident } from "../types/incident";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Share2,
  Download,
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
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const phone = incident.extractedEntities?.phones?.[0] || "+919876543210";
  const upi = incident.extractedEntities?.upiIds?.[0] || "user@oksbi";
  const account = incident.extractedEntities?.accounts?.[0] || "4521";
  const rawMsg = incident.evidence?.[0]?.extractedText || "";

  return (
    <div className="cb-surface p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cb-primary" />
            Stage 6: Privacy Protection & PII Redaction Sandbox
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Zero-leakage privacy engine masking PII (Phone numbers, UPI handles, Bank accounts) for safe cross-agency distribution.
          </p>
        </div>

        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className={`px-3.5 py-1.5 rounded-cb-md text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
            isRevealed
              ? "bg-cb-critical/10 text-cb-critical border-cb-critical/30 hover:bg-cb-critical/20"
              : "bg-cb-success/10 text-cb-success border-cb-success/30 hover:bg-cb-success/20"
          }`}
        >
          {isRevealed ? (
            <>
              <Unlock className="w-4 h-4" />
              <span>UNMASKED MODE (Active)</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>REDACTED MODE (Protected)</span>
            </>
          )}
        </button>
      </div>

      {/* PII Entity Mapping Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "MSISDN / Mobile Number",
            value: isRevealed ? phone : maskPhoneNumber(phone),
            desc: isRevealed ? "Raw victim/attacker number" : "Masked with 6-digit obfuscation",
          },
          {
            label: "Beneficiary UPI VPA",
            value: isRevealed ? upi : maskUPI(upi),
            desc: isRevealed ? "Raw payment handle" : "Masked handle with PSP preservation",
          },
          {
            label: "Bank Account Identifier",
            value: isRevealed ? `XXXX${account}` : maskAccountNumber(account),
            desc: isRevealed ? "Raw account digits" : "Masked card/account token",
          },
        ].map((item) => (
          <div key={item.label} className="bg-cb-bg/40 p-4 rounded-cb-md border border-cb-border">
            <div className="text-[10px] uppercase font-bold text-cb-muted mb-1">{item.label}</div>
            <div className="text-sm font-mono font-bold text-cb-text">{item.value}</div>
            <div className="text-[10px] text-cb-muted mt-1">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Live Text Redaction Sandbox */}
      <div className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-4">
        <div className="text-xs font-bold text-cb-text mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cb-primary" />
            Live Evidence Redaction Buffer Preview
          </span>
          <span className="text-[10px] font-mono text-cb-muted">
            State: {isRevealed ? "Original Forensic Source" : "Sanitized Output"}
          </span>
        </div>
        <pre className="text-xs font-mono text-cb-text-secondary p-4 bg-cb-surface rounded-cb-sm border border-cb-border overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {isRevealed ? rawMsg : redactText(rawMsg)}
        </pre>
      </div>

      {/* Export Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-cb-border">
        <button
          onClick={() => exportShareableRedactedJSON(incident)}
          className="cb-btn-primary flex items-center gap-2 text-xs cursor-pointer shadow-sm"
        >
          <Share2 className="w-4 h-4" /> Download Shareable Redacted JSON
        </button>
        <button
          onClick={() => exportFullForensicJSON(incident)}
          className="cb-btn-ghost flex items-center gap-2 text-xs cursor-pointer"
        >
          <Download className="w-4 h-4" /> Download Full Forensic JSON (Local)
        </button>
      </div>
    </div>
  );
};
