import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { handleRescueUpload } from "../middleware/uploadMiddleware.js";
import {
  createRescueRequest,
  getAllRescueRequests,
  getSingleRescueRequest,
  updateRescueStatus,
  assignNgo,
  assignVolunteer,
  acceptRescueMission,
  updateMissionStatus,
  getAssignedRescues,
  getMyRescueRequests,
  getRescueStats,
  getCriticalRescues,
  autoAssignNgo,
  rejectRescueMission,
} from "../controllers/rescueController.js";

import { validateRequest } from "../middlewares/validateRequest.js";
import { createRescueSchema, updateRescueStatusSchema } from "../validators/rescueValidator.js";

const router = express.Router();

// CREATE RESCUE REQUEST (multipart field: images)
router.post("/create", authMiddleware, handleRescueUpload, validateRequest(createRescueSchema), createRescueRequest);

// GET ALL RESCUE REQUESTS (Operational roles only)
router.get(
  "/all",
  authMiddleware,
  authorizeRoles("ngo", "volunteer", "admin"),
  getAllRescueRequests
);

// GET CRITICAL RESCUES (Operational roles only)
router.get(
  "/critical/list",
  authMiddleware,
  authorizeRoles("ngo", "volunteer", "admin"),
  getCriticalRescues
);

// ASSIGN NGO TO MISSION
router.put(
  "/assign-ngo/:id",
  authMiddleware,
  authorizeRoles("admin", "ngo"),
  assignNgo
);

// ASSIGN VOLUNTEER TO MISSION
router.put(
  "/assign-volunteer/:id",
  authMiddleware,
  authorizeRoles("admin", "ngo", "volunteer"),
  assignVolunteer
);

// ACCEPT RESCUE MISSION
router.put(
  "/accept/:id",
  authMiddleware,
  authorizeRoles("admin", "ngo", "volunteer"),
  acceptRescueMission
);

// REJECT RESCUE MISSION
router.put(
  "/reject/:id",
  authMiddleware,
  authorizeRoles("admin", "ngo"),
  rejectRescueMission
);

// AUTO ASSIGN NGO TO MISSION
router.put(
  "/auto-assign/:id",
  authMiddleware,
  authorizeRoles("admin"),
  autoAssignNgo
);

// UPDATE OPERATIONAL MISSION STATUS
router.put(
  "/update-mission/:id",
  authMiddleware,
  authorizeRoles("admin", "ngo", "volunteer"),
  updateMissionStatus
);

// GET ASSIGNED MISSIONS
router.get(
  "/assigned",
  authMiddleware,
  authorizeRoles("admin", "ngo", "volunteer"),
  getAssignedRescues
);

// GET RESCUE STATISTICS
router.get("/stats/overview", getRescueStats);

// GET CURRENT USER'S RESCUE REQUESTS (aliases for frontend compatibility)
router.get("/my", authMiddleware, getMyRescueRequests);
router.get("/my/requests", authMiddleware, getMyRescueRequests);

// GET SINGLE RESCUE REQUEST
router.get("/:id", authMiddleware, getSingleRescueRequest);

router.put(
  "/update-status/:id",
  authMiddleware,
  authorizeRoles("ngo", "volunteer", "admin"),
  validateRequest(updateRescueStatusSchema),
  updateRescueStatus
);

export default router;
