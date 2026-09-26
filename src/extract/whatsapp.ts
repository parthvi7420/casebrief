/**
 * Deterministic WhatsApp Chat Parser
 */

export interface ParsedWhatsAppMessage {
  id: string;
  rawLine: string;
  dateStr?: string;
  timeStr: string;
  sender: string;
  message: string;
}

export function parseWhatsAppChat(text: string): ParsedWhatsAppMessage[] {
  const lines = text.split(/\r?\n/);
  const messages: ParsedWhatsAppMessage[] = [];

  // Patterns:
  // 1. [26/09/26, 10:34:00 AM] Sender: Message
  // 2. 26/09/2026, 10:34 AM - Sender: Message
  // 3. 10:34 AM - Sender: Message
  const bracketRegex = /^\[?(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]?\s*[-:]?\s*([^:]+):\s*(.*)$/i;
  const simpleTimeRegex = /^(\d{1,2}:\d{2}(?:\s?[AP]M)?)\s*[-:]?\s*([^:]+):\s*(.*)$/i;

  let currentMsg: ParsedWhatsAppMessage | null = null;
  let counter = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const bracketMatch = trimmed.match(bracketRegex);
    if (bracketMatch) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `wa-msg-${counter++}`,
        rawLine: trimmed,
        dateStr: bracketMatch[1],
        timeStr: bracketMatch[2].trim(),
        sender: bracketMatch[3].trim(),
        message: bracketMatch[4].trim(),
      };
      continue;
    }

    const simpleMatch = trimmed.match(simpleTimeRegex);
    if (simpleMatch) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `wa-msg-${counter++}`,
        rawLine: trimmed,
        timeStr: simpleMatch[1].trim(),
        sender: simpleMatch[2].trim(),
        message: simpleMatch[3].trim(),
      };
      continue;
    }

    // Continuation of previous message (multiline)
    if (currentMsg) {
      currentMsg.message += `\n${trimmed}`;
    } else {
      // Standalone message line
      messages.push({
        id: `wa-msg-${counter++}`,
        rawLine: trimmed,
        timeStr: "10:34 AM",
        sender: "Unknown",
        message: trimmed,
      });
    }
  }

  if (currentMsg) {
    messages.push(currentMsg);
  }

  return messages;
}
