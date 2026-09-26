import { extractDatesAndTimes, normalizeTimeString } from "./dates";
import { extractMoney, formatINR } from "./money";
import { extractUrls } from "./urls";
import { extractPaymentsAndIdentifiers } from "./payments";
import { parseWhatsAppChat } from "./whatsapp";
import { parseCSVTransactions } from "./csv";
import { ExtractedEntities } from "../types/incident";

export * from "./dates";
export * from "./money";
export * from "./urls";
export * from "./payments";
export * from "./entities";
export * from "./whatsapp";
export * from "./csv";

/**
 * Master entity extraction function running all deterministic parsers on input text
 */
export function extractEntities(text: string): ExtractedEntities {
  const datesInfo = extractDatesAndTimes(text);
  const moneyInfo = extractMoney(text);
  const urlsInfo = extractUrls(text);
  const paymentsInfo = extractPaymentsAndIdentifiers(text);

  // Extract risk/social engineering keywords
  const keywordsFound = new Set<string>();
  const keywordsList = [
    "urgent", "immediately", "verify", "kyc", "otp", "account blocked",
    "suspended", "unblock", "refund", "login", "password", "bank", "paytm", "upi"
  ];
  const lower = text.toLowerCase();
  for (const kw of keywordsList) {
    if (lower.includes(kw)) {
      keywordsFound.add(kw);
    }
  }

  const dates: string[] = [];
  datesInfo.forEach(d => {
    if (d.formattedTime) dates.push(normalizeTimeString(d.formattedTime));
    if (d.formattedDate) dates.push(d.formattedDate);
  });

  return {
    dates: Array.from(new Set(dates)),
    amounts: moneyInfo.map(m => m.amount),
    formattedAmounts: moneyInfo.map(m => m.formatted),
    urls: urlsInfo.map(u => ({
      raw: u.raw,
      protocol: u.protocol,
      domain: u.domain,
      path: u.path,
    })),
    phones: paymentsInfo.phones,
    emails: paymentsInfo.emails,
    upiIds: paymentsInfo.upiIds,
    utrs: paymentsInfo.utrs,
    accounts: paymentsInfo.accountNumbers,
    keywords: Array.from(keywordsFound),
  };
}
