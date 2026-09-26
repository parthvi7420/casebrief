import { Request, Response } from "express";
import { getDatabaseStatus } from "../config/database.js";

export function getHealthHandler(_req: Request, res: Response): void {
  const dbStatus = getDatabaseStatus();

  res.status(200).json({
    status: "ok",
    service: "CaseBrief Cyber Forensics Backend API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    endpoints: [
      "POST /api/cases",
      "GET /api/cases",
      "GET /api/cases/:id",
      "POST /api/cases/:id/process",
      "POST /api/cases/:id/evidence",
      "GET /api/cases/:id/evidence",
      "DELETE /api/cases/:id/evidence/:evidenceId",
      "GET /api/cases/:id/timeline",
      "GET /api/cases/:id/gaps",
      "GET /api/cases/:id/conflicts",
      "GET /api/cases/:id/assumptions",
      "GET /api/cases/:id/duplicates",
      "GET /api/cases/:id/matches",
      "GET /api/cases/:id/traceability",
      "GET /api/cases/:id/modules",
      "GET /api/cases/:id/checklist",
      "GET /api/cases/:id/report",
      "GET /api/cases/:id/custody",
      "POST /api/demo/phishing",
      "GET /api/health",
    ],
  });
}
