import React, { useState, useEffect } from "react";
import { Incident, EvidenceItem } from "../types/incident";
import { createDemoIncident } from "../logic/demoCase";
import { processEvidence } from "../logic/incident";
import { saveCase, loadCase } from "../store/caseStore";
import { ProcessStepper } from "../components/ProcessStepper";
import { ModuleRail } from "../components/ModuleRail";
import { EvidencePanel } from "../components/EvidencePanel";
import { ExtractionPanel } from "../components/ExtractionPanel";
import { PhishingTimeline } from "../components/PhishingTimeline";
import { MissingPanel } from "../components/MissingPanel";
import { ConflictPanel } from "../components/ConflictPanel";
import { DuplicatesPanel } from "../components/DuplicatesPanel";
import { AssumptionsPanel } from "../components/AssumptionsPanel";
import { DataNormalizationUI } from "../components/DataNormalizationUI";
import { ReportingChecklist } from "../components/ReportingChecklist";
import { EnhancedIncidentReport } from "../components/EnhancedIncidentReport";
import { RedactionPanel } from "../components/RedactionPanel";
import {
  ShieldCheck,
  Sparkles,
  Printer,
  Download,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  exportFullForensicJSON,
  printIncidentReport,
} from "../utils/export";

export const InvestigationDesk: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [incident, setIncident] = useState<Incident>(() => createDemoIncident());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    async function initCase() {
      try {
        const saved = await loadCase("CB-2026-001");
        if (saved) setIncident(saved);
      } catch (err) {
        console.warn("Storage load fallback:", err);
      }
    }
    initCase();
  }, []);

  useEffect(() => {
    if (incident) saveCase(incident).catch((e) => console.warn("Save case error:", e));
  }, [incident]);

  const handleLoadDemo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIncident(createDemoIncident());
      setIsProcessing(false);
    }, 150);
  };

  const handleReset = () => {
    setIncident({
      meta: {
        caseId: `CB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: "New Forensic Investigation",
        createdAt: new Date().toISOString(),
        status: "Draft",
      },
      summary: { fraudType: "phishing", estimatedLoss: 0, currency: "INR", firstEvent: "--", lastEvent: "--" },
      parties: [],
      channels: [],
      transactions: [],
      timeline: [],
      gaps: [],
      conflicts: [],
      duplicates: [],
      assumptions: [],
      normalizedRecords: [],
      sourceReferences: [],
      checklist: {
        incidentDate: false, incidentTime: false, fraudType: false, amount: false,
        transactionReference: false, suspiciousUrl: false, counterparty: false,
        evidenceAttached: false, timelineCreated: false, missingDataDocumented: false,
        contradictionsDocumented: false, redactionApplied: false, overallComplete: false,
        completionPercentage: 0, items: []
      },
      moduleHits: [],
      fraudAttemptLog: [],
      evidence: [],
      extractedEntities: { dates: [], amounts: [], formattedAmounts: [], urls: [], phones: [], emails: [], upiIds: [], utrs: [], accounts: [], keywords: [] },
    });
  };

  const handleUpdateEvidence = async (updatedEvidence: EvidenceItem[]) => {
    setIsProcessing(true);
    try {
      const updatedIncident = await processEvidence(updatedEvidence);
      setIncident(updatedIncident);
    } catch (err) {
      console.error("Failed to process evidence:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSingleEvidence = async (newItem: EvidenceItem) => {
    const updatedEvidence = [...incident.evidence, newItem];
    await handleUpdateEvidence(updatedEvidence);
  };

  return (
    <div className="min-h-screen bg-cb-bg text-cb-text antialiased">
      {/* Compact Header (~72px) */}
      <header className="h-[72px] sticky top-0 z-50 bg-cb-surface/80 backdrop-blur border-b border-cb-border flex items-center no-print">
        <div className="w-full max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-cb-md bg-cb-primary-soft flex items-center justify-center text-cb-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                CASEBRIEF <span className="text-[10px] font-mono px-1.5 rounded-cb-sm bg-cb-border-subtle text-cb-muted font-normal">v2.0</span>
              </h1>
              <p className="text-xs text-cb-muted font-mono">{incident.meta.caseId} | {incident.meta.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleLoadDemo} className="cb-btn-ghost flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4" /> Load Phishing Benchmark (5 Evidence Files)
            </button>
            <button onClick={handleReset} className="cb-btn-ghost flex items-center gap-2 text-xs">
              Reset Desk
            </button>
            <button onClick={printIncidentReport} className="cb-icon-btn">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={() => exportFullForensicJSON(incident)} className="cb-icon-btn">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="max-w-[1440px] mx-auto p-4 md:p-6 space-y-6">
        {/* Stepper */}
        <ProcessStepper currentStep={activeStage} onStepClick={setActiveStage} />

        {/* Workspace: 68% left / 32% rail */}
        <div className="grid grid-cols-[1fr,320px] gap-6 items-start">
          <main className="space-y-6">
            <div className="cb-surface p-6">
              {/* STAGE SWITCHER */}
              {isProcessing && <div className="text-center p-4">Processing investigation...</div>}
              {!isProcessing && (
                <>
                  {activeStage === 1 && <EvidencePanel evidence={incident.evidence} onAddEvidence={handleAddSingleEvidence} />}
                  {activeStage === 2 && <ExtractionPanel entities={incident.entities} />}
                  {activeStage === 3 && <PhishingTimeline timeline={incident.timeline} />}
                  {activeStage === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MissingPanel gaps={incident.gaps} />
                      <ConflictPanel conflicts={incident.conflicts} />
                      <DuplicatesPanel duplicates={incident.duplicates} />
                      <AssumptionsPanel assumptions={incident.assumptions} />
                      <div className="md:col-span-2">
                        <DataNormalizationUI datasets={incident.datasets} />
                      </div>
                    </div>
                  )}
                  {activeStage === 5 && <ReportingChecklist items={incident.checklistItems} />}
                  {activeStage === 6 && <RedactionPanel incident={incident} />}
                  {activeStage === 7 && <EnhancedIncidentReport incident={incident} />}
                </>
              )}
            </div>
            {/* Bottom Stepper Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-cb-border mt-6">
              <button
                onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
                disabled={activeStage === 1}
                className="cb-btn-ghost flex items-center gap-2 disabled:opacity-30 text-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Previous Stage
              </button>
              <span className="text-xs font-mono text-cb-muted">Stage {activeStage} of 7</span>
              <button
                onClick={() => setActiveStage((prev) => Math.min(7, prev + 1))}
                disabled={activeStage === 7}
                className="cb-btn-primary flex items-center gap-2 disabled:opacity-30 text-xs"
              >
                Next Stage <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </main>

          <aside className="sticky top-[96px]">
            <ModuleRail moduleHits={incident.moduleHits} />
          </aside>
        </div>
      </div>
    </div>
  );
};
