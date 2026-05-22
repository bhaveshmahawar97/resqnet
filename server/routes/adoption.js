import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  getAdoptionListings,
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

router.post(
  "/listings",
  authMiddleware,
  authorizeRoles("ngo", "admin"),
  postAdoptionListing
);

router.get("/applications/mine", authMiddleware, getMyAdoptionApplications);
router.get(
  "/applications/incoming",
  authMiddleware,
  authorizeRoles("ngo", "admin"),
  getNgoAdoptionApplications
);

router.post("/:id/apply", authMiddleware, postAdoptionApplication);
router.put(
  "/applications/:applicationId/review",
  authMiddleware,
  authorizeRoles("ngo", "admin"),
  putReviewAdoptionApplication
);

export default router;
