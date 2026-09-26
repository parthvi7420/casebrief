import { Request, Response, NextFunction } from "express";
import { getCaseById } from "../services/caseService.js";

export async function getGapsHandler(
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

    res.status(200).json({
      success: true,
      caseId: id,
      count: incident.gaps.length,
      gaps: incident.gaps,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConflictsHandler(
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

    res.status(200).json({
      success: true,
      caseId: id,
      count: incident.conflicts.length,
      conflicts: incident.conflicts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAssumptionsHandler(
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

    res.status(200).json({
      success: true,
      caseId: id,
      count: (incident.assumptions || []).length,
      assumptions: incident.assumptions || [],
    });
  } catch (error) {
    next(error);
  }
}

export async function getDuplicatesHandler(
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

    res.status(200).json({
      success: true,
      caseId: id,
      count: (incident.duplicateFindings || []).length,
      duplicateFindings: incident.duplicateFindings || [],
    });
  } catch (error) {
    next(error);
  }
}

export async function getMatchedPairsHandler(
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

    res.status(200).json({
      success: true,
      caseId: id,
      count: (incident.matchedPairs || []).length,
      matchedPairs: incident.matchedPairs || [],
    });
  } catch (error) {
    next(error);
  }
}

export async function getTraceabilityHandler(
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

    res.status(200).json({
      success: true,
      caseId: id,
      count: (incident.sourceReferences || []).length,
      sourceReferences: incident.sourceReferences || [],
    });
  } catch (error) {
    next(error);
  }
}

export async function getSecurityModulesHandler(
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

    res.status(200).json({
      success: true,
      caseId: id,
      moduleHits: incident.moduleHits,
      networkLogs: incident.networkLogs || [],
      fraudAttemptLog: incident.fraudAttemptLog || [],
    });
  } catch (error) {
    next(error);
  }
}
