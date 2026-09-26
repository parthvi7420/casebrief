/**
 * SHARED CONTRACT between Member 1 (UI) and Member 2 (Engine)
 *
 * DO NOT modify this file without coordinating with both team members.
 * This is the single source of truth for data flow between systems.
 */

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  sourceIds: string[];
  modulesFired: string[];
}

export interface EvidenceItem {
  id: string;
  type: 'message' | 'url' | 'transaction' | 'image' | 'document';
  content: string;
  timestamp?: string;
  hash?: string;
  metadata?: Record<string, unknown>;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  timestamp: string;
  upi?: string;
  utr?: string;
  counterparty?: string;
}

export interface Gap {
  field: string;
  transaction?: string;
  status: 'missing' | 'incomplete';
  required?: boolean;
}

export interface Conflict {
  type: string;
  source1: string;
  source2: string;
  value1: string | number;
  value2: string | number;
  difference?: string | number;
}

export interface ModuleHit {
  module: string;
  status: 'hit' | 'idle';
  reasons?: string[];
  confidence?: number;
}

export interface FraudAttempt {
  timestamp: string;
  event: string;
  reason: string;
  modulesFired: string[];
}

export interface Party {
  name?: string;
  identifier?: string;
  role: 'sender' | 'receiver' | 'intermediary';
}

export interface Channel {
  type: 'whatsapp' | 'sms' | 'email' | 'bank' | 'other';
  identifier?: string;
}

export interface Incident {
  // Metadata
  id: string;
  createdAt: string;
  caseNumber: string;

  // Summary
  summary: {
    title: string;
    fraudType: string;
    estimatedLoss: number;
    currency: string;
  };

  // Entities
  parties: Party[];
  channels: Channel[];

  // Data
  transactions: Transaction[];
  timeline: TimelineEvent[];
  gaps: Gap[];
  conflicts: Conflict[];
  moduleHits: ModuleHit[];
  fraudAttemptLog: FraudAttempt[];
  evidence: EvidenceItem[];

  // Redaction state
  redacted?: {
    phone?: boolean;
    email?: boolean;
    upi?: boolean;
    account?: boolean;
    aadhaar?: boolean;
    pan?: boolean;
  };
}

/**
 * MEMBER 2 INTERFACE
 *
 * Member 2 must expose these functions:
 */

export interface InvestigationEngine {
  loadDemoCase(): Incident;
  processEvidence(evidence: EvidenceItem[]): Promise<Incident>;
}
