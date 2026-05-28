import {
  listPublicAdoptions,
  createAdoptionListing,
  applyForAdoption,
  listMyApplications,
  listNgoApplications,
  reviewApplication,
  getAdoptionStats,
} from "../services/adoptionService.js";
import {
  notifyAdoptionSubmitted,
  notifyAdoptionStatusChange,
} from "../services/adoptionNotificationService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendAdoptionApprovalEmail } from "../services/emailService.js";

export const getAdoptionListings = asyncHandler(async (req, res) => {
  const listings = await listPublicAdoptions({
    animalType: req.query.animalType,
    city: req.query.city,
    limit: Number(req.query.limit) || 50,
  });

  return sendSuccess(res, {
    message: "Adoption listings loaded",
    data: listings,
  });
});

export const getAdoptionStatsOverview = asyncHandler(async (req, res) => {
  const stats = await getAdoptionStats();
  return sendSuccess(res, { message: "Adoption stats loaded", data: stats });
});

export const postAdoptionListing = asyncHandler(async (req, res) => {
  const listing = await createAdoptionListing({
    userId: req.user._id,
    payload: req.body,
  });
  return sendSuccess(res, {
    status: 201,
    message: "Adoption listing created",
    data: listing,
  });
});

export const postAdoptionApplication = asyncHandler(async (req, res) => {
  const application = await applyForAdoption({
    adoptionId: req.params.id,
    userId: req.user._id,
    message: req.body.message || "",
    experience: req.body.experience || "",
    livingEnvironment: req.body.livingEnvironment || "",
    contactInfo: req.body.contactInfo || "",
    address: req.body.address || "",
  });

  await notifyAdoptionSubmitted(application, application.adoption);

  return sendSuccess(res, {
    status: 201,
    message: "Adoption application submitted",
    data: application,
  });
});

export const getMyAdoptionApplications = asyncHandler(async (req, res) => {
  const applications = await listMyApplications(req.user._id);
  return sendSuccess(res, {
    message: "Applications loaded",
    data: applications,
  });
});

export const getNgoAdoptionApplications = asyncHandler(async (req, res) => {
  const applications = await listNgoApplications(req.user._id);
  return sendSuccess(res, {
    message: "NGO applications loaded",
    data: applications,
  });
});

export const putReviewAdoptionApplication = asyncHandler(async (req, res) => {
  const { status, reviewNote } = req.body;
  const application = await reviewApplication({
    applicationId: req.params.applicationId,
    ngoId: req.user._id,
    status,
    reviewNote,
  });

  await notifyAdoptionStatusChange(
    application,
    status,
    application.adoption?.animalName || application.adoption?.animalType
  );

  if (status === "approved" && application.applicant) {
    sendAdoptionApprovalEmail(application.applicant, application.adoption)
      .catch(err => console.error("Adoption approval email failed:", err));
  }

  return sendSuccess(res, {
    message: `Application ${status}`,
    data: application,
  });
});
