import { Transaction } from "../types/incident";

/**
 * Deterministic CSV Transaction Parser with Flexible Header Sniffing
 */

export function parseCSVTransactions(csvText: string, evidenceId: string = "evidence-csv"): Transaction[] {
  const lines = csvText.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.toLowerCase().trim().replace(/[\s\-_]+/g, ''));

  // Sniff column indices
  const amountIdx = headers.findIndex(h => /amount|amt|debit|val|sum/i.test(h));
  const dateIdx = headers.findIndex(h => /date|txn_date|txndate/i.test(h));
  const timeIdx = headers.findIndex(h => /time|txn_time|txntime/i.test(h));
  const descIdx = headers.findIndex(h => /desc|description|particulars|narration|remarks|note/i.test(h));
  const utrIdx = headers.findIndex(h => /utr|ref|reference|txnid|rrn/i.test(h));
  const accountIdx = headers.findIndex(h => /acc|account|acct|card/i.test(h));
  const upiIdx = headers.findIndex(h => /upi|vpa|beneficiary|receiver/i.test(h));
  const currencyIdx = headers.findIndex(h => /curr|currency/i.test(h));

  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length === 0) continue;

    const rawAmountStr = amountIdx !== -1 && row[amountIdx] ? row[amountIdx].replace(/[^0-9.]/g, '') : "0";
    const amount = parseFloat(rawAmountStr) || 0;
    const date = dateIdx !== -1 && row[dateIdx] ? row[dateIdx].trim() : undefined;
    const time = timeIdx !== -1 && row[timeIdx] ? row[timeIdx].trim() : undefined;
    const description = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : undefined;
    const utr = utrIdx !== -1 && row[utrIdx] ? row[utrIdx].trim() : undefined;
    const accountLast4 = accountIdx !== -1 && row[accountIdx] ? row[accountIdx].trim().replace(/^X+/, '') : undefined;
    const upiId = upiIdx !== -1 && row[upiIdx] ? row[upiIdx].trim() : undefined;
    const currency = currencyIdx !== -1 && row[currencyIdx] ? row[currencyIdx].trim() : "INR";

    transactions.push({
      id: `txn-${i.toString().padStart(3, '0')}`,
      date: date || "2026-09-26",
      time: time || "10:45 AM",
      amount,
      currency,
      utr: utr && utr.length > 0 ? utr : undefined,
      accountLast4,
      upiId,
      description: description || "Debit transaction",
      sourceEvidenceIds: [evidenceId],
    });
  }

  return transactions;
}

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
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
