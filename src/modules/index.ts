import { EvidenceItem, ModuleHit, Transaction, FraudAttempt } from "../types/incident";
import { runMessageAnalyzer } from "./message";
import { runUrlReputationCheck } from "./url";
import { runNetworkMonitoring, NetworkLogEntry } from "./network";
import { runThreatIntel } from "./intel";
import { runTransactionAuditor } from "./transaction";
import { runFraudAttemptLog } from "./fraudLog";

export * from "./message";
export * from "./url";
export * from "./network";
export * from "./intel";
export * from "./transaction";
export * from "./fraudLog";

export interface SecurityModulesResult {
  moduleHits: ModuleHit[];
  networkLogs: NetworkLogEntry[];
  transactions: Transaction[];
  fraudAttemptLog: FraudAttempt[];
}

/**
 * Executes all 6 deterministic security modules over ingested evidence items.
 */
export function runAllSecurityModules(
  evidenceList: EvidenceItem[],
  existingTransactions: Transaction[] = []
): SecurityModulesResult {
  const messageHit = runMessageAnalyzer(evidenceList);
  const urlHit = runUrlReputationCheck(evidenceList);
  const networkResult = runNetworkMonitoring(evidenceList);
  const intelHit = runThreatIntel(evidenceList);
  const transactionResult = runTransactionAuditor(evidenceList, existingTransactions);
  const fraudLogResult = runFraudAttemptLog(evidenceList);

  const moduleHits: ModuleHit[] = [
    messageHit,
    urlHit,
    networkResult.moduleHit,
    intelHit,
    transactionResult.moduleHit,
    fraudLogResult.moduleHit,
  ];

  return {
    moduleHits,
    networkLogs: networkResult.networkLogs,
    transactions: transactionResult.auditedTransactions,
    fraudAttemptLog: fraudLogResult.fraudAttemptLog,
  };
}
