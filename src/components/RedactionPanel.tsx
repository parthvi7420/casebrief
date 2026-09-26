import React, { useState } from "react";
import { Incident } from "../types/incident";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Download,
  FileCheck,
  Lock,
  Unlock,
  Share2,
} from "lucide-react";
import {
  exportShareableRedactedJSON,
  exportFullForensicJSON,
} from "../utils/export";
import {
  maskPhoneNumber,
  maskUPI,
  maskAccountNumber,
  maskEmail,
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
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Stage 6: Privacy Protection & PII Redaction Sandbox
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero-leakage privacy engine masking PII (Phone numbers, UPI handles, Bank accounts) for safe cross-agency distribution.
            </p>
          </div>

          {/* Reveal Toggle */}
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              isRevealed
                ? "bg-rose-950/80 text-rose-300 border-rose-500/40 hover:bg-rose-900/80"
                : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80"
            }`}
          >
            {isRevealed ? (
              <>
                <Unlock className="w-4 h-4 text-rose-400" />
                <span>UNMASKED MODE (Active)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>REDACTED MODE (Protected)</span>
              </>
            )}
          </button>
        </div>

        {/* PII Entity Mapping Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Phone */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-400 mb-1">
              MSISDN / Mobile Number
            </div>
            <div className="text-sm font-mono font-bold text-slate-100">
              {isRevealed ? phone : maskPhoneNumber(phone)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {isRevealed ? "Raw victim/attacker number" : "Masked with 6-digit obfuscation"}
            </div>
          </div>

          {/* UPI */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-400 mb-1">
              Beneficiary UPI VPA
            </div>
            <div className="text-sm font-mono font-bold text-slate-100">
              {isRevealed ? upi : maskUPI(upi)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {isRevealed ? "Raw payment handle" : "Masked handle with PSP preservation"}
            </div>
          </div>

          {/* Account */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-400 mb-1">
              Bank Account Identifier
            </div>
            <div className="text-sm font-mono font-bold text-slate-100">
              {isRevealed ? `XXXX${account}` : maskAccountNumber(account)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {isRevealed ? "Raw account digits" : "Masked card/account token"}
            </div>
          </div>
        </div>

        {/* Live Text Redaction Sandbox */}
        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-400" />
              Live Evidence Redaction Buffer Preview
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              State: {isRevealed ? "Original Forensic Source" : "Sanitized Output"}
            </span>
          </div>

          <pre className="mt-3 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            {isRevealed ? rawMsg : redactText(rawMsg)}
          </pre>
        </div>

        {/* Export Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => exportShareableRedactedJSON(incident)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Download Shareable Redacted JSON
          </button>

          <button
            onClick={() => exportFullForensicJSON(incident)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Full Forensic JSON (Local)
          </button>
        </div>
      </div>
    </div>
  );
};
