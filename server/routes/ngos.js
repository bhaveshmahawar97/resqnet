import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { verifyNgoAccess } from "../middleware/ngoVerificationMiddleware.js";
import {
  registerNGO,
  getAllNGOs,
  getNGOById,
  updateNGO,
  getPendingNGOs,
  verifyNGO,
  getVerificationStatus,
  getMyNgoProfile,
  getNgoStatsOverview,
} from "../controllers/ngoController.js";

import { validateRequest } from "../middleware/validationMiddleware.js";
import { ngoRegistrationSchema } from "../validators/ngoValidator.js";

const router = express.Router();

// Admin routes (must come first to avoid conflict with /:id)
router.get("/admin/pending", authMiddleware, authorizeRoles("admin"), getPendingNGOs);
router.post("/admin/verify/:id", authMiddleware, authorizeRoles("admin"), verifyNGO);

// Public routes
router.get("/stats/overview", getNgoStatsOverview);
router.get("/", getAllNGOs);
router.post("/register", validateRequest(ngoRegistrationSchema), registerNGO);

// Verification status (public)
router.get("/:id/verification-status", getVerificationStatus);

// NGO owner routes (authenticated)
// NGO owner routes (authenticated & verified)
router.get("/my-profile", authMiddleware, verifyNgoAccess, getMyNgoProfile);
router.put("/:id", authMiddleware, verifyNgoAccess, updateNGO);

// Get single NGO (public - must come last to avoid conflicts)
router.get("/:id", getNGOById);

export default router;
