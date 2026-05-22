import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { handleAiUpload } from "../middleware/uploadMiddleware.js";
import {
  scanAnimal,
  getScannerStats,
  getScanHistory,
} from "../controllers/aiController.js";

const router = express.Router();

/**
 * GET /api/ai/stats
 * Public scanner statistics
 */
router.get("/stats", getScannerStats);

/**
 * GET /api/ai/scans
 * Authenticated user's scan history
 */
router.get("/scans", authMiddleware, getScanHistory);

/**
 * POST /api/ai/scan
 * Vision analysis via OpenRouter (JSON body imageUrl or multipart image upload)
 */
router.post("/scan", authMiddleware, handleAiUpload, scanAnimal);

export default router;
