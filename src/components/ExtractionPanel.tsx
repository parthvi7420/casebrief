import React from "react";
import { ExtractedEntities } from "../types/incident";
import { Cpu, Globe, IndianRupee, AtSign, Phone, FileKey, AlertTriangle } from "lucide-react";

interface ExtractionPanelProps {
  entities?: ExtractedEntities;
}

export const ExtractionPanel: React.FC<ExtractionPanelProps> = ({ entities }) => {
  if (!entities) {
    return (
      <div className="cb-surface p-8 text-center text-cb-muted">
        No entities extracted. Ingest evidence items to parse forensic entities.
      </div>
    );
  }

  const EntityCard = ({ title, icon: Icon, color, count, children }: any) => (
    <div className="cb-surface p-4">
      <div className="flex items-center justify-between pb-3 border-b border-cb-border mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-cb-text">
          <Icon className={`w-4 h-4 ${color}`} />
          {title}
        </div>
        <span className="cb-badge cb-badge-idle">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="cb-surface p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cb-border gap-2">
          <div>
            <h3 className="text-lg font-bold text-cb-text flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cb-primary" />
              Stage 2: Deterministic Entity Extraction
            </h3>
            <p className="text-xs text-cb-muted mt-1">Automated parsing of forensic indicators.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <EntityCard title="Domains & URLs" icon={Globe} color="text-cb-primary" count={entities.urls.length}>
             {entities.urls.map((u, i) => (
                <div key={i} className="bg-cb-bg p-2 rounded-cb-sm border border-cb-border text-xs font-mono break-all text-cb-text-secondary">{u.raw}</div>
             ))}
          </EntityCard>

          <EntityCard title="Amounts" icon={IndianRupee} color="text-cb-success" count={entities.amounts.length}>
             <div className="flex flex-wrap gap-2">
                {entities.formattedAmounts.map((amt, i) => (
                   <span key={i} className="cb-badge cb-badge-hit font-forensic">{amt}</span>
                ))}
             </div>
          </EntityCard>

          <EntityCard title="UPI Handles" icon={AtSign} color="text-cb-primary" count={entities.upiIds.length}>
             <div className="flex flex-wrap gap-2">
                {entities.upiIds.map((upi, i) => (
                   <span key={i} className="cb-badge cb-badge-idle font-mono">{upi}</span>
                ))}
             </div>
          </EntityCard>

          <EntityCard title="Phone Numbers" icon={Phone} color="text-cb-warning" count={entities.phones.length}>
             <div className="flex flex-wrap gap-2">
                {entities.phones.map((phone, i) => (
                   <span key={i} className="cb-badge cb-badge-idle font-mono">+91 {phone.replace(/^\+?91/, "")}</span>
                ))}
             </div>
          </EntityCard>

          <EntityCard title="UTR References" icon={FileKey} color="text-cb-critical" count={entities.utrs.length}>
            <div className="flex flex-wrap gap-2">
                {entities.utrs.map((u, i) => (
                   <span key={i} className="cb-badge cb-badge-idle font-mono">{u}</span>
                ))}
            </div>
          </EntityCard>

          <EntityCard title="Phishing Triggers" icon={AlertTriangle} color="text-cb-warning" count={entities.keywords.length}>
             <div className="flex flex-wrap gap-1.5">
                {entities.keywords.map((kw, i) => (
                   <span key={i} className="cb-badge cb-badge-warning">{kw}</span>
                ))}
            </div>
          </EntityCard>
        </div>
      </div>
    </div>
  );
};
