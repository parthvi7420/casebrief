import React from "react";
import { ExtractedEntities } from "../types/incident";
import {
  Cpu,
  Globe,
  IndianRupee,
  AtSign,
  Phone,
  Mail,
  FileKey,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface ExtractionPanelProps {
  entities?: ExtractedEntities;
}

export const ExtractionPanel: React.FC<ExtractionPanelProps> = ({ entities }) => {
  if (!entities) {
    return (
      <div className="cb-surface border border-cb-border rounded-cb-md p-8 text-center text-cb-muted">
        No entities extracted. Ingest evidence items to parse forensic entities.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="cb-surface p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
          <div>
            <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cb-primary" />
              Stage 2a: Deterministic Entity Extraction Grid
            </h3>
            <p className="text-xs text-cb-muted mt-1">
              Automated deterministic parsing of URLs, financial amounts, UPI handles, contact numbers, and threat lures.
            </p>
          </div>
          <span className="cb-badge cb-badge-hit">
            Deterministic Regex Engine
          </span>
        </div>

        {/* 6-Grid Extraction Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. URLs & Domains */}
          <div className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-4">
            <div className="flex items-center justify-between pb-2 border-b border-cb-border">
              <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
                <Globe className="w-4 h-4 text-cb-primary" />
                Target Domains & URLs
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-primary/10 text-cb-primary border border-cb-primary/30">
                {entities.urls.length} Detected
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {entities.urls.length === 0 ? (
                <div className="text-xs text-cb-muted italic">No URLs found</div>
              ) : (
                entities.urls.map((u, i) => (
                  <div key={i} className="bg-cb-surface p-2.5 rounded-cb-sm border border-cb-border text-xs">
                    <div className="font-mono text-cb-primary break-all">{u.raw}</div>
                    <div className="text-[10px] text-cb-muted mt-1 flex gap-2">
                      <span>Proto: <strong className="text-cb-critical">{u.protocol.toUpperCase()}</strong></span>
                      <span>Host: <strong className="text-cb-text">{u.domain}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Monetary Amounts */}
          <div className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-4">
            <div className="flex items-center justify-between pb-2 border-b border-cb-border">
              <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
                <IndianRupee className="w-4 h-4 text-cb-success" />
                Financial Amounts
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-success/10 text-cb-success border border-cb-success/30">
                {entities.amounts.length} Found
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {entities.formattedAmounts.length === 0 ? (
                <div className="text-xs text-cb-muted italic">No monetary values</div>
              ) : (
                entities.formattedAmounts.map((amt, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-cb-success/10 border border-cb-success/30 text-cb-success font-mono text-xs font-bold rounded-cb-sm"
                  >
                    {amt}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 3. UPI Handles */}
          <div className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-4">
            <div className="flex items-center justify-between pb-2 border-b border-cb-border">
              <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
                <AtSign className="w-4 h-4 text-cb-primary" />
                UPI VPAs / Handles
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-primary/10 text-cb-primary border border-cb-primary/30">
                {entities.upiIds.length} Captured
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {entities.upiIds.length === 0 ? (
                <div className="text-xs text-cb-muted italic">No UPI IDs found</div>
              ) : (
                entities.upiIds.map((upi, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-cb-primary/10 border border-cb-primary/30 text-cb-primary font-mono text-xs font-semibold rounded-cb-sm"
                  >
                    {upi}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 4. Phone Numbers */}
          <div className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-4">
            <div className="flex items-center justify-between pb-2 border-b border-cb-border">
              <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
                <Phone className="w-4 h-4 text-cb-warning" />
                Phone Numbers
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-warning/10 text-cb-warning border border-cb-warning/30">
                {entities.phones.length} Found
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {entities.phones.length === 0 ? (
                <div className="text-xs text-cb-muted italic">No phone numbers</div>
              ) : (
                entities.phones.map((phone, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-cb-warning/10 border border-cb-warning/30 text-cb-warning font-mono text-xs font-semibold rounded-cb-sm"
                  >
                    +91 {phone.replace(/^\+?91/, "")}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 5. UTR / Bank Reference Numbers */}
          <div className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-4">
            <div className="flex items-center justify-between pb-2 border-b border-cb-border">
              <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
                <FileKey className="w-4 h-4 text-cb-critical" />
                Bank UTR / Reference IDs
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-critical/10 text-cb-critical border border-cb-critical/30">
                {entities.utrs.length} Found
              </span>
            </div>
            <div className="mt-3">
              {entities.utrs.length === 0 ? (
                <div className="text-xs text-cb-critical bg-cb-critical/5 border border-cb-critical/30 p-2.5 rounded-cb-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>0 UTR Numbers detected (Investigation Gap Flagged)</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {entities.utrs.map((u, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-cb-surface text-cb-text font-mono text-xs rounded-cb-sm border border-cb-border"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. Social Engineering Keywords */}
          <div className="bg-cb-bg/40 border border-cb-border rounded-cb-md p-4">
            <div className="flex items-center justify-between pb-2 border-b border-cb-border">
              <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
                <AlertTriangle className="w-4 h-4 text-cb-warning" />
                Urgency & Threat Lures
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-warning/10 text-cb-warning border border-cb-warning/30">
                {entities.keywords.length} Triggers
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entities.keywords.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No panic triggers</div>
              ) : (
                entities.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-orange-950/60 border border-orange-700/40 text-orange-300 text-[11px] font-medium rounded uppercase tracking-wide"
                  >
                    {kw}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
