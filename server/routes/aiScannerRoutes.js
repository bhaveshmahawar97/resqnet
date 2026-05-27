import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { handleScannerUpload } from "../middleware/uploadMiddleware.js";
import { analyzeScannerImage } from "../controllers/aiScannerController.js";

const router = express.Router();

/**
 * POST /api/scanner/analyze
 * Analyze an uploaded animal image with Claude Vision.
 */
router.post("/analyze", authMiddleware, handleScannerUpload, analyzeScannerImage);

export default router;
