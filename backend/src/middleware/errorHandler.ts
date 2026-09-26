import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`API Error on ${req.method} ${req.url}:`, err);

  if (err instanceof ZodError) {
    sendError(
      res,
      "Validation failed",
      "VALIDATION_ERROR",
      400,
      err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }))
    );
    return;
  }

  if (err.name === "MulterError") {
    sendError(res, `File upload error: ${err.message}`, "FILE_UPLOAD_ERROR", 400);
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "An unexpected internal server error occurred.";
  const code = err.code || "INTERNAL_SERVER_ERROR";

  sendError(res, message, code, statusCode);
}
