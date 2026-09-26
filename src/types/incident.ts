/**
 * CaseBrief Shared Contract (Person 1 & Person 2 Interface)
 * Extended with Phase 2 Normalized Records, Matching, Duplicates, Assumptions, Traceability, and Checklist
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
  date?: string;
  timestamp?: string;
  rawTime?: string;
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
  field?: string;
  description: string;
  reason?: string;
  discrepancyDiff?: string;
  status?: "unresolved" | "investigating" | "confirmed_contradiction";
  sourceA: {
    evidenceId: string;
    value: string;
    location?: string;
  };
  sourceB: {
    evidenceId: string;
    value: string;
    location?: string;
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

/* =========================================================
   PHASE 2: NEW FORENSIC TYPES & SCHEMAS
   ========================================================= */

/**
 * 1. Normalized Transaction Record
 */
export interface NormalizedTransaction {
  id: string;
  date?: string;
  time?: string;
  amount?: number;
  transactionReference?: string;
  account?: string;
  counterparty?: string;
  description?: string;
  status?: string;
  currency?: string;
  sourceEvidenceId: string;
  sourceRowIndex?: number;
  rawRecord?: Record<string, any>;
}

/**
 * 2. Record Matching & Clusters
 */
export interface MatchedRecordPair {
  recordA: NormalizedTransaction;
  recordB: NormalizedTransaction;
  matchType: "EXACT_MATCH" | "PROBABLE_MATCH" | "PARTIAL_MATCH";
  confidence: "EXACT_MATCH" | "PROBABLE_MATCH" | "PARTIAL_MATCH" | number;
  confidenceScore?: number;
  matchedFields: string[];
  reasons: string[];
}

/**
 * 3. Duplicate Detection Finding
 */
export interface DuplicateFinding {
  id: string;
  type: "EXACT_DUPLICATE" | "POSSIBLE_DUPLICATE" | "CONFLICTING_DUPLICATE";
  duplicateType?: "EXACT_DUPLICATE" | "POSSIBLE_DUPLICATE" | "CONFLICTING_DUPLICATE";
  status: "DUPLICATE" | "POSSIBLE DUPLICATE";
  description: string;
  recordA: NormalizedTransaction;
  recordB: NormalizedTransaction;
  duplicateFields: string[];
  differingFields?: string[];
  severity: "low" | "medium" | "high";
}

/**
 * 5. Forensic Assertion & Assumption Engine
 */
export type AssertionLevel = "CONFIRMED" | "INFERRED" | "ASSUMPTION" | "MISSING";

export interface ForensicAssertion {
  id: string;
  level: AssertionLevel;
  displayBadge: "CONFIRMED" | "INFERRED" | "INFERRED — UNVERIFIED" | "MISSING";
  claim: string;
  rationale: string;
  basis: string[];
  sourceEvidenceIds: string[];
  verified: boolean;
}

/**
 * 6. Source Traceability
 */
export interface SourceReference {
  id: string;
  evidenceId: string;
  filename: string;
  location?: string;
  extractedValue: string;
  entityType: "phone" | "email" | "amount" | "url" | "upi" | "utr" | "account" | "date" | "other";
  contextSnippet?: string;
}

/**
 * 7. Incident Reporting Checklist
 */
export interface ChecklistItem {
  id?: string;
  key?: string;
  field?: string;
  label: string;
  description: string;
  category?: string;
  passed?: boolean;
  status?: "pass" | "fail" | "warning";
  required?: boolean;
  evidenceFound?: string;
}

export interface IncidentChecklist {
  incidentDate: boolean;
  incidentTime: boolean;
  fraudType: boolean;
  amount: boolean;
  transactionReference: boolean;
  suspiciousUrl: boolean;
  counterparty: boolean;
  evidenceAttached: boolean;
  timelineCreated: boolean;
  missingDataDocumented: boolean;
  contradictionsDocumented: boolean;
  redactionApplied: boolean;
  overallComplete: boolean;
  completionPercentage: number;
  items: ChecklistItem[];
}

/**
 * Master Incident Object
 */
export interface Incident {
  meta: IncidentMeta;
  summary: IncidentSummary;
  parties: Party[];
  channels: Channel[];
  transactions: Transaction[];
  timeline: TimelineEvent[];
  gaps: Gap[];
  conflicts: Conflict[];
  duplicates?: DuplicateFinding[];
  assumptions?: ForensicAssertion[];
  normalizedRecords?: NormalizedTransaction[];
  sourceReferences?: SourceReference[];
  checklist?: IncidentChecklist;
  moduleHits: ModuleHit[];
  fraudAttemptLog: FraudAttempt[];
  evidence: EvidenceItem[];
  extractedEntities?: ExtractedEntities;
}
