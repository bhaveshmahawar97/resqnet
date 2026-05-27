import { NGO, User } from "../models/index.js";

export const createNgo = async (data) => {
  const { email, registrationNumber } = data;

  const existingNgo = await NGO.findOne({ email: email.toLowerCase() });
  if (existingNgo) {
    throw { status: 409, message: "An NGO with this email already exists" };
  }

  if (registrationNumber) {
    const existingReg = await NGO.findOne({ registrationNumber });
    if (existingReg) {
      throw { status: 409, message: "Registration number already in use" };
    }
  }

  // Sanitize coordinates: only include finite numbers
  const latitude = Number.isFinite(Number(data.latitude)) ? Number(data.latitude) : undefined;
  const longitude = Number.isFinite(Number(data.longitude)) ? Number(data.longitude) : undefined;

  const ngoPayload = {
    ...data,
    email: email.toLowerCase(),
    phone: data.phone.trim(),
    ngoType: Array.isArray(data.ngoType) ? data.ngoType : [data.ngoType || "Rescue"],
    socialMedia: data.socialMedia || {},
    documents: data.documents || {},
    verificationStatus: "pending",
    verified: false,
  };

  if (latitude !== undefined) ngoPayload.latitude = latitude;
  if (longitude !== undefined) ngoPayload.longitude = longitude;

  const ngo = new NGO(ngoPayload);

  await ngo.save();
  return ngo;
};

export const fetchAllNgos = async (queryFilters, limit = 50) => {
  const query = { isActive: true, verified: true };
  if (queryFilters.city) query.city = { $regex: queryFilters.city, $options: "i" };
  if (queryFilters.ngoType) query.ngoType = queryFilters.ngoType;

  return NGO.find(query)
    .select("organizationName email phone city state address ngoType description verified rating responseTime missionsCompleted latitude longitude")
    .sort({ verified: -1, rating: -1, createdAt: -1 })
    .limit(limit)
    .lean();
};

export const fetchNgoById = async (id) => {
  const ngo = await NGO.findById(id);
  if (!ngo) throw { status: 404, message: "NGO not found" };
  return ngo;
};

export const modifyNgo = async (id, updates) => {
  delete updates.email;
  delete updates.verified;
  delete updates.verificationStatus;
  delete updates.verifiedAt;
  delete updates.verifiedBy;

  const ngo = await NGO.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!ngo) throw { status: 404, message: "NGO not found" };
  return ngo;
};

export const fetchPendingNgos = async (page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  const query = { verificationStatus: { $in: ["pending", "under_review"] } };

  const [ngos, total] = await Promise.all([
    NGO.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    NGO.countDocuments(query)
  ]);

  return { ngos, total, pages: Math.ceil(total / limit) };
};

export const verifyNgoStatus = async (id, status, notes, adminId) => {
  if (!status || !["under_review", "approved", "rejected", "suspended"].includes(status)) {
    throw { status: 400, message: "A valid status field is required (under_review, approved, rejected, suspended)" };
  }

  const ngo = await NGO.findById(id);
  if (!ngo) throw { status: 404, message: "NGO not found" };

  ngo.verificationStatus = status;
  ngo.verified = status === "approved";
  
  if (status === "rejected") {
    ngo.rejectionReason = notes || "No reason provided.";
  } else {
    ngo.verificationNotes = notes || "";
  }
  
  ngo.verifiedAt = new Date();
  ngo.verifiedBy = adminId;

  await ngo.save();
  // If NGO approved, propagate verification to the User record (if any)
  try {
    if (status === "approved") {
      // Link NGO details into the user's ngoProfile so middleware and UI work
      await User.findOneAndUpdate(
        { email: ngo.email.toLowerCase() },
        {
          role: "ngo",
          ngoProfile: {
            organizationName: ngo.organizationName || "",
            city: ngo.city || "",
            latitude: ngo.latitude ?? null,
            longitude: ngo.longitude ?? null,
            registrationId: ngo.registrationNumber || ngo.registrationId || "",
            serviceAreas: ngo.serviceAreas || [],
            description: ngo.description || "",
            website: ngo.website || "",
            verified: true,
          },
        },
        { new: true }
      );
    } else if (status === "rejected") {
      // mark any matching user ngoProfile as unverified
      await User.findOneAndUpdate(
        { email: ngo.email.toLowerCase() },
        { $set: { "ngoProfile.verified": false } },
        { new: true }
      );
    }
  } catch (err) {
    // non-fatal: log and continue (controller will still return success)
    console.error("Failed to sync NGO verification to user record:", err.message || err);
  }
  return ngo;
};

export const fetchVerificationStatus = async (id) => {
  const ngo = await NGO.findById(id).select(
    "verificationStatus verified verificationNotes verifiedAt organizationName"
  );
  if (!ngo) throw { status: 404, message: "NGO not found" };
  return ngo;
};

export const fetchMyNgoProfile = async (email) => {
  const ngo = await NGO.findOne({ email });
  if (!ngo) throw { status: 404, message: "NGO profile not found for this user" };
  return ngo;
};

export const fetchNgoStatsOverview = async () => {
  const [totalVerified, uniqueCities] = await Promise.all([
    NGO.countDocuments({ verified: true }),
    NGO.distinct("city", { verified: true })
  ]);
  return { totalVerified, citiesCovered: uniqueCities.length };
};
