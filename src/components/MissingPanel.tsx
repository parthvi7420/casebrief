import React from "react";
import { Gap } from "../types/incident";
import {
  AlertCircle,
  FileQuestion,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  FileKey,
  Landmark,
  Radio,
} from "lucide-react";

interface MissingPanelProps {
  gaps: Gap[];
}

export const MissingPanel: React.FC<MissingPanelProps> = ({ gaps }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              Stage 4: Missing Information & Investigatory Gaps
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated audit identifying incomplete transaction fields, missing settlement identifiers, and unobtained subpoena evidence.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-950/80 text-rose-300 rounded-full border border-rose-500/30 w-fit">
            {gaps.length} Actionable Gaps Flagged
          </span>
        </div>

        {/* Gaps List */}
        <div className="grid grid-cols-1 gap-4 mt-6">
          {gaps.map((gap) => {
            const isHigh = gap.severity === "high";

            return (
              <div
                key={gap.id}
                className={`rounded-xl p-5 border transition-all ${
                  isHigh
                    ? "bg-rose-950/20 border-rose-800/60 shadow-sm"
                    : "bg-amber-950/20 border-amber-800/60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isHigh
                          ? "bg-rose-900/40 text-rose-300 border border-rose-700/50"
                          : "bg-amber-900/40 text-amber-300 border border-amber-700/50"
                      }`}
                    >
                      {gap.field.includes("UTR") ? (
                        <FileKey className="w-5 h-5" />
                      ) : gap.field.includes("Bank") || gap.field.includes("IFSC") ? (
                        <Landmark className="w-5 h-5" />
                      ) : (
                        <Radio className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>{gap.field}</span>
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        Evidence Scope: {gap.sourceEvidenceIds.join(", ")}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                      isHigh
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {gap.severity} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {gap.description}
                </p>

                {/* Investigatory Resolution Guidance */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 bg-slate-900/60 rounded-lg p-3">
                  <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    Recommended Law Enforcement / Bank Ombudsman Step:
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {gap.field.includes("UTR")
                      ? "File Form 1420 / Chargeback Notice with Remitting Bank quoting timestamp '10:45 AM' and account ending in '4521' to retrieve 12-digit RRN / UTR."
                      : gap.field.includes("IFSC")
                      ? "Issue Notice under Section 91 CrPC to beneficiary PSP ('oksbi') to freeze beneficiary bank account and obtain KYC records."
                      : "Request Section 91 CrPC telecom subscriber and IPDR records for MSISDN +919876543210 from national telecom service provider."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
