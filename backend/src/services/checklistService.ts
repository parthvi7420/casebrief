import {
  IncidentChecklist,
  ChecklistItem,
  EvidenceItem,
  ExtractedEntities,
  TimelineEvent,
  Gap,
  Conflict,
  NormalizedTransaction,
} from "../types/incident.js";

/**
 * Dynamic 12-Point Incident Reporting Checklist Engine
 * Evaluates forensic completeness across mandatory reporting fields and produces completion metrics.
 */
export function evaluateReportingChecklist(
  evidenceList: EvidenceItem[],
  entities: ExtractedEntities,
  timeline: TimelineEvent[],
  gaps: Gap[],
  conflicts: Conflict[],
  normalizedTransactions: NormalizedTransaction[] = [],
  isRedactionApplied: boolean = true
): IncidentChecklist {
  const items: ChecklistItem[] = [];

  // 1. Incident Date
  const hasDate =
    (entities.dates || []).length > 0 ||
    timeline.some((t) => Boolean(t.date || t.timestamp));
  items.push({
    id: "chk-date",
    field: "incidentDate",
    label: "Incident Date Recorded",
    description:
      "Identifies the calendar date(s) on which the fraud communications or transactions occurred.",
    status: hasDate ? "pass" : "fail",
    required: true,
  });

  // 2. Incident Time
  const hasTime =
    timeline.length > 0 &&
    timeline.some((t) => Boolean(t.time || t.timestamp));
  items.push({
    id: "chk-time",
    field: "incidentTime",
    label: "Incident Timestamp Sequence",
    description:
      "Granular HH:MM chronological timing documented for incident reconstruction.",
    status: hasTime ? "pass" : "fail",
    required: true,
  });

  // 3. Fraud Type
  const hasFraudType =
    (entities.urls && entities.urls.length > 0) ||
    ((entities.upiIds || []).length > 0 && (entities.amounts || []).length > 0);
  items.push({
    id: "chk-fraud-type",
    field: "fraudType",
    label: "Fraud Modus Operandi Classification",
    description:
      "Specific fraud category (e.g. KYC Impersonation, Phishing Gateway) determined.",
    status: hasFraudType ? "pass" : "fail",
    required: true,
  });

  // 4. Amount
  const hasAmount =
    (entities.amounts && entities.amounts.length > 0) ||
    normalizedTransactions.some((t) => (t.amount || 0) > 0);
  items.push({
    id: "chk-amount",
    field: "amount",
    label: "Defrauded Financial Amount",
    description: "Exact monetary quantum demanded and/or debited across ledgers.",
    status: hasAmount ? "pass" : "fail",
    required: true,
  });

  // 5. Transaction Reference / UTR
  const hasRef =
    normalizedTransactions.some((t) => Boolean(t.transactionReference)) ||
    (entities.utrs || []).length > 0;
  const utrMissing = gaps.some((g) => g.field.toLowerCase().includes("utr"));
  items.push({
    id: "chk-txn-ref",
    field: "transactionReference",
    label: "Bank Transaction Settlement Reference (UTR / RRN)",
    description:
      "12-digit interbank settlement reference for tracking fund flow across beneficiary banks.",
    status: hasRef ? "pass" : utrMissing ? "warning" : "fail",
    required: true,
  });

  // 6. Suspicious URL
  const hasUrl = entities.urls && entities.urls.length > 0;
  items.push({
    id: "chk-url",
    field: "suspiciousUrl",
    label: "Phishing / Malicious URL Artifact",
    description:
      "Unencrypted or lookalike web endpoint payload extracted from victim communications.",
    status: hasUrl ? "pass" : "warning",
    required: true,
  });

  // 7. Counterparty / Beneficiary
  const hasCounterparty =
    (entities.upiIds || []).length > 0 ||
    normalizedTransactions.some((t) => Boolean(t.counterparty));
  items.push({
    id: "chk-counterparty",
    field: "counterparty",
    label: "Counterparty Beneficiary Identifier (VPA / UPI / Account)",
    description: "Destination handle or mule account receiving fraudulent funds.",
    status: hasCounterparty ? "pass" : "fail",
    required: true,
  });

  // 8. Evidence Attached
  const hasEvidence = evidenceList.length > 0;
  items.push({
    id: "chk-evidence",
    field: "evidenceAttached",
    label: "Multi-Modal Primary Evidence Attached",
    description:
      "Raw files, screenshots, chat exports, or CSV extracts verified with SHA-256 hashes.",
    status: hasEvidence ? "pass" : "fail",
    required: true,
  });

  // 9. Timeline Created
  const hasTimeline = timeline.length >= 2;
  items.push({
    id: "chk-timeline",
    field: "timelineCreated",
    label: "Chronological Sequence Assembled",
    description:
      "Multi-step event reconstruction ordered chronologically across all evidence artifacts.",
    status: hasTimeline ? "pass" : "fail",
    required: true,
  });

  // 10. Missing Data Documented
  const hasGapsDoc = gaps.length > 0;
  items.push({
    id: "chk-gaps",
    field: "missingDataDocumented",
    label: "Investigation Data Gaps Formally Documented",
    description:
      "Missing banking records, subpoena requirements, and missing UTRs logged for escalation.",
    status: hasGapsDoc ? "pass" : "pass",
    required: true,
  });

  // 11. Contradictions Documented
  const hasConflictsDoc = conflicts.length > 0;
  items.push({
    id: "chk-conflicts",
    field: "contradictionsDocumented",
    label: "Cross-Evidence Contradictions Highlighted",
    description:
      "Discrepancies across chat demands vs bank statements (e.g. ₹5,000 vs ₹4,999) flagged.",
    status: hasConflictsDoc ? "pass" : "pass",
    required: true,
  });

  // 12. Redaction Applied
  items.push({
    id: "chk-redaction",
    field: "redactionApplied",
    label: "Privacy Redaction & Masking Applied",
    description: "PII masking active for compliance and external dissemination.",
    status: isRedactionApplied ? "pass" : "warning",
    required: true,
  });

  // Calculate completeness score
  const passedCount = items.filter((i) => i.status === "pass").length;
  const completionPercentage = Math.round((passedCount / items.length) * 100);
  const overallComplete = completionPercentage >= 75;

  return {
    incidentDate: hasDate,
    incidentTime: hasTime,
    fraudType: hasFraudType,
    amount: hasAmount,
    transactionReference: hasRef,
    suspiciousUrl: hasUrl,
    counterparty: hasCounterparty,
    evidenceAttached: hasEvidence,
    timelineCreated: hasTimeline,
    missingDataDocumented: hasGapsDoc,
    contradictionsDocumented: hasConflictsDoc,
    redactionApplied: isRedactionApplied,
    overallComplete,
    completionPercentage,
    items,
  };
}
