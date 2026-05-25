import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to ensure the authenticated user is an NGO and is verified.
 * Should be used AFTER authMiddleware.
 */
export const verifyNgoAccess = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not authenticated.");
  }

  if (req.user.role !== "ngo") {
    res.status(403);
    throw new Error("Access denied. Only NGOs can perform this action.");
  }

  // Check if the user's NGO profile is verified
  if (!req.user.ngoProfile || req.user.ngoProfile.verified !== true) {
    res.status(403);
    throw new Error("Your NGO account is pending verification or has not been approved.");
  }

  next();
});
