import { Incident } from "../types/incident.js";
import { createRedactedIncident } from "./redactionService.js";
import { computeSHA256 } from "./evidenceService.js";

/**
 * Report Generation Engine for Law Enforcement & Financial Intelligence Units
 */

export interface ChainOfCustodyRecord {
  caseId: string;
  caseTitle: string;
  generatedAt: string;
  reportIntegrityHash: string;
  evidenceItems: {
    evidenceId: string;
    filename: string;
    type: string;
    sha256: string;
    timestamp: string;
  }[];
  custodian: string;
  station: string;
}

/**
 * Generates an unredacted forensic report export (Strictly for local authority / court filing)
 */
export function generateFullForensicReport(incident: Incident): Incident {
  return JSON.parse(JSON.stringify(incident));
}

/**
 * Generates a sanitized, privacy-masked report export (Safe for external dissemination)
 */
export function generateRedactedReport(incident: Incident): Incident {
  return createRedactedIncident(incident);
}

/**
 * Creates a verifiable SHA-256 Chain of Custody certificate
 */
export function generateChainOfCustody(
  incident: Incident,
  custodianName: string = "CaseBrief Cyber Forensics Engine",
  station: string = "Digital Crime Investigation Bureau"
): ChainOfCustodyRecord {
  const caseIdStr = incident.id || incident.meta?.caseId || "UNKNOWN-CASE";
  const caseTitleStr = incident.title || incident.meta?.title || "CaseBrief Investigation Report";

  const evidenceRecords = (incident.evidence || []).map((e) => ({
    evidenceId: e.id,
    filename: e.filename || "Evidence",
    type: e.type,
    sha256: e.sha256 || e.fileHash || computeSHA256(e.extractedText || ""),
    timestamp: e.createdAt || new Date().toISOString(),
  }));

  const payloadToHash = JSON.stringify({
    caseId: caseIdStr,
    title: caseTitleStr,
    evidence: evidenceRecords,
    summary: incident.summary,
  });

  const integrityHash = computeSHA256(payloadToHash);

  return {
    caseId: caseIdStr,
    caseTitle: caseTitleStr,
    generatedAt: new Date().toISOString(),
    reportIntegrityHash: integrityHash,
    evidenceItems: evidenceRecords,
    custodian: custodianName,
    station,
  };
}
