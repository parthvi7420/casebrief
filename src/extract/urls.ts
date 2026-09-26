/**
 * Deterministic URL & Domain Extraction Engine
 */

export interface ParsedUrl {
  raw: string;
  protocol: string;
  domain: string;
  path: string;
  isHttpOnly: boolean;
  hasPhishingKeywords: boolean;
  suspiciousKeywordsFound: string[];
}

const SUSPICIOUS_KEYWORDS = [
  "pay-secure",
  "secure-",
  "verify-account",
  "urgent-kyc",
  "account-suspended",
  "kyc",
  "verify",
  "unblock",
  "otp",
  "login-update",
  "bank-secure",
  "claim-refund",
  "reward-points"
];

export function extractUrls(text: string): ParsedUrl[] {
  const results: ParsedUrl[] = [];
  const seen = new Set<string>();

  // URL matching regex
  const urlRegex = /\bhttps?:\/\/[^\s<>"'`)]+/gi;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    const raw = match[0].replace(/[.,;!]+$/, ''); // clean trailing punctuation
    if (!seen.has(raw)) {
      seen.add(raw);
      try {
        const parsed = new URL(raw);
        const isHttpOnly = parsed.protocol.toLowerCase() === "http:";
        const lowerUrl = raw.toLowerCase();

        const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(k => lowerUrl.includes(k));

        results.push({
          raw,
          protocol: parsed.protocol.replace(':', ''),
          domain: parsed.hostname,
          path: parsed.pathname,
          isHttpOnly,
          hasPhishingKeywords: matchedKeywords.length > 0,
          suspiciousKeywordsFound: matchedKeywords,
        });
      } catch {
        // In case URL parser fails on weird domain format
        const domainMatch = raw.match(/https?:\/\/([^\/\s]+)(\/.*)?/i);
        const domain = domainMatch ? domainMatch[1] : raw;
        const path = domainMatch && domainMatch[2] ? domainMatch[2] : "/";
        const isHttpOnly = raw.toLowerCase().startsWith("http://");
        const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(k => raw.toLowerCase().includes(k));

        results.push({
          raw,
          protocol: isHttpOnly ? "http" : "https",
          domain,
          path,
          isHttpOnly,
          hasPhishingKeywords: matchedKeywords.length > 0,
          suspiciousKeywordsFound: matchedKeywords,
        });
      }
    }
  }

  return results;
}
