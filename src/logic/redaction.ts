import { Incident, EvidenceItem, Party } from "../types/incident";

/**
 * Deterministic Privacy Masking & Redaction Engine
 * Masks Phone Numbers, Email Addresses, UPI Handles, and Account Numbers for safe distribution.
 */

export function maskPhoneNumber(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return "******";
  const last4 = cleaned.slice(-4);
  const prefix = cleaned.startsWith("+91") ? "+91 " : "";
  return `${prefix}******${last4}`;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "******@***.com";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `*@${domain}`;
  }
  return `${local[0]}****${local[local.length - 1]}@${domain}`;
}

export function maskUPI(upi: string): string {
  if (!upi || !upi.includes("@")) return "******@upi";
  const [handle, psp] = upi.split("@");
  if (handle.length <= 2) {
    return `*@${psp}`;
  }
  return `${handle.slice(0, 2)}****@${psp}`;
}

export function maskAccountNumber(account: string): string {
  if (!account) return "********";
  const cleaned = account.replace(/[\s-]/g, "");
  if (cleaned.length <= 4) return "********";
  const last4 = cleaned.slice(-4);
  return `********${last4}`;
}

/**
 * Redacts PII patterns inside freeform text string
 */
export function redactText(text: string): string {
  if (!text) return "";
  let redacted = text;

  // 1. Redact Emails
  redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (m) => maskEmail(m));

  // 2. Redact UPI IDs (handle@psp)
  redacted = redacted.replace(/\b[a-zA-Z0-9.\-_]{2,}@(oksbi|okaxis|okhdfcbank|okicici|paytm|upi|ybl|ibl|axl|apl|barodampay)\b/gi, (m) => maskUPI(m));

  // 3. Redact Indian Phone Numbers (+91 9876543210 or 9876543210)
  redacted = redacted.replace(/(?:\+91[\s-]?)?[6-9]\d{9}\b/g, (m) => maskPhoneNumber(m));

  return redacted;
}

/**
 * Creates a complete deep clone of an Incident with all PII safely masked for external sharing
 */
export function createRedactedIncident(incident: Incident): Incident {
  const cloned: Incident = JSON.parse(JSON.stringify(incident));

  // Redact Parties
  cloned.parties = cloned.parties.map((p: Party) => ({
    ...p,
    phones: p.phones?.map(maskPhoneNumber),
    emails: p.emails?.map(maskEmail),
    upiIds: p.upiIds?.map(maskUPI),
    handles: p.handles?.map(maskUPI),
  }));

  // Redact Transactions
  cloned.transactions = cloned.transactions.map(t => ({
    ...t,
    upiId: t.upiId ? maskUPI(t.upiId) : undefined,
    accountLast4: t.accountLast4 ? maskAccountNumber(t.accountLast4) : undefined,
    description: t.description ? redactText(t.description) : undefined,
  }));

  // Redact Evidence
  cloned.evidence = cloned.evidence.map((e: EvidenceItem) => ({
    ...e,
    extractedText: e.extractedText ? redactText(e.extractedText) : undefined,
    redactedPreview: e.redactedPreview || (e.extractedText ? redactText(e.extractedText) : undefined),
  }));

  // Redact Extracted Entities if present
  if (cloned.extractedEntities) {
    cloned.extractedEntities.phones = cloned.extractedEntities.phones.map(maskPhoneNumber);
    cloned.extractedEntities.emails = cloned.extractedEntities.emails.map(maskEmail);
    cloned.extractedEntities.upiIds = cloned.extractedEntities.upiIds.map(maskUPI);
    cloned.extractedEntities.accounts = cloned.extractedEntities.accounts.map(maskAccountNumber);
  }

  // Redact Timeline Descriptions
  cloned.timeline = cloned.timeline.map(tl => ({
    ...tl,
    description: redactText(tl.description),
  }));

  // Redact Gaps and Conflicts
  cloned.gaps = cloned.gaps.map(g => ({
    ...g,
    description: redactText(g.description),
  }));

  cloned.conflicts = cloned.conflicts.map(c => ({
    ...c,
    description: redactText(c.description),
    sourceA: {
      ...c.sourceA,
      value: redactText(c.sourceA.value),
    },
    sourceB: {
      ...c.sourceB,
      value: redactText(c.sourceB.value),
    },
  }));

  return cloned;
}
