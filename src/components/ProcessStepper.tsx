import React from "react";
import {
  FileSearch,
  Cpu,
  Clock,
  AlertCircle,
  Scale,
  ShieldCheck,
  FileText,
  CheckCircle2,
} from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

export const INVESTIGATION_STEPS: StepItem[] = [
  { id: 1, label: "Evidence Intake", sublabel: "SHA-256 Custody", icon: FileSearch },
  { id: 2, label: "Entity Extraction", sublabel: "Deterministic Parser", icon: Cpu },
  { id: 3, label: "Incident Timeline", sublabel: "4-Event Sequence", icon: Clock },
  { id: 4, label: "Data Gaps", sublabel: "Missing UTR Audit", icon: AlertCircle },
  { id: 5, label: "Contradictions", sublabel: "₹5K vs ₹4,999 Diff", icon: Scale },
  { id: 6, label: "Privacy Sandbox", sublabel: "PII Masking & Toggle", icon: ShieldCheck },
  { id: 7, label: "Executive Report", sublabel: "Print & JSON Export", icon: FileText },
];

interface ProcessStepperProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
  completedSteps?: number[];
}

export const ProcessStepper: React.FC<ProcessStepperProps> = ({
  currentStep,
  onStepClick,
  completedSteps = [1, 2, 3, 4, 5, 6, 7],
}) => {
  return (
    <div className="cb-surface border border-cb-border rounded-cb-md p-2.5 shadow-sm no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {INVESTIGATION_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-cb-md text-left transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-cb-primary/15 border border-cb-primary/40 text-cb-primary shadow-sm"
                    : "hover:bg-cb-surface/80 border border-transparent text-cb-muted hover:text-cb-text"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-cb-sm flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? "bg-cb-primary text-white shadow-sm"
                      : isCompleted
                      ? "bg-cb-bg text-cb-success border border-cb-success/30"
                      : "bg-cb-bg text-cb-muted border border-cb-border"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cb-success" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
                    <span className="text-cb-muted">{step.id}.</span> {step.label}
                  </div>
                  <div className="text-[10px] text-cb-muted truncate max-w-[120px]">
                    {step.sublabel}
                  </div>
                </div>
              </button>
              {idx < INVESTIGATION_STEPS.length - 1 && (
                <div className="hidden lg:block w-3 h-0.5 bg-cb-border shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
