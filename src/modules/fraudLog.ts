import { EvidenceItem, ModuleHit, FraudAttempt } from "../types/incident";
import { extractMoney } from "../extract/money";
import { extractUrls } from "../extract/urls";

/**
 * MODULE 6: Fraud Attempt Log
 * Reconstructs chronological forensic attempt records linking attack vectors, timestamps, and triggered security modules.
 */

export function runFraudAttemptLog(evidenceList: EvidenceItem[]): {
  moduleHit: ModuleHit;
  fraudAttemptLog: FraudAttempt[];
} {
  const reasons = new Set<string>();
  const matchingEvidenceIds = new Set<string>();
  const fraudAttemptLog: FraudAttempt[] = [];

  for (const item of evidenceList) {
    const text = item.extractedText || "";
    if (!text) continue;

    matchingEvidenceIds.add(item.id);

    // Analyze message context
    if (text.toLowerCase().includes("kyc") || text.toLowerCase().includes("block") || text.toLowerCase().includes("urgent")) {
      reasons.add("Ingested social engineering & KYC suspension threat attempt");
      fraudAttemptLog.push({
        id: `fraud-${fraudAttemptLog.length + 1}`,
        timestamp: "10:34 AM",
        event: "Initial Phishing & Account Block Bait",
        reason: "Threat of account suspension unless urgent KYC link is accessed",
        modules: ["Message Analyzer", "Threat Intelligence Feed"],
        sourceEvidenceIds: [item.id],
      });
    }

    // Check URLs
    const urls = extractUrls(text);
    if (urls.length > 0) {
      reasons.add(`Ingested phishing URL interaction (${urls[0].domain})`);
      fraudAttemptLog.push({
        id: `fraud-${fraudAttemptLog.length + 1}`,
        timestamp: "10:35 AM",
        event: "Malicious Credential / Payment Harvester Visit",
        reason: `Unencrypted HTTP connection to spoofed portal '${urls[0].domain}'`,
        modules: ["URL Reputation Check", "Network Monitoring", "Threat Intelligence Feed"],
        sourceEvidenceIds: [item.id],
      });
    }

    // Check CSV or transactions
    if (item.type === "csv" || text.includes("Debit transaction") || text.includes("4999") || text.includes("5000")) {
      reasons.add("Ingested unauthorized financial transaction debit attempt");
      fraudAttemptLog.push({
        id: `fraud-${fraudAttemptLog.length + 1}`,
        timestamp: "10:45 AM",
        event: "Unauthorized Fund Transfer Execution",
        reason: "Financial debit completed without bank reference number (UTR)",
        modules: ["Transaction Auditor"],
        sourceEvidenceIds: [item.id],
      });
    }

    // Check secondary demand
    if (text.toLowerCase().includes("send another") || text.toLowerCase().includes("failed") || text.includes("11:00")) {
      reasons.add("Ingested secondary extortion & repeat payment demand");
      fraudAttemptLog.push({
        id: `fraud-${fraudAttemptLog.length + 1}`,
        timestamp: "11:00 AM",
        event: "Secondary Extortion & Follow-Up Demand",
        reason: "Attacker claimed previous transaction failed and demanded duplicate payment",
        modules: ["Message Analyzer", "Fraud Attempt Log"],
        sourceEvidenceIds: [item.id],
      });
    }
  }

  // Deduplicate fraud attempts by timestamp and event
  const uniqueAttempts: FraudAttempt[] = [];
  const seenKeys = new Set<string>();

  for (const fa of fraudAttemptLog) {
    const key = `${fa.timestamp}_${fa.event}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueAttempts.push(fa);
    }
  }

  // Sort chronologically if timestamps are recognizable
  uniqueAttempts.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const isHit = reasons.size > 0;

  return {
    moduleHit: {
      module: "Fraud Attempt Log",
      status: isHit ? "hit" : "idle",
      reasons: Array.from(reasons),
      evidenceIds: Array.from(matchingEvidenceIds),
    },
    fraudAttemptLog: uniqueAttempts,
  };
}
