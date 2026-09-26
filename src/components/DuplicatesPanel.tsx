import React, { useState } from "react";
import { AlertTriangle, Eye, EyeOff, FileText } from "lucide-react";

interface DuplicateRecord {
  id: string;
  sources: Array<{ file: string; location: string }>;
}

interface DuplicatesPanelProps {
  duplicates: DuplicateRecord[];
}

export const DuplicatesPanel: React.FC<DuplicatesPanelProps> = ({ duplicates }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="cb-surface p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-cb-border mb-6">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-cb-warning" />
            Duplicate Records
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Redundant evidence entries across sources.
          </p>
        </div>
        <span className="cb-badge cb-badge-warning">{duplicates.length}</span>
      </div>

      <div className="space-y-3">
        {duplicates.map((dup) => (
          <div
            key={dup.id}
            className="bg-cb-bg/40 rounded-cb-md border border-cb-border"
          >
            <button
              onClick={() => setExpandedId(expandedId === dup.id ? null : dup.id)}
              className="w-full text-left p-3 flex items-center justify-between hover:bg-cb-surface transition-all rounded-cb-md"
            >
              <div>
                <div className="text-xs font-bold text-cb-text">ID: {dup.id}</div>
                <div className="text-[10px] text-cb-muted">Found in {dup.sources.length} sources</div>
              </div>
              {expandedId === dup.id ? (
                <EyeOff className="w-4 h-4 text-cb-muted" />
              ) : (
                <Eye className="w-4 h-4 text-cb-muted" />
              )}
            </button>

            {expandedId === dup.id && (
              <div className="px-3 pb-3 pt-0 space-y-2 border-t border-cb-border-subtle mt-1 pt-2">
                {dup.sources.map((source, idx) => (
                  <div key={idx} className="text-xs bg-cb-surface p-2 rounded-cb-sm border border-cb-border flex items-center gap-2">
                    <FileText className="w-3 h-3 text-cb-muted" />
                    <span className="text-cb-text-secondary truncate">{source.file}</span>
                    <span className="text-[10px] text-cb-muted font-mono ml-auto">{source.location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
