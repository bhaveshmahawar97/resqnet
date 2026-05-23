import mongoose from "mongoose";
import { Adoption } from "../models/index.js";
import { getCoreModels } from "../models/index.js";

const getAdoptionApplicationModel = () => {
  const models = getCoreModels();
  if (!models.AdoptionApplication) {
    throw new Error("AdoptionApplication model is not registered");
  }
  return models.AdoptionApplication;
};

const populateListing = { path: "listedBy", select: "fullName email ngoProfile" };

export const listPublicAdoptions = async ({ animalType, city, limit = 50 } = {}) => {
  const query = { status: "listed" };
  if (animalType) query.animalType = new RegExp(animalType, "i");
  if (city) query.location = new RegExp(city, "i");

  return Adoption.find(query)
    .populate(populateListing)
    .populate("sourceRescue", "status severity condition")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const createAdoptionListing = async ({ userId, payload }) => {
  const listing = await Adoption.create({
    listedBy: userId,
    sourceRescue: payload.sourceRescue || null,
    animalName: payload.animalName || "",
    animalType: payload.animalType,
    breed: payload.breed || "",
    description: payload.description || "",
    location: payload.location || "",
    images: payload.images || [],
    adoptionFee: payload.adoptionFee || 0,
    urgency: payload.urgency || "low",
    healthCondition: payload.healthCondition || "Healthy",
    vaccinationStatus: payload.vaccinationStatus || "Unknown",
    status: payload.status === "draft" ? "draft" : "available",
  });

  return Adoption.findById(listing._id).populate(populateListing).lean();
};

export const applyForAdoption = async ({
  adoptionId,
  userId,
  message = "",
  experience = "",
  livingEnvironment = "",
  contactInfo = "",
  address = "",
}) => {
  if (!mongoose.Types.ObjectId.isValid(adoptionId)) {
    throw new Error("Invalid adoption listing");
  }

  const listing = await Adoption.findById(adoptionId);
  if (!listing || !["available", "listed"].includes(listing.status)) {
    throw new Error("This animal is not available for adoption");
  }

  const AdoptionApplication = getAdoptionApplicationModel();

  const existing = await AdoptionApplication.findOne({
    adoption: adoptionId,
    applicant: userId,
    status: { $in: ["pending", "interview_scheduled", "approved"] },
  });

  if (existing) {
    throw new Error("You already have an active application for this animal");
  }

  const application = await AdoptionApplication.create({
    adoption: adoptionId,
    applicant: userId,
    ngo: listing.listedBy,
    message,
    experience,
    livingEnvironment,
    contactInfo,
    address,
    status: "pending",
  });

  await Adoption.findByIdAndUpdate(adoptionId, { status: "pending_review" });

  return AdoptionApplication.findById(application._id)
    .populate("adoption")
    .populate("applicant", "fullName email phone")
    .lean();
};

export const listMyApplications = async (userId) => {
  const AdoptionApplication = getAdoptionApplicationModel();
  return AdoptionApplication.find({ applicant: userId })
    .populate({ path: "adoption", populate: populateListing })
    .sort({ createdAt: -1 })
    .lean();
};

export const listNgoApplications = async (ngoId) => {
  const AdoptionApplication = getAdoptionApplicationModel();
  return AdoptionApplication.find({ ngo: ngoId })
    .populate("adoption")
    .populate("applicant", "fullName email phone")
    .sort({ createdAt: -1 })
    .lean();
};

export const reviewApplication = async ({
  applicationId,
  ngoId,
  status,
  reviewNote = "",
}) => {
  if (!["interview_scheduled", "approved", "rejected", "withdrawn"].includes(status)) {
    throw new Error("Invalid review status");
  }

  const AdoptionApplication = getAdoptionApplicationModel();
  const application = await AdoptionApplication.findById(applicationId);

  if (!application) throw new Error("Application not found");
  if (application.ngo?.toString() !== ngoId.toString()) {
    throw new Error("Not authorized to review this application");
  }

  application.status = status;
  application.reviewNote = reviewNote;
  application.reviewedBy = ngoId;
  application.reviewedAt = new Date();
  await application.save();

  if (status === "approved") {
    await Adoption.findByIdAndUpdate(application.adoption, { status: "adoption_in_progress" });
  } else if (status === "rejected") {
    // Determine if any other approved apps exist for this adoption
    const otherApproved = await AdoptionApplication.findOne({
      adoption: application.adoption,
      status: "approved"
    });
    if (!otherApproved) {
      await Adoption.findByIdAndUpdate(application.adoption, { status: "available" });
    }
  }

  return AdoptionApplication.findById(applicationId)
    .populate("adoption")
    .populate("applicant", "fullName email phone")
    .lean();
};

export const getAdoptionStats = async () => {
  const [available, pendingReview, adopted] = await Promise.all([
    Adoption.countDocuments({ status: { $in: ["listed", "available"] } }),
    Adoption.countDocuments({ status: { $in: ["pending_review", "interview_scheduled", "adoption_in_progress"] } }),
    Adoption.countDocuments({ status: "adopted" }),
  ]);

  return { available, pendingReview, adopted, total: available + pendingReview + adopted };
};

export default {
  listPublicAdoptions,
  createAdoptionListing,
  applyForAdoption,
  listMyApplications,
  listNgoApplications,
  reviewApplication,
  getAdoptionStats,
};
