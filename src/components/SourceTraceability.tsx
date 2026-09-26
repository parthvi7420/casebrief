import React, { useState } from "react";
import { Link2, Eye, EyeOff } from "lucide-react";

export interface SourceRecord {
  id: string;
  file: string;
  location: string;
  extractedValue: string;
}

interface SourceTraceabilityProps {
  title: string;
  value: string | number;
  sources: SourceRecord[];
}

export const SourceTraceability: React.FC<SourceTraceabilityProps> = ({
  title,
  value,
  sources,
}) => {
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setShowSources(!showSources)}
        className="w-full text-left p-4 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-900 transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">{title}</div>
            <div className="text-xl font-bold text-white mt-1">{value}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">
              Sources: {sources.length}
            </span>
            {showSources ? (
              <EyeOff className="w-4 h-4 text-slate-400" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>
      </button>

      {showSources && (
        <div className="space-y-2 p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">
            <Link2 className="w-3 h-3 inline mr-1" />
            Source Records
          </div>
          {sources.map((source, idx) => (
            <div key={idx} className="text-sm bg-slate-900 p-3 rounded border border-slate-800">
              <div className="font-mono text-blue-300">{source.file}</div>
              <div className="text-xs text-slate-500 mt-1">{source.location}</div>
              <div className="text-sm text-slate-300 mt-2 font-bold">{source.extractedValue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
