import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { handleScannerUpload } from "../middleware/uploadMiddleware.js";
import { analyzeScannerImage, getScannerHistory } from "../controllers/aiScannerController.js";

const router = express.Router();

/**
 * POST /api/scanner/analyze
 * Analyze an uploaded animal image with Claude Vision.
 */
router.post("/analyze", authMiddleware, handleScannerUpload, analyzeScannerImage);

/**
 * GET /api/scanner/history
 * Fetch AI scan history for the authenticated user.
 */
router.get("/history", authMiddleware, getScannerHistory);

export default router;
