import { Request, Response, NextFunction } from "express";
import { getCaseById } from "../services/caseService.js";

export async function getChecklistHandler(
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
      checklist: incident.checklist,
    });
  } catch (error) {
    next(error);
  }
}
