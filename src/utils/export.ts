import { Incident } from "../types/incident";
import { createRedactedIncident } from "../logic/redaction";

/**
 * Downloads a JSON object as a formatted local file
 */
export function downloadJSON(data: unknown, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports Shareable Redacted Incident JSON (PII sanitized for law enforcement/advisories)
 */
export function exportShareableRedactedJSON(incident: Incident): void {
  const redacted = createRedactedIncident(incident);
  const filename = `${incident.meta.caseId || "case"}_shareable_redacted.json`;
  downloadJSON(redacted, filename);
}

/**
 * Exports Full Unredacted Forensic JSON (Local retention only)
 */
export function exportFullForensicJSON(incident: Incident): void {
  const filename = `${incident.meta.caseId || "case"}_forensic_full.json`;
  downloadJSON(incident, filename);
}

/**
 * Triggers clean browser print dialog for the incident report
 */
export function printIncidentReport(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}
