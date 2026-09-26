/**
 * MEMBER 2: Placeholder for demo case loading
 *
 * Replace this with actual implementation after schema agreement
 */

import { Incident } from '../types/incident'

export function loadDemoCase(): Incident {
  // TODO: Member 2 implements this
  return {
    id: 'demo-001',
    createdAt: new Date().toISOString(),
    caseNumber: 'CB-2026-001',
    summary: {
      title: 'Phishing and UPI Fraud',
      fraudType: 'Phishing / UPI',
      estimatedLoss: 5000,
      currency: 'INR',
    },
    parties: [],
    channels: [],
    transactions: [],
    timeline: [],
    gaps: [],
    conflicts: [],
    moduleHits: [],
    fraudAttemptLog: [],
    evidence: [],
  }
}
