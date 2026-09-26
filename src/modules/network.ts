import { EvidenceItem, ModuleHit } from "../types/incident";
import { extractUrls } from "../extract/urls";

/**
 * MODULE 3: Network Monitoring (Evidence-Derived)
 * Reconstructs contacted hostnames, endpoints, and communications derived directly from ingested evidence.
 */

export interface NetworkLogEntry {
  domain: string;
  protocol: string;
  path: string;
  sourceEvidenceId: string;
  detectedAt: string;
}

export function runNetworkMonitoring(evidenceList: EvidenceItem[]): {
  moduleHit: ModuleHit;
  networkLogs: NetworkLogEntry[];
} {
  const reasons = new Set<string>();
  const matchingEvidenceIds = new Set<string>();
  const networkLogs: NetworkLogEntry[] = [];

  for (const item of evidenceList) {
    const text = item.extractedText || "";
    const urls = extractUrls(text);

    for (const u of urls) {
      matchingEvidenceIds.add(item.id);
      reasons.add(`Evidence-derived connection logged to external host: ${u.domain} (${u.protocol.toUpperCase()})`);
      networkLogs.push({
        domain: u.domain,
        protocol: u.protocol,
        path: u.path,
        sourceEvidenceId: item.id,
        detectedAt: item.createdAt || "10:35 AM",
      });
    }
  }

  const isHit = reasons.size > 0;

  return {
    moduleHit: {
      module: "Network Monitoring",
      status: isHit ? "hit" : "idle",
      reasons: Array.from(reasons),
      evidenceIds: Array.from(matchingEvidenceIds),
    },
    networkLogs,
  };
}
