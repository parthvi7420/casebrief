import React from "react";
import { Check, X, AlertCircle, ListChecks } from "lucide-react";
import { ChecklistItem as IncidentChecklistItem } from "../types/incident";

export interface ChecklistItem extends Omit<Partial<IncidentChecklistItem>, "status"> {
  id?: string;
  label: string;
  status?: "complete" | "incomplete" | "warning" | "pass" | "fail";
  category?: string;
  description?: string;
}

interface ReportingChecklistProps {
  items: ChecklistItem[];
}

export const ReportingChecklist: React.FC<ReportingChecklistProps> = ({ items }) => {
  const isComplete = (status?: string) => status === "complete" || status === "pass";
  const isWarning = (status?: string) => status === "warning";

  const completed = items.filter((i) => isComplete(i.status)).length;
  const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  const categories = Array.from(new Set(items.map((i) => i.category || "Reporting Criteria")));

  return (
    <div className="cb-surface p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-cb-border">
        <h3 className="text-lg font-bold text-cb-text flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-cb-primary" />
          Reporting Checklist
        </h3>
        <div className="text-right">
          <div className="text-lg font-bold text-cb-primary">{progress}%</div>
          <div className="text-[10px] text-cb-muted">{completed} / {items.length} Complete</div>
        </div>
      </div>

      <div className="w-full h-1.5 bg-cb-surface rounded-full overflow-hidden">
        <div
          className="h-full transition-all bg-cb-primary"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const categoryItems = items.filter((i) => (i.category || "Reporting Criteria") === category);
          return (
            <div key={category}>
              <div className="text-[10px] font-bold text-cb-muted uppercase tracking-wider mb-3">
                {category}
              </div>
              <div className="space-y-2">
                {categoryItems.map((item, idx) => (
                  <div
                    key={item.id || `chk-item-${idx}`}
                    className={`flex items-center gap-3 p-3 rounded-cb-md border ${
                      isComplete(item.status)
                        ? "bg-cb-success/5 border-cb-success/20"
                        : isWarning(item.status)
                          ? "bg-cb-warning/5 border-cb-warning/20"
                          : "bg-cb-bg/40 border-cb-border"
                    }`}
                  >
                    {isComplete(item.status) ? (
                      <Check className="w-4 h-4 text-cb-success flex-shrink-0" />
                    ) : isWarning(item.status) ? (
                      <AlertCircle className="w-4 h-4 text-cb-warning flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-cb-critical flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-cb-text">{item.label}</span>
                      {item.description && (
                         <div className="text-[10px] text-cb-muted mt-0.5">{item.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
