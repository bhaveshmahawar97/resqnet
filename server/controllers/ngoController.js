import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createNgo,
  fetchAllNgos,
  fetchNgoById,
  modifyNgo,
  fetchPendingNgos,
  verifyNgoStatus,
  fetchVerificationStatus,
  fetchMyNgoProfile,
  fetchNgoStatsOverview
} from "../services/ngoService.js";

export const registerNGO = asyncHandler(async (req, res) => {
  const ngo = await createNgo(req.body);
  return sendSuccess(res, {
    status: 201,
    message: "NGO registered successfully. Awaiting admin verification.",
    data: {
      ngo: {
        id: ngo._id.toString(),
        organizationName: ngo.organizationName,
        email: ngo.email,
        city: ngo.city,
        verificationStatus: ngo.verificationStatus,
        createdAt: ngo.createdAt,
      },
    },
  });
});

export const getAllNGOs = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const city = req.query.city ? req.query.city.trim() : null;
  const ngoType = req.query.type ? req.query.type.trim() : null;

  const ngos = await fetchAllNgos({ city, ngoType }, limit);
  return sendSuccess(res, { message: "NGOs retrieved successfully", data: { ngos } });
});

export const getNGOById = asyncHandler(async (req, res) => {
  const ngo = await fetchNgoById(req.params.id);
  return sendSuccess(res, { message: "NGO retrieved successfully", data: { ngo } });
});

export const updateNGO = asyncHandler(async (req, res) => {
  const ngo = await modifyNgo(req.params.id, req.body);
  return sendSuccess(res, { message: "NGO updated successfully", data: { ngo } });
});

export const getPendingNGOs = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const page = Math.max(Number(req.query.page) || 1, 1);
  
  const { ngos, total, pages } = await fetchPendingNgos(page, limit);
  
  return sendSuccess(res, {
    message: "Pending NGOs retrieved",
    data: {
      ngos,
      pagination: { total, page, limit, pages },
    },
  });
});

export const verifyNGO = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const ngo = await verifyNgoStatus(req.params.id, status, notes, req.user._id);
  
  return sendSuccess(res, {
    status: 200,
    message: `NGO status updated to ${status} successfully`,
    data: { ngo },
  });
});

export const getVerificationStatus = asyncHandler(async (req, res) => {
  const ngo = await fetchVerificationStatus(req.params.id);
  return sendSuccess(res, {
    message: "Verification status retrieved",
    data: {
      id: ngo._id.toString(),
      organizationName: ngo.organizationName,
      status: ngo.verificationStatus,
      verified: ngo.verified,
      notes: ngo.verificationNotes,
      verifiedAt: ngo.verifiedAt,
    },
  });
});

export const getMyNgoProfile = asyncHandler(async (req, res) => {
  const ngo = await fetchMyNgoProfile(req.user.email);
  return sendSuccess(res, { message: "NGO profile retrieved", data: { ngo } });
});

export const getNgoStatsOverview = asyncHandler(async (req, res) => {
  const stats = await fetchNgoStatsOverview();
  return sendSuccess(res, {
    message: "NGO stats retrieved successfully",
    data: stats,
  });
});
