import React, { useState } from "react";
import { AlertTriangle, Eye, EyeOff, Layers } from "lucide-react";
import { DuplicateFinding } from "../types/incident";

export interface DuplicateRecord {
  id: string;
  sources?: Array<{ file: string; location: string }>;
  description?: string;
  type?: string;
  status?: string;
  confidence?: number;
  duplicateFields?: string[];
  recordA?: any;
  recordB?: any;
}

interface DuplicatesPanelProps {
  duplicates: (DuplicateRecord | DuplicateFinding)[];
}

export const DuplicatesPanel: React.FC<DuplicatesPanelProps> = ({ duplicates }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (duplicates.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-emerald-400" />
          Stage 4b: Duplicate Records (Non-Destructive)
        </h3>
        <p className="text-sm text-slate-400">No duplicate records detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Stage 4b: Duplicate Records (Non-Destructive Flagging)
          </h3>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-950/80 text-amber-300 rounded-full border border-amber-500/30">
            {duplicates.length} Duplicate(s) Identified
          </span>
        </div>

        <div className="space-y-4 mt-6">
          {duplicates.map((item) => {
            const id = item.id;
            const description = item.description || "Identical transaction record detected across evidence files";
            const status = ("status" in item && item.status) || "DUPLICATE";
            const confidence = ("confidence" in item && item.confidence) ? Math.round(item.confidence * 100) : null;
            const duplicateFields = ("duplicateFields" in item && item.duplicateFields) || [];

            // Extract source info
            let sourceList: Array<{ file: string; location: string }> = [];
            if ("sources" in item && item.sources) {
              sourceList = item.sources;
            } else if ("recordA" in item && "recordB" in item) {
              const recA = item.recordA;
              const recB = item.recordB;
              sourceList = [
                {
                  file: recA.sourceEvidenceId || "Evidence File A",
                  location: `Row ${recA.sourceRowIndex || 1} • Ref: ${recA.transactionReference || "N/A"} • ₹${recA.amount || "N/A"}`,
                },
                {
                  file: recB.sourceEvidenceId || "Evidence File B",
                  location: `Row ${recB.sourceRowIndex || 2} • Ref: ${recB.transactionReference || "N/A"} • ₹${recB.amount || "N/A"}`,
                },
              ];
            }

            return (
              <div
                key={id}
                className="bg-slate-950/80 border border-amber-800/60 rounded-lg p-4"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === id ? null : id)
                  }
                  className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{description}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        {status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 mt-1 flex items-center gap-3">
                      <span>Sources: {sourceList.length}</span>
                      {confidence !== null && (
                        <span>Confidence: <strong className="text-emerald-400">{confidence}%</strong></span>
                      )}
                    </div>
                  </div>
                  {expandedId === id ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {expandedId === id && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                    {duplicateFields.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
                          Matching Attributes
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {duplicateFields.map((f, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                        Source Locations (Preserved Intact)
                      </div>
                      <div className="space-y-2">
                        {sourceList.map((source, idx) => (
                          <div
                            key={idx}
                            className="text-sm bg-slate-900 p-2.5 rounded border border-slate-800"
                          >
                            <div className="text-slate-200 font-semibold flex items-center gap-2">
                              <span>📄</span> {source.file}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-1">
                              {source.location}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
