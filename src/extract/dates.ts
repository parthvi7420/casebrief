/**
 * Deterministic Date & Time Extraction Engine
 */

export interface ParsedDateInfo {
  raw: string;
  iso?: string;
  formattedDate?: string;
  formattedTime?: string;
}

export function extractDatesAndTimes(text: string): ParsedDateInfo[] {
  const results: ParsedDateInfo[] = [];
  const seen = new Set<string>();

  // 1. WhatsApp bracket style: [26/09/26, 10:34:00 AM] or [26/09/2026, 10:34:00]
  const waRegex = /\[?(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]?/gi;
  let match: RegExpExecArray | null;

  while ((match = waRegex.exec(text)) !== null) {
    const raw = match[0];
    if (!seen.has(raw)) {
      seen.add(raw);
      results.push({
        raw,
        formattedDate: match[1],
        formattedTime: match[2].trim(),
      });
    }
  }

  // 2. Standard 12-hour or 24-hour time: 10:34 AM, 11:00 PM, 10:45
  const timeRegex = /\b(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\b/gi;
  while ((match = timeRegex.exec(text)) !== null) {
    const raw = match[1];
    if (!seen.has(raw)) {
      seen.add(raw);
      results.push({
        raw,
        formattedTime: raw.trim(),
      });
    }
  }

  // 3. ISO / YYYY-MM-DD or DD/MM/YYYY dates
  const dateRegex = /\b(\d{4}-\d{2}-\d{2}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})\b/g;
  while ((match = dateRegex.exec(text)) !== null) {
    const raw = match[1];
    if (!seen.has(raw)) {
      seen.add(raw);
      results.push({
        raw,
        formattedDate: raw,
      });
    }
  }

  return results;
}

/**
 * Normalizes time string to "HH:MM AM/PM" format
 */
export function normalizeTimeString(timeStr?: string): string {
  if (!timeStr) return "12:00 PM";
  const trimmed = timeStr.trim();

  // If already has AM/PM
  if (/[AP]M/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // If 24hr format HH:MM
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }

  return trimmed;
}
