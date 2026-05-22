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
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const createAdoptionListing = async ({ userId, payload }) => {
  const listing = await Adoption.create({
    listedBy: userId,
    animalName: payload.animalName || "",
    animalType: payload.animalType,
    breed: payload.breed || "",
    description: payload.description || "",
    location: payload.location || "",
    images: payload.images || [],
    adoptionFee: payload.adoptionFee || 0,
    status: payload.status === "draft" ? "draft" : "listed",
  });

  return Adoption.findById(listing._id).populate(populateListing).lean();
};

export const applyForAdoption = async ({ adoptionId, userId, message = "" }) => {
  if (!mongoose.Types.ObjectId.isValid(adoptionId)) {
    throw new Error("Invalid adoption listing");
  }

  const listing = await Adoption.findById(adoptionId);
  if (!listing || listing.status !== "listed") {
    throw new Error("This animal is not available for adoption");
  }

  const AdoptionApplication = getAdoptionApplicationModel();

  const existing = await AdoptionApplication.findOne({
    adoption: adoptionId,
    applicant: userId,
    status: { $in: ["pending", "approved"] },
  });

  if (existing) {
    throw new Error("You already have an active application for this animal");
  }

  const application = await AdoptionApplication.create({
    adoption: adoptionId,
    applicant: userId,
    ngo: listing.listedBy,
    message,
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
  if (!["approved", "rejected"].includes(status)) {
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
    await Adoption.findByIdAndUpdate(application.adoption, { status: "adopted" });
  } else if (status === "rejected") {
    await Adoption.findByIdAndUpdate(application.adoption, { status: "listed" });
  }

  return AdoptionApplication.findById(applicationId)
    .populate("adoption")
    .populate("applicant", "fullName email phone")
    .lean();
};

export const getAdoptionStats = async () => {
  const [listed, pendingReview, adopted] = await Promise.all([
    Adoption.countDocuments({ status: "listed" }),
    Adoption.countDocuments({ status: "pending_review" }),
    Adoption.countDocuments({ status: "adopted" }),
  ]);

  return { listed, pendingReview, adopted, total: listed + pendingReview + adopted };
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
