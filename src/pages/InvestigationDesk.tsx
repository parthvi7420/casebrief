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
import { Sidebar } from "../components/Sidebar";
import { OverviewDashboard } from "../components/OverviewDashboard";
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
  Menu,
  X,
  Layers,
  FileText,
} from "lucide-react";
import {
  exportShareableRedactedJSON,
  exportFullForensicJSON,
  printIncidentReport,
} from "../utils/export";

export const InvestigationDesk: React.FC = () => {
  // Default to Stage 0 (Overview Dashboard)
  const [activeStage, setActiveStage] = useState<number>(0);
  const [incident, setIncident] = useState<Incident>(() => createDemoIncident());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [backendChecked, setBackendChecked] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

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
          setActiveStage(0);
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
    setActiveStage(0);
    setIsProcessing(false);
  };

  // Evidence list update handler (triggers full deterministic reconstruction locally & remotely)
  const handleUpdateEvidence = async (newEvidenceList: EvidenceItem[]) => {
    setIsProcessing(true);
    try {
      const updatedIncident = await processEvidence(newEvidenceList);
      setIncident(updatedIncident);

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

  const totalEntities =
    (incident.extractedEntities?.urls?.length || 0) +
    (incident.extractedEntities?.amounts?.length || 0) +
    (incident.extractedEntities?.upiIds?.length || 0) +
    (incident.extractedEntities?.phones?.length || 0) +
    (incident.extractedEntities?.utrs?.length || 0) +
    (incident.extractedEntities?.accounts?.length || 0) +
    (incident.extractedEntities?.keywords?.length || 0);

  const stepBadges: Record<number, string> = {
    1: `${incident.evidence.length}`,
    2: `${totalEntities}`,
    3: `${incident.timeline.length}`,
    4: `${incident.gaps.length}`,
    5: `${incident.conflicts.length}`,
    6: "Masked",
    7: "Dossier",
  };

  const stageTitles: Record<number, { title: string; desc: string }> = {
    0: {
      title: "Executive Investigation Overview",
      desc: "Forensic dashboard summarizing case facts, suspect profiles, and live detection heuristics.",
    },
    1: {
      title: "Stage 01: Evidence Ingestion & Custody",
      desc: "Raw multi-modal evidence upload with automatic SHA-256 cryptographic checksum calculation.",
    },
    2: {
      title: "Stage 02: Entity Extraction & Normalization",
      desc: "Deterministic regex-based parsing of URLs, UPI IDs, Phones, UTRs, and CSV column schema mapping.",
    },
    3: {
      title: "Stage 03: Chronological Attack Timeline",
      desc: "Reconstructed sequential incident milestones with cross-evidence verification tags.",
    },
    4: {
      title: "Stage 04: Investigatory Gaps, Duplicates & Assumptions",
      desc: "Missing UTR audit, non-destructive duplicate identification, and evidentiary certainty classification.",
    },
    5: {
      title: "Stage 05: Contradiction & Discrepancy Matrix",
      desc: "Automated cross-source conflict detection comparing chat claims against formal financial ledgers.",
    },
    6: {
      title: "Stage 06: Privacy & PII Redaction Sandbox",
      desc: "Client-side privacy masking for phone numbers, accounts, and VPA identifiers with safe unmasking.",
    },
    7: {
      title: "Stage 07: Incident Report & Export Dossier",
      desc: "NCRP/CERT-In compliant executive summary brief, reporting checklist, and JSON exports.",
    },
  };

  return (
    <div className="min-h-screen bg-cb-bg text-cb-text flex selection:bg-cb-primary selection:text-white">
      {/* 220px–240px Navigation Sidebar */}
      <Sidebar
        currentStage={activeStage}
        onSelectStage={setActiveStage}
        incident={incident}
        backendOnline={backendOnline}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Global Command Header */}
        <header className="bg-cb-surface/95 backdrop-blur-md border-b border-cb-border sticky top-0 z-40 no-print">
          <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Stage title & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden cb-icon-btn"
                title="Toggle Sidebar"
              >
                <Menu className="w-5 h-5 text-cb-text" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-cb-text">
                    {stageTitles[activeStage]?.title || "CaseBrief Workspace"}
                  </h1>
                  {activeStage === 0 ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-primary/10 text-cb-primary border border-cb-primary/30 font-bold">
                      DASHBOARD
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cb-bg text-cb-muted border border-cb-border font-semibold">
                      STAGE {activeStage}/7
                    </span>
                  )}
                </div>
                <p className="text-xs text-cb-muted mt-0.5 hidden sm:block">
                  {stageTitles[activeStage]?.desc}
                </p>
              </div>
            </div>

            {/* Quick Actions CTAs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleLoadDemo}
                disabled={isProcessing}
                className="cb-btn-primary flex items-center gap-1.5 text-xs cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Benchmark Demo</span>
              </button>

              <button
                onClick={handleReset}
                className="cb-btn-ghost flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
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

        {/* Workspace Body */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Workflow Stepper (always accessible) */}
          <section className="no-print">
            <ProcessStepper
              currentStep={activeStage}
              onStepClick={setActiveStage}
              stepBadges={stepBadges}
            />
          </section>

          {/* 6-Module Live Threat Rail (shown for stages) */}
          <section className="no-print">
            <ModuleRail moduleHits={incident.moduleHits} />
          </section>

          {/* Active Stage Pane */}
          <section className="min-h-[500px] space-y-6">
            {/* Stage 0: Overview Dashboard */}
            {activeStage === 0 && (
              <OverviewDashboard
                incident={incident}
                onNavigateStage={setActiveStage}
              />
            )}

            {/* Stage 1: Evidence Intake */}
            {activeStage === 1 && (
              <EvidencePanel
                evidence={incident.evidence}
                onAddEvidence={handleAddSingleEvidence}
              />
            )}

            {/* Stage 2: Entity Extraction & Data Normalization */}
            {activeStage === 2 && (
              <div className="space-y-6">
                <ExtractionPanel entities={incident.extractedEntities} />
                <DataNormalizationUI
                  datasets={extractDatasetMappings(incident.evidence)}
                />
              </div>
            )}

            {/* Stage 3: Chronological Timeline */}
            {activeStage === 3 && (
              <PhishingTimeline timeline={incident.timeline} />
            )}

            {/* Stage 4: Gaps, Duplicates, Assumptions */}
            {activeStage === 4 && (
              <div className="space-y-6">
                <MissingPanel gaps={incident.gaps} />
                <DuplicatesPanel duplicates={incident.duplicates || []} />
                <AssumptionsPanel assumptions={incident.assumptions || []} />
              </div>
            )}

            {/* Stage 5: Contradictions */}
            {activeStage === 5 && (
              <ConflictPanel conflicts={incident.conflicts} />
            )}

            {/* Stage 6: Privacy Sandbox */}
            {activeStage === 6 && (
              <RedactionPanel incident={incident} />
            )}

            {/* Stage 7: Reporting Checklist & Incident Report */}
            {activeStage === 7 && (
              <div className="space-y-6">
                {incident.checklist && (
                  <ReportingChecklist items={incident.checklist.items} />
                )}
                <EnhancedIncidentReport incident={incident} />
              </div>
            )}
          </section>

          {/* Bottom Stage Navigation Controls */}
          <section className="cb-surface p-4 flex items-center justify-between no-print shadow-xs rounded-cb-md">
            {activeStage === 0 ? (
              <button
                onClick={() => setActiveStage(1)}
                className="cb-btn-ghost flex items-center gap-2 text-xs cursor-pointer"
              >
                <span>Enter Guided Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setActiveStage((prev) => Math.max(0, prev - 1))}
                className="cb-btn-ghost flex items-center gap-2 text-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{activeStage === 1 ? "Overview Dashboard" : "Previous Stage"}</span>
              </button>
            )}

            <div className="text-xs font-mono text-cb-muted">
              {activeStage === 0 ? (
                <span>Executive Summary View</span>
              ) : (
                <span>
                  Investigation Stage <strong className="text-cb-text">{activeStage}</strong> of <strong>7</strong>
                </span>
              )}
            </div>

            <button
              onClick={() => setActiveStage((prev) => (prev === 7 ? 0 : prev + 1))}
              className="cb-btn-primary flex items-center gap-2 text-xs cursor-pointer"
            >
              <span>{activeStage === 7 ? "Return to Overview" : activeStage === 0 ? "Begin Stage 1" : "Next Stage"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-cb-border bg-cb-surface py-3.5 px-6 text-center text-xs text-cb-muted no-print">
          CaseBrief Forensic Reconstruction Desk • Zero External API Calls • Deterministic Evidence Processing Engine • ISO/IEC 27037 Compliant
        </footer>
      </div>
    </div>
  );
};

export default InvestigationDesk;
