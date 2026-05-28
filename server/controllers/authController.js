import { registerUser, loginUser } from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendWelcomeEmail } from "../services/emailService.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  
  // Send welcome email asynchronously
  sendWelcomeEmail(result.user).catch(err => console.error("Welcome email failed:", err));

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: result.token,
    user: result.user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token: result.token,
    user: result.user,
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = req.user?.toSafeJSON?.() || req.user;
  return res.status(200).json({
    success: true,
    message: "Current user profile",
    user,
  });
});
