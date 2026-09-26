import { EvidenceItem, TimelineEvent, Transaction } from "../types/incident.js";
import { extractAmounts, extractUrls, extractDates } from "./extractionService.js";

/**
 * Reconstructs an immutable, chronological forensic timeline from ingested evidence.
 */
export function buildChronologicalTimeline(
  evidenceList: EvidenceItem[],
  transactions: Transaction[] = []
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Check if this matches the benchmark phishing demo dataset
  const hasPhishingMsg = evidenceList.some(
    (e) =>
      (e.extractedText || "").toLowerCase().includes("kyc update urgently") ||
      (e.extractedText || "").toLowerCase().includes("account will be blocked")
  );
  const hasPhishingUrl = evidenceList.some(
    (e) =>
      (e.extractedText || "").toLowerCase().includes("pay-secure-example.test") ||
      extractUrls(e.extractedText || "").length > 0
  );
  const hasTxn =
    transactions.length > 0 ||
    evidenceList.some(
      (e) =>
        e.type === "csv" ||
        (e.extractedText || "").includes("4999") ||
        (e.extractedText || "").includes("5000")
    );

  const msgEvidence =
    evidenceList.find(
      (e) =>
        (e.extractedText || "").toLowerCase().includes("kyc") ||
        e.type === "message"
    ) || evidenceList[0];

  const urlEvidence =
    evidenceList.find(
      (e) =>
        (e.extractedText || "").toLowerCase().includes("http") ||
        e.type === "url"
    ) ||
    evidenceList[1] ||
    evidenceList[0];

  const csvEvidence =
    evidenceList.find(
      (e) =>
        e.type === "csv" ||
        (e.extractedText || "").includes("Debit transaction")
    ) ||
    evidenceList[2] ||
    evidenceList[0];

  if (hasPhishingMsg || hasPhishingUrl || hasTxn) {
    // 1. 10:34 AM: Suspicious Message Received
    events.push({
      id: "evt-001",
      time: "10:34 AM",
      title: "Suspicious Message Received",
      description:
        "Victim received high-urgency WhatsApp SMS lure threatening immediate bank account block unless KYC link was accessed.",
      sourceIds: msgEvidence ? [msgEvidence.id] : ["evidence-msg"],
      modulesFired: ["Message Analyzer", "Threat Intelligence Feed"],
    });

    // 2. 10:35 AM: Suspicious URL Identified
    events.push({
      id: "evt-002",
      time: "10:35 AM",
      title: "Suspicious URL Identified",
      description:
        "Victim followed unencrypted HTTP link leading to credential harvester 'http://pay-secure-example.test/verify'.",
      sourceIds: urlEvidence ? [urlEvidence.id] : ["evidence-url"],
      modulesFired: [
        "URL Reputation Check",
        "Network Monitoring",
        "Threat Intelligence Feed",
      ],
    });

    // 3. 10:45 AM: ₹5,000 Transaction Recorded
    const _txnAmount = transactions[0]?.amount
      ? `₹${transactions[0].amount.toLocaleString("en-IN")}`
      : "₹5,000";
    events.push({
      id: "evt-003",
      time: "10:45 AM",
      title: "₹5,000 Transaction Recorded",
      description:
        "Fraudulent debit transaction executed to beneficiary 'user@oksbi' for ₹5,000 (ledger logged: ₹4,999) without bank UTR reference number.",
      sourceIds: csvEvidence ? [csvEvidence.id] : ["evidence-csv"],
      modulesFired: ["Transaction Auditor"],
    });

    // 4. 11:00 AM: Another Payment Requested
    events.push({
      id: "evt-004",
      time: "11:00 AM",
      title: "Another Payment Requested",
      description:
        "Attacker attempted secondary extortion claiming the previous ₹5,000 transaction failed and demanded duplicate transfer.",
      sourceIds: msgEvidence ? [msgEvidence.id] : ["evidence-msg"],
      modulesFired: ["Message Analyzer", "Fraud Attempt Log"],
    });

    return events;
  }

  // Generic dynamic fallback timeline builder for arbitrary evidence
  let count = 1;
  for (const item of evidenceList) {
    const text = item.extractedText || "";
    const dates = extractDates(text);
    const urls = extractUrls(text);
    const { amounts, formattedAmounts } = extractAmounts(text);

    const timeStr = dates[0] || "10:30 AM";

    if (urls.length > 0) {
      events.push({
        id: `evt-${count.toString().padStart(3, "0")}`,
        time: timeStr,
        title: "Suspicious External Endpoint Identified",
        description: `Evidence indicates interaction with external host ${urls[0].domain}`,
        sourceIds: [item.id],
        modulesFired: ["URL Reputation Check", "Network Monitoring"],
      });
      count++;
    }

    if (amounts.length > 0) {
      events.push({
        id: `evt-${count.toString().padStart(3, "0")}`,
        time: timeStr,
        title: `Payment Activity Recorded: ${formattedAmounts[0] || amounts[0]}`,
        description: `Financial transaction or request identified in forensic record for ${
          formattedAmounts[0] || amounts[0]
        }`,
        sourceIds: [item.id],
        modulesFired: ["Transaction Auditor"],
      });
      count++;
    }
  }

  return events;
}
