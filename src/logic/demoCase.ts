import { Incident, EvidenceItem } from "../types/incident";
import { runAllSecurityModules } from "../modules";
import { buildChronologicalTimeline } from "./timeline";
import { identifyForensicGaps } from "./gaps";
import { identifyEvidenceConflicts } from "./conflicts";
import { extractEntities } from "../extract";
import { redactText } from "./redaction";

export const DEMO_PHISHING_MESSAGE_TEXT = `[26/09/26, 10:34:00 AM] +919876543210: URGENT: Your bank account requires immediate KYC verification to avoid permanent account block. Click here immediately to verify: http://pay-secure-example.test/verify
[26/09/26, 11:00:00 AM] +919876543210: We noticed an issue with your previous submission. Please send ₹5,000 to user@oksbi immediately to complete your verification and unblock your account.`;

export const DEMO_SUSPICIOUS_URL_TEXT = `http://pay-secure-example.test/verify`;

export const DEMO_TRANSACTIONS_CSV_TEXT = `date,time,amount,currency,description,utr,account,upi_id
2026-09-26,10:45,4999,INR,Debit transaction to user@oksbi,,XXXX4521,user@oksbi`;

/**
 * Creates the official benchmark Demo Case for CaseBrief
 */
export function createDemoIncident(): Incident {
  const evidenceList: EvidenceItem[] = [
    {
      id: "evidence-msg",
      type: "message",
      filename: "phishing_message.txt",
      hash: "a4f891b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abc",
      extractedText: DEMO_PHISHING_MESSAGE_TEXT,
      redactedPreview: redactText(DEMO_PHISHING_MESSAGE_TEXT),
      createdAt: "2026-09-26T10:34:00Z",
    },
    {
      id: "evidence-url",
      type: "url",
      filename: "suspicious_url.txt",
      hash: "b7e123c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
      extractedText: DEMO_SUSPICIOUS_URL_TEXT,
      redactedPreview: DEMO_SUSPICIOUS_URL_TEXT,
      createdAt: "2026-09-26T10:35:00Z",
    },
    {
      id: "evidence-csv",
      type: "csv",
      filename: "transactions.csv",
      hash: "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
      extractedText: DEMO_TRANSACTIONS_CSV_TEXT,
      redactedPreview: redactText(DEMO_TRANSACTIONS_CSV_TEXT),
      createdAt: "2026-09-26T10:45:00Z",
    },
  ];

  // Combined text for master entity extraction
  const fullText = evidenceList.map(e => e.extractedText || "").join("\n");
  const extractedEntities = extractEntities(fullText);

  // Security modules
  const moduleResults = runAllSecurityModules(evidenceList);

  // Timeline
  const timeline = buildChronologicalTimeline(evidenceList, moduleResults.transactions);

  // Gaps
  const gaps = identifyForensicGaps(evidenceList, moduleResults.transactions);

  // Conflicts
  const conflicts = identifyEvidenceConflicts(evidenceList, moduleResults.transactions);

  return {
    meta: {
      caseId: "CB-2026-001",
      title: "Banking Phishing & KYC Extortion Lure",
      createdAt: "2026-09-26T10:34:00Z",
      status: "Active Investigation",
    },
    summary: {
      fraudType: "phishing",
      estimatedLoss: 4999,
      currency: "INR",
      firstEvent: "10:34 AM",
      lastEvent: "11:00 AM",
    },
    parties: [
      {
        id: "party-suspect",
        name: "Unknown Threat Actor (Spoofed Support)",
        phones: ["+919876543210"],
        upiIds: ["user@oksbi"],
        handles: ["+919876543210", "user@oksbi"],
      },
      {
        id: "party-victim",
        name: "Complainant / Account Holder",
        phones: [],
      },
    ],
    channels: [
      {
        type: "url",
        value: "http://pay-secure-example.test/verify",
        sourceEvidenceIds: ["evidence-url", "evidence-msg"],
      },
      {
        type: "domain",
        value: "pay-secure-example.test",
        sourceEvidenceIds: ["evidence-url", "evidence-msg"],
      },
      {
        type: "app",
        value: "WhatsApp Messenger (+919876543210)",
        sourceEvidenceIds: ["evidence-msg"],
      },
    ],
    transactions: moduleResults.transactions.length > 0 ? moduleResults.transactions : [
      {
        id: "txn-001",
        date: "2026-09-26",
        time: "10:45 AM",
        amount: 4999,
        currency: "INR",
        accountLast4: "4521",
        upiId: "user@oksbi",
        description: "Debit transaction to user@oksbi",
        sourceEvidenceIds: ["evidence-csv"],
      },
    ],
    timeline,
    gaps,
    conflicts,
    moduleHits: moduleResults.moduleHits,
    fraudAttemptLog: moduleResults.fraudAttemptLog,
    evidence: evidenceList,
    extractedEntities,
  };
}
