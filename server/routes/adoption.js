import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  createAdoptionListingSchema,
  createAdoptionApplicationSchema,
  reviewAdoptionApplicationSchema,
} from "../validators/adoptionValidator.js";
import {
  getAdoptionListings,
  getAdoptionDetail,
  getAdoptionStatsOverview,
  postAdoptionListing,
  postAdoptionApplication,
  getMyAdoptionApplications,
  getNgoAdoptionApplications,
  putReviewAdoptionApplication,
} from "../controllers/adoptionController.js";

const router = express.Router();

router.get("/", getAdoptionListings);
router.get("/stats", getAdoptionStatsOverview);
router.get("/:id", getAdoptionDetail);

router.post(
  "/listings",
  authMiddleware,
  authorizeRoles("ngo", "admin"),
  validateRequest(createAdoptionListingSchema),
  postAdoptionListing
);

router.get("/applications/mine", authMiddleware, getMyAdoptionApplications);
router.get(
  "/applications/incoming",
  authMiddleware,
  authorizeRoles("ngo", "admin"),
  getNgoAdoptionApplications
);

router.post(
  "/:id/apply",
  authMiddleware,
  validateRequest(createAdoptionApplicationSchema),
  postAdoptionApplication
);

router.put(
  "/applications/:applicationId/review",
  authMiddleware,
  authorizeRoles("ngo", "admin"),
  validateRequest(reviewAdoptionApplicationSchema),
  putReviewAdoptionApplication
);

export default router;
