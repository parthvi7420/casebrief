import { z } from "zod";

export const CreateCaseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().optional(),
});

export const IngestEvidenceSchema = z.object({
  type: z.enum(["text", "message", "url", "csv", "screenshot"]),
  content: z.string().min(1, "Evidence content cannot be empty"),
  filename: z.string().optional(),
});

export const IngestEvidenceBatchSchema = z.object({
  items: z.array(IngestEvidenceSchema).min(1, "Must provide at least one evidence item"),
});

export const CaseIdParamSchema = z.object({
  id: z.string().min(1, "Case ID is required"),
});

export const EvidenceIdParamSchema = z.object({
  id: z.string().min(1, "Case ID is required"),
  evidenceId: z.string().min(1, "Evidence ID is required"),
});

export const ExportReportQuerySchema = z.object({
  format: z.enum(["json", "redacted", "custody", "print"]).default("json"),
});
