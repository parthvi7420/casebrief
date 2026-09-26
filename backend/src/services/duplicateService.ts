import { NormalizedTransaction, DuplicateFinding } from "../types/incident.js";

/**
 * Deterministic Duplicate Transaction Detection Engine
 * Identifies exact ledger duplicates and cross-export conflicting duplicates without deleting data.
 */
export function detectDuplicates(
  records: NormalizedTransaction[]
): DuplicateFinding[] {
  const duplicates: DuplicateFinding[] = [];
  const seenPairs = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const recA = records[i];
      const recB = records[j];

      const pairKey = [recA.id, recB.id].sort().join("::");
      if (seenPairs.has(pairKey)) continue;

      const duplicateFields: string[] = [];
      const differingFields: string[] = [];

      // Compare Reference / UTR
      const hasRef = Boolean(
        recA.transactionReference && recB.transactionReference
      );
      const sameRef =
        hasRef &&
        recA.transactionReference?.trim().toUpperCase() ===
          recB.transactionReference?.trim().toUpperCase();

      if (sameRef) {
        duplicateFields.push("transactionReference");
      } else if (hasRef) {
        differingFields.push("transactionReference");
      }

      // Compare Amount
      const sameAmount =
        recA.amount !== undefined &&
        recB.amount !== undefined &&
        Math.abs(recA.amount - recB.amount) < 0.01;
      if (sameAmount) {
        duplicateFields.push("amount");
      } else if (recA.amount !== undefined && recB.amount !== undefined) {
        differingFields.push("amount");
      }

      // Compare Date & Time
      const normTimeA = (recA.time || "").replace(/[^0-9:]/g, "").slice(0, 5);
      const normTimeB = (recB.time || "").replace(/[^0-9:]/g, "").slice(0, 5);
      const sameTime = Boolean(
        normTimeA && normTimeB && normTimeA === normTimeB
      );
      if (sameTime) {
        duplicateFields.push("time");
      } else if (normTimeA && normTimeB) {
        differingFields.push("time");
      }

      const sameDate = Boolean(
        recA.date && recB.date && recA.date === recB.date
      );
      if (sameDate) {
        duplicateFields.push("date");
      }

      // Compare Counterparty
      const sameCounterparty = Boolean(
        recA.counterparty &&
          recB.counterparty &&
          recA.counterparty.toLowerCase().trim() ===
            recB.counterparty.toLowerCase().trim()
      );
      if (sameCounterparty) {
        duplicateFields.push("counterparty");
      }

      // 1. EXACT DUPLICATE RULE:
      // Same transaction reference + same amount + (same timestamp, date, counterparty or no conflicting date)
      if (sameRef && sameAmount && (sameTime || sameDate || sameCounterparty || (!recA.date && !recB.date))) {
        seenPairs.add(pairKey);
        duplicates.push({
          id: `dup-exact-${duplicates.length + 1}`,
          type: "EXACT_DUPLICATE",
          duplicateType: "EXACT_DUPLICATE",
          status: "DUPLICATE",
          description: `Identical transaction record verified across files (${recA.sourceEvidenceId} vs ${recB.sourceEvidenceId}). Reference ${recA.transactionReference} for ₹${recA.amount}${recA.time || recA.date ? ` at ${recA.time || recA.date}` : ""}.`,
          recordA: recA,
          recordB: recB,
          duplicateFields,
          differingFields,
          severity: "low",
        });
        continue;
      }

      // 2. CONFLICTING / POSSIBLE DUPLICATE RULE A:
      // Same reference / UTR but differing amount or timestamp
      if (
        sameRef &&
        (differingFields.includes("amount") || differingFields.includes("time"))
      ) {
        seenPairs.add(pairKey);
        duplicates.push({
          id: `dup-conflict-${duplicates.length + 1}`,
          type: "CONFLICTING_DUPLICATE",
          duplicateType: "CONFLICTING_DUPLICATE",
          status: "POSSIBLE DUPLICATE",
          description: `Conflicting duplicate on reference ${recA.transactionReference}. Same transaction identifier carries differing attributes across records (${differingFields.join(", ")}).`,
          recordA: recA,
          recordB: recB,
          duplicateFields,
          differingFields,
          severity: "high",
        });
        continue;
      }

      // 3. POSSIBLE DUPLICATE RULE B:
      // Exact same amount + same timestamp + same counterparty across different files without reference
      if (
        !sameRef &&
        sameAmount &&
        sameTime &&
        sameCounterparty &&
        recA.sourceEvidenceId !== recB.sourceEvidenceId
      ) {
        seenPairs.add(pairKey);
        duplicates.push({
          id: `dup-possible-${duplicates.length + 1}`,
          type: "POSSIBLE_DUPLICATE",
          duplicateType: "POSSIBLE_DUPLICATE",
          status: "POSSIBLE DUPLICATE",
          description: `Probable unlinked duplicate debit. Same amount (₹${recA.amount}) to ${recA.counterparty} at ${recA.time} found across ${recA.sourceEvidenceId} and ${recB.sourceEvidenceId}.`,
          recordA: recA,
          recordB: recB,
          duplicateFields,
          differingFields,
          severity: "medium",
        });
      }
    }
  }

  return duplicates;
}
