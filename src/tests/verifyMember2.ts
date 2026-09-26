/**
 * Comprehensive Validation Suite for Member 2 (Investigation Engine & Data Layer)
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
import { maskPhoneNumber, maskUPI, maskAccountNumber, maskEmail, redactText, createRedactedIncident } from "../logic/redaction";
import { createDemoIncident } from "../logic/demoCase";
import { processEvidence } from "../logic/incident";
import { EvidenceItem, Gap, Conflict } from "../types/incident";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${msg}`);
  }
}

console.log("=== RUNNING MEMBER 2 COMPREHENSIVE ENGINE AUDIT ===");

// 1. DATES & TIMES
const dateTest = extractDatesAndTimes("Urgent action needed at 10:34 AM on 24/09/2026. Followup by 11:00 AM.");
assert(dateTest.length >= 2, "Should extract at least 2 date/time entries");
assert(normalizeTimeString("10:34 AM") === "10:34 AM", "Time normalization should work");
console.log("✔ Extract: Dates and Times OK");

// 2. MONEY
const moneyTest = extractMoney("Please pay ₹5,000 immediately, else Rs. 4,999 will be forfeited. Total INR 10,000.50");
assert(moneyTest.some(m => m.amount === 5000), "Should extract 5000");
assert(moneyTest.some(m => m.amount === 4999), "Should extract 4999");
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
assert(payTest.accountNumbers.some(a => a.includes("4521")), "Should extract Account number");
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
    createdAt: "2026-09-24T10:34:00Z"
  },
  {
    id: "url-1",
    type: "url",
    filename: "suspicious_url.txt",
    extractedText: "http://pay-secure-example.test/verify",
    hash: "mockhash2",
    createdAt: "2026-09-24T10:35:00Z"
  },
  {
    id: "csv-1",
    type: "csv",
    filename: "transactions.csv",
    extractedText: csvSample,
    hash: "mockhash3",
    createdAt: "2026-09-24T10:45:00Z"
  }
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

// 13. DEMO CASE GENERATION
const demoCase = createDemoIncident();
assert(demoCase.meta.caseId === "CB-2026-001", "Demo caseId must be CB-2026-001");
assert(demoCase.timeline.length === 4, "Demo case timeline must have 4 events");
assert(demoCase.conflicts.length >= 1, "Demo case must have conflicts");
assert(demoCase.gaps.length >= 1, "Demo case must have gaps");
assert(demoCase.moduleHits.every(m => m.status === "hit"), "All 6 modules in demo case should have status 'hit'");
console.log("✔ Logic: Demo Benchmark Case Generator OK");

// 14. MASTER PIPELINE PROCESS EVIDENCE
async function testMasterPipeline() {
  const result = await processEvidence(mockEvidence);
  assert(result.summary.estimatedLoss > 0, "Loss should be estimated");
  assert(result.timeline.length === 4, "Pipeline timeline should reconstruct 4 events");
  console.log("✔ Logic: Master processEvidence() Pipeline OK");
}

testMasterPipeline().then(() => {
  console.log("\n========================================================");
  console.log("🎉 ALL 14 MEMBER 2 ENGINE & DATA SUBSYSTEMS VERIFIED 100%");
  console.log("========================================================");
}).catch(e => {
  console.error("Test failed:", e);
  process.exit(1);
});
