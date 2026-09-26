import { NormalizedTransaction, MatchedRecordPair } from "../types/incident.js";

/**
 * Multi-Attribute Record Matcher
 * Determines whether two transaction records represent the same financial event across different ledgers.
 */
export function matchTwoRecords(
  recA: NormalizedTransaction,
  recB: NormalizedTransaction
): MatchedRecordPair | null {
  // Never match a record against itself
  if (
    recA.id === recB.id &&
    recA.sourceEvidenceId === recB.sourceEvidenceId &&
    recA.sourceRowIndex === recB.sourceRowIndex
  ) {
    return null;
  }

  const matchedFields: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  // 1. Transaction Reference / UTR Check (Decisive matching factor)
  if (
    recA.transactionReference &&
    recB.transactionReference &&
    recA.transactionReference.trim().toUpperCase() ===
      recB.transactionReference.trim().toUpperCase()
  ) {
    matchedFields.push("transactionReference");
    reasons.push(
      `Identical Transaction Reference / UTR: ${recA.transactionReference}`
    );
    score += 0.6;
  }

  // 2. Amount Check
  if (
    recA.amount !== undefined &&
    recB.amount !== undefined &&
    recA.amount > 0
  ) {
    if (Math.abs(recA.amount - recB.amount) < 0.01) {
      matchedFields.push("amount");
      reasons.push(`Exact financial amount: ₹${recA.amount}`);
      score += 0.3;
    } else if (Math.abs(recA.amount - recB.amount) <= 1.0) {
      // Net ₹1 discrepancy (often seen in fraud evasion)
      matchedFields.push("amount_near");
      reasons.push(
        `Near financial amount with ₹1 variance: ₹${recA.amount} vs ₹${recB.amount}`
      );
      score += 0.2;
    }
  }

  // 3. Counterparty / UPI Match
  if (
    recA.counterparty &&
    recB.counterparty &&
    recA.counterparty.toLowerCase().trim() ===
      recB.counterparty.toLowerCase().trim()
  ) {
    matchedFields.push("counterparty");
    reasons.push(`Matching counterparty handle: ${recA.counterparty}`);
    score += 0.2;
  }

  // 4. Source Account Match
  if (
    recA.account &&
    recB.account &&
    (recA.account === recB.account ||
      recA.account.slice(-4) === recB.account.slice(-4))
  ) {
    matchedFields.push("account");
    reasons.push(`Matching source account ending in ${recA.account.slice(-4)}`);
    score += 0.15;
  }

  // 5. Date / Time Match
  const timeA = (recA.time || "").replace(/[^0-9:]/g, "");
  const timeB = (recB.time || "").replace(/[^0-9:]/g, "");
  if (timeA && timeB && timeA.slice(0, 5) === timeB.slice(0, 5)) {
    matchedFields.push("time");
    reasons.push(`Aligned timestamp: ${recA.time || recB.time}`);
    score += 0.15;
  }

  const dateA = (recA.date || "").replace(/[^0-9]/g, "");
  const dateB = (recB.date || "").replace(/[^0-9]/g, "");
  if (dateA && dateB && dateA === dateB) {
    matchedFields.push("date");
    reasons.push(`Matching transaction date: ${recA.date}`);
    score += 0.1;
  }

  // Determine Match Type
  if (score >= 0.7) {
    const isExact = score >= 0.85;
    return {
      recordA: recA,
      recordB: recB,
      matchType: isExact ? "EXACT_MATCH" : "PROBABLE_MATCH",
      confidence: isExact ? "EXACT_MATCH" : "PROBABLE_MATCH",
      confidenceScore: Math.min(1.0, score),
      matchedFields,
      reasons,
    };
  } else if (score >= 0.45 && matchedFields.includes("amount")) {
    return {
      recordA: recA,
      recordB: recB,
      matchType: "PARTIAL_MATCH",
      confidence: "PARTIAL_MATCH",
      confidenceScore: score,
      matchedFields,
      reasons,
    };
  }

  return null;
}

/**
 * Finds all matched pairs across an entire collection of normalized transactions.
 */
export function findMatchingRecords(
  records: NormalizedTransaction[]
): MatchedRecordPair[] {
  const matches: MatchedRecordPair[] = [];
  const seenPairs = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const recA = records[i];
      const recB = records[j];
      const pairKey = [recA.id, recB.id].sort().join("::");

      if (seenPairs.has(pairKey)) continue;

      const match = matchTwoRecords(recA, recB);
      if (match) {
        seenPairs.add(pairKey);
        matches.push(match);
      }
    }
  }

  return matches;
}

export const findRecordMatches = findMatchingRecords;
