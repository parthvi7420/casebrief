import { ExtractedEntities, EvidenceItem } from "../types/incident.js";

/**
 * Deterministic Date and Time Extraction
 */
export function extractDates(text: string): string[] {
  const dateRegex = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/g;
  const matches = text.match(dateRegex) || [];
  return Array.from(new Set(matches));
}

/**
 * Deterministic Money and Amount Extraction
 */
export function extractAmounts(text: string): { amounts: number[]; formattedAmounts: string[] } {
  const amountRegex = /(?:₹|Rs\.?|INR)\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)|(?:paid|transfer|amount|deposit|fee|sum|of)\s*(?:of\s*)?(?:₹|Rs\.?|INR)?\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)/gi;

  const rawMatches: string[] = [];
  const numericAmounts: number[] = [];

  let match;
  while ((match = amountRegex.exec(text)) !== null) {
    const rawVal = match[1] || match[2];
    if (rawVal) {
      const cleanNum = parseFloat(rawVal.replace(/,/g, ""));
      if (!isNaN(cleanNum) && cleanNum > 0 && cleanNum < 100000000) {
        rawMatches.push(`₹${cleanNum.toLocaleString("en-IN")}`);
        numericAmounts.push(cleanNum);
      }
    }
  }

  // Also catch explicit standalone currency patterns like ₹5,000 or ₹4,999
  const standaloneCurrency = /₹\s*([0-9,]+(?:\.[0-9]{1,2})?)/g;
  while ((match = standaloneCurrency.exec(text)) !== null) {
    const cleanNum = parseFloat(match[1].replace(/,/g, ""));
    if (!isNaN(cleanNum) && !numericAmounts.includes(cleanNum)) {
      rawMatches.push(`₹${cleanNum.toLocaleString("en-IN")}`);
      numericAmounts.push(cleanNum);
    }
  }

  return {
    amounts: Array.from(new Set(numericAmounts)),
    formattedAmounts: Array.from(new Set(rawMatches)),
  };
}

/**
 * Deterministic URL Extraction
 */
export function extractUrls(text: string): {
  raw: string;
  protocol: string;
  domain: string;
  path: string;
}[] {
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
  const matches = text.match(urlRegex) || [];
  const uniqueUrls = Array.from(new Set(matches));

  return uniqueUrls.map((urlStr) => {
    try {
      const parsed = new URL(urlStr);
      return {
        raw: urlStr,
        protocol: parsed.protocol.replace(":", ""),
        domain: parsed.hostname,
        path: parsed.pathname + parsed.search,
      };
    } catch {
      const isHttps = urlStr.startsWith("https");
      const clean = urlStr.replace(/^https?:\/\//, "");
      const domain = clean.split("/")[0];
      const path = clean.substring(domain.length) || "/";
      return {
        raw: urlStr,
        protocol: isHttps ? "https" : "http",
        domain,
        path,
      };
    }
  });
}

/**
 * Deterministic Phone, Email, UPI, UTR, and Bank Account Extraction
 */
export function extractContactEntities(text: string) {
  // Indian phone numbers: +91XXXXXXXXXX or 10-digit mobile
  const phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{9}\b/g;
  const phones = Array.from(new Set(text.match(phoneRegex) || []));

  // Email addresses (distinguished from UPI IDs)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@(?!ok|upi|paytm|okhdfcbank|oksbi|okaxis|ybl|ibl|axl)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi;
  const emails = Array.from(new Set(text.match(emailRegex) || []));

  // UPI IDs / VPAs
  const upiRegex = /\b[a-zA-Z0-9.\-_]{2,256}@(okaxis|oksbi|okhdfcbank|okicici|paytm|ybl|ibl|axl|upi|sbi|hdfcbank|icici|axisbank|barodampay)\b/gi;
  const upiIds = Array.from(new Set(text.match(upiRegex) || []));

  // UTR / Reference IDs (12-digit or UTR-prefixed numbers)
  const utrRegex = /\b(?:UTR|Ref|UPI Ref|Txn Ref)?\s*([0-9]{12})\b|\b(UTR[0-9A-Za-z]{8,16})\b/gi;
  const utrs: string[] = [];
  let utrMatch;
  while ((utrMatch = utrRegex.exec(text)) !== null) {
    const val = utrMatch[1] || utrMatch[2];
    if (val && !phones.includes(val)) {
      utrs.push(val);
    }
  }

  // Masked bank accounts (e.g. XXXX4521 or XX4521)
  const accountRegex = /\b(?:A\/C|Account|Acc)?\s*(X{2,4}\d{4})\b/gi;
  const accounts: string[] = [];
  let accMatch;
  while ((accMatch = accountRegex.exec(text)) !== null) {
    if (accMatch[1]) accounts.push(accMatch[1]);
  }

  // High-risk cybersecurity keywords
  const keywordsList = [
    "KYC",
    "unblock",
    "blocked",
    "suspended",
    "urgent",
    "security deposit",
    "penalty",
    "freeze",
    "verify",
    "refund",
    "OTP",
    "extortion",
    "digital arrest",
  ];
  const detectedKeywords = keywordsList.filter((kw) =>
    new RegExp(`\\b${kw}\\b`, "i").test(text)
  );

  return {
    phones,
    emails,
    upiIds,
    utrs: Array.from(new Set(utrs)),
    accounts: Array.from(new Set(accounts)),
    keywords: detectedKeywords,
  };
}

/**
 * WhatsApp chat log parser
 */
export function parseWhatsAppExport(text: string): {
  timestamp: string;
  sender: string;
  message: string;
}[] {
  const lineRegex = /\[?(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\]?\s*(?:-\s*)?([^:]+):\s*(.*)/;
  const lines = text.split("\n");
  const parsedMessages: { timestamp: string; sender: string; message: string }[] = [];

  for (const line of lines) {
    const match = line.trim().match(lineRegex);
    if (match) {
      parsedMessages.push({
        timestamp: match[1].trim(),
        sender: match[2].trim(),
        message: match[3].trim(),
      });
    }
  }

  return parsedMessages;
}

/**
 * CSV parser for tabular transaction logs
 */
export function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    if (cols.length === headers.length || cols.length >= headers.length - 1) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = cols[idx] || "";
      });
      records.push(row);
    }
  }

  return records;
}

/**
 * Master entity extraction function
 */
export function extractAllEntities(text: string): ExtractedEntities {
  const dates = extractDates(text || "");
  const { amounts, formattedAmounts } = extractAmounts(text || "");
  const urls = extractUrls(text || "");
  const contact = extractContactEntities(text || "");

  return {
    dates,
    amounts,
    formattedAmounts,
    urls,
    phones: contact.phones,
    emails: contact.emails,
    upiIds: contact.upiIds,
    utrs: contact.utrs,
    accounts: contact.accounts,
    keywords: contact.keywords,
  };
}

export const extractEntities = extractAllEntities;
