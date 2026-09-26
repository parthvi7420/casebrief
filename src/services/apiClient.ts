import { Incident, EvidenceItem } from "../types/incident";

const API_BASE = "/api";

export interface BackendHealth {
  online: boolean;
  service?: string;
  version?: string;
  database?: string;
  uptime?: number;
  timestamp?: string;
}

/**
 * Checks backend connectivity.
 */
export async function checkBackendHealth(): Promise<BackendHealth> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        service: data.service,
        version: data.version,
        database: data.database,
        uptime: data.uptime,
        timestamp: data.timestamp,
      };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}

/**
 * Ingests the benchmark synthetic phishing case via backend engine.
 */
export async function fetchPhishingDemo(): Promise<Incident | null> {
  try {
    const res = await fetch(`${API_BASE}/demo/phishing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return (body.data || body.incident || body) as Incident;
  } catch (err) {
    console.warn("Backend /demo/phishing call failed, using client fallback:", err);
    return null;
  }
}

/**
 * Creates a new case on the backend.
 */
export async function createCaseOnBackend(title?: string): Promise<Incident | null> {
  try {
    const res = await fetch(`${API_BASE}/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data as Incident;
  } catch (err) {
    console.warn("Backend create case failed:", err);
    return null;
  }
}

/**
 * Ingests evidence content / items to a case on the backend.
 */
export async function uploadEvidenceToBackend(
  caseId: string,
  items: Array<{ type?: string; content: string; filename?: string }>
): Promise<Incident | null> {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return (body.incident || body.data) as Incident;
  } catch (err) {
    console.warn("Backend upload evidence failed:", err);
    return null;
  }
}

/**
 * Uploads raw files to backend via multipart/form-data.
 */
export async function uploadFilesToBackend(
  caseId: string,
  files: File[]
): Promise<Incident | null> {
  try {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/evidence`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return (body.incident || body.data) as Incident;
  } catch (err) {
    console.warn("Backend file upload failed:", err);
    return null;
  }
}

/**
 * Fetches Chain of Custody & Forensic Certificate from backend.
 */
export async function fetchChainOfCustody(caseId: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/custody`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  } catch (err) {
    console.warn("Backend fetch chain of custody failed:", err);
    return null;
  }
}

/**
 * Fetches Forensic Incident Report from backend.
 */
export async function fetchCaseReport(caseId: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/report`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  } catch (err) {
    console.warn("Backend fetch case report failed:", err);
    return null;
  }
}
