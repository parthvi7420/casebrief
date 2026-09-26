import React, { useState } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";

interface DuplicateRecord {
  id: string;
  sources: Array<{ file: string; location: string }>;
}

interface DuplicatesPanelProps {
  duplicates: DuplicateRecord[];
}

export const DuplicatesPanel: React.FC<DuplicatesPanelProps> = ({ duplicates }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (duplicates.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-emerald-400" />
          Stage 4b: Duplicate Records
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
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Stage 4b: Duplicate Records
          </h3>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-950/80 text-amber-300 rounded-full border border-amber-500/30">
            {duplicates.length} Duplicate Identified
          </span>
        </div>

        <div className="space-y-4 mt-6">
          {duplicates.map((dup) => (
            <div
              key={dup.id}
              className="bg-slate-950/80 border border-amber-800/60 rounded-lg p-4"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === dup.id ? null : dup.id)
                }
                className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
              >
                <div>
                  <div className="font-bold text-white">Record ID: {dup.id}</div>
                  <div className="text-sm text-slate-400">
                    Found in {dup.sources.length} source(s)
                  </div>
                </div>
                {expandedId === dup.id ? (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedId === dup.id && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  {dup.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="text-sm bg-slate-900 p-2 rounded border border-slate-800"
                    >
                      <div className="text-slate-300">📄 {source.file}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {source.location}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
