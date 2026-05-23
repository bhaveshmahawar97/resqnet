import express from "express";

import {
  register,
  login,
  me,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);

router.post("/login", validateRequest(loginSchema), login);

router.get("/me", authMiddleware, me);

export default router;