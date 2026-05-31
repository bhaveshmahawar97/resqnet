import {
  listNgos,
  listVolunteers,
  resolveCityFromQuery,
} from "../services/userDirectoryService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/index.js";
import { formatAuthUser } from "../services/authService.js";

export const getNgoDirectory = asyncHandler(async (req, res) => {
  const city = resolveCityFromQuery({
    city: req.query.city,
    address: req.query.address,
  });
  const latitude = req.query.latitude ? Number(req.query.latitude) : null;
  const longitude = req.query.longitude ? Number(req.query.longitude) : null;

  const ngos = await listNgos({
    city,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    limit: Math.min(Number(req.query.limit) || 24, 50),
    sort: req.query.sort || "verified",
  });

  return sendSuccess(res, {
    message: "NGO directory loaded",
    data: { ngos, city: city || null },
  });
});

export const getVolunteerDirectory = asyncHandler(async (req, res) => {
  const city = resolveCityFromQuery({
    city: req.query.city,
    address: req.query.address,
  });

  const volunteers = await listVolunteers({
    city,
    limit: Math.min(Number(req.query.limit) || 30, 50),
  });

  return sendSuccess(res, {
    message: "Volunteer directory loaded",
    data: { volunteers, city: city || null },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.role) query.role = req.query.role;
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    query.$or = [{ fullName: regex }, { email: regex }];
  }

  const [users, total] = await Promise.all([
    User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  return sendSuccess(res, {
    message: "Users retrieved successfully",
    data: {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "volunteer", "ngo", "admin"].includes(role)) {
    return sendError(res, { status: 400, message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return sendError(res, { status: 404, message: "User not found" });
  }

  return sendSuccess(res, { message: "User role updated", data: user });
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    return sendError(res, { status: 404, message: "User not found" });
  }

  user.isActive = !user.isActive;
  await user.save();

  return sendSuccess(res, { 
    message: `User account ${user.isActive ? "activated" : "deactivated"}`, 
    data: { id: user._id, isActive: user.isActive } 
  });
});

export const toggleAvailability = asyncHandler(async (req, res) => {
  const user = req.user;
  
  if (!user.volunteerProfile) {
    user.volunteerProfile = { availability: "available" };
  }

  // Toggle between available and unavailable
  const newStatus = user.volunteerProfile.availability === "available" ? "unavailable" : "available";
  user.volunteerProfile.availability = newStatus;
  
  await user.save();

  return sendSuccess(res, {
    message: `Availability updated to ${newStatus}`,
    data: { availability: newStatus }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  
  if (req.body.fullName) user.fullName = req.body.fullName;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.age !== undefined) {
    const parsedAge = parseInt(req.body.age, 10);
    user.age = isNaN(parsedAge) ? null : parsedAge;
  }

  if (req.file) {
    user.avatar = req.file.path;
    user.avatarPublicId = req.file.filename;
  }

  await user.save();

  return sendSuccess(res, {
    message: "Profile updated successfully",
    data: { user: formatAuthUser(user) }
  });
});
