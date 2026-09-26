import React, { useState } from "react";
import { Database, Eye, EyeOff } from "lucide-react";

export interface ColumnMapping {
  sourceColumn: string;
  mappedField: string;
  dataType: string;
}

export interface DatasetInfo {
  filename: string;
  columnMappings: ColumnMapping[];
}

interface DataNormalizationUIProps {
  datasets: DatasetInfo[];
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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          Dataset Normalization
        </h3>
        <p className="text-sm text-slate-400">No datasets detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Dataset Normalization
          </h3>
          <span className="text-xs font-semibold px-3 py-1 bg-purple-950/80 text-purple-300 rounded-full border border-purple-500/30">
            {datasets.length} Datasets
          </span>
        </div>

        <div className="space-y-4 mt-6">
          {datasets.map((dataset) => (
            <div key={dataset.filename} className="bg-slate-950/80 border border-slate-800 rounded-lg">
              <button
                onClick={() =>
                  setExpandedDataset(
                    expandedDataset === dataset.filename ? null : dataset.filename
                  )
                }
                className="w-full text-left flex items-center justify-between p-4 hover:bg-slate-900/50 transition"
              >
                <div>
                  <div className="font-bold text-white">{dataset.filename}</div>
                  <div className="text-sm text-slate-400">
                    {dataset.columnMappings.length} columns mapped
                  </div>
                </div>
                {expandedDataset === dataset.filename ? (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedDataset === dataset.filename && (
                <div className="border-t border-slate-800 p-4 space-y-3">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">
                    Column Mappings
                  </div>
                  {dataset.columnMappings.map((mapping, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 gap-2 text-sm items-center p-3 bg-slate-900 rounded border border-slate-800"
                    >
                      <div>
                        <div className="text-xs text-slate-500 uppercase">Source</div>
                        <div className="font-mono text-slate-300">{mapping.sourceColumn}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-500">→</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase">Maps To</div>
                        <div className="font-mono text-emerald-300">{mapping.mappedField}</div>
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
            className="mt-6 w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition"
          >
            Confirm Mappings
          </button>
        )}
      </div>
    </div>
  );
};
