import { Router } from "express";
import { loadPhishingDemoHandler } from "../controllers/demoController.js";

export const demoRouter = Router();

demoRouter.post("/phishing", loadPhishingDemoHandler);
demoRouter.get("/phishing", loadPhishingDemoHandler);
