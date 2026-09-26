import { Router } from "express";
import { caseRouter } from "./caseRoutes.js";
import { demoRouter } from "./demoRoutes.js";
import { healthRouter } from "./healthRoutes.js";

export const apiRouter = Router();

apiRouter.use("/cases", caseRouter);
apiRouter.use("/demo", demoRouter);
apiRouter.use("/health", healthRouter);
