import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Incident } from "../types/incident";

const DB_NAME = "casebrief_db";
const DB_VERSION = 1;
const STORE_NAME = "cases";

interface CaseBriefDB extends DBSchema {
  cases: {
    key: string;
    value: Incident;
    indexes: { "by-created": string };
  };
}

let dbPromise: Promise<IDBPDatabase<CaseBriefDB>> | null = null;

function getDB(): Promise<IDBPDatabase<CaseBriefDB>> {
  if (typeof window === "undefined" || !window.indexedDB) {
    throw new Error("IndexedDB is not supported in this environment");
  }

  if (!dbPromise) {
    dbPromise = openDB<CaseBriefDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "meta.caseId" });
          store.createIndex("by-created", "meta.createdAt");
        }
      },
    });
  }

  return dbPromise;
}

/**
 * Persists an incident case to IndexedDB with localStorage fallback
 */
export async function saveCase(incident: Incident): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, incident);
  } catch (err) {
    console.warn("IndexedDB save failed, falling back to localStorage", err);
    try {
      localStorage.setItem(`casebrief_${incident.meta.caseId}`, JSON.stringify(incident));
      localStorage.setItem("casebrief_latest_case_id", incident.meta.caseId);
    } catch (e) {
      console.error("Storage write error", e);
    }
  }
}

/**
 * Loads a case from IndexedDB by caseId, or returns the most recent case
 */
export async function loadCase(caseId?: string): Promise<Incident | null> {
  try {
    const db = await getDB();
    if (caseId) {
      const res = await db.get(STORE_NAME, caseId);
      return res || null;
    }
    const all = await db.getAllFromIndex(STORE_NAME, "by-created");
    return all.length > 0 ? all[all.length - 1] : null;
  } catch (err) {
    console.warn("IndexedDB read failed, falling back to localStorage", err);
    try {
      const targetId = caseId || localStorage.getItem("casebrief_latest_case_id");
      if (!targetId) return null;
      const data = localStorage.getItem(`casebrief_${targetId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Storage read error", e);
      return null;
    }
  }
}

/**
 * Lists all stored cases
 */
export async function listCases(): Promise<{ caseId: string; title: string; createdAt: string }[]> {
  try {
    const db = await getDB();
    const all = await db.getAll(STORE_NAME);
    return all.map(c => ({
      caseId: c.meta.caseId,
      title: c.meta.title,
      createdAt: c.meta.createdAt,
    }));
  } catch (err) {
    console.warn("IndexedDB list failed, falling back to localStorage", err);
    const results: { caseId: string; title: string; createdAt: string }[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("casebrief_CB-")) {
          const item = JSON.parse(localStorage.getItem(key) || "{}");
          if (item?.meta) {
            results.push({
              caseId: item.meta.caseId,
              title: item.meta.title,
              createdAt: item.meta.createdAt,
            });
          }
        }
      }
    } catch (e) {
      console.error("Storage list error", e);
    }
    return results;
  }
}

/**
 * Deletes a case by caseId
 */
export async function deleteCase(caseId: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, caseId);
  } catch (err) {
    console.warn("IndexedDB delete failed", err);
  }
  try {
    localStorage.removeItem(`casebrief_${caseId}`);
  } catch (e) {
    console.error("Storage delete error", e);
  }
}
