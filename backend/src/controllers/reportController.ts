import { Request, Response, NextFunction } from "express";
import { getCaseById } from "../services/caseService.js";
import {
  generateFullForensicReport,
  generateRedactedReport,
  generateChainOfCustody,
} from "../services/reportService.js";

export async function getReportHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const format = (req.query.format as string) || "json";
    const incident = await getCaseById(id);

    if (!incident) {
      res.status(404).json({ success: false, message: `Case '${id}' not found` });
      return;
    }

    if (format === "redacted") {
      const redacted = generateRedactedReport(incident);
      res.status(200).json({
        success: true,
        type: "sanitized_redacted_report",
        caseId: id,
        data: redacted,
      });
      return;
    }

    if (format === "custody") {
      const custody = generateChainOfCustody(incident);
      res.status(200).json({
        success: true,
        type: "chain_of_custody_certificate",
        caseId: id,
        data: custody,
      });
      return;
    }

    const fullReport = generateFullForensicReport(incident);
    res.status(200).json({
      success: true,
      type: "full_forensic_report",
      caseId: id,
      data: fullReport,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustodyCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const incident = await getCaseById(id);

    if (!incident) {
      res.status(404).json({ success: false, message: `Case '${id}' not found` });
      return;
    }

    const custody = generateChainOfCustody(incident);
    res.status(200).json({
      success: true,
      caseId: id,
      data: custody,
    });
  } catch (error) {
    next(error);
  }
}
