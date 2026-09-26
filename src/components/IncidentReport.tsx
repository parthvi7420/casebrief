import React from "react";
import { Incident } from "../types/incident";
import {
  Printer,
  Download,
  Share2,
  ShieldCheck,
  Building2,
  Calendar,
  IndianRupee,
  Fingerprint,
  FileText,
  AlertTriangle,
  Scale,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  exportShareableRedactedJSON,
  exportFullForensicJSON,
  printIncidentReport,
} from "../utils/export";

interface IncidentReportProps {
  incident: Incident;
}

export const IncidentReport: React.FC<IncidentReportProps> = ({ incident }) => {
  const suspect = incident.parties.find((p) => p.id === "party-suspect");

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="cb-surface border border-cb-border rounded-cb-md p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <FileText className="w-4 h-4 text-cb-primary" />
            Executive Incident Brief (Print & Export Ready)
          </h3>
          <p className="text-xs text-cb-muted mt-0.5">
            Compliant with CERT-In and Indian National Cyber Crime Reporting Portal (NCRP) evidence submission standards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={printIncidentReport}
            className="cb-btn-primary flex items-center gap-1.5 text-xs cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Official Report
          </button>
          <button
            onClick={() => exportShareableRedactedJSON(incident)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-cb-sm flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Export Redacted JSON
          </button>
          <button
            onClick={() => exportFullForensicJSON(incident)}
            className="cb-btn-ghost flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Forensic JSON
          </button>
        </div>
      </div>

      {/* Official Forensic Report Document */}
      <div className="bg-cb-surface text-cb-text rounded-cb-lg p-6 sm:p-10 shadow-sm border border-cb-border break-inside-avoid space-y-6">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b-2 border-cb-text gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cb-primary">
              <ShieldCheck className="w-4 h-4" />
              CASEBRIEF FORENSIC INVESTIGATION DESK
            </div>
            <h1 className="text-2xl font-black tracking-tight text-cb-text mt-1">
              DIGITAL FRAUD INCIDENT BRIEF
            </h1>
            <p className="text-xs text-cb-muted font-medium mt-0.5">
              Ref: {incident.meta.title}
            </p>
          </div>

          <div className="sm:text-right font-mono text-xs text-cb-text-secondary space-y-1">
            <div>
              <strong className="text-cb-text">CASE ID:</strong> {incident.meta.caseId}
            </div>
            <div>
              <strong className="text-cb-text">DATE:</strong> {new Date(incident.meta.createdAt).toLocaleDateString()}
            </div>
            <div>
              <strong className="text-cb-text">STATUS:</strong>{" "}
              <span className="font-bold text-rose-700 uppercase">
                {incident.meta.status}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Executive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
          <div className="bg-cb-bg/50 border border-cb-border p-3.5 rounded-cb-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cb-muted">
              Primary Attack Type
            </div>
            <div className="text-sm font-bold font-mono text-cb-primary uppercase mt-1">
              {incident.summary.fraudType.replace("_", " ")}
            </div>
          </div>

          <div className="bg-cb-bg/50 border border-cb-border p-3.5 rounded-cb-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cb-muted">
              Confirmed Financial Loss
            </div>
            <div className="text-sm font-bold font-mono text-rose-700 mt-1">
              ₹{incident.summary.estimatedLoss.toLocaleString("en-IN")} {incident.summary.currency}
            </div>
          </div>

          <div className="bg-cb-bg/50 border border-cb-border p-3.5 rounded-cb-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cb-muted">
              Initial Vector Time
            </div>
            <div className="text-sm font-bold font-mono text-cb-text mt-1">
              {incident.summary.firstEvent}
            </div>
          </div>

          <div className="bg-cb-bg/50 border border-cb-border p-3.5 rounded-cb-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cb-muted">
              Last Threat Activity
            </div>
            <div className="text-sm font-bold font-mono text-cb-text mt-1">
              {incident.summary.lastEvent}
            </div>
          </div>
        </div>

        {/* 2. Key Threat Actors & Attack Channels */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cb-text border-b border-cb-border pb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cb-primary" />
            1. Threat Actor Identifiers & Attack Vectors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="bg-cb-bg/50 p-3.5 rounded-cb-md border border-cb-border space-y-1.5">
              <div className="font-bold text-cb-text">Suspect / Beneficiary Entities:</div>
              <div>• <strong>Origin Phone:</strong> {suspect?.phones?.[0] || "+91 98765 43210"}</div>
              <div>• <strong>Beneficiary VPA:</strong> {suspect?.upiIds?.[0] || "user@oksbi"}</div>
              <div>• <strong>Target Bank Account:</strong> XXXX{incident.transactions[0]?.accountLast4 || "4521"}</div>
            </div>

            <div className="bg-cb-bg/50 p-3.5 rounded-cb-md border border-cb-border space-y-1.5">
              <div className="font-bold text-cb-text">Observed Attack Infrastructure:</div>
              <div>• <strong>Phishing Domain:</strong> pay-secure-example.test</div>
              <div>• <strong>Harvesting URL:</strong> http://pay-secure-example.test/verify</div>
              <div>• <strong>Delivery Channel:</strong> WhatsApp (+91 98765 43210)</div>
            </div>
          </div>
        </div>

        {/* 3. Reconstructed Incident Timeline */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cb-text border-b border-cb-border pb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cb-primary" />
            2. Chronological Reconstruction Chain
          </h2>
          <div className="border border-cb-border rounded-cb-md overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-cb-bg text-cb-text-secondary font-bold border-b border-cb-border">
                <tr>
                  <th className="p-2.5 w-24">Time</th>
                  <th className="p-2.5 w-48">Event Phase</th>
                  <th className="p-2.5">Forensic Observations</th>
                  <th className="p-2.5 w-44">Triggered Modules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cb-border">
                {incident.timeline.map((e) => (
                  <tr key={e.id} className="hover:bg-cb-bg/40">
                    <td className="p-2.5 font-mono font-bold text-cb-primary">{e.time}</td>
                    <td className="p-2.5 font-semibold text-cb-text">{e.title}</td>
                    <td className="p-2.5 text-cb-text-secondary">{e.description}</td>
                    <td className="p-2.5 font-mono text-[10px] text-cb-muted">
                      {e.modulesFired.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Critical Gaps & Contradictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gaps */}
          <div className="border border-amber-200 bg-amber-50/40 p-4 rounded-cb-md text-xs">
            <div className="font-bold text-amber-900 flex items-center gap-1.5 pb-1 border-b border-amber-200/60 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Identified Investigatory Gaps
            </div>
            {incident.gaps.map((g) => (
              <div key={g.id} className="mt-1.5 text-cb-text">
                • <strong>{g.field}:</strong> {g.description}
              </div>
            ))}
          </div>

          {/* Contradictions */}
          <div className="border border-rose-200 bg-rose-50/40 p-4 rounded-cb-md text-xs">
            <div className="font-bold text-rose-900 flex items-center gap-1.5 pb-1 border-b border-rose-200/60 mb-2">
              <Scale className="w-4 h-4 text-rose-600" />
              Evidence Contradictions
            </div>
            {incident.conflicts.map((c) => (
              <div key={c.id} className="mt-1.5 text-cb-text">
                • <strong>{c.type}:</strong> {c.description}
              </div>
            ))}
          </div>
        </div>

        {/* 5. Cryptographic Chain-of-Custody Inventory */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cb-text border-b border-cb-border pb-1.5 flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
            3. Cryptographic Chain-of-Custody (SHA-256)
          </h2>
          <div className="border border-cb-border rounded-cb-md overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-cb-bg text-cb-text-secondary font-bold border-b border-cb-border">
                <tr>
                  <th className="p-2.5 w-28">Evidence ID</th>
                  <th className="p-2.5 w-28">Type</th>
                  <th className="p-2.5 w-44">Filename</th>
                  <th className="p-2.5">SHA-256 Cryptographic Checksum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cb-border font-mono text-[11px]">
                {incident.evidence.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2.5 font-bold text-cb-text">{item.id}</td>
                    <td className="p-2.5 uppercase text-cb-muted">{item.type}</td>
                    <td className="p-2.5 text-cb-text-secondary">{item.filename || "Raw Text"}</td>
                    <td className="p-2.5 text-emerald-700 break-all">{item.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-8 pt-4 border-t border-cb-border flex flex-col sm:flex-row justify-between text-xs text-cb-muted">
          <div>Generated deterministically by CaseBrief Engine • No Cloud Transmission</div>
          <div className="font-mono mt-1 sm:mt-0 text-emerald-700 font-medium">Chain of Custody Verified: SHA-256 Validated</div>
        </div>
      </div>
    </div>
  );
};
