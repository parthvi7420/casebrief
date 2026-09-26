import { EvidenceItem, ModuleHit, Transaction } from "../../types/incident.js";
import { extractAmounts } from "../extractionService.js";

/**
 * MODULE 5: Transaction Auditor
 * Audits financial ledger transactions against evidence, flagging missing UTRs, suspicious debits, and unverified transfers.
 */

export function runTransactionAuditor(
  evidenceList: EvidenceItem[],
  existingTransactions: Transaction[] = []
): {
  moduleHit: ModuleHit;
  auditedTransactions: Transaction[];
} {
  const reasons = new Set<string>();
  const matchingEvidenceIds = new Set<string>();
  const allTransactions: Transaction[] = [...existingTransactions];

  // Audit each transaction
  for (const txn of allTransactions) {
    if (txn.sourceEvidenceIds) {
      txn.sourceEvidenceIds.forEach((id) => matchingEvidenceIds.add(id));
    }

    // Check for missing UTR
    if (!txn.utr || txn.utr.trim().length === 0) {
      reasons.add(
        `Transaction ID '${txn.id}' (Amount: ₹${txn.amount?.toLocaleString("en-IN")}) lacks critical bank UTR / Reference ID`
      );
    }

    // Check for debit transactions
    if (txn.amount && txn.amount > 0) {
      reasons.add(
        `Financial debit recorded: ₹${txn.amount.toLocaleString("en-IN")} to beneficiary ${txn.upiId || "Unverified VPA"}`
      );
    }
  }

  // If no transactions but money mentions found in messages
  if (allTransactions.length === 0) {
    for (const item of evidenceList) {
      const { amounts, formattedAmounts } = extractAmounts(item.extractedText || "");
      if (amounts.length > 0) {
        matchingEvidenceIds.add(item.id);
        for (let i = 0; i < amounts.length; i++) {
          reasons.add(
            `Monetary transfer request identified in text: ${formattedAmounts[i] || `₹${amounts[i]}`}`
          );
        }
      }
    }
  }

  const isHit = reasons.size > 0;

  return {
    moduleHit: {
      module: "Transaction Auditor",
      status: isHit ? "hit" : "idle",
      reasons: Array.from(reasons),
      evidenceIds: Array.from(matchingEvidenceIds),
    },
    auditedTransactions: allTransactions,
  };
}
