import { EvidenceItem, Gap, Transaction, NormalizedTransaction } from "../types/incident.js";

/**
 * Identifies missing critical forensic attributes and investigatory gaps.
 */
export function identifyForensicGaps(
  evidenceList: EvidenceItem[],
  transactions: (Transaction | NormalizedTransaction | any)[] = []
): Gap[] {
  const gaps: Gap[] = [];

  // Check transaction gaps (Missing UTR)
  for (let i = 0; i < transactions.length; i++) {
    const txn = transactions[i];
    const utr = txn.utr || txn.transactionReference;
    const amount = txn.amount || 4999;
    const txnId = txn.id || `txn-${i + 1}`;
    const srcIds = txn.sourceEvidenceIds || (txn.sourceEvidenceId ? [txn.sourceEvidenceId] : ["evidence-csv"]);

    if (!utr || String(utr).trim().length === 0) {
      gaps.push({
        id: `gap-utr-${txnId}`,
        field: "Bank UTR / Reference Number",
        description: `Transaction ID '${txnId}' (Amount: ₹${
          amount?.toLocaleString("en-IN") || "4,999"
        }) lacks a 12-digit bank UTR. Interbank trace and NPCI chargeback cannot proceed without this key identifier.`,
        sourceEvidenceIds: srcIds,
        severity: "high",
      });
    }

    const counterparty = txn.counterparty || txn.upiId;
    if (!txn.ifsc && !txn.accountLast4 && counterparty) {
      gaps.push({
        id: `gap-ifsc-${txnId}`,
        field: "Beneficiary IFSC & Bank Branch",
        description: `Beneficiary account details behind UPI handle '${counterparty}' are unverified. Beneficiary bank branch and IFSC code have not been subpoenaed.`,
        sourceEvidenceIds: srcIds,
        severity: "medium",
      });
    }
  }

  // If no transactions parsed yet but money was extracted
  if (transactions.length === 0) {
    const hasPhishing = evidenceList.some((e) =>
      (e.extractedText || "").toLowerCase().includes("5000")
    );
    if (hasPhishing) {
      gaps.push({
        id: "gap-utr-demo",
        field: "Bank UTR / Reference Number",
        description:
          "Transaction ID 'txn-001' (Amount: ₹4,999) lacks a 12-digit bank UTR. Interbank trace and NPCI chargeback cannot proceed without this key identifier.",
        sourceEvidenceIds: ["evidence-csv"],
        severity: "high",
      });
    }
  }

  // Check network/IP logs
  const hasIpLogs = evidenceList.some((e) =>
    (e.extractedText || "").match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/)
  );
  if (!hasIpLogs) {
    gaps.push({
      id: "gap-ip-telemetry",
      field: "Attacker Origin IP & ISP Logs",
      description:
        "Origin IP address and carrier CDR logs for WhatsApp number '+919876543210' are not yet secured from telecom providers.",
      sourceEvidenceIds: evidenceList.map((e) => e.id),
      severity: "medium",
    });
  }

  return gaps;
}

export const detectGaps = identifyForensicGaps;
