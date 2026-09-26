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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        No entities extracted. Ingest evidence items to parse forensic entities.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              Stage 2: Deterministic Entity Extraction Grid
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated deterministic parsing of URLs, financial amounts, UPI handles, contact numbers, and threat lures.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-950/80 text-blue-300 rounded-full border border-blue-500/30 w-fit">
            Deterministic Regex Engine
          </span>
        </div>

        {/* 6-Grid Extraction Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* 1. URLs & Domains */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Globe className="w-4 h-4 text-blue-400" />
                Target Domains & URLs
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                {entities.urls.length} Detected
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {entities.urls.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No URLs found</div>
              ) : (
                entities.urls.map((u, i) => (
                  <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="font-mono text-blue-300 break-all">{u.raw}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex gap-2">
                      <span>Proto: <strong className="text-rose-400">{u.protocol.toUpperCase()}</strong></span>
                      <span>Host: <strong className="text-slate-300">{u.domain}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Monetary Amounts */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                Financial Amounts
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                {entities.amounts.length} Found
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {entities.formattedAmounts.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No monetary values</div>
              ) : (
                entities.formattedAmounts.map((amt, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold rounded-lg"
                  >
                    {amt}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 3. UPI Handles */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <AtSign className="w-4 h-4 text-purple-400" />
                UPI VPAs / Handles
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                {entities.upiIds.length} Captured
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {entities.upiIds.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No UPI IDs found</div>
              ) : (
                entities.upiIds.map((upi, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-xs font-semibold rounded-lg"
                  >
                    {upi}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 4. Phone Numbers */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Phone className="w-4 h-4 text-amber-400" />
                Phone Numbers
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                {entities.phones.length} Found
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {entities.phones.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No phone numbers</div>
              ) : (
                entities.phones.map((phone, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold rounded-lg"
                  >
                    +91 {phone.replace(/^\+?91/, "")}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 5. UTR / Bank Reference Numbers */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <FileKey className="w-4 h-4 text-rose-400" />
                Bank UTR / Reference IDs
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60">
                {entities.utrs.length} Found
              </span>
            </div>
            <div className="mt-3">
              {entities.utrs.length === 0 ? (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>0 UTR Numbers detected (Investigation Gap Flagged)</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {entities.utrs.map((u, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-800 text-slate-200 font-mono text-xs rounded-lg"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. Social Engineering Keywords */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Urgency & Threat Lures
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800/60">
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
