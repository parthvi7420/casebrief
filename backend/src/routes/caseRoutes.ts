import { Router } from "express";
import {
  createCaseHandler,
  getCaseHandler,
  listCasesHandler,
  processCaseHandler,
} from "../controllers/caseController.js";
import {
  uploadEvidenceHandler,
  listEvidenceHandler,
  deleteEvidenceHandler,
} from "../controllers/evidenceController.js";
import { getTimelineHandler } from "../controllers/timelineController.js";
import {
  getGapsHandler,
  getConflictsHandler,
  getAssumptionsHandler,
  getDuplicatesHandler,
  getMatchedPairsHandler,
  getTraceabilityHandler,
  getSecurityModulesHandler,
} from "../controllers/findingsController.js";
import { getChecklistHandler } from "../controllers/checklistController.js";
import {
  getReportHandler,
  getCustodyCertificateHandler,
} from "../controllers/reportController.js";
import { uploadEvidence } from "../middleware/uploadMiddleware.js";

export const caseRouter = Router();

// Core Case Endpoints
caseRouter.post("/", createCaseHandler);
caseRouter.get("/", listCasesHandler);
caseRouter.get("/:id", getCaseHandler);
caseRouter.post("/:id/process", processCaseHandler);

// Evidence Ingestion & Management
caseRouter.post("/:id/evidence", uploadEvidence.array("files", 10), uploadEvidenceHandler);
caseRouter.get("/:id/evidence", listEvidenceHandler);
caseRouter.delete("/:id/evidence/:evidenceId", deleteEvidenceHandler);

// Forensic Timeline
caseRouter.get("/:id/timeline", getTimelineHandler);

// Security & Investigative Findings
caseRouter.get("/:id/gaps", getGapsHandler);
caseRouter.get("/:id/conflicts", getConflictsHandler);
caseRouter.get("/:id/assumptions", getAssumptionsHandler);
caseRouter.get("/:id/duplicates", getDuplicatesHandler);
caseRouter.get("/:id/matches", getMatchedPairsHandler);
caseRouter.get("/:id/traceability", getTraceabilityHandler);
caseRouter.get("/:id/modules", getSecurityModulesHandler);

// 12-Point Incident Checklist
caseRouter.get("/:id/checklist", getChecklistHandler);

// Report Generation & Chain of Custody
caseRouter.get("/:id/report", getReportHandler);
caseRouter.get("/:id/custody", getCustodyCertificateHandler);
