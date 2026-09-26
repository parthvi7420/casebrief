import { EvidenceItem, ModuleHit } from "../../types/incident.js";

/**
 * MODULE 1: Message Analyzer
 * Deterministic heuristic engine detecting social engineering, urgency lures, and credential/OTP requests.
 */

const URGENCY_TRIGGERS = [
  { pattern: /\burgent(?:ly)?\b/i, reason: "Urgency pressure trigger detected" },
  { pattern: /\bimmediate(?:ly)?\b/i, reason: "Immediate action demand detected" },
  { pattern: /\bkyc\b/i, reason: "KYC update lure detected" },
  { pattern: /\bverif(?:y|ication)\b/i, reason: "Verification prompt detected" },
  { pattern: /\b(?:account\s+)?block(?:ed)?\b/i, reason: "Account block threat detected" },
  { pattern: /\bsuspend(?:ed|sion)?\b/i, reason: "Account suspension threat detected" },
  { pattern: /\botp\b|one\stime\spassword/i, reason: "OTP / credential request detected" },
  { pattern: /click\s+(?:here|this\s+link|link)/i, reason: "Call-to-action click lure detected" },
  { pattern: /send\s+(?:₹|rs\.?|inr|\d+)/i, reason: "Direct payment solicitation detected" },
  { pattern: /unblock\s+your\s+account/i, reason: "Account unblock extortion/demand detected" },
];

export function runMessageAnalyzer(evidenceList: EvidenceItem[]): ModuleHit {
  const reasons = new Set<string>();
  const matchingEvidenceIds = new Set<string>();

  for (const item of evidenceList) {
    const text = (item.extractedText || "").toLowerCase();
    if (!text) continue;

    for (const trigger of URGENCY_TRIGGERS) {
      if (trigger.pattern.test(text)) {
        reasons.add(trigger.reason);
        matchingEvidenceIds.add(item.id);
      }
    }
  }

  const isHit = reasons.size > 0;

  return {
    module: "Message Analyzer",
    status: isHit ? "hit" : "idle",
    reasons: Array.from(reasons),
    evidenceIds: Array.from(matchingEvidenceIds),
  };
}
