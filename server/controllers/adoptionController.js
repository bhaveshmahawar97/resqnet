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

export const getAdoptionListings = async (req, res) => {
  try {
    const listings = await listPublicAdoptions({
      animalType: req.query.animalType,
      city: req.query.city,
      limit: Number(req.query.limit) || 50,
    });

    return sendSuccess(res, {
      message: "Adoption listings loaded",
      data: listings,
    });
  } catch (err) {
    return sendError(res, { status: 500, message: err.message || "Failed to load adoptions" });
  }
};

export const getAdoptionStatsOverview = async (req, res) => {
  try {
    const stats = await getAdoptionStats();
    return sendSuccess(res, { message: "Adoption stats loaded", data: stats });
  } catch (err) {
    return sendError(res, { status: 500, message: err.message || "Failed to load stats" });
  }
};

export const postAdoptionListing = async (req, res) => {
  try {
    const listing = await createAdoptionListing({
      userId: req.user._id,
      payload: req.body,
    });
    return sendSuccess(res, {
      status: 201,
      message: "Adoption listing created",
      data: listing,
    });
  } catch (err) {
    return sendError(res, { status: 400, message: err.message || "Failed to create listing" });
  }
};

export const postAdoptionApplication = async (req, res) => {
  try {
    const application = await applyForAdoption({
      adoptionId: req.params.id,
      userId: req.user._id,
      message: req.body.message || "",
    });

    await notifyAdoptionSubmitted(application, application.adoption);

    return sendSuccess(res, {
      status: 201,
      message: "Adoption application submitted",
      data: application,
    });
  } catch (err) {
    return sendError(res, { status: 400, message: err.message || "Application failed" });
  }
};

export const getMyAdoptionApplications = async (req, res) => {
  try {
    const applications = await listMyApplications(req.user._id);
    return sendSuccess(res, {
      message: "Applications loaded",
      data: applications,
    });
  } catch (err) {
    return sendError(res, { status: 500, message: err.message || "Failed to load applications" });
  }
};

export const getNgoAdoptionApplications = async (req, res) => {
  try {
    const applications = await listNgoApplications(req.user._id);
    return sendSuccess(res, {
      message: "NGO applications loaded",
      data: applications,
    });
  } catch (err) {
    return sendError(res, { status: 500, message: err.message || "Failed to load applications" });
  }
};

export const putReviewAdoptionApplication = async (req, res) => {
  try {
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

    return sendSuccess(res, {
      message: `Application ${status}`,
      data: application,
    });
  } catch (err) {
    return sendError(res, { status: 400, message: err.message || "Review failed" });
  }
};
