import { NormalizedTransaction, EvidenceItem } from "../types/incident";

/**
 * Normalization Field Alias Dictionary
 * Maps various financial institution and gateway header names to canonical schema fields.
 */
const FIELD_ALIASES: Record<keyof Omit<NormalizedTransaction, "id" | "sourceEvidenceId" | "sourceRowIndex" | "rawRecord">, RegExp> = {
  transactionReference: /^(transaction_id|transactionid|transaction_reference|transactionreference|utr|utr_number|utrnumber|reference|ref|txn_id|txnid|rrn|ref_no|ref_number|txn_ref)$/i,
  amount: /^(amount|value|transaction_amount|transactionamount|paid_amount|paidamount|amt|debit|total|sum|txn_amt)$/i,
  counterparty: /^(receiver_upi|receiverupi|counterparty|beneficiary|payee|to|recipient|vpa|receiver|dest_upi)$/i,
  account: /^(sender_account|senderaccount|account|account_number|accountnumber|from_account|fromaccount|acc_no|accno|card|acc|src_acc)$/i,
  date: /^(date|txn_date|txndate|posting_date|value_date|timestamp_date)$/i,
  time: /^(time|txn_time|txntime|timestamp_time|time_stamp)$/i,
  description: /^(description|desc|narration|particulars|remarks|note|details|reason)$/i,
  status: /^(status|txn_status|txnstatus|state|result)$/i,
  currency: /^(currency|curr|ccy)$/i,
};

/**
 * Normalizes a raw key-value record into the canonical NormalizedTransaction schema.
 */
export function normalizeTransactionRecord(
  rawRecord: Record<string, any>,
  sourceEvidenceId: string,
  rowIndex: number = 1
): NormalizedTransaction {
  const normalized: NormalizedTransaction = {
    id: `norm-txn-${sourceEvidenceId}-${rowIndex.toString().padStart(3, "0")}`,
    sourceEvidenceId,
    sourceRowIndex: rowIndex,
    rawRecord,
  };

  const rawKeys = Object.keys(rawRecord);

  // Helper to find matching key value in rawRecord
  const findValue = (regex: RegExp): any => {
    const matchedKey = rawKeys.find((k) => regex.test(k.trim().replace(/[\s\-_]+/g, "_")));
    return matchedKey !== undefined ? rawRecord[matchedKey] : undefined;
  };

  // 1. Transaction Reference (UTR / Txn ID)
  const rawRef = findValue(FIELD_ALIASES.transactionReference);
  if (rawRef !== undefined && rawRef !== null && String(rawRef).trim() !== "") {
    normalized.transactionReference = String(rawRef).trim();
  }

  // 2. Amount
  const rawAmount = findValue(FIELD_ALIASES.amount);
  if (rawAmount !== undefined && rawAmount !== null) {
    const cleanNum = String(rawAmount).replace(/[^0-9.]/g, "");
    normalized.amount = parseFloat(cleanNum) || 0;
  }

  // 3. Counterparty (Beneficiary UPI / Account)
  const rawCounterparty = findValue(FIELD_ALIASES.counterparty);
  if (rawCounterparty !== undefined && rawCounterparty !== null && String(rawCounterparty).trim() !== "") {
    normalized.counterparty = String(rawCounterparty).trim();
  }

  // 4. Account (Source Account Number)
  const rawAccount = findValue(FIELD_ALIASES.account);
  if (rawAccount !== undefined && rawAccount !== null && String(rawAccount).trim() !== "") {
    normalized.account = String(rawAccount).trim().replace(/^X+/, "");
  }

  // 5. Date & Time
  const rawDate = findValue(FIELD_ALIASES.date);
  if (rawDate !== undefined && rawDate !== null && String(rawDate).trim() !== "") {
    normalized.date = String(rawDate).trim();
  }

  const rawTime = findValue(FIELD_ALIASES.time);
  if (rawTime !== undefined && rawTime !== null && String(rawTime).trim() !== "") {
    normalized.time = String(rawTime).trim();
  }

  // Check if date contains combined timestamp
  if (normalized.date && !normalized.time && normalized.date.includes(" ")) {
    const parts = normalized.date.split(" ");
    normalized.date = parts[0];
    normalized.time = parts.slice(1).join(" ");
  }

  // 6. Description
  const rawDesc = findValue(FIELD_ALIASES.description);
  if (rawDesc !== undefined && rawDesc !== null && String(rawDesc).trim() !== "") {
    normalized.description = String(rawDesc).trim();
  }

  // 7. Status
  const rawStatus = findValue(FIELD_ALIASES.status);
  if (rawStatus !== undefined && rawStatus !== null && String(rawStatus).trim() !== "") {
    normalized.status = String(rawStatus).trim().toUpperCase();
  }

  // 8. Currency
  const rawCurrency = findValue(FIELD_ALIASES.currency);
  normalized.currency = rawCurrency ? String(rawCurrency).trim().toUpperCase() : "INR";

  return normalized;
}

/**
 * Parses raw CSV string and normalizes every row into standard NormalizedTransaction objects.
 */
export function normalizeTransactionsFromCSV(
  csvText: string,
  evidenceId: string = "evidence-csv"
): NormalizedTransaction[] {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  const results: NormalizedTransaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const rowObj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] !== undefined ? values[idx] : "";
    });

    const normalized = normalizeTransactionRecord(rowObj, evidenceId, i);
    results.push(normalized);
  }

  return results;
}

/**
 * Scans all evidence items in an incident and extracts all normalized transaction records.
 */
export function normalizeAllTransactions(evidenceList: EvidenceItem[]): NormalizedTransaction[] {
  const allNormalized: NormalizedTransaction[] = [];

  for (const item of evidenceList) {
    if (item.type === "csv" || (item.extractedText && item.extractedText.includes(","))) {
      const records = normalizeTransactionsFromCSV(item.extractedText || "", item.id);
      allNormalized.push(...records);
    }
  }

  return allNormalized;
}

/**
 * CSV Line Tokenizer handling quotes and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
