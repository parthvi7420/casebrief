import { Request, Response, NextFunction } from "express";
import { loadSyntheticPhishingBenchmark } from "../services/caseService.js";

export async function loadPhishingDemoHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const demoIncident = await loadSyntheticPhishingBenchmark();

    res.status(200).json({
      success: true,
      message: "Benchmark 4-Event Phishing Case (#CB-2026-001) instantiated successfully",
      caseId: demoIncident.id,
      data: demoIncident,
    });
  } catch (error) {
    next(error);
  }
}
