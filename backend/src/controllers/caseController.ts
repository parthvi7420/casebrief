import { Request, Response, NextFunction } from "express";
import {
  getCaseById,
  listAllCases,
  processCasePipeline,
  loadSyntheticPhishingBenchmark,
} from "../services/caseService.js";
import { getEvidenceForCase } from "../services/evidenceService.js";

export async function createCaseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title } = req.body;
    const caseId = `CB-${Date.now().toString().slice(-6)}`;
    const incident = await processCasePipeline(caseId, [], title || "New Cyber Incident Investigation");

    res.status(201).json({
      success: true,
      message: "Case created successfully",
      data: incident,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCaseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const incident = await getCaseById(id);

    if (!incident) {
      res.status(404).json({
        success: false,
        message: `Case '${id}' not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    next(error);
  }
}

export async function listCasesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const cases = await listAllCases();
    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    next(error);
  }
}

export async function processCaseHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const evidence = await getEvidenceForCase(id);
    const incident = await processCasePipeline(id, evidence);

    res.status(200).json({
      success: true,
      message: "Forensic reconstruction pipeline executed successfully",
      data: incident,
    });
  } catch (error) {
    next(error);
  }
}
