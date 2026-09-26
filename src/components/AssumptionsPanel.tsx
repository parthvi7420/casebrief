import React, { useState } from "react";
import { AlertTriangle, Eye, EyeOff, Link2 } from "lucide-react";

export interface AssumptionRecord {
  id: string;
  description: string;
  reason: string;
  status: "unverified" | "verified" | "disputed";
  evidenceIds: string[];
}

interface AssumptionsPanelProps {
  assumptions: AssumptionRecord[];
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
          Stage 4d: Assumptions
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
            Stage 4d: Assumptions
          </h3>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-950/80 text-blue-300 rounded-full border border-blue-500/30">
            {assumptions.length} Inferred Relationship
          </span>
        </div>

        <div className="space-y-4 mt-6">
          {assumptions.map((assumption) => (
            <div
              key={assumption.id}
              className={`border rounded-lg p-4 ${
                assumption.status === "verified"
                  ? "bg-emerald-950/30 border-emerald-800/60"
                  : assumption.status === "disputed"
                    ? "bg-red-950/30 border-red-800/60"
                    : "bg-slate-950/80 border-blue-800/60"
              }`}
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === assumption.id ? null : assumption.id)
                }
                className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
              >
                <div>
                  <div className="font-bold text-white">{assumption.description}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    Status:{" "}
                    <span
                      className={
                        assumption.status === "verified"
                          ? "text-emerald-400"
                          : assumption.status === "disputed"
                            ? "text-red-400"
                            : "text-amber-400"
                      }
                    >
                      {assumption.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                {expandedId === assumption.id ? (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedId === assumption.id && (
                <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                      Reasoning
                    </div>
                    <div className="text-sm text-slate-300 mt-1">{assumption.reason}</div>
                  </div>
                  {assumption.evidenceIds.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                        Supporting Evidence
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-mono">
                        {assumption.evidenceIds.join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
