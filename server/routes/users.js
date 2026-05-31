import express from "express";
import authMiddleware, { roleMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { 
  getNgoDirectory, 
  getVolunteerDirectory,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  toggleAvailability,
  updateProfile
} from "../controllers/userController.js";

const router = express.Router();

router.put("/me", authMiddleware, upload.single("avatar"), updateProfile);
router.put("/me/availability", authMiddleware, roleMiddleware("volunteer"), toggleAvailability);

router.get("/ngos", getNgoDirectory);
router.get("/volunteers", authMiddleware, getVolunteerDirectory);

// Admin Routes
router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.put("/:id/role", authMiddleware, roleMiddleware("admin"), updateUserRole);
router.put("/:id/toggle-status", authMiddleware, roleMiddleware("admin"), toggleUserStatus);

export default router;
