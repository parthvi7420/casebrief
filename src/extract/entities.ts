/**
 * Deterministic Entity Extractor (Phones, Emails, Names, Suspect Identifiers)
 */

export interface ContactEntities {
  phones: string[];
  emails: string[];
  names: string[];
}

export function extractContactEntities(text: string): ContactEntities {
  const phones = new Set<string>();
  const emails = new Set<string>();
  const names = new Set<string>();

  // 1. Phone numbers: +919876543210, +91 98765 43210, 9876543210
  const phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{9}\b/g;
  let match: RegExpExecArray | null;
  while ((match = phoneRegex.exec(text)) !== null) {
    phones.add(match[0].replace(/\s+/g, ""));
  }

  // 2. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  while ((match = emailRegex.exec(text)) !== null) {
    emails.add(match[0].toLowerCase());
  }

  // 3. Sender Names / Identity labels in chat formats: e.g. "Bank Support:", "Vikram Malhotra:"
  const senderRegex = /(?:^|\n)([\w\s\.\-]{2,30}):/g;
  while ((match = senderRegex.exec(text)) !== null) {
    const candidate = match[1].trim();
    if (!["http", "https", "am", "pm", "date", "time", "ref", "utr", "id"].includes(candidate.toLowerCase())) {
      names.add(candidate);
    }
  }

  return {
    phones: Array.from(phones),
    emails: Array.from(emails),
    names: Array.from(names),
  };
}
