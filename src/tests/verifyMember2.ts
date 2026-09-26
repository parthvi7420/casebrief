/**
 * Comprehensive Validation Suite for Member 2 (Investigation Engine & Data Layer)
 * Tests all Phase 1 (14 Core Subsystems) and Phase 2 (9 Advanced Forensic Capabilities)
 */

import { extractDatesAndTimes, normalizeTimeString } from "../extract/dates";
import { extractMoney, formatINR } from "../extract/money";
import { extractUrls } from "../extract/urls";
import { extractPaymentsAndIdentifiers } from "../extract/payments";
import { extractContactEntities } from "../extract/entities";
import { parseWhatsAppChat } from "../extract/whatsapp";
import { parseCSVTransactions } from "../extract/csv";
import { extractEntities } from "../extract/index";

import { runMessageAnalyzer } from "../modules/message";
import { runUrlReputationCheck } from "../modules/url";
import { runNetworkMonitoring } from "../modules/network";
import { runThreatIntel } from "../modules/intel";
import { runTransactionAuditor } from "../modules/transaction";
import { runFraudAttemptLog } from "../modules/fraudLog";
import { runAllSecurityModules } from "../modules/index";

import { buildChronologicalTimeline } from "../logic/timeline";
import { identifyForensicGaps } from "../logic/gaps";
import { identifyEvidenceConflicts } from "../logic/conflicts";
import { maskPhoneNumber, maskUPI, maskAccountNumber, maskEmail, redactText } from "../logic/redaction";
import { createDemoIncident } from "../logic/demoCase";
import { processEvidence } from "../logic/incident";
import { normalizeTransactionRecord, normalizeTransactionsFromCSV, normalizeAllTransactions } from "../logic/normalize";
import { matchTwoRecords, findMatchingRecords } from "../logic/matching";
import { detectDuplicates } from "../logic/duplicates";
import { evaluateForensicAssumptions } from "../logic/assumptions";
import { buildSourceTraceabilityMatrix } from "../logic/traceability";
import { evaluateReportingChecklist } from "../logic/checklist";
import { EvidenceItem, Gap, Conflict, NormalizedTransaction } from "../types/incident";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${msg}`);
  }
}

console.log("=========================================================");
console.log("⚡ RUNNING MEMBER 2 COMPREHENSIVE FORENSIC ENGINE AUDIT ⚡");
console.log("=========================================================");

// 1. DATES & TIMES
const dateTest = extractDatesAndTimes("Urgent action needed at 10:34 AM on 24/09/2026. Followup by 11:00 AM.");
assert(dateTest.length >= 2, "Should extract at least 2 date/time entries");
assert(normalizeTimeString("10:34 AM") === "10:34 AM", "Time normalization should work");
console.log("✔ Extract: Dates and Times OK");

// 2. MONEY
const moneyTest = extractMoney("Please pay ₹5,000 immediately, else Rs. 4,999 will be forfeited. Total INR 10,000.50");
assert(moneyTest.some((m) => m.amount === 5000), "Should extract 5000");
assert(moneyTest.some((m) => m.amount === 4999), "Should extract 4999");
assert(formatINR(5000) === "₹5,000", "Format INR should be ₹5,000");
console.log("✔ Extract: Money OK");

// 3. URLS
const urlTest = extractUrls("Click here: http://pay-secure-example.test/verify to unlock account");
assert(urlTest.length === 1, "Should extract 1 URL");
assert(urlTest[0].domain === "pay-secure-example.test", "Domain should match");
assert(urlTest[0].isHttpOnly === true, "Should flag HTTP-only protocol");
console.log("✔ Extract: URLs OK");

// 4. PAYMENTS & IDENTIFIERS
const payTest = extractPaymentsAndIdentifiers("Send to user@oksbi or phone +919876543210. Ref UTR: 998877665544 for A/C: XXXX4521");
assert(payTest.upiIds.includes("user@oksbi"), "Should extract UPI ID");
assert(payTest.phones.includes("+919876543210"), "Should extract phone number");
assert(payTest.utrs.includes("998877665544"), "Should extract UTR");
assert(payTest.accountNumbers.some((a) => a.includes("4521")), "Should extract Account number");
console.log("✔ Extract: Payments and Identifiers OK");

// 5. CONTACT ENTITIES
const contactTest = extractContactEntities("Support Agent: Call +919876543210 or email help@fakebank.com");
assert(contactTest.phones.includes("+919876543210"), "Should extract contact phone");
assert(contactTest.emails.includes("help@fakebank.com"), "Should extract email");
console.log("✔ Extract: Contact Entities OK");

// 6. WHATSAPP PARSER
const chatSample = `[24/09/26, 10:34:00 AM] Bank Support: Dear user, your account will be blocked today. Click http://pay-secure-example.test/verify to pay ₹5,000 unblock fee.
[24/09/26, 11:00:00 AM] Bank Support: We have not received confirmation for ₹5,000. Send ₹5,000 more to user@oksbi immediately.`;
const parsedChat = parseWhatsAppChat(chatSample);
assert(parsedChat.length === 2, "Should parse 2 WhatsApp messages");
assert(parsedChat[0].sender === "Bank Support", "Sender should be Bank Support");
console.log("✔ Extract: WhatsApp Parser OK");

// 7. CSV PARSER
const csvSample = `Date,Time,Transaction_ID,Sender_Account,Receiver_UPI,Amount,Status,UTR
24/09/2026,10:45:00,TXN889201,XXXX4521,user@oksbi,4999.00,SUCCESS,
24/09/2026,11:15:00,TXN889202,XXXX4521,user@oksbi,5000.00,FAILED,UTR998877665544`;
const parsedCSV = parseCSVTransactions(csvSample);
assert(parsedCSV.length === 2, "Should parse 2 transactions");
assert(parsedCSV[0].amount === 4999, "First txn amount should be 4999");
assert(parsedCSV[0].utr === undefined || parsedCSV[0].utr === "", "First txn UTR should be empty");
assert(parsedCSV[1].utr === "UTR998877665544", "Second txn UTR should be UTR998877665544");
console.log("✔ Extract: CSV Parser OK");

// 8. MASTER ENTITY EXTRACTOR
const masterEntities = extractEntities(chatSample);
assert(masterEntities.urls.length > 0, "Master extractor should extract URLs");
assert(masterEntities.amounts.includes(5000), "Master extractor should extract amounts");
console.log("✔ Extract: Master extractEntities() OK");

// 9. SECURITY MODULES
const mockEvidence: EvidenceItem[] = [
  {
    id: "msg-1",
    type: "message",
    filename: "chat.txt",
    extractedText: chatSample,
    hash: "mockhash1",
    createdAt: "2026-09-24T10:34:00Z",
  },
  {
    id: "url-1",
    type: "url",
    filename: "suspicious_url.txt",
    extractedText: "http://pay-secure-example.test/verify",
    hash: "mockhash2",
    createdAt: "2026-09-24T10:35:00Z",
  },
  {
    id: "csv-1",
    type: "csv",
    filename: "transactions.csv",
    extractedText: csvSample,
    hash: "mockhash3",
    createdAt: "2026-09-24T10:45:00Z",
  },
];

const msgHit = runMessageAnalyzer(mockEvidence);
assert(msgHit.status === "hit", "Message Analyzer should hit on phishing lure");

const urlHit = runUrlReputationCheck(mockEvidence);
assert(urlHit.status === "hit", "URL module should hit on suspicious TLD and HTTP");

const netRes = runNetworkMonitoring(mockEvidence);
assert(netRes.moduleHit.status === "hit", "Network module should register hit");

const intelHit = runThreatIntel(mockEvidence);
assert(intelHit.status === "hit", "Threat Intel should match IOC");

const txnRes = runTransactionAuditor(mockEvidence, parsedCSV);
assert(txnRes.moduleHit.status === "hit", "Transaction Auditor should hit on missing UTR");

const fraudLogRes = runFraudAttemptLog(mockEvidence);
assert(fraudLogRes.fraudAttemptLog.length > 0, "Fraud logs should be populated");

const allModulesRes = runAllSecurityModules(mockEvidence, parsedCSV);
assert(allModulesRes.moduleHits.length === 6, "Should return 6 module hits");
console.log("✔ Modules: All 6 Security Detection Modules OK");

// 10. TIMELINE RECONSTRUCTION
const timeline = buildChronologicalTimeline(mockEvidence, parsedCSV);
assert(timeline.length === 4, "Timeline should reconstruct exactly 4 distinct benchmark events");
assert(timeline[0].time === "10:34 AM", "Event 1 should be 10:34 AM");
assert(timeline[1].time === "10:35 AM", "Event 2 should be 10:35 AM");
assert(timeline[2].time === "10:45 AM", "Event 3 should be 10:45 AM");
assert(timeline[3].time === "11:00 AM", "Event 4 should be 11:00 AM");
console.log("✔ Logic: Timeline 4-Event Reconstruction OK");

// 11. GAPS & CONFLICTS
const gaps = identifyForensicGaps(mockEvidence, parsedCSV);
assert(gaps.some((g: Gap) => g.field.includes("UTR")), "Should flag missing UTR on Txn #1");

const conflicts = identifyEvidenceConflicts(mockEvidence, parsedCSV);
assert(conflicts.some((c: Conflict) => c.id === "conflict-amount-001"), "Should flag ₹5,000 vs ₹4,999 mismatch");
console.log("✔ Logic: Gaps and Conflicts Detection OK");

// 12. REDACTION ENGINE
assert(maskPhoneNumber("+919876543210") === "+91******3210", "Phone mask should be +91******3210");
assert(maskUPI("user@oksbi") === "******@oksbi", "UPI mask should be ******@oksbi");
assert(maskAccountNumber("123456784521") === "********4521", "Account mask should mask prefix");
assert(maskEmail("victim.name@gmail.com") === "v******e@gmail.com", "Email mask should obscure username");

const redactedTextSample = redactText("Call +919876543210 or UPI user@oksbi for ₹5,000");
assert(!redactedTextSample.includes("9876543210"), "Redacted text should not contain raw phone");
console.log("✔ Logic: Redaction Engine OK");

/* =========================================================
   PHASE 2: ADVANCED FORENSIC CAPABILITIES TESTS
   ========================================================= */

// 13. DATASET NORMALIZATION ENGINE
const rawBankRecord = {
  transaction_id: "UTR998877665544",
  posting_date: "2026-09-26",
  txn_time: "10:45:00",
  debit: "4,999.00",
  payee: "user@oksbi",
  sender_account: "XXXX4521",
  narration: "UPI Transfer to KYC Helpdesk",
};
const normalizedRec = normalizeTransactionRecord(rawBankRecord, "evidence-bank-1", 1);
assert(normalizedRec.transactionReference === "UTR998877665544", "Should normalize transaction_id to transactionReference");
assert(normalizedRec.amount === 4999, "Should normalize debit string '4,999.00' to 4999");
assert(normalizedRec.counterparty === "user@oksbi", "Should normalize payee to counterparty");
assert(normalizedRec.account === "4521", "Should normalize sender_account to account");
console.log("✔ Phase 2: Dataset Normalization Engine OK");

// 14. MULTI-ATTRIBUTE RECORD MATCHING
const recA: NormalizedTransaction = {
  id: "norm-1",
  sourceEvidenceId: "src-1",
  transactionReference: "UTR998877665544",
  amount: 4999,
  counterparty: "user@oksbi",
  time: "10:45 AM",
};
const recB: NormalizedTransaction = {
  id: "norm-2",
  sourceEvidenceId: "src-2",
  transactionReference: "UTR998877665544",
  amount: 4999,
  counterparty: "user@oksbi",
  time: "10:45 AM",
};
const matchPair = matchTwoRecords(recA, recB);
assert(matchPair !== null, "Records with identical reference, amount, and counterparty should match");
assert(matchPair?.matchType === "EXACT_MATCH", "Match type should be EXACT_MATCH");
assert(Number(matchPair?.confidence ?? 0) >= 0.85, "Confidence score should be high (>= 0.85)");
console.log("✔ Phase 2: Multi-Attribute Record Matching OK");

// 15. NON-DESTRUCTIVE DUPLICATE DETECTION
const dupFindings = detectDuplicates([recA, recB]);
assert(dupFindings.length === 1, "Should identify exactly 1 duplicate finding");
assert(dupFindings[0].type === "EXACT_DUPLICATE", "Duplicate type should be EXACT_DUPLICATE");
assert(dupFindings[0].status === "DUPLICATE", "Status should be DUPLICATE");
console.log("✔ Phase 2: Non-Destructive Duplicate Detection OK");

// 16. EXPANDED MULTI-DIMENSION CONTRADICTION ENGINE
const recConflictA: NormalizedTransaction = {
  id: "norm-3",
  sourceEvidenceId: "src-csv-1",
  transactionReference: "UTR123456",
  amount: 5000,
  counterparty: "user@oksbi",
};
const recConflictB: NormalizedTransaction = {
  id: "norm-4",
  sourceEvidenceId: "src-csv-2",
  transactionReference: "UTR123456",
  amount: 5000,
  counterparty: "fraud@fakebank",
};
const expandedConflicts = identifyEvidenceConflicts(mockEvidence, [recConflictA, recConflictB]);
assert(
  expandedConflicts.some((c) => c.field === "counterparty" || c.type.includes("Counterparty")),
  "Should detect Counterparty VPA mismatch for identical UTR"
);
console.log("✔ Phase 2: Expanded Contradiction Engine OK");

// 17. FORENSIC ASSUMPTION & TRUTH CLASSIFICATION ENGINE
const assumptions = evaluateForensicAssumptions(mockEvidence, [recA], timeline, gaps, conflicts);
assert(assumptions.length >= 3, "Should evaluate at least 3 forensic assertions");
const confirmedAssert = assumptions.find((a) => a.level === "CONFIRMED");
assert(confirmedAssert !== undefined, "Must contain CONFIRMED assertion for explicit chat lure / URL");
const assumptionAssert = assumptions.find((a) => a.level === "ASSUMPTION");
assert(
  assumptionAssert !== undefined && assumptionAssert.displayBadge === "INFERRED — UNVERIFIED",
  "Must label temporal causation assumption as INFERRED — UNVERIFIED"
);
console.log("✔ Phase 2: Assumption & Forensic Truth Engine OK");

// 18. GRANULAR SOURCE TRACEABILITY MATRIX
const traceRefs = buildSourceTraceabilityMatrix(mockEvidence, masterEntities, [recA]);
assert(traceRefs.length > 0, "Should generate source references");
assert(traceRefs.some((r) => r.location?.includes("Line") || r.location?.includes("Row")), "Source references must include granular line or row location");
console.log("✔ Phase 2: Source Traceability Matrix OK");

// 19. DYNAMIC REPORTING CHECKLIST ENGINE
const checklist = evaluateReportingChecklist(mockEvidence, masterEntities, timeline, gaps, conflicts, [recA], true);
assert(checklist.items.length === 12, "Reporting checklist should evaluate all 12 mandatory criteria");
assert(checklist.completionPercentage >= 75, "Comprehensive case should achieve >= 75% completion");
assert(checklist.overallComplete === true, "overallComplete should be true");
console.log("✔ Phase 2: Dynamic Reporting Checklist OK");

// 20. 5-FILE BENCHMARK DEMO CASE GENERATION
const demoCase = createDemoIncident();
assert(demoCase.meta.caseId === "CB-2026-001", "Demo caseId must be CB-2026-001");
assert(demoCase.evidence.length === 5, "Demo case must contain 5 multi-modal evidence files");
assert(Boolean(demoCase.duplicates && demoCase.duplicates.length > 0), "Demo case must contain duplicate findings");
assert(Boolean(demoCase.assumptions && demoCase.assumptions.length > 0), "Demo case must contain forensic assumptions");
assert(Boolean(demoCase.normalizedRecords && demoCase.normalizedRecords.length > 0), "Demo case must contain normalized records");
assert(Boolean(demoCase.sourceReferences && demoCase.sourceReferences.length > 0), "Demo case must contain source traceability references");
assert(Boolean(demoCase.checklist && demoCase.checklist.overallComplete), "Demo case checklist must pass validation");
console.log("✔ Phase 2: 5-File Benchmark Demo Case OK");

// 21. MASTER PIPELINE PROCESS EVIDENCE
async function testMasterPipeline() {
  const result = await processEvidence(mockEvidence);
  assert(result.summary.estimatedLoss > 0, "Loss should be estimated");
  assert(result.timeline.length === 4, "Pipeline timeline should reconstruct 4 events");
  assert(Boolean(result.checklist), "Pipeline must generate dynamic checklist");
  assert(Boolean(result.sourceReferences), "Pipeline must generate source traceability references");
  console.log("✔ Phase 2: Master processEvidence() Integrated Pipeline OK");
}

testMasterPipeline()
  .then(() => {
    console.log("\n=========================================================================");
    console.log("🎉 ALL 21 MEMBER 2 ENGINE & FORENSIC LOGIC SUBSYSTEMS VERIFIED 100% PASS");
    console.log("=========================================================================");
  })
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  });
