import {
  EvidenceItem,
  ExtractedEntities,
  NormalizedTransaction,
  SourceReference,
} from "../types/incident.js";

/**
 * Granular Forensic Source Traceability Engine
 * Maps every extracted entity and transaction field back to its exact origin:
 * file, line number (text/message), row/col (CSV), or visual/OCR context (screenshot).
 */
export function buildSourceTraceabilityMatrix(
  evidenceList: EvidenceItem[],
  entities: ExtractedEntities,
  normalizedTransactions: NormalizedTransaction[] = []
): SourceReference[] {
  const references: SourceReference[] = [];
  const seenKeys = new Set<string>();

  const addRef = (ref: SourceReference) => {
    const key = `${ref.evidenceId}::${ref.extractedValue}::${ref.location || ""}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      references.push(ref);
    }
  };

  // 1. Trace text / message evidence line by line
  for (const item of evidenceList) {
    const text = item.extractedText || "";
    if (!text.trim()) continue;

    const lines = text.split(/\r?\n/);

    lines.forEach((line, lineIdx) => {
      const lineNum = lineIdx + 1;

      // Match Phone numbers
      for (const phone of entities.phones || []) {
        if (line.includes(phone)) {
          addRef({
            id: `ref-phone-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Line ${lineNum}`,
            extractedValue: phone,
            entityType: "phone",
            contextSnippet: line.trim(),
          });
        }
      }

      // Match Emails
      for (const email of entities.emails || []) {
        if (line.includes(email)) {
          addRef({
            id: `ref-email-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Line ${lineNum}`,
            extractedValue: email,
            entityType: "email",
            contextSnippet: line.trim(),
          });
        }
      }

      // Match URLs
      for (const urlObj of entities.urls || []) {
        const rawUrl = urlObj.raw || urlObj.domain;
        if (line.includes(rawUrl) || (urlObj.domain && line.includes(urlObj.domain))) {
          addRef({
            id: `ref-url-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Line ${lineNum}`,
            extractedValue: rawUrl,
            entityType: "url",
            contextSnippet: line.trim(),
          });
        }
      }

      // Match UPI IDs
      for (const upi of entities.upiIds || []) {
        if (line.includes(upi)) {
          addRef({
            id: `ref-upi-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Line ${lineNum}`,
            extractedValue: upi,
            entityType: "upi",
            contextSnippet: line.trim(),
          });
        }
      }

      // Match Amounts
      for (const amt of entities.amounts || []) {
        const amtStr = String(amt);
        if (line.includes(amtStr)) {
          addRef({
            id: `ref-amt-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Line ${lineNum}`,
            extractedValue: `₹${amt}`,
            entityType: "amount",
            contextSnippet: line.trim(),
          });
        }
      }
    });

    // 2. Trace CSV Records specifically
    if (
      item.type === "csv" ||
      (item.extractedText && item.extractedText.includes(","))
    ) {
      const csvTxns = normalizedTransactions.filter(
        (t) => t.sourceEvidenceId === item.id
      );
      for (const txn of csvTxns) {
        const row = txn.sourceRowIndex || 1;

        if (txn.transactionReference) {
          addRef({
            id: `ref-utr-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Row ${row}, Col: Transaction_ID / UTR`,
            extractedValue: txn.transactionReference,
            entityType: "utr",
            contextSnippet: `Row ${row}: ${txn.description || "Ledger Entry"}`,
          });
        }

        if (txn.amount !== undefined) {
          addRef({
            id: `ref-csv-amt-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Row ${row}, Col: Amount`,
            extractedValue: `₹${txn.amount}`,
            entityType: "amount",
            contextSnippet: `Row ${row}: Amount ${txn.amount} to ${
              txn.counterparty || "Beneficiary"
            }`,
          });
        }

        if (txn.counterparty) {
          addRef({
            id: `ref-csv-upi-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Row ${row}, Col: Counterparty / VPA`,
            extractedValue: txn.counterparty,
            entityType: "upi",
            contextSnippet: `Row ${row}: Counterparty ${txn.counterparty}`,
          });
        }

        if (txn.account) {
          addRef({
            id: `ref-csv-acc-${references.length + 1}`,
            evidenceId: item.id,
            filename: item.filename || "Evidence",
            location: `Row ${row}, Col: Account`,
            extractedValue: txn.account,
            entityType: "account",
            contextSnippet: `Row ${row}: Source Account ${txn.account}`,
          });
        }
      }
    }

    // 3. Trace Image / Screenshot OCR evidence
    if (item.type === "screenshot") {
      addRef({
        id: `ref-img-${references.length + 1}`,
        evidenceId: item.id,
        filename: item.filename || "Evidence",
        location: "OCR Text Layer / Visual Scan",
        extractedValue: "Payment Gateway Screen / OCR Extract",
        entityType: "other",
        contextSnippet: text.slice(0, 100) || "Visual evidence screenshot artifact",
      });
    }
  }

  return references;
}
