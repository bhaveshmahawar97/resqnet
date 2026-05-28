import express from "express";
import { Feedback } from "../models/index.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
  const { name, email, type, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required" });
  }

  const feedback = await Feedback.create({
    user: req.user ? req.user._id : undefined,
    name,
    email,
    type: type || "suggestion",
    message
  });

  return sendSuccess(res, {
    status: 201,
    message: "Feedback submitted successfully. Thank you!",
    data: { id: feedback._id }
  });
}));

export default router;
