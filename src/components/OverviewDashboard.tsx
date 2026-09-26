import React from "react";
import { Incident } from "../types/incident";
import {
  ShieldAlert,
  Fingerprint,
  Cpu,
  Scale,
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  Clock,
  ExternalLink,
  Globe,
  IndianRupee,
  Lock,
  Phone,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Layers,
  Sparkles,
  MessageSquareWarning,
  CreditCard,
  History,
  Network,
} from "lucide-react";

interface OverviewDashboardProps {
  incident: Incident;
  onNavigateStage: (stageId: number) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  incident,
  onNavigateStage,
}) => {
  const suspect = incident.parties.find((p) => p.id === "party-suspect");
  const hitModulesCount = incident.moduleHits.filter((m) => m.status === "hit").length;
  const totalModulesCount = incident.moduleHits.length;

  const totalEntities =
    (incident.extractedEntities?.urls?.length || 0) +
    (incident.extractedEntities?.amounts?.length || 0) +
    (incident.extractedEntities?.upiIds?.length || 0) +
    (incident.extractedEntities?.phones?.length || 0) +
    (incident.extractedEntities?.utrs?.length || 0) +
    (incident.extractedEntities?.accounts?.length || 0) +
    (incident.extractedEntities?.keywords?.length || 0);

  const moduleIconMap: Record<string, React.ElementType> = {
    "Message Analyzer": MessageSquareWarning,
    "URL Reputation Check": Globe,
    "Network Monitoring": Network,
    "Threat Intelligence Feed": ShieldAlert,
    "Transaction Auditor": CreditCard,
    "Fraud Attempt Log": History,
  };

  const stageLinks = [
    {
      id: 1,
      name: "01 Evidence Intake",
      desc: `${incident.evidence.length} Artifacts • SHA-256 Validated`,
      icon: Fingerprint,
      badge: `${incident.evidence.length} Files`,
      color: "text-cb-primary",
      bg: "bg-cb-primary/10",
    },
    {
      id: 2,
      name: "02 Entity Extraction",
      desc: `${totalEntities} Normalized Entities & CSV Mapping`,
      icon: Cpu,
      badge: `${totalEntities} Entities`,
      color: "text-cb-primary",
      bg: "bg-cb-primary/10",
    },
    {
      id: 3,
      name: "03 Attack Timeline",
      desc: `${incident.timeline.length} Chronological Forensic Milestones`,
      icon: Clock,
      badge: `${incident.timeline.length} Events`,
      color: "text-cb-primary",
      bg: "bg-cb-primary/10",
    },
    {
      id: 4,
      name: "04 Findings & Gaps",
      desc: `${incident.gaps.length} Gaps • ${incident.duplicates?.length || 0} Duplicates`,
      icon: AlertTriangle,
      badge: `${incident.gaps.length} Gaps Flagged`,
      color: "text-cb-warning",
      bg: "bg-cb-warning/10",
    },
    {
      id: 5,
      name: "05 Contradictions",
      desc: `${incident.conflicts.length} Cross-evidence Discrepancies`,
      icon: Scale,
      badge: `${incident.conflicts.length} Contradictions`,
      color: "text-cb-critical",
      bg: "bg-cb-critical/10",
    },
    {
      id: 6,
      name: "06 Privacy Sandbox",
      desc: "Client-side PII Masking & Unmask Sandbox",
      icon: Lock,
      badge: "Zero Egress",
      color: "text-cb-success",
      bg: "bg-cb-success/10",
    },
    {
      id: 7,
      name: "07 Incident Report",
      desc: "Executive Brief, Checklist & Export Dossier",
      icon: FileText,
      badge: "Print Ready",
      color: "text-cb-primary",
      bg: "bg-cb-primary/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 5 Top Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Financial Loss */}
        <div className="cb-surface p-4 shadow-sm border border-cb-border rounded-cb-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cb-muted uppercase tracking-wider">
              Confirmed Loss
            </span>
            <div className="w-6 h-6 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold font-mono text-rose-700">
              ₹{incident.summary.estimatedLoss.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-cb-muted mt-0.5 flex items-center gap-1 font-medium">
              <span className="text-rose-600 font-semibold">Unauthorized Debit</span>
              <span>• INR</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Evidence Custody */}
        <div className="cb-surface p-4 shadow-sm border border-cb-border rounded-cb-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cb-muted uppercase tracking-wider">
              Evidence Items
            </span>
            <div className="w-6 h-6 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Fingerprint className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold font-mono text-cb-text">
              {incident.evidence.length}{" "}
              <span className="text-xs font-normal text-cb-muted">Artifacts</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>SHA-256 Validated</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Extracted Entities */}
        <div className="cb-surface p-4 shadow-sm border border-cb-border rounded-cb-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cb-muted uppercase tracking-wider">
              Forensic Entities
            </span>
            <div className="w-6 h-6 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold font-mono text-cb-text">
              {totalEntities}{" "}
              <span className="text-xs font-normal text-cb-muted">Parsed</span>
            </div>
            <div className="text-[11px] text-cb-muted mt-0.5 font-medium">
              URLs, UPIs, Phones, UTRs
            </div>
          </div>
        </div>

        {/* Metric 4: Contradictions */}
        <div className="cb-surface p-4 shadow-sm border border-cb-border rounded-cb-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cb-muted uppercase tracking-wider">
              Discrepancies
            </span>
            <div className="w-6 h-6 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold font-mono text-amber-700">
              {incident.conflicts.length}{" "}
              <span className="text-xs font-normal text-cb-muted">Discrepancy</span>
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">
              ₹5,000 vs ₹4,999 Diff
            </div>
          </div>
        </div>

        {/* Metric 5: Active Threat Modules */}
        <div className="cb-surface p-4 shadow-sm border border-cb-border rounded-cb-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cb-muted uppercase tracking-wider">
              Threat Modules
            </span>
            <div className="w-6 h-6 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold font-mono text-rose-700">
              {hitModulesCount} / {totalModulesCount}
            </div>
            <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
              Active Threat Detections
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Case Executive Profile & Incident Anatomy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="cb-surface p-6 shadow-sm border border-cb-border rounded-cb-md space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-cb-border">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cb-primary" />
                <h3 className="text-sm font-bold text-cb-text">
                  Incident Profile & Attack Vector Summary
                </h3>
              </div>
              <span className="cb-badge cb-badge-hit uppercase text-[10px]">
                {incident.meta.status}
              </span>
            </div>

            {/* Attack classification & timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-cb-bg/70 p-3.5 rounded-cb-sm border border-cb-border space-y-1">
                <div className="text-[10px] font-bold text-cb-muted uppercase tracking-wider">
                  Attack Modus Operandi
                </div>
                <div className="font-bold text-cb-text uppercase">
                  {incident.summary.fraudType.replace("_", " ")}
                </div>
                <div className="text-[11px] text-cb-text-secondary mt-1">
                  Social engineering KYC deactivation panic lure followed by unauthorized UPI transaction.
                </div>
              </div>

              <div className="bg-cb-bg/70 p-3.5 rounded-cb-sm border border-cb-border space-y-1">
                <div className="text-[10px] font-bold text-cb-muted uppercase tracking-wider">
                  Incident Execution Window
                </div>
                <div className="font-mono text-cb-text font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cb-primary" />
                  <span>{incident.summary.firstEvent} → {incident.summary.lastEvent}</span>
                </div>
                <div className="text-[11px] text-cb-muted">
                  Chronological duration: ~26 minutes
                </div>
              </div>
            </div>

            {/* Threat actor & infrastructure */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-cb-text flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Extracted Threat Actor Identifiers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-cb-bg/40 p-3 rounded-cb-sm border border-cb-border space-y-1">
                  <div className="text-[10px] text-cb-muted font-bold uppercase">Suspect Contact</div>
                  <div className="font-mono font-bold text-cb-text">
                    {suspect?.phones?.[0] || "+91 98765 43210"}
                  </div>
                  <div className="text-[10px] text-cb-muted">Delivery via WhatsApp Messenger</div>
                </div>

                <div className="bg-cb-bg/40 p-3 rounded-cb-sm border border-cb-border space-y-1">
                  <div className="text-[10px] text-cb-muted font-bold uppercase">Beneficiary VPA</div>
                  <div className="font-mono font-bold text-cb-primary">
                    {suspect?.upiIds?.[0] || "user@oksbi"}
                  </div>
                  <div className="text-[10px] text-cb-muted">State Bank of India UPI Handle</div>
                </div>

                <div className="bg-cb-bg/40 p-3 rounded-cb-sm border border-cb-border space-y-1">
                  <div className="text-[10px] text-cb-muted font-bold uppercase">Phishing Domain</div>
                  <div className="font-mono font-bold text-rose-700">
                    pay-secure-example.test
                  </div>
                  <div className="text-[10px] text-rose-600 font-semibold">Protocol: HTTP (Insecure)</div>
                </div>

                <div className="bg-cb-bg/40 p-3 rounded-cb-sm border border-cb-border space-y-1">
                  <div className="text-[10px] text-cb-muted font-bold uppercase">Target Account</div>
                  <div className="font-mono font-bold text-cb-text">
                    XXXX{incident.transactions[0]?.accountLast4 || "4521"}
                  </div>
                  <div className="text-[10px] text-cb-muted">Primary Debit Account</div>
                </div>
              </div>
            </div>

            {/* Quick launch to timeline */}
            <div className="pt-2 flex items-center justify-between border-t border-cb-border">
              <span className="text-xs text-cb-muted">
                {incident.timeline.length} reconstruction milestones ready
              </span>
              <button
                onClick={() => onNavigateStage(3)}
                className="text-xs text-cb-primary hover:text-cb-primary-hover font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick 7-Stage Investigation Matrix */}
          <div className="cb-surface p-6 shadow-sm border border-cb-border rounded-cb-md space-y-4">
            <h3 className="text-sm font-bold text-cb-text flex items-center gap-2 pb-3 border-b border-cb-border">
              <Layers className="w-4 h-4 text-cb-primary" />
              7-Stage Investigation Workflow
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stageLinks.map((stage) => {
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.id}
                    onClick={() => onNavigateStage(stage.id)}
                    className="text-left p-3 rounded-cb-sm border border-cb-border hover:border-cb-primary/40 bg-cb-bg/40 hover:bg-cb-surface transition-all flex items-start justify-between gap-2 group cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded ${stage.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`w-3.5 h-3.5 ${stage.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-cb-text group-hover:text-cb-primary transition-colors truncate">
                          {stage.name}
                        </div>
                        <div className="text-[10px] text-cb-muted truncate mt-0.5">
                          {stage.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cb-surface text-cb-muted border border-cb-border shrink-0">
                      {stage.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): 6-Module Security Suite Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cb-surface p-6 shadow-sm border border-cb-border rounded-cb-md space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-cb-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cb-primary" />
                <h3 className="text-sm font-bold text-cb-text">
                  6-Module Threat Radar
                </h3>
              </div>
              <span className="cb-badge cb-badge-hit text-[10px]">
                {hitModulesCount}/{totalModulesCount} FIRED
              </span>
            </div>

            <p className="text-xs text-cb-muted">
              Real-time heuristic & threat intelligence modules evaluating evidence artifacts.
            </p>

            <div className="space-y-2.5">
              {incident.moduleHits.map((m) => {
                const Icon = moduleIconMap[m.module] || Activity;
                const isHit = m.status === "hit";

                return (
                  <div
                    key={m.module}
                    className={`p-3 rounded-cb-sm border transition-all ${
                      isHit
                        ? "bg-rose-50/40 border-rose-200"
                        : "bg-cb-bg/40 border-cb-border opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                            isHit
                              ? "bg-rose-100 text-rose-700 border border-rose-300"
                              : "bg-cb-surface text-cb-muted border border-cb-border"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-cb-text">
                            {m.module}
                          </div>
                          <div className="text-[10px] text-cb-muted">
                            {isHit
                              ? `${m.reasons.length} signature match${m.reasons.length > 1 ? "es" : ""}`
                              : "No threats detected"}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          isHit
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-cb-surface text-cb-muted border border-cb-border"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    {isHit && m.reasons[0] && (
                      <div className="mt-2 text-[11px] text-rose-900/80 bg-rose-100/50 px-2 py-1 rounded border border-rose-200/60 flex items-start gap-1">
                        <span className="font-bold">•</span>
                        <span className="truncate">{m.reasons[0]}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigateStage(7)}
              className="w-full mt-3 cb-btn-primary text-xs py-2 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Official Executive Brief</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
