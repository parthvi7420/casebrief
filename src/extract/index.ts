/**
 * MEMBER 2: Placeholder files for extraction engine
 *
 * These will be implemented by Member 2
 */

// src/extract/dates.ts
export function extractDates(text: string): string[] {
  // TODO: Parse DD/MM/YYYY, DD/MM/YY, ISO, WhatsApp timestamps
  return []
}

// src/extract/money.ts
export function extractMoney(text: string): Array<{ amount: number; currency: string }> {
  // TODO: Parse ₹5000, ₹5,000, Rs 5000, INR 5000
  return []
}

// src/extract/urls.ts
export function extractUrls(text: string): string[] {
  // TODO: Detect http://, https://
  return []
}

// src/extract/payments.ts
export function extractUPI(text: string): string[] {
  // TODO: Parse name@okaxis, name@oksbi
  return []
}

export function extractPhones(text: string): string[] {
  // TODO: Parse +91XXXXXXXXXX
  return []
}

export function extractEmails(text: string): string[] {
  // TODO: Standard email regex
  return []
}

// src/extract/whatsapp.ts
export function parseWhatsAppMessage(message: string) {
  // TODO: Extract timestamp, sender, message body
  return { timestamp: '', sender: '', body: '' }
}
