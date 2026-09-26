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
      <div className="cb-surface p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
          <div>
            <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-cb-critical" />
              Stage 4a: Missing Information & Investigatory Gaps
            </h3>
            <p className="text-xs text-cb-muted mt-1">
              Automated audit identifying incomplete transaction fields, missing settlement identifiers, and unobtained subpoena evidence.
            </p>
          </div>
          <span className="cb-badge cb-badge-critical">
            {gaps.length} Actionable Gaps Flagged
          </span>
        </div>

        {/* Gaps List */}
        <div className="grid grid-cols-1 gap-4">
          {gaps.map((gap) => {
            const isHigh = gap.severity === "high";

            return (
              <div
                key={gap.id}
                className={`rounded-cb-md p-5 border transition-all ${
                  isHigh
                    ? "bg-cb-critical/5 border-cb-critical/30 shadow-sm"
                    : "bg-cb-warning/5 border-cb-warning/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cb-border gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-cb-sm flex items-center justify-center shrink-0 border ${
                        isHigh
                          ? "bg-cb-critical/10 text-cb-critical border-cb-critical/30"
                          : "bg-cb-warning/10 text-cb-warning border-cb-warning/30"
                      }`}
                    >
                      {gap.field.includes("UTR") ? (
                        <FileKey className="w-4 h-4" />
                      ) : gap.field.includes("Bank") || gap.field.includes("IFSC") ? (
                        <Landmark className="w-4 h-4" />
                      ) : (
                        <Radio className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-cb-text flex items-center gap-2">
                        <span>{gap.field}</span>
                      </h4>
                      <span className="text-[10px] font-mono text-cb-muted">
                        Evidence Scope: {gap.sourceEvidenceIds.join(", ")}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`cb-badge text-[10px] ${
                      isHigh
                        ? "cb-badge-critical"
                        : "cb-badge-warning"
                    }`}
                  >
                    {gap.severity} Priority
                  </span>
                </div>

                <p className="text-xs text-cb-text-secondary mt-3 leading-relaxed">
                  {gap.description}
                </p>

                {/* Investigatory Resolution Guidance */}
                <div className="mt-4 pt-3 border-t border-cb-border bg-cb-bg/60 rounded-cb-sm p-3">
                  <div className="text-[11px] font-semibold text-cb-text flex items-center gap-1.5 mb-1">
                    <ArrowRight className="w-3.5 h-3.5 text-cb-primary" />
                    Recommended Law Enforcement / Bank Ombudsman Step:
                  </div>
                  <p className="text-[11px] text-cb-muted">
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
