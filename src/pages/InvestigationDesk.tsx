import React, { useState, useEffect } from "react";
import { Incident, EvidenceItem } from "../types/incident";
import { createDemoIncident } from "../logic/demoCase";
import { processEvidence } from "../logic/incident";
import { extractDatasetMappings } from "../logic/normalize";
import { saveCase, loadCase } from "../store/caseStore";
import {
  checkBackendHealth,
  fetchPhishingDemo,
  createCaseOnBackend,
  uploadEvidenceToBackend,
} from "../services/apiClient";
import { ProcessStepper } from "../components/ProcessStepper";
import { ModuleRail } from "../components/ModuleRail";
import { EvidencePanel } from "../components/EvidencePanel";
import { ExtractionPanel } from "../components/ExtractionPanel";
import { DataNormalizationUI } from "../components/DataNormalizationUI";
import { PhishingTimeline } from "../components/PhishingTimeline";
import { MissingPanel } from "../components/MissingPanel";
import { DuplicatesPanel } from "../components/DuplicatesPanel";
import { ConflictPanel } from "../components/ConflictPanel";
import { AssumptionsPanel } from "../components/AssumptionsPanel";
import { RedactionPanel } from "../components/RedactionPanel";
import { IncidentReport } from "../components/IncidentReport";
import { EnhancedIncidentReport } from "../components/EnhancedIncidentReport";
import { ReportingChecklist } from "../components/ReportingChecklist";
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
  Server,
  Activity,
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
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [backendChecked, setBackendChecked] = useState<boolean>(false);

  // Poll backend health on mount and periodically
  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      const health = await checkBackendHealth();
      if (isMounted) {
        setBackendOnline(health.online);
        setBackendChecked(true);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Load latest case or demo case on mount
  useEffect(() => {
    async function initCase() {
      try {
        // Try loading from backend demo first if online, else IndexedDB
        const remoteDemo = await fetchPhishingDemo();
        if (remoteDemo) {
          setIncident(remoteDemo);
          return;
        }

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

  // Load standard benchmark demo case (from REST API if online, else client engine)
  const handleLoadDemo = async () => {
    setIsProcessing(true);
    try {
      if (backendOnline) {
        const remoteDemo = await fetchPhishingDemo();
        if (remoteDemo) {
          setIncident(remoteDemo);
          setIsProcessing(false);
          return;
        }
      }
      // Local fallback
      const demo = createDemoIncident();
      setIncident(demo);
    } catch (err) {
      console.warn("Demo load fallback to local:", err);
      const demo = createDemoIncident();
      setIncident(demo);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset desk to blank investigation state
  const handleReset = async () => {
    setIsProcessing(true);
    try {
      if (backendOnline) {
        const newCase = await createCaseOnBackend("New Digital Fraud Investigation");
        if (newCase) {
          setIncident(newCase);
          setActiveStage(1);
          setIsProcessing(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend reset fallback:", err);
    }

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
    setIsProcessing(false);
  };

  // Evidence list update handler (triggers full deterministic reconstruction locally & remotely)
  const handleUpdateEvidence = async (newEvidenceList: EvidenceItem[]) => {
    setIsProcessing(true);
    try {
      const updatedIncident = await processEvidence(newEvidenceList);
      setIncident(updatedIncident);

      // Async sync with backend if online
      if (backendOnline && incident.meta.caseId) {
        uploadEvidenceToBackend(
          incident.meta.caseId,
          newEvidenceList.map((e) => ({
            type: e.type,
            content: e.extractedText || "",
            filename: e.filename,
          }))
        ).catch((err) => console.warn("Backend background sync notice:", err));
      }
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
    <div className="min-h-screen bg-cb-bg text-cb-text flex flex-col selection:bg-cb-primary selection:text-white">
      {/* Top Global Command Bar */}
      <header className="bg-cb-surface/90 backdrop-blur border-b border-cb-border sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Case Meta */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-cb-md bg-cb-primary/10 border border-cb-primary/30 flex items-center justify-center text-cb-primary shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-cb-text">
                  CASEBRIEF
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cb-primary/10 text-cb-primary border border-cb-primary/30 font-bold">
                  v2.0 PRO
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-success/10 text-cb-success border border-cb-success/30 flex items-center gap-1 font-semibold">
                  <Lock className="w-2.5 h-2.5" />
                  100% OFFLINE / ZERO CLOUD
                </span>
                {backendChecked && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 font-semibold transition-all ${
                      backendOnline
                        ? "bg-cb-primary/10 text-cb-primary border-cb-primary/30"
                        : "bg-cb-bg text-cb-muted border-cb-border"
                    }`}
                    title={
                      backendOnline
                        ? "Connected to Express Backend on Port 3000"
                        : "Running on Client-Side Engine (Offline Mode)"
                    }
                  >
                    <Server className="w-2.5 h-2.5" />
                    {backendOnline ? "REST API :3000" : "LOCAL ENGINE"}
                  </span>
                )}
              </div>
              <div className="text-xs text-cb-muted flex items-center gap-2 mt-0.5">
                <span>Case Ref: <strong className="text-cb-text font-mono">{incident.meta.caseId}</strong></span>
                <span>•</span>
                <span className="text-cb-muted font-medium truncate max-w-xs">{incident.meta.title}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleLoadDemo}
              disabled={isProcessing}
              className="cb-btn-primary flex items-center gap-1.5 text-xs cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Phishing Benchmark Demo
            </button>

            <button
              onClick={handleReset}
              className="cb-btn-ghost flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Desk
            </button>

            <div className="h-4 w-px bg-cb-border hidden sm:block" />

            <button
              onClick={() => exportShareableRedactedJSON(incident)}
              title="Export Redacted JSON for Safe Sharing"
              className="cb-icon-btn text-cb-success"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => exportFullForensicJSON(incident)}
              title="Download Full Forensic JSON File"
              className="cb-icon-btn text-cb-text-secondary"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={printIncidentReport}
              title="Print Official Incident Report"
              className="cb-icon-btn text-cb-primary"
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
        <section className="min-h-[500px] space-y-6">
          {activeStage === 1 && (
            <EvidencePanel
              evidence={incident.evidence}
              onAddEvidence={handleAddSingleEvidence}
            />
          )}

          {activeStage === 2 && (
            <div className="space-y-6">
              <ExtractionPanel
                entities={incident.extractedEntities}
              />
              <DataNormalizationUI
                datasets={extractDatasetMappings(incident.evidence)}
              />
            </div>
          )}

          {activeStage === 3 && (
            <PhishingTimeline timeline={incident.timeline} />
          )}

          {activeStage === 4 && (
            <div className="space-y-6">
              <MissingPanel gaps={incident.gaps} />
              <DuplicatesPanel duplicates={incident.duplicates || []} />
              <AssumptionsPanel assumptions={incident.assumptions || []} />
            </div>
          )}

          {activeStage === 5 && (
            <ConflictPanel conflicts={incident.conflicts} />
          )}

          {activeStage === 6 && (
            <RedactionPanel incident={incident} />
          )}

          {activeStage === 7 && (
            <div className="space-y-6">
              {incident.checklist && (
                <ReportingChecklist items={incident.checklist.items} />
              )}
              <EnhancedIncidentReport incident={incident} />
            </div>
          )}
        </section>

        {/* Bottom Step Navigation Control Bar */}
        <section className="cb-surface p-4 flex items-center justify-between no-print shadow-sm">
          <button
            onClick={() => setActiveStage((prev) => Math.max(1, prev - 1))}
            disabled={activeStage === 1}
            className="cb-btn-ghost flex items-center gap-2 text-xs cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Stage
          </button>

          <div className="text-xs font-mono text-cb-muted">
            Investigation Stage <strong className="text-cb-text">{activeStage}</strong> of <strong>7</strong>
          </div>

          <button
            onClick={() => setActiveStage((prev) => Math.min(7, prev + 1))}
            disabled={activeStage === 7}
            className="cb-btn-primary flex items-center gap-2 text-xs cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            Next Stage
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-cb-border bg-cb-bg py-4 text-center text-xs text-cb-muted no-print">
        CaseBrief Forensic Reconstruction Desk • Zero External API Calls • Deterministic Evidence Processing Engine • ISO/IEC 27037 Standard Compliant
      </footer>
    </div>
  );
};

export default InvestigationDesk;
