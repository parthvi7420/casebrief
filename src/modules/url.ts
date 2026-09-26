import { EvidenceItem, ModuleHit } from "../types/incident";
import { extractUrls } from "../extract/urls";

/**
 * MODULE 2: URL Reputation Check
 * Flags insecure HTTP, lookalike domains, suspicious TLDs, and payment verification keywords.
 */

const SUSPICIOUS_DOMAIN_KEYWORDS = [
  "pay-secure",
  "secure-",
  "verify",
  "kyc",
  "update",
  "unblock",
  "banking-alert",
  "reward",
  "support",
  "helpdesk",
  "login-sbi",
  "hdfc-net"
];

const SUSPICIOUS_TLDS = [".test", ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".buzz", ".click"];

export function runUrlReputationCheck(evidenceList: EvidenceItem[]): ModuleHit {
  const reasons = new Set<string>();
  const matchingEvidenceIds = new Set<string>();

  for (const item of evidenceList) {
    const text = item.extractedText || "";
    const urls = extractUrls(text);

    for (const url of urls) {
      matchingEvidenceIds.add(item.id);

      if (url.isHttpOnly) {
        reasons.add(`Insecure unencrypted HTTP protocol: ${url.raw}`);
      }

      for (const kw of SUSPICIOUS_DOMAIN_KEYWORDS) {
        if (url.domain.toLowerCase().includes(kw) || url.path.toLowerCase().includes(kw)) {
          reasons.add(`Phishing keyword '${kw}' identified in URL: ${url.domain}${url.path}`);
        }
      }

      for (const tld of SUSPICIOUS_TLDS) {
        if (url.domain.toLowerCase().endsWith(tld)) {
          reasons.add(`High-risk / suspicious TLD '${tld}' detected: ${url.domain}`);
        }
      }
    }
  }

  const isHit = reasons.size > 0;

  return {
    module: "URL Reputation Check",
    status: isHit ? "hit" : "idle",
    reasons: Array.from(reasons),
    evidenceIds: Array.from(matchingEvidenceIds),
  };
}
