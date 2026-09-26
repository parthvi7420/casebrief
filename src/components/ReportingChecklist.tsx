import React, { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";

export interface ChecklistItem {
  id: string;
  label: string;
  status: "complete" | "incomplete" | "warning";
  category: string;
}

interface ReportingChecklistProps {
  items: ChecklistItem[];
}

export const ReportingChecklist: React.FC<ReportingChecklistProps> = ({ items }) => {
  const completed = items.filter((i) => i.status === "complete").length;
  const progress = Math.round((completed / items.length) * 100);

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            ✓ Reporting Checklist
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{progress}%</div>
            <div className="text-xs text-slate-400">
              {completed} / {items.length} Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              progress === 100
                ? "bg-emerald-500"
                : progress >= 75
                  ? "bg-blue-500"
                  : progress >= 50
                    ? "bg-amber-500"
                    : "bg-red-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Checklist by Category */}
        <div className="space-y-6 mt-6">
          {categories.map((category) => {
            const categoryItems = items.filter((i) => i.category === category);
            return (
              <div key={category}>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {category}
                </div>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        item.status === "complete"
                          ? "bg-emerald-950/30 border-emerald-800/60"
                          : item.status === "warning"
                            ? "bg-amber-950/30 border-amber-800/60"
                            : "bg-slate-950/60 border-slate-800"
                      }`}
                    >
                      {item.status === "complete" ? (
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : item.status === "warning" ? (
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )}
                      <span className="text-sm text-slate-200">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
