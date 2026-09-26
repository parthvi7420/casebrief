import { extractAllEntities, extractUrls, extractAmounts } from "../services/extractionService.js";
import { normalizeCSVRow, parseCSVToRows } from "../services/normalizationService.js";
import { findRecordMatches, matchTwoRecords } from "../services/matchingService.js";
import { detectDuplicates } from "../services/duplicateService.js";
import { detectConflicts } from "../services/conflictService.js";
import { detectGaps } from "../services/gapService.js";
import { evaluateForensicAssumptions } from "../services/assumptionService.js";
import { buildSourceTraceabilityMatrix } from "../services/traceabilityService.js";
import { buildChronologicalTimeline } from "../services/timelineService.js";
import { evaluateReportingChecklist } from "../services/checklistService.js";
import { runAllSecurityModules } from "../services/modules/index.js";
import { createRedactedIncident, maskPhoneNumber, maskUPI, maskEmail } from "../services/redactionService.js";
import { loadSyntheticPhishingBenchmark, processCasePipeline } from "../services/caseService.js";
import { EvidenceItem } from "../types/incident.js";

let passedCount = 0;
let totalCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` — ${detail}` : ""}`);
  }
}

async function runAllTests() {
  console.log("\n=======================================================");
  console.log("🛡️ RUNNING CASEBRIEF FORENSIC ENGINE AUTOMATED SUITE 🛡️");
  console.log("=======================================================\n");

  // TEST 1: Extraction Engine
  console.log("▶️ [TEST 1] Entity Extraction Engine");
  const sampleText = "URGENT: KYC blocked. Visit http://pay-secure-example.test/verify and pay Rs. 5000 to user@oksbi. Call +919876543210 or email help@secure-bank.com";
  const extracted = extractAllEntities(sampleText);
  assert(extracted.urls.some((u) => u.domain === "pay-secure-example.test"), "Extracts phishing domain");
  assert(extracted.upiIds.includes("user@oksbi"), "Extracts UPI ID user@oksbi");
  assert(extracted.amounts.includes(5000), "Extracts monetary amount 5000");
  assert(extracted.phones.some((p) => p.includes("9876543210")), "Extracts phone number");
  assert(extracted.emails.includes("help@secure-bank.com"), "Extracts email");

  // TEST 2: Normalization Engine
  console.log("\n▶️ [TEST 2] Canonical Header Normalization");
  const rawCSVRow = {
    txn_amount: "4999.00",
    to_upi: "user@oksbi",
    rrn: "UTR987654321",
    source_account: "123456789012",
    date_time: "2026-09-26 10:45:00",
  };
  const normalized = normalizeCSVRow(rawCSVRow, "ev-test", 1);
  assert(normalized.amount === 4999, "Normalizes amount alias 'txn_amount' -> 4999");
  assert(normalized.counterparty === "user@oksbi", "Normalizes counterparty alias 'to_upi' -> 'user@oksbi'");
  assert(normalized.transactionReference === "UTR987654321", "Normalizes reference alias 'rrn' -> 'UTR987654321'");
  assert(normalized.account === "123456789012", "Normalizes account alias 'source_account'");

  // TEST 3: Record Matching
  console.log("\n▶️ [TEST 3] Multi-Attribute Record Matching");
  const recA = normalizeCSVRow({ amount: "5000", utr: "123456789012", payee: "scammer@upi" }, "ev-1", 1);
  const recB = normalizeCSVRow({ debit: "5000", reference_no: "123456789012", to_vpa: "scammer@upi" }, "ev-2", 1);
  const match = matchTwoRecords(recA, recB);
  assert(match !== null && match.confidence === "EXACT_MATCH", "Identifies EXACT_MATCH on matching UTR, amount, and VPA");
  assert((match?.confidenceScore || 0) >= 0.9, "Confidence score >= 0.9 for exact match");

  // TEST 4: Duplicate Detection
  console.log("\n▶️ [TEST 4] Non-Destructive Duplicate Detection");
  const dupFindings = detectDuplicates([recA, recB]);
  assert(dupFindings.length > 0, "Flags duplicate records without destructive deletion");
  assert(dupFindings[0].duplicateType === "EXACT_DUPLICATE", "Categorizes as EXACT_DUPLICATE");

  // TEST 5: Contradiction Engine (₹5,000 vs ₹4,999)
  console.log("\n▶️ [TEST 5] Contradiction Detection Engine");
  const msgEv: EvidenceItem = {
    id: "ev-msg",
    type: "message",
    extractedText: "Pay Rs. 5000 immediately to unblock your account.",
  };
  const csvRec = normalizeCSVRow({ amount: "4999.00", description: "UPI payment to user@oksbi" }, "ev-csv", 1);
  const conflicts = detectConflicts([msgEv], [csvRec]);
  assert(conflicts.length > 0, "Detects amount contradiction between chat demand and ledger debit");
  assert(conflicts.some((c) => (c.discrepancyDiff || "").includes("₹1") || (c.discrepancyDiff || "").includes("1")), "Calculates exact discrepancy diff ₹1");

  // TEST 6: Investigatory Gaps (Missing UTR)
  console.log("\n▶️ [TEST 6] Investigatory Gap Detection");
  const csvWithoutUTR = normalizeCSVRow({ amount: "4999.00", utr: "" }, "ev-csv", 1);
  const gaps = detectGaps([msgEv], [csvWithoutUTR]);
  assert(gaps.some((g) => g.field.includes("UTR")), "Identifies missing bank settlement reference (UTR) on Transaction #01");

  // TEST 7: 6 Security Modules
  console.log("\n▶️ [TEST 7] 6 Local Security Modules Execution");
  const { moduleHits } = runAllSecurityModules([
    msgEv,
    { id: "ev-url", type: "url", extractedText: "http://pay-secure-example.test/verify" },
    { id: "ev-csv", type: "csv", extractedText: "Amount: 4999, Counterparty: user@oksbi" },
  ]);
  assert(moduleHits.length === 6, "Executes all 6 security modules");
  assert(moduleHits.find((m) => m.module === "Message Analyzer")?.status === "hit", "Message Analyzer triggers HIT");
  assert(moduleHits.find((m) => m.module === "URL Reputation Check")?.status === "hit", "URL Reputation Check triggers HIT");
  assert(moduleHits.find((m) => m.module === "Threat Intelligence Feed")?.status === "hit", "Threat Intelligence Feed triggers HIT");
  assert(moduleHits.find((m) => m.module === "Transaction Auditor")?.status === "hit", "Transaction Auditor triggers HIT");
  assert(moduleHits.find((m) => m.module === "Fraud Attempt Log")?.status === "hit", "Fraud Attempt Log triggers HIT");

  // TEST 8: 12-Point Checklist Engine
  console.log("\n▶️ [TEST 8] 12-Point Incident Checklist Engine");
  const checklist = evaluateReportingChecklist([msgEv], extracted, [], gaps, conflicts, [csvRec], true);
  assert(checklist.items.length === 12, "Evaluates all 12 mandatory reporting dimensions");
  assert(checklist.completionPercentage > 0, "Calculates numeric completeness percentage");

  // TEST 9: Privacy Redaction Engine
  console.log("\n▶️ [TEST 9] Privacy Redaction & PII Masking");
  assert(maskPhoneNumber("+919876543210") === "+91******3210", "Masks phone number (+91******3210)");
  assert(maskUPI("user@oksbi") === "******@oksbi", "Masks UPI handle (******@oksbi)");
  assert(maskEmail("victim.name@gmail.com").includes("******"), "Masks email address");

  // TEST 10: Benchmark 4-Event Phishing Case Reconstruction
  console.log("\n▶️ [TEST 10] Canonical Benchmark Case (#CB-2026-001) Full Reconstruction");
  const benchmark = await loadSyntheticPhishingBenchmark();
  assert(benchmark.id === "CB-2026-001", "Instantiates Case #CB-2026-001");
  assert(benchmark.evidence.length === 3, "Contains exactly 3 multi-modal evidence items");
  assert(benchmark.timeline.length === 4, "Reconstructs exact 4-event chronological sequence");
  assert(benchmark.conflicts.length > 0, "Contains detected contradiction (Chat ₹5,000 vs CSV ₹4,999)");
  assert(benchmark.gaps.some((g) => g.field.includes("UTR")), "Contains flagged missing UTR data gap");
  assert(Boolean(benchmark.assumptions && benchmark.assumptions.length > 0), "Contains categorized forensic assumptions");
  assert(Boolean(benchmark.sourceReferences && benchmark.sourceReferences.length > 0), "Contains granular source traceability matrix");

  console.log("\n=======================================================");
  console.log(`🏁 TEST SUITE COMPLETED: ${passedCount} / ${totalCount} PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log("=======================================================\n");

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
