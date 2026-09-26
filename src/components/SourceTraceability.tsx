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
        className="w-full text-left p-4 rounded-cb-md border border-cb-border bg-cb-bg/40 hover:bg-cb-surface transition cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-cb-muted uppercase tracking-wider font-semibold">{title}</div>
            <div className="text-xl font-bold text-cb-text mt-1">{value}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cb-muted">
              Sources: {sources.length}
            </span>
            {showSources ? (
              <EyeOff className="w-4 h-4 text-cb-muted" />
            ) : (
              <Eye className="w-4 h-4 text-cb-muted" />
            )}
          </div>
        </div>
      </button>

      {showSources && (
        <div className="space-y-2 p-4 bg-cb-surface border border-cb-border rounded-cb-md">
          <div className="text-xs text-cb-muted uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-cb-primary" />
            <span>Source Evidence Registry</span>
          </div>
          {sources.map((source, idx) => (
            <div key={idx} className="text-sm bg-cb-bg/60 p-3 rounded-cb-sm border border-cb-border">
              <div className="font-mono text-cb-primary text-xs">{source.file}</div>
              <div className="text-[10px] text-cb-muted mt-0.5">{source.location}</div>
              <div className="text-xs text-cb-text mt-2 font-bold font-mono">{source.extractedValue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

