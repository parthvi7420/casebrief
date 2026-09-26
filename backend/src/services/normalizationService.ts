import { EvidenceItem, NormalizedTransaction } from "../types/incident.js";
import { parseCSV } from "./extractionService.js";

/**
 * Standard banking header alias dictionary
 */
const CANONICAL_FIELD_MAPPINGS: Record<string, string[]> = {
  amount: [
    "amount",
    "debit",
    "txn_amount",
    "transaction_amount",
    "value",
    "amt",
    "paid_amount",
    "withdrawal",
  ],
  transactionReference: [
    "utr",
    "utr_number",
    "transaction_id",
    "txn_id",
    "reference_no",
    "ref_no",
    "rrn",
    "upi_ref",
    "transaction_reference",
  ],
  date: [
    "date",
    "posting_date",
    "txn_date",
    "transaction_date",
    "value_date",
  ],
  time: [
    "time",
    "txn_time",
    "transaction_time",
    "timestamp",
  ],
  account: [
    "account",
    "sender_account",
    "account_number",
    "source_account",
    "acc_no",
    "from_account",
  ],
  counterparty: [
    "payee",
    "receiver_upi",
    "beneficiary",
    "merchant",
    "to_upi",
    "to_vpa",
    "vpa",
    "payee_vpa",
    "receiver_vpa",
    "upi_id",
    "target_account",
    "receiver",
  ],
  description: [
    "description",
    "narration",
    "remarks",
    "particulars",
    "memo",
    "notes",
  ],
  status: [
    "status",
    "txn_status",
    "transaction_status",
    "state",
  ],
  currency: [
    "currency",
    "ccy",
  ],
};

export function normalizeCSVRow(
  rawRow: Record<string, string>,
  evidenceId: string,
  rowIndex: number
): NormalizedTransaction {
  const norm: Partial<NormalizedTransaction> = {
    id: `norm-txn-${evidenceId}-${rowIndex}`,
    sourceEvidenceId: evidenceId,
    sourceRowIndex: rowIndex,
    rawRecord: rawRow,
    currency: "INR",
  };

  const normalizedKeys = Object.keys(rawRow).map((k) => k.toLowerCase().trim());

  for (const [canonicalField, aliases] of Object.entries(CANONICAL_FIELD_MAPPINGS)) {
    for (const alias of aliases) {
      const matchIdx = normalizedKeys.findIndex(
        (k) => k === alias || k.replace(/[^a-z0-9]/g, "") === alias.replace(/[^a-z0-9]/g, "")
      );
      if (matchIdx !== -1) {
        const originalKey = Object.keys(rawRow)[matchIdx];
        const val = (rawRow[originalKey] || "").trim();

        if (canonicalField === "amount") {
          const num = parseFloat(val.replace(/[^0-9.]/g, ""));
          if (!isNaN(num)) norm.amount = num;
        } else if (canonicalField === "transactionReference") {
          if (val && val.length > 0) norm.transactionReference = val;
        } else if (canonicalField === "date") {
          if (val) norm.date = val;
        } else if (canonicalField === "time") {
          if (val) norm.time = val;
        } else if (canonicalField === "account") {
          if (val) norm.account = val;
        } else if (canonicalField === "counterparty") {
          if (val) norm.counterparty = val;
        } else if (canonicalField === "description") {
          if (val) norm.description = val;
        } else if (canonicalField === "status") {
          if (val) norm.status = val.toUpperCase();
        } else if (canonicalField === "currency") {
          if (val) norm.currency = val.toUpperCase();
        }
        break;
      }
    }
  }

  // Construct timestamp ISO string if date and time available
  if (norm.date) {
    if (norm.time) {
      norm.timestamp = `${norm.date}T${norm.time}`;
    } else {
      norm.timestamp = `${norm.date}T00:00:00`;
    }
  }

  return norm as NormalizedTransaction;
}

/**
 * Normalizes all transactions across all uploaded evidence files
 */
export function normalizeAllTransactions(evidenceList: EvidenceItem[]): NormalizedTransaction[] {
  const allNormalized: NormalizedTransaction[] = [];

  for (const ev of evidenceList) {
    if (ev.type === "csv" || (ev.filename && ev.filename.endsWith(".csv")) || (ev.extractedText && ev.extractedText.includes(","))) {
      const rows = parseCSV(ev.extractedText || "");
      rows.forEach((row, idx) => {
        const norm = normalizeCSVRow(row, ev.id, idx + 1);
        if (norm.amount || norm.transactionReference || norm.counterparty) {
          allNormalized.push(norm);
        }
      });
    }
  }

  return allNormalized;
}

export const parseCSVToRows = parseCSV;

