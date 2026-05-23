import { NGO } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Register a new NGO
 * POST /ngos/register
 */
export const registerNGO = async (req, res, next) => {
  try {
    const {
      organizationName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      registrationNumber,
      ngoType,
      description,
      website,
      socialMedia,
      documents,
    } = req.body;

    // Check if NGO with same email already exists
    const existingNgo = await NGO.findOne({ email: email.toLowerCase() });
    if (existingNgo) {
      return sendError(res, {
        status: 409,
        message: "An NGO with this email already exists",
      });
    }

    // Check registration number uniqueness if provided
    if (registrationNumber) {
      const existingReg = await NGO.findOne({ registrationNumber });
      if (existingReg) {
        return sendError(res, { status: 409, message: "Registration number already in use" });
      }
    }

    // Create new NGO
    const ngo = new NGO({
      organizationName,
      email: email.toLowerCase(),
      phone: phone.trim(),
      address,
      city,
      state,
      pincode,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      registrationNumber,
      ngoType: Array.isArray(ngoType) ? ngoType : [ngoType || "Rescue"],
      description,
      website,
      socialMedia: socialMedia || {},
      documents: documents || {},
      verificationStatus: "pending",
      verified: false,
    });

    await ngo.save();

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
  } catch (err) {
    next(err);
  }
};

/**
 * Get all NGOs (public - only verified)
 * GET /ngos
 */
export const getAllNGOs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const city = req.query.city ? req.query.city.trim() : null;
    const ngoType = req.query.type ? req.query.type.trim() : null;

    const query = {
      isActive: true,
      verified: true,
    };

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (ngoType) {
      query.ngoType = ngoType;
    }

    const ngos = await NGO.find(query)
      .select(
        "organizationName email phone city state address ngoType description verified rating responseTime missionsCompleted latitude longitude"
      )
      .sort({ verified: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return sendSuccess(res, {
      message: "NGOs retrieved successfully",
      data: { ngos },
    });
  } catch (err) {
    console.error("Get NGOs Error:", err);
    return sendError(res, {
      status: 500,
      message: err.message || "Failed to retrieve NGOs",
    });
  }
};

/**
 * Get NGO by ID
 * GET /ngos/:id
 */
export const getNGOById = async (req, res) => {
  try {
    const { id } = req.params;

    const ngo = await NGO.findById(id);
    if (!ngo) {
      return sendError(res, {
        status: 404,
        message: "NGO not found",
      });
    }

    return sendSuccess(res, {
      message: "NGO retrieved successfully",
      data: { ngo },
    });
  } catch (err) {
    console.error("Get NGO Error:", err);
    return sendError(res, {
      status: 500,
      message: err.message || "Failed to retrieve NGO",
    });
  }
};

/**
 * Update NGO profile (by NGO owner)
 * PUT /ngos/:id
 */
export const updateNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent changing email or verification status
    delete updates.email;
    delete updates.verified;
    delete updates.verificationStatus;
    delete updates.verifiedAt;
    delete updates.verifiedBy;

    const ngo = await NGO.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!ngo) {
      return sendError(res, {
        status: 404,
        message: "NGO not found",
      });
    }

    return sendSuccess(res, {
      message: "NGO updated successfully",
      data: { ngo },
    });
  } catch (err) {
    console.error("Update NGO Error:", err);
    return sendError(res, {
      status: 500,
      message: err.message || "Failed to update NGO",
    });
  }
};

/**
 * Get pending NGOs for admin verification
 * GET /ngos/admin/pending
 */
export const getPendingNGOs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const ngos = await NGO.find({
      verificationStatus: { $in: ["pending", "under_review"] }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await NGO.countDocuments({
      verificationStatus: { $in: ["pending", "under_review"] }
    });

    return sendSuccess(res, {
      message: "Pending NGOs retrieved",
      data: {
        ngos,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("Get Pending NGOs Error:", err);
    return sendError(res, {
      status: 500,
      message: err.message || "Failed to retrieve pending NGOs",
    });
  }
};

/**
 * Verify NGO (admin only)
 * POST /ngos/admin/verify/:id
 */
export const verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status || !["under_review", "approved", "rejected", "suspended"].includes(status)) {
      return sendError(res, {
        status: 400,
        message: "A valid status field is required (under_review, approved, rejected, suspended)",
      });
    }

    const ngo = await NGO.findById(id);
    if (!ngo) {
      return sendError(res, {
        status: 404,
        message: "NGO not found",
      });
    }

    ngo.verificationStatus = status;
    ngo.verified = status === "approved";
    
    if (status === "rejected") {
      ngo.rejectionReason = notes || "No reason provided.";
    } else {
      ngo.verificationNotes = notes || "";
    }
    
    ngo.verifiedAt = new Date();
    ngo.verifiedBy = req.user._id;

    await ngo.save();

    return sendSuccess(res, {
      status: 200,
      message: `NGO status updated to ${status} successfully`,
      data: { ngo },
    });
  } catch (err) {
    console.error("Verify NGO Error:", err);
    return sendError(res, {
      status: 500,
      message: err.message || "Failed to verify NGO",
    });
  }
};

/**
 * Get verification status
 * GET /ngos/:id/verification-status
 */
export const getVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const ngo = await NGO.findById(id).select(
      "verificationStatus verified verificationNotes verifiedAt organizationName"
    );

    if (!ngo) {
      return sendError(res, {
        status: 404,
        message: "NGO not found",
      });
    }

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
  } catch (err) {
    console.error("Get Verification Status Error:", err);
    return sendError(res, {
      status: 500,
      message: err.message || "Failed to get verification status",
    });
  }
};

/**
 * Get my NGO profile
 * GET /ngos/my-profile
 */
export const getMyNgoProfile = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ email: req.user.email });
    if (!ngo) {
      return sendError(res, { status: 404, message: "NGO profile not found for this user" });
    }
    return sendSuccess(res, { message: "NGO profile retrieved", data: { ngo } });
  } catch (err) {
    console.error("GET MY NGO PROFILE ERROR:", err);
    return sendError(res, { status: 500, message: err.message || "Failed to fetch profile" });
  }
};

/**
 * Get NGO Stats Overview
 * GET /ngos/stats/overview
 */
export const getNgoStatsOverview = async (req, res) => {
  try {
    const totalVerified = await NGO.countDocuments({ verified: true });
    const uniqueCities = await NGO.distinct("city", { verified: true });
    
    return sendSuccess(res, {
      message: "NGO stats retrieved successfully",
      data: {
        totalVerified,
        citiesCovered: uniqueCities.length,
      },
    });
  } catch (err) {
    console.error("GET NGO STATS ERROR:", err);
    return sendError(res, { status: 500, message: err.message || "Failed to fetch NGO stats" });
  }
};
