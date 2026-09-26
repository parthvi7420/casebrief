/**
 * Deterministic Money & Currency Extraction Engine
 */

export interface ParsedMoney {
  raw: string;
  amount: number;
  formatted: string;
  currency: string;
}

export function extractMoney(text: string): ParsedMoney[] {
  const results: ParsedMoney[] = [];
  const seen = new Set<number>();

  // Patterns for ₹5,000, Rs. 5000, Rs 5000, INR 5,000, send 5000, paid 5000
  const patterns: RegExp[] = [
    /(?:₹|Rs\.?|INR)\s?([\d,]+(?:\.\d{1,2})?)/gi,
    /(?:paid|send|transfer|amount|debit(?:ed)?|charge(?:d)?|fee|loss|sum\sof)\s*(?:of|is|:)?\s*(?:₹|Rs\.?|INR)?\s?([\d,]+(?:\.\d{1,2})?)/gi,
  ];

  for (const regex of patterns) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const numStr = match[1].replace(/,/g, '');
      const parsedAmount = parseFloat(numStr);

      if (!isNaN(parsedAmount) && parsedAmount > 0 && !seen.has(parsedAmount)) {
        seen.add(parsedAmount);
        results.push({
          raw: fullMatch.trim(),
          amount: parsedAmount,
          formatted: `₹${parsedAmount.toLocaleString('en-IN')}`,
          currency: 'INR',
        });
      }
    }
  }

  // Also check raw standalone numbers if context looks like transaction (e.g., in CSV fields)
  return results;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
