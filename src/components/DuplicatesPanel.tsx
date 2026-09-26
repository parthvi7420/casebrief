import React, { useState } from "react";
import { AlertTriangle, Eye, EyeOff, Layers, FileText } from "lucide-react";
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
      <div className="cb-surface p-6 shadow-sm">
        <h3 className="text-sm font-bold text-cb-text mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cb-success" />
          Stage 4b: Duplicate Records (Non-Destructive)
        </h3>
        <p className="text-xs text-cb-muted">No duplicate records detected</p>
      </div>
    );
  }

  return (
    <div className="cb-surface p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-cb-border">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <Layers className="w-5 h-5 text-cb-warning" />
            Stage 4b: Duplicate Records (Non-Destructive Flagging)
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Identifies redundant entries while preserving all source records intact.
          </p>
        </div>
        <span className="cb-badge cb-badge-warning">{duplicates.length} Identified</span>
      </div>

      <div className="space-y-3">
        {duplicates.map((item) => {
          const id = item.id;
          const description =
            item.description ||
            "Identical transaction record detected across evidence files";
          const status = ("status" in item && item.status) || "DUPLICATE";
          const confidence =
            "confidence" in item && item.confidence
              ? Math.round(item.confidence * 100)
              : null;
          const duplicateFields =
            ("duplicateFields" in item && item.duplicateFields) || [];

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
                location: `Row ${recA.sourceRowIndex || 1} • Ref: ${
                  recA.transactionReference || "N/A"
                } • ₹${recA.amount || "N/A"}`,
              },
              {
                file: recB.sourceEvidenceId || "Evidence File B",
                location: `Row ${recB.sourceRowIndex || 2} • Ref: ${
                  recB.transactionReference || "N/A"
                } • ₹${recB.amount || "N/A"}`,
              },
            ];
          }

          return (
            <div
              key={id}
              className="bg-cb-bg/40 rounded-cb-md border border-cb-border hover:border-cb-border-subtle transition-all"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === id ? null : id)
                }
                className="w-full text-left p-3 flex items-center justify-between hover:bg-cb-surface transition-all rounded-cb-md cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <div className="text-xs font-bold text-cb-text flex items-center gap-2">
                    <span className="truncate">{description}</span>
                    <span className="cb-badge cb-badge-warning text-[9px] shrink-0">
                      {status}
                    </span>
                  </div>
                  <div className="text-[10px] text-cb-muted mt-1 flex items-center gap-3">
                    <span>Sources: <strong>{sourceList.length}</strong></span>
                    {confidence !== null && (
                      <span>
                        Confidence: <strong className="text-cb-success">{confidence}%</strong>
                      </span>
                    )}
                  </div>
                </div>
                {expandedId === id ? (
                  <EyeOff className="w-4 h-4 text-cb-muted shrink-0" />
                ) : (
                  <Eye className="w-4 h-4 text-cb-muted shrink-0" />
                )}
              </button>

              {expandedId === id && (
                <div className="px-3 pb-3 pt-2 border-t border-cb-border-subtle space-y-3">
                  {duplicateFields.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-cb-muted uppercase tracking-wider mb-1.5">
                        Matching Attributes
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {duplicateFields.map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-cb-surface text-cb-text-secondary border border-cb-border font-mono"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] font-bold text-cb-muted uppercase tracking-wider mb-1.5">
                      Source Locations (Preserved Intact)
                    </div>
                    <div className="space-y-1.5">
                      {sourceList.map((source, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-cb-surface p-2 rounded-cb-sm border border-cb-border flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                        >
                          <div className="text-cb-text-secondary font-semibold flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-cb-primary shrink-0" />
                            <span className="truncate">{source.file}</span>
                          </div>
                          <div className="text-[10px] text-cb-muted font-mono shrink-0">
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
  );
};
