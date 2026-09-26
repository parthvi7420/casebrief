import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { env } from "../config/env.js";

const uploadDir = path.resolve(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Reject executable or dangerous file extensions
  const dangerousExts = [".exe", ".bat", ".cmd", ".sh", ".ps1", ".vbs", ".dll", ".so"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (dangerousExts.includes(ext)) {
    return cb(new Error(`File type ${ext} is not allowed for evidence ingestion.`));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.UPLOAD_MAX_SIZE_MB * 1024 * 1024,
  },
});

export const uploadEvidence = upload;

