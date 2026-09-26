import { Response } from "express";
import { ApiResponse } from "../types/api.js";

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    },
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  code = "INTERNAL_SERVER_ERROR",
  statusCode = 500,
  details?: any
): void {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    },
  };
  res.status(statusCode).json(response);
}
