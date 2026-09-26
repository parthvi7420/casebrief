import React, { useState } from "react";
import { Link2, Eye, EyeOff } from "lucide-react";
import { ForensicAssertion } from "../types/incident";

export interface AssumptionRecord {
  id: string;
  description?: string;
  claim?: string;
  reason?: string;
  rationale?: string;
  status?: "unverified" | "verified" | "disputed" | "CONFIRMED" | "INFERRED" | "ASSUMPTION" | "MISSING" | string;
  displayBadge?: string;
  evidenceIds?: string[];
  sourceEvidenceIds?: string[];
}

interface AssumptionsPanelProps {
  assumptions: (AssumptionRecord | ForensicAssertion)[];
}

export const AssumptionsPanel: React.FC<AssumptionsPanelProps> = ({
  assumptions,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (assumptions.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-blue-400" />
          Stage 4d: Assumptions & Inferred Relationships
        </h3>
        <p className="text-sm text-slate-400">No inferred relationships documented</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            Stage 4d: Assumptions & Forensic Inferences
          </h3>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-950/80 text-blue-300 rounded-full border border-blue-500/30">
            {assumptions.length} Evaluated Assertion(s)
          </span>
        </div>

        <div className="space-y-4 mt-6">
          {assumptions.map((item) => {
            const id = item.id;
            const title = ("claim" in item && item.claim) || ("description" in item && item.description) || "Forensic Assertion";
            const reason = ("rationale" in item && item.rationale) || ("reason" in item && item.reason) || "";
            const badge = ("displayBadge" in item && item.displayBadge) || ("status" in item && String(item.status).toUpperCase()) || "UNVERIFIED";
            const evidence = ("sourceEvidenceIds" in item && item.sourceEvidenceIds) || ("evidenceIds" in item && item.evidenceIds) || [];

            const isVerified = badge.includes("CONFIRMED") || badge === "VERIFIED";
            const isDisputed = badge === "DISPUTED" || badge === "MISSING";

            return (
              <div
                key={id}
                className={`border rounded-lg p-4 ${
                  isVerified
                    ? "bg-emerald-950/30 border-emerald-800/60"
                    : isDisputed
                      ? "bg-red-950/30 border-red-800/60"
                      : "bg-slate-950/80 border-blue-800/60"
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === id ? null : id)
                  }
                  className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
                >
                  <div>
                    <div className="font-bold text-white">{title}</div>
                    <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                      <span>Status:</span>
                      <span
                        className={`font-semibold text-xs px-2 py-0.5 rounded ${
                          isVerified
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : isDisputed
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-amber-950 text-amber-300 border border-amber-800"
                        }`}
                      >
                        {badge}
                      </span>
                    </div>
                  </div>
                  {expandedId === id ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {expandedId === id && (
                  <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                    {reason && (
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Forensic Rationale
                        </div>
                        <div className="text-sm text-slate-300 mt-1">{reason}</div>
                      </div>
                    )}
                    {evidence.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                          Supporting Evidence IDs
                        </div>
                        <div className="text-xs text-slate-400 mt-1 font-mono">
                          {evidence.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
