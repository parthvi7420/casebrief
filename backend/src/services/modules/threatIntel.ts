import { EvidenceItem, ModuleHit } from "../../types/incident.js";
import { extractUrls } from "../extractionService.js";

/**
 * MODULE 4: Threat Intelligence Feed (Bundled Static Rule List)
 * Evaluates observed artifacts against local cyber threat intelligence IOC rules without external network queries.
 */

interface ThreatIndicator {
  type: "domain" | "url_pattern" | "upi" | "keyword";
  value: RegExp | string;
  threatName: string;
  severity: "critical" | "high" | "medium";
}

const STATIC_THREAT_IOCS: ThreatIndicator[] = [
  {
    type: "domain",
    value: "pay-secure-example.test",
    threatName: "Known Banking Phishing & Credential Harvester Domain",
    severity: "critical",
  },
  {
    type: "domain",
    value: /\.test$/i,
    threatName: "Unregistered / Disposable Non-Standard TLD Domain",
    severity: "high",
  },
  {
    type: "url_pattern",
    value: /pay-secure/i,
    threatName: "Lookalike Payment Gateway Spoof Pattern",
    severity: "high",
  },
  {
    type: "url_pattern",
    value: /\/verify(?:\.html|\.php)?$/i,
    threatName: "Generic Verification Stealer Endpoint",
    severity: "medium",
  },
  {
    type: "keyword",
    value: /kyc\s+update\s+urgently/i,
    threatName: "Banking Panic Social Engineering Campaign Signature",
    severity: "high",
  },
  {
    type: "keyword",
    value: /account\s+will\s+be\s+blocked\s+today/i,
    threatName: "Account Suspension Threat Signature",
    severity: "high",
  },
];

export function runThreatIntel(evidenceList: EvidenceItem[]): ModuleHit {
  const reasons = new Set<string>();
  const matchingEvidenceIds = new Set<string>();

  for (const item of evidenceList) {
    const text = item.extractedText || "";
    if (!text) continue;

    const urls = extractUrls(text);

    for (const ioc of STATIC_THREAT_IOCS) {
      if (ioc.type === "domain") {
        for (const u of urls) {
          const matched =
            typeof ioc.value === "string"
              ? u.domain.toLowerCase() === ioc.value.toLowerCase()
              : ioc.value.test(u.domain);

          if (matched) {
            matchingEvidenceIds.add(item.id);
            reasons.add(
              `[${ioc.severity.toUpperCase()}] IOC Hit: ${ioc.threatName} matched domain '${u.domain}'`
            );
          }
        }
      } else if (ioc.type === "url_pattern") {
        for (const u of urls) {
          const matched =
            typeof ioc.value === "string"
              ? u.raw.toLowerCase().includes(ioc.value.toLowerCase())
              : ioc.value.test(u.raw);

          if (matched) {
            matchingEvidenceIds.add(item.id);
            reasons.add(
              `[${ioc.severity.toUpperCase()}] IOC Hit: ${ioc.threatName} matched URL '${u.raw}'`
            );
          }
        }
      } else if (ioc.type === "keyword") {
        const matched =
          typeof ioc.value === "string"
            ? text.toLowerCase().includes(ioc.value.toLowerCase())
            : ioc.value.test(text);

        if (matched) {
          matchingEvidenceIds.add(item.id);
          reasons.add(
            `[${ioc.severity.toUpperCase()}] IOC Pattern: ${ioc.threatName}`
          );
        }
      }
    }
  }

  const isHit = reasons.size > 0;

  return {
    module: "Threat Intelligence Feed",
    status: isHit ? "hit" : "idle",
    reasons: Array.from(reasons),
    evidenceIds: Array.from(matchingEvidenceIds),
  };
}
