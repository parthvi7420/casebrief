import crypto from "crypto";
import { EvidenceItem, ExtractedEntities } from "../types/incident.js";
import { extractAllEntities } from "./extractionService.js";
import { prisma } from "../config/database.js";

// In-memory fallback repository for cases and evidence when PostgreSQL is in transit
const memoryEvidenceStore = new Map<string, EvidenceItem[]>();

/**
 * Computes deterministic cryptographic SHA-256 hash for raw content
 */
export function computeSHA256(content: string | Buffer): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Creates and processes a single evidence item with SHA-256 hash and extracted entities
 */
export function createEvidenceItem(
  id: string,
  type: "text" | "message" | "url" | "csv" | "screenshot",
  content: string,
  filename?: string,
  mimeType?: string
): { item: EvidenceItem; entities: ExtractedEntities } {
  const hash = computeSHA256(content);
  const entities = extractAllEntities(content);

  const item: EvidenceItem = {
    id,
    type,
    filename: filename || `${type}-evidence-${Date.now()}`,
    fileHash: hash,
    extractedText: content,
    createdAt: new Date().toISOString(),
  };

  return { item, entities };
}

/**
 * Ingests evidence into a case (Prisma DB with in-memory fallback)
 */
export async function ingestEvidence(
  caseId: string,
  items: EvidenceItem[]
): Promise<EvidenceItem[]> {
  // Store in memory cache
  const existing = memoryEvidenceStore.get(caseId) || [];
  const merged = [...existing];

  for (const item of items) {
    const idx = merged.findIndex((e) => e.id === item.id);
    if (idx >= 0) {
      merged[idx] = item;
    } else {
      merged.push(item);
    }
  }
  memoryEvidenceStore.set(caseId, merged);

  // Attempt DB persistence
  try {
    for (const item of items) {
      const sha256Val = item.sha256 || item.fileHash || computeSHA256(item.extractedText || "");
      await prisma.evidence.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          caseId,
          sourceType: "TEXT",
          filename: item.filename || "evidence.txt",
          sha256: sha256Val,
          extractedText: item.extractedText || "",
          metadata: {
            preview: item.preview,
            sourceEvidenceId: item.id,
          },
        },
        update: {
          extractedText: item.extractedText || "",
          sha256: sha256Val,
        },
      });
    }
  } catch {
    // Graceful fallback to memory store
  }

  return memoryEvidenceStore.get(caseId) || [];
}

/**
 * Retrieves all evidence for a given case
 */
export async function getEvidenceForCase(caseId: string): Promise<EvidenceItem[]> {
  try {
    const dbRecords = await prisma.evidence.findMany({
      where: { caseId },
      orderBy: { createdAt: "asc" },
    });

    if (dbRecords.length > 0) {
      return dbRecords.map((r) => ({
        id: r.id,
        type: "text",
        filename: r.filename,
        fileHash: r.sha256,
        sha256: r.sha256,
        extractedText: r.extractedText || undefined,
        createdAt: r.createdAt.toISOString(),
      }));
    }
  } catch {
    // Fall back to memory store
  }

  return memoryEvidenceStore.get(caseId) || [];
}

/**
 * Deletes an evidence item by ID
 */
export async function removeEvidenceItem(caseId: string, evidenceId: string): Promise<boolean> {
  const existing = memoryEvidenceStore.get(caseId) || [];
  const filtered = existing.filter((e) => e.id !== evidenceId);
  memoryEvidenceStore.set(caseId, filtered);

  try {
    await prisma.evidence.delete({
      where: { id: evidenceId },
    });
    return true;
  } catch {
    return filtered.length < existing.length;
  }
}
