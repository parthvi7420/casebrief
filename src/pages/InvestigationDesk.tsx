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
import { RedactionPanel } from "../components/RedactionPanel";
import { IncidentReport } from "../components/IncidentReport";
import {
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Download,
  Printer,
  Share2,
} from "lucide-react";
import {
  exportShareableRedactedJSON,
  exportFullForensicJSON,
  printIncidentReport,
} from "../utils/export";

export const InvestigationDesk: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [incident, setIncident] = useState<Incident>(() => createDemoIncident());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load latest case or demo case on mount
  useEffect(() => {
    async function initCase() {
      try {
        const saved = await loadCase("CB-2026-001");
        if (saved) {
          setIncident(saved);
        }
      } catch (err) {
        console.warn("Storage load fallback:", err);
      }
    }
    initCase();
  }, []);

  // Save to IndexedDB on incident change
  useEffect(() => {
    if (incident) {
      saveCase(incident).catch((e) => console.warn("Save case error:", e));
    }
  }, [incident]);

  // Load standard benchmark demo case
  const handleLoadDemo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const demo = createDemoIncident();
      setIncident(demo);
      setIsProcessing(false);
    }, 150);
  };

  // Reset desk to blank investigation state
  const handleReset = () => {
    const blankIncident: Incident = {
      meta: {
        caseId: `CB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: "New Digital Fraud Investigation",
        createdAt: new Date().toISOString(),
        status: "draft",
      },
      summary: {
        fraudType: "other",
        estimatedLoss: 0,
        currency: "INR",
        firstEvent: "N/A",
        lastEvent: "N/A",
      },
      parties: [],
      channels: [],
      transactions: [],
      timeline: [],
      gaps: [],
      conflicts: [],
      moduleHits: [
        {
          module: "Message Analyzer",
          status: "idle",
          reasons: ["No chat or message evidence ingested"],
          evidenceIds: [],
        },
        {
          module: "URL Reputation Check",
          status: "idle",
          reasons: ["No URLs or domains detected"],
          evidenceIds: [],
        },
        {
          module: "Network Monitoring",
          status: "idle",
          reasons: ["No DNS or network traces detected"],
          evidenceIds: [],
        },
        {
          module: "Threat Intelligence Feed",
          status: "idle",
          reasons: ["No IOC matches detected"],
          evidenceIds: [],
        },
        {
          module: "Transaction Auditor",
          status: "idle",
          reasons: ["No bank records or payment transactions ingested"],
          evidenceIds: [],
        },
        {
          module: "Fraud Attempt Log",
          status: "idle",
          reasons: ["No threat events registered in audit log"],
          evidenceIds: [],
        },
      ],
      fraudAttemptLog: [],
      evidence: [],
      extractedEntities: {
        urls: [],
        upiIds: [],
        utrs: [],
        phones: [],
        emails: [],
        amounts: [],
        formattedAmounts: [],
        dates: [],
        accounts: [],
        keywords: [],
      },
    };

    setIncident(blankIncident);
    setActiveStage(1);
  };

  // Evidence list update handler (triggers full deterministic reconstruction)
  const handleUpdateEvidence = async (newEvidenceList: EvidenceItem[]) => {
    setIsProcessing(true);
    try {
      const updatedIncident = await processEvidence(newEvidenceList);
      setIncident(updatedIncident);
    } catch (err) {
      console.error("Evidence processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSingleEvidence = (item: EvidenceItem) => {
    const updatedList = [...incident.evidence, item];
    handleUpdateEvidence(updatedList);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Global Command Bar */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Case Meta */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  CASEBRIEF
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                  v2.0 PRO
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 font-semibold">
                  <Lock className="w-2.5 h-2.5" />
                  100% OFFLINE / ZERO CLOUD
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Case Ref: <strong className="text-slate-200 font-mono">{incident.meta.caseId}</strong></span>
                <span>•</span>
                <span className="text-slate-400 font-medium truncate max-w-xs">{incident.meta.title}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleLoadDemo}
              disabled={isProcessing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-950 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Phishing Benchmark Demo
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Desk
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <button
              onClick={() => exportShareableRedactedJSON(incident)}
              title="Export Redacted JSON for Safe Sharing"
              className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-emerald-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => exportFullForensicJSON(incident)}
              title="Download Full Forensic JSON File"
              className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={printIncidentReport}
              title="Print Official Incident Report"
              className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-blue-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 7-Stage Process Stepper Navigation */}
        <section className="no-print">
          <ProcessStepper
            currentStep={activeStage}
            onStepClick={setActiveStage}
          />
        </section>

        {/* 6-Module Live Cybersecurity Status Rail */}
        <section className="no-print">
          <ModuleRail moduleHits={incident.moduleHits} />
        </section>

        {/* Stage Investigation Panel Switcher */}
        <section className="min-h-[500px]">
          {activeStage === 1 && (
            <EvidencePanel
              evidence={incident.evidence}
              onAddEvidence={handleAddSingleEvidence}
            />
          )}

          {activeStage === 2 && (
            <ExtractionPanel
              entities={incident.extractedEntities}
            />
          )}

          {activeStage === 3 && (
            <PhishingTimeline timeline={incident.timeline} />
          )}

          {activeStage === 4 && (
            <MissingPanel gaps={incident.gaps} />
          )}

          {activeStage === 5 && (
            <ConflictPanel conflicts={incident.conflicts} />
          )}

          {activeStage === 6 && (
            <RedactionPanel incident={incident} />
          )}

          {activeStage === 7 && (
            <IncidentReport incident={incident} />
          )}
        </section>

        {/* Bottom Step Navigation Control Bar */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between no-print">
          <button
            onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
            disabled={activeStage === 1}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Stage
          </button>

          <div className="text-xs font-mono text-slate-400">
            Investigation Stage <strong className="text-white">{activeStage}</strong> of <strong>7</strong>
          </div>

          <button
            onClick={() => setActiveStage((prev) => Math.min(7, prev + 1))}
            disabled={activeStage === 7}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            Next Stage
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500 no-print">
        CaseBrief Forensic Reconstruction Desk • Zero External API Calls • Deterministic Evidence Processing Engine • ISO/IEC 27037 Standard Compliant
      </footer>
    </div>
  );
};
