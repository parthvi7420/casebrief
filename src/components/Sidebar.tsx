import React from "react";
import { Incident } from "../types/incident";
import {
  ShieldCheck,
  LayoutDashboard,
  Fingerprint,
  Cpu,
  Clock,
  AlertTriangle,
  Scale,
  Lock,
  FileText,
  Server,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Activity,
  Layers,
} from "lucide-react";

interface SidebarProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  incident: Incident;
  backendOnline: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStage,
  onSelectStage,
  incident,
  backendOnline,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const totalEntities =
    (incident.extractedEntities?.urls?.length || 0) +
    (incident.extractedEntities?.amounts?.length || 0) +
    (incident.extractedEntities?.upiIds?.length || 0) +
    (incident.extractedEntities?.phones?.length || 0) +
    (incident.extractedEntities?.utrs?.length || 0) +
    (incident.extractedEntities?.accounts?.length || 0) +
    (incident.extractedEntities?.keywords?.length || 0);

  const stages = [
    {
      id: 0,
      name: "Overview Dashboard",
      short: "Overview",
      icon: LayoutDashboard,
      badge: "Summary",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: 1,
      name: "01 Evidence Intake",
      short: "Evidence",
      icon: Fingerprint,
      badge: `${incident.evidence.length} files`,
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    },
    {
      id: 2,
      name: "02 Entity Extraction",
      short: "Entities",
      icon: Cpu,
      badge: `${totalEntities} parsed`,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: 3,
      name: "03 Incident Timeline",
      short: "Timeline",
      icon: Clock,
      badge: `${incident.timeline.length} events`,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: 4,
      name: "04 Findings & Gaps",
      short: "Gaps & Audit",
      icon: AlertTriangle,
      badge: `${incident.gaps.length} gaps`,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: 5,
      name: "05 Contradictions",
      short: "Contradictions",
      icon: Scale,
      badge: `${incident.conflicts.length} diff`,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      id: 6,
      name: "06 Privacy Sandbox",
      short: "Privacy",
      icon: Lock,
      badge: "Masked",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: 7,
      name: "07 Incident Report",
      short: "Report",
      icon: FileText,
      badge: "Print Ready",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
  ];

  const handleStageClick = (id: number) => {
    onSelectStage(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-60 sm:w-64 bg-cb-surface border-r border-cb-border flex flex-col justify-between transition-transform duration-200 ease-in-out no-print ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Brand Section */}
        <div className="p-4 border-b border-cb-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-cb-md bg-cb-primary/10 border border-cb-primary/30 flex items-center justify-center text-cb-primary shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-cb-text">
                  CASEBRIEF
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cb-primary/10 text-cb-primary border border-cb-primary/30 font-bold">
                  v2.0
                </span>
              </div>
              <div className="text-[10px] text-cb-muted truncate font-medium">
                Digital Forensics Workspace
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-cb-muted">
            Investigation Stages
          </div>

          {stages.map((stage) => {
            const Icon = stage.icon;
            const isActive = currentStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-cb-md text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? "bg-cb-primary text-white shadow-xs font-bold"
                    : "text-cb-text-secondary hover:text-cb-text hover:bg-cb-bg"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-cb-muted group-hover:text-cb-primary transition-colors"
                    }`}
                  />
                  <span className="truncate">{stage.name}</span>
                </div>

                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 transition-colors ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : stage.badgeColor
                  }`}
                >
                  {stage.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Metadata & Air-gap Status */}
        <div className="p-3 border-t border-cb-border bg-cb-bg/50 space-y-2">
          {/* Active Case Card */}
          <div className="p-2.5 rounded-cb-sm bg-cb-surface border border-cb-border space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-cb-muted uppercase">Case Dossier</span>
              <span className="font-mono font-bold text-cb-primary">
                {incident.meta.caseId}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-cb-text truncate">
              {incident.meta.title}
            </div>
          </div>

          {/* Air-gap security status */}
          <div className="flex items-center justify-between px-1 text-[10px] text-cb-muted font-medium">
            <div className="flex items-center gap-1 text-emerald-700">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Zero-Egress Mode</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <Server className="w-3 h-3 text-cb-primary" />
              <span>{backendOnline ? "REST API" : "Offline"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
