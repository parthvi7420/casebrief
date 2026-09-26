import { Incident, EvidenceItem, FraudType, Channel, Party } from "../types/incident";
import { runAllSecurityModules } from "../modules";
import { buildChronologicalTimeline } from "./timeline";
import { identifyForensicGaps } from "./gaps";
import { identifyEvidenceConflicts } from "./conflicts";
import { extractEntities } from "../extract";
import { redactText } from "./redaction";
import { computeSHA256 } from "../utils/hashing";
import { createDemoIncident } from "./demoCase";
import { normalizeAllTransactions } from "./normalize";
import { detectDuplicates } from "./duplicates";
import { evaluateForensicAssumptions } from "./assumptions";
import { buildSourceTraceabilityMatrix } from "./traceability";
import { evaluateReportingChecklist } from "./checklist";

export { createDemoIncident, loadDemoCase };

function loadDemoCase(): Incident {
  return createDemoIncident();
}

/**
 * Master pipeline processing raw uploaded/pasted evidence into an authenticated Incident investigation object.
 */
export async function processEvidence(evidenceList: EvidenceItem[]): Promise<Incident> {
  // If no evidence provided or matches demo case, load benchmark demo
  if (!evidenceList || evidenceList.length === 0) {
    return createDemoIncident();
  }

  // Ensure SHA-256 cryptographic hashes and redacted previews for all evidence items
  const processedEvidence: EvidenceItem[] = [];
  for (const item of evidenceList) {
    const text = item.extractedText || "";
    const hash = item.hash || (await computeSHA256(text));
    const redactedPreview = item.redactedPreview || redactText(text);

    processedEvidence.push({
      ...item,
      hash,
      redactedPreview,
    });
  }

  // Entity extraction
  const combinedText = processedEvidence.map((e) => e.extractedText || "").join("\n");
  const extractedEntities = extractEntities(combinedText);

  // Security modules execution
  const moduleResults = runAllSecurityModules(processedEvidence);

  // Phase 2: Normalization
  const normalizedRecords = normalizeAllTransactions(processedEvidence);

  // Phase 2: Duplicate Detection
  const duplicateFindings = detectDuplicates(normalizedRecords);

  // Reconstruct chronological timeline
  const timeline = buildChronologicalTimeline(processedEvidence, moduleResults.transactions);

  // Identify gaps & conflicts
  const gaps = identifyForensicGaps(processedEvidence, moduleResults.transactions);
  const conflicts = identifyEvidenceConflicts(processedEvidence, normalizedRecords);

  // Phase 2: Assumptions & Forensic Truth Engine
  const assumptions = evaluateForensicAssumptions(processedEvidence, normalizedRecords, timeline, gaps, conflicts);

  // Phase 2: Source Traceability Matrix
  const sourceReferences = buildSourceTraceabilityMatrix(processedEvidence, extractedEntities, normalizedRecords);

  // Phase 2: Dynamic Reporting Checklist
  const checklist = evaluateReportingChecklist(
    processedEvidence,
    extractedEntities,
    timeline,
    gaps,
    conflicts,
    normalizedRecords,
    true
  );

  // Derive channels
  const channels: Channel[] = [];
  for (const u of extractedEntities.urls) {
    channels.push({
      type: "url",
      value: u.raw,
      sourceEvidenceIds: processedEvidence.map((e) => e.id),
    });
    channels.push({
      type: "domain",
      value: u.domain,
      sourceEvidenceIds: processedEvidence.map((e) => e.id),
    });
  }
  for (const phone of extractedEntities.phones) {
    channels.push({
      type: "app",
      value: `WhatsApp (+91 ${phone})`,
      sourceEvidenceIds: processedEvidence.map((e) => e.id),
    });
  }

  // Derive parties
  const parties: Party[] = [
    {
      id: "party-suspect",
      name: "Identified Threat Actor",
      phones: extractedEntities.phones,
      emails: extractedEntities.emails,
      upiIds: extractedEntities.upiIds,
      handles: [...extractedEntities.phones, ...extractedEntities.upiIds],
    },
    {
      id: "party-victim",
      name: "Complainant",
      phones: [],
    },
  ];

  // Derive estimated financial loss
  let estimatedLoss = 0;
  if (moduleResults.transactions.length > 0) {
    estimatedLoss = moduleResults.transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  } else if (normalizedRecords.length > 0) {
    estimatedLoss = normalizedRecords.reduce((acc, t) => acc + (t.amount || 0), 0);
  } else if (extractedEntities.amounts.length > 0) {
    estimatedLoss = extractedEntities.amounts[0];
  }

  // Infer fraud type
  let fraudType: FraudType = "phishing";
  const lowerAll = combinedText.toLowerCase();
  if (lowerAll.includes("upi") || extractedEntities.upiIds.length > 0) {
    fraudType = "UPI";
  } else if (lowerAll.includes("kyc") || lowerAll.includes("verify") || extractedEntities.urls.length > 0) {
    fraudType = "phishing";
  } else if (lowerAll.includes("job") || lowerAll.includes("task") || lowerAll.includes("salary")) {
    fraudType = "fake_job";
  } else if (lowerAll.includes("invest") || lowerAll.includes("crypto") || lowerAll.includes("return")) {
    fraudType = "investment";
  }

  const firstEventTime = timeline[0]?.time || "10:34 AM";
  const lastEventTime = timeline[timeline.length - 1]?.time || "11:00 AM";

  return {
    meta: {
      caseId: `CB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: `${fraudType.toUpperCase()} Digital Fraud Incident`,
      createdAt: new Date().toISOString(),
      status: "Active Investigation",
    },
    summary: {
      fraudType,
      estimatedLoss,
      currency: "INR",
      firstEvent: firstEventTime,
      lastEvent: lastEventTime,
    },
    parties,
    channels,
    transactions: moduleResults.transactions,
    timeline,
    gaps,
    conflicts,
    duplicates: duplicateFindings,
    assumptions,
    normalizedRecords,
    sourceReferences,
    checklist,
    moduleHits: moduleResults.moduleHits,
    fraudAttemptLog: moduleResults.fraudAttemptLog,
    evidence: processedEvidence,
    extractedEntities,
  };
}
