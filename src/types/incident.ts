/**
 * CaseBrief Shared Contract (Person 1 & Person 2 Interface)
 */

export type FraudType =
  | "UPI"
  | "phishing"
  | "fake_job"
  | "investment"
  | "other";

export type SecurityModuleName =
  | "Message Analyzer"
  | "URL Reputation Check"
  | "Network Monitoring"
  | "Threat Intelligence Feed"
  | "Transaction Auditor"
  | "Fraud Attempt Log";

export interface IncidentMeta {
  caseId: string;
  createdAt: string;
  title: string;
  status: string;
}

export interface IncidentSummary {
  fraudType: FraudType;
  estimatedLoss: number;
  currency: string;
  firstEvent: string;
  lastEvent: string;
}

export interface Party {
  id: string;
  name?: string;
  phones?: string[];
  emails?: string[];
  upiIds?: string[];
  handles?: string[];
}

export interface Channel {
  type: "url" | "app" | "domain" | "other";
  value: string;
  sourceEvidenceIds: string[];
}

export interface Transaction {
  id: string;
  date?: string;
  time?: string;
  amount?: number;
  currency?: string;
  utr?: string;
  impsRef?: string;
  neftRef?: string;
  ifsc?: string;
  accountLast4?: string;
  upiId?: string;
  description?: string;
  notes?: string;
  sourceEvidenceIds: string[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  sourceIds: string[];
  modulesFired: string[];
}

export interface Gap {
  id: string;
  field: string;
  description: string;
  sourceEvidenceIds: string[];
  severity: "low" | "medium" | "high";
}

export interface Conflict {
  id: string;
  type: string;
  description: string;
  sourceA: {
    evidenceId: string;
    value: string;
  };
  sourceB: {
    evidenceId: string;
    value: string;
  };
  severity: "low" | "medium" | "high";
}

export interface ModuleHit {
  module: SecurityModuleName;
  status: "hit" | "idle";
  reasons: string[];
  evidenceIds: string[];
}

export interface FraudAttempt {
  id: string;
  timestamp: string;
  event: string;
  reason: string;
  modules: string[];
  sourceEvidenceIds: string[];
}

export interface EvidenceItem {
  id: string;
  type:
    | "message"
    | "screenshot"
    | "transaction"
    | "url"
    | "pdf"
    | "csv"
    | "text"
    | "other";
  filename?: string;
  hash?: string;
  extractedText?: string;
  redactedPreview?: string;
  createdAt: string;
}

export interface ExtractedEntities {
  dates: string[];
  amounts: number[];
  formattedAmounts: string[];
  urls: {
    raw: string;
    protocol: string;
    domain: string;
    path: string;
  }[];
  phones: string[];
  emails: string[];
  upiIds: string[];
  utrs: string[];
  accounts: string[];
  keywords: string[];
}

export interface Incident {
  meta: IncidentMeta;
  summary: IncidentSummary;
  parties: Party[];
  channels: Channel[];
  transactions: Transaction[];
  timeline: TimelineEvent[];
  gaps: Gap[];
  conflicts: Conflict[];
  moduleHits: ModuleHit[];
  fraudAttemptLog: FraudAttempt[];
  evidence: EvidenceItem[];
  extractedEntities?: ExtractedEntities;
}
