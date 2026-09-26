import React from "react";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

export const INVESTIGATION_STEPS: StepItem[] = [
  { id: 1, label: "Evidence Intake", sublabel: "Ingestion & Hashing", icon: Check },
  { id: 2, label: "Entity Extraction", sublabel: "Regex & IOC Parsing", icon: Check },
  { id: 3, label: "Incident Timeline", sublabel: "Chronology & Context", icon: Check },
  { id: 4, label: "Data Quality & Gaps", sublabel: "Conflicts & Normalization", icon: Check },
  { id: 5, label: "Reporting Checklist", sublabel: "Forensic Readiness", icon: Check },
  { id: 6, label: "Privacy Sandbox", sublabel: "PII Masking & Redaction", icon: Check },
  { id: 7, label: "Executive Report", sublabel: "Final Dossier & Export", icon: Check },
];

interface ProcessStepperProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
  completedSteps?: number[];
}

export const ProcessStepper: React.FC<ProcessStepperProps> = ({
  currentStep,
  onStepClick,
  completedSteps = [],
}) => {
  return (
    <div className="w-full bg-cb-surface border-b border-cb-border px-4 py-2 overflow-x-auto scrollbar-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between min-w-[900px] gap-1">
        {INVESTIGATION_STEPS.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id) || step.id < currentStep;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-cb-md border transition-all text-left group ${
                  isActive
                    ? "bg-cb-primary-soft/60 border-cb-primary text-cb-text shadow-sm"
                    : isCompleted
                    ? "bg-cb-surface border-cb-border-subtle hover:border-cb-border text-cb-text-secondary"
                    : "bg-cb-bg/40 border-transparent hover:border-cb-border-subtle text-cb-muted"
                }`}
              >
                {/* Step Number / Icon Badge */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-forensic text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-cb-primary text-white shadow-sm"
                      : isCompleted
                      ? "bg-cb-success-soft text-cb-success border border-cb-success/30"
                      : "bg-cb-elevated text-cb-muted border border-cb-border"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <StepIcon className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <span>0{step.id}</span>
                  )}
                </div>

                {/* Step Label & Sublabel */}
                <div className="min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive
                          ? "text-white font-bold"
                          : isCompleted
                          ? "text-cb-text"
                          : "text-cb-muted group-hover:text-cb-text-secondary"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-cb-muted truncate leading-none mt-0.5 font-sans">
                    {step.sublabel}
                  </div>
                </div>
              </button>

              {/* Connecting Divider between steps */}
              {idx < INVESTIGATION_STEPS.length - 1 && (
                <div
                  className={`h-4 w-px shrink-0 transition-colors ${
                    step.id < currentStep ? "bg-cb-primary/40" : "bg-cb-border-subtle"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
