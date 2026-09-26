/**
 * Deterministic Payment Rails, UPI, UTR, and Identity Extractor
 */

export interface ParsedPayments {
  upiIds: string[];
  utrs: string[];
  phones: string[];
  emails: string[];
  accountNumbers: string[];
}

const COMMON_UPI_HANDLES = [
  "oksbi", "okaxis", "okhdfcbank", "okicici", "paytm", "upi", "ybl", "ibl",
  "axl", "apl", "ptaxis", "ptsbi", "pthdfc", "postbank", "federal", "barodampay"
];

export function extractPaymentsAndIdentifiers(text: string): ParsedPayments {
  const upiIds = new Set<string>();
  const utrs = new Set<string>();
  const phones = new Set<string>();
  const emails = new Set<string>();
  const accountNumbers = new Set<string>();

  // 1. Phone numbers: +919876543210, +91 98765 43210, 9876543210
  const phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{9}\b/g;
  let match: RegExpExecArray | null;
  while ((match = phoneRegex.exec(text)) !== null) {
    phones.add(match[0].replace(/\s+/g, ''));
  }

  // 2. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  while ((match = emailRegex.exec(text)) !== null) {
    emails.add(match[0].toLowerCase());
  }

  // 3. UPI IDs: pattern like user@oksbi, fraudster@okaxis, etc.
  const upiRegex = /\b[a-zA-Z0-9.\-_]{2,256}@([a-zA-Z0-9.\-_]{2,64})\b/g;
  while ((match = upiRegex.exec(text)) !== null) {
    const fullMatch = match[0].toLowerCase();
    const handle = match[1].toLowerCase();

    // Avoid standard email domains like .com, .org, .net, .in
    const isStandardEmail = /\.(com|org|net|in|edu|gov|io|co|ai)$/i.test(handle);
    const isKnownUpi = COMMON_UPI_HANDLES.includes(handle);

    if (isKnownUpi || (!isStandardEmail && !handle.includes('.'))) {
      upiIds.add(fullMatch);
    }
  }

  // 4. UTRs / Banking Reference numbers (12 to 22 digit alphanumeric or numeric)
  const utrRegex = /\b(?:UTR|Ref|Reference|TxnID|Transaction\sID|IMPS|NEFT)[\s:#\-_]*([A-Z0-9]{12,22})\b/gi;
  while ((match = utrRegex.exec(text)) !== null) {
    utrs.add(match[1]);
  }

  // Also standalone 12-digit numeric if prefixed or isolated
  const numeric12Regex = /\b(?:\d{12})\b/g;
  while ((match = numeric12Regex.exec(text)) !== null) {
    // Only if not already captured as phone number
    if (![...phones].some(p => p.includes(match![0]))) {
      utrs.add(match[0]);
    }
  }

  // 5. Account Numbers (e.g. XXXX4521 or A/C: 123456789012)
  const accRegex = /(?:A\/C|Account|Acc|Card)[\s:#\-_]*([X\d]{4,18})/gi;
  while ((match = accRegex.exec(text)) !== null) {
    accountNumbers.add(match[1]);
  }

  return {
    upiIds: Array.from(upiIds),
    utrs: Array.from(utrs),
    phones: Array.from(phones),
    emails: Array.from(emails),
    accountNumbers: Array.from(accountNumbers),
  };
}
