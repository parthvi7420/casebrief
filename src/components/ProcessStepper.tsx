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
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 shadow-md sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {INVESTIGATION_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-blue-600/20 border border-blue-500 text-blue-400 shadow-sm"
                    : "hover:bg-slate-800/80 border border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
                    <span>{step.id}.</span> {step.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {step.sublabel}
                  </div>
                </div>
              </button>
              {idx < INVESTIGATION_STEPS.length - 1 && (
                <div className="hidden lg:block w-4 h-0.5 bg-slate-800 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
