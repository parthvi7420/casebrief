import { EvidenceItem, ModuleHit, Transaction } from "../types/incident";
import { parseCSVTransactions } from "../extract/csv";
import { extractMoney } from "../extract/money";

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

  // Also parse any CSV or transaction evidence items
  for (const item of evidenceList) {
    if (item.type === "csv" || (item.extractedText && item.extractedText.includes("Date,Time,Description"))) {
      const csvTxns = parseCSVTransactions(item.extractedText || "", item.id);
      for (const t of csvTxns) {
        if (!allTransactions.some(x => x.id === t.id && x.amount === t.amount)) {
          allTransactions.push(t);
        }
      }
    }
  }

  // Audit each transaction
  for (const txn of allTransactions) {
    if (txn.sourceEvidenceIds) {
      txn.sourceEvidenceIds.forEach(id => matchingEvidenceIds.add(id));
    }

    // Check for missing UTR
    if (!txn.utr || txn.utr.trim().length === 0) {
      reasons.add(`Transaction ID '${txn.id}' (Amount: ₹${txn.amount?.toLocaleString('en-IN')}) lacks critical bank UTR / Reference ID`);
    }

    // Check for debit transactions
    if (txn.amount && txn.amount > 0) {
      reasons.add(`Financial debit recorded: ₹${txn.amount.toLocaleString('en-IN')} to beneficiary ${txn.upiId || 'Unverified VPA'}`);
    }
  }

  // If no transactions in CSV but money mentions found in messages
  if (allTransactions.length === 0) {
    for (const item of evidenceList) {
      const money = extractMoney(item.extractedText || "");
      if (money.length > 0) {
        matchingEvidenceIds.add(item.id);
        for (const m of money) {
          reasons.add(`Monetary transfer request identified in text: ${m.formatted}`);
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
