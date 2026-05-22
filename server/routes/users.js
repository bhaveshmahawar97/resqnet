import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getNgoDirectory, getVolunteerDirectory } from "../controllers/userController.js";

const router = express.Router();

router.get("/ngos", getNgoDirectory);
router.get("/volunteers", authMiddleware, getVolunteerDirectory);

export default router;
