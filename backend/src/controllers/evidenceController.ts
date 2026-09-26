import { Request, Response, NextFunction } from "express";
import fs from "fs";
import {
  ingestEvidence,
  getEvidenceForCase,
  removeEvidenceItem,
  createEvidenceItem,
  computeSHA256,
} from "../services/evidenceService.js";
import { processCasePipeline } from "../services/caseService.js";
import { EvidenceItem } from "../types/incident.js";

export async function uploadEvidenceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const itemsToIngest: EvidenceItem[] = [];

    // 1. Check if files were uploaded via multipart/form-data
    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      for (const file of files) {
        let textContent = "";
        try {
          textContent = fs.readFileSync(file.path, "utf-8");
        } catch {
          textContent = `Binary evidence file: ${file.originalname} (${file.size} bytes)`;
        }

        let type: EvidenceItem["type"] = "text";
        if (file.originalname.endsWith(".csv")) type = "csv";
        else if (file.mimetype.startsWith("image/")) type = "screenshot";
        else if (file.originalname.includes("message") || textContent.includes("KYC")) type = "message";
        else if (textContent.includes("http://") || textContent.includes("https://")) type = "url";

        const { item } = createEvidenceItem(
          `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type,
          textContent,
          file.originalname,
          file.mimetype
        );
        itemsToIngest.push(item);
      }
    }

    // 2. Check if JSON payload was submitted (direct text / URL ingestion)
    if (req.body && req.body.content) {
      const { type, content, filename } = req.body;
      const { item } = createEvidenceItem(
        `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type || "text",
        content,
        filename
      );
      itemsToIngest.push(item);
    } else if (req.body && Array.isArray(req.body.items)) {
      for (const raw of req.body.items) {
        const { item } = createEvidenceItem(
          `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          raw.type || "text",
          raw.content,
          raw.filename
        );
        itemsToIngest.push(item);
      }
    }

    if (itemsToIngest.length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid evidence files or content provided",
      });
      return;
    }

    // Ingest and re-run pipeline
    const updatedEvidence = await ingestEvidence(id, itemsToIngest);
    const incident = await processCasePipeline(id, updatedEvidence);

    res.status(200).json({
      success: true,
      message: `Successfully ingested ${itemsToIngest.length} evidence item(s)`,
      evidence: updatedEvidence,
      incident,
    });
  } catch (error) {
    next(error);
  }
}

export async function listEvidenceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const evidence = await getEvidenceForCase(id);

    res.status(200).json({
      success: true,
      count: evidence.length,
      data: evidence,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteEvidenceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const evidenceId = String(req.params.evidenceId);
    await removeEvidenceItem(id, evidenceId);
    const remaining = await getEvidenceForCase(id);
    const incident = await processCasePipeline(id, remaining);

    res.status(200).json({
      success: true,
      message: `Evidence item '${evidenceId}' deleted`,
      incident,
    });
  } catch (error) {
    next(error);
  }
}
