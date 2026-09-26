import { EvidenceItem, ModuleHit, Transaction, FraudAttempt } from "../../types/incident.js";
import { runMessageAnalyzer } from "./messageAnalyzer.js";
import { runUrlReputationCheck } from "./urlReputation.js";
import { runNetworkMonitoring, NetworkLogEntry } from "./networkMonitoring.js";
import { runThreatIntel } from "./threatIntel.js";
import { runTransactionAuditor } from "./transactionAuditor.js";
import { runFraudAttemptLog } from "./fraudAttemptLog.js";

export {
  runMessageAnalyzer,
  runUrlReputationCheck,
  runNetworkMonitoring,
  runThreatIntel,
  runTransactionAuditor,
  runFraudAttemptLog,
};

export interface SecurityModulesResult {
  moduleHits: ModuleHit[];
  networkLogs: NetworkLogEntry[];
  auditedTransactions: Transaction[];
  fraudAttemptLog: FraudAttempt[];
}

export function runAllSecurityModules(
  evidenceList: EvidenceItem[],
  existingTransactions: Transaction[] = []
): SecurityModulesResult {
  const hit1 = runMessageAnalyzer(evidenceList);
  const hit2 = runUrlReputationCheck(evidenceList);
  const { moduleHit: hit3, networkLogs } = runNetworkMonitoring(evidenceList);
  const hit4 = runThreatIntel(evidenceList);
  const { moduleHit: hit5, auditedTransactions } = runTransactionAuditor(
    evidenceList,
    existingTransactions
  );
  const { moduleHit: hit6, fraudAttemptLog } = runFraudAttemptLog(evidenceList);

  return {
    moduleHits: [hit1, hit2, hit3, hit4, hit5, hit6],
    networkLogs,
    auditedTransactions,
    fraudAttemptLog,
  };
}
