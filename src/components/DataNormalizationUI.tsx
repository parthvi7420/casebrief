import React, { useState } from "react";
import { Database, Eye, EyeOff, ArrowRight } from "lucide-react";

export interface ColumnMapping {
  sourceColumn: string;
  mappedField: string;
}

export interface DatasetMapping {
  filename: string;
  columnMappings: ColumnMapping[];
}

interface DataNormalizationUIProps {
  datasets: DatasetMapping[];
  onConfirm?: () => void;
}

export const DataNormalizationUI: React.FC<DataNormalizationUIProps> = ({
  datasets,
  onConfirm,
}) => {
  const [expandedDataset, setExpandedDataset] = useState<string | null>(
    datasets[0]?.filename || null
  );

  if (datasets.length === 0) {
    return (
      <div className="cb-surface p-6 shadow-sm">
        <h3 className="text-sm font-bold text-cb-text mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-cb-primary" />
          Dataset Normalization Engine
        </h3>
        <p className="text-xs text-cb-muted">No structured datasets detected</p>
      </div>
    );
  }

  return (
    <div className="cb-surface p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-cb-border">
        <div>
          <h3 className="text-sm font-bold text-cb-text flex items-center gap-2">
            <Database className="w-5 h-5 text-cb-primary" />
            Dataset Normalization & Field Mapping
          </h3>
          <p className="text-xs text-cb-muted mt-1">
            Map raw CSV/bank statement columns to standardized forensic case fields.
          </p>
        </div>
        <span className="cb-badge cb-badge-idle">{datasets.length} Datasets</span>
      </div>

      <div className="space-y-3">
        {datasets.map((dataset) => (
          <div
            key={dataset.filename}
            className="bg-cb-bg/40 rounded-cb-md border border-cb-border"
          >
            <button
              onClick={() =>
                setExpandedDataset(
                  expandedDataset === dataset.filename ? null : dataset.filename
                )
              }
              className="w-full text-left p-3 flex items-center justify-between hover:bg-cb-surface transition-all rounded-cb-md cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-cb-text">{dataset.filename}</div>
                <div className="text-[10px] text-cb-muted mt-0.5">
                  {dataset.columnMappings.length} columns mapped to canonical schema
                </div>
              </div>
              {expandedDataset === dataset.filename ? (
                <EyeOff className="w-4 h-4 text-cb-muted shrink-0" />
              ) : (
                <Eye className="w-4 h-4 text-cb-muted shrink-0" />
              )}
            </button>

            {expandedDataset === dataset.filename && (
              <div className="px-3 pb-3 pt-2 border-t border-cb-border-subtle space-y-2">
                <div className="text-[10px] font-bold text-cb-muted uppercase tracking-wider mb-2">
                  Canonical Column Mappings
                </div>
                {dataset.columnMappings.map((mapping, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center p-2 bg-cb-surface rounded-cb-sm border border-cb-border"
                  >
                    <div className="text-[10px] font-mono text-cb-text-secondary truncate">
                      {mapping.sourceColumn}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-cb-muted" />
                    <div className="text-[10px] font-mono font-bold text-cb-primary truncate">
                      {mapping.mappedField}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {onConfirm && (
        <button
          onClick={onConfirm}
          className="mt-4 w-full cb-btn-primary cursor-pointer text-xs"
        >
          Confirm Schema Mappings
        </button>
      )}
    </div>
  );
};
