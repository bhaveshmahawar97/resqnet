import mongoose from "mongoose";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createRescue,
  getRescueById,
  buildRoleQueryForAll,
  buildRoleQueryForMy,
  listRescues,
  getRescueStatsAggregate,
  RESCUE_STATUSES,
  SEVERITY_LEVELS,
  parsePagination
} from "../services/rescueService.js";
import {
  assignNgoToRescue,
  autoAssignNgoToRescue,
  rejectRescueMissionOperation,
  assignVolunteerToRescue,
  acceptMissionOperation,
  updateMissionStatusOperation,
  updateRescueStatusOperation
} from "../services/rescueOperationService.js";
import {
  extractUploadedImageUrls,
  parseImageField,
} from "../validators/rescueValidator.js";

export const createRescueRequest = asyncHandler(async (req, res) => {
  const uploaded = extractUploadedImageUrls(req.files);
  const fallback = parseImageField(req.body.images);
  const imageUrls = uploaded.length > 0 ? uploaded : fallback;

  const rescue = await createRescue({
    body: req.body,
    user: req.user,
    imageUrls,
  });

  return sendSuccess(res, {
    status: 201,
    message: "Rescue request created successfully",
    data: rescue,
  });
});

export const getAllRescueRequests = asyncHandler(async (req, res) => {
  const { status, severity, search, sortBy } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  let query = {};
  if (status && RESCUE_STATUSES.includes(status)) query.status = status;
  if (severity && SEVERITY_LEVELS.includes(severity)) query.severity = severity;

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [
      { animalType: regex },
      { condition: regex },
      { description: regex },
      { address: regex },
    ];
  }

  query = buildRoleQueryForAll(req.user, query);

  let sort = { createdAt: -1 };
  if (sortBy === "severity-high") sort = { severity: 1, createdAt: -1 };
  if (sortBy === "status") sort = { status: 1, createdAt: -1 };

  const result = await listRescues(query, { page, limit, skip, sort });

  return sendSuccess(res, {
    message: "Rescue requests retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getSingleRescueRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendError(res, { status: 400, message: "Invalid rescue request id" });
  }

  const request = await getRescueById(id);
  if (!request) {
    return sendError(res, { status: 404, message: "Rescue request not found" });
  }

  const isOwner = request.createdBy?._id?.equals(req.user._id);
  const isAssignedNgo = request.assignedNgo?._id?.equals(req.user._id);
  const isAssignedVolunteer = request.assignedVolunteer?._id?.equals(req.user._id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAssignedNgo && !isAssignedVolunteer && !isAdmin) {
    return sendError(res, { status: 403, message: "Access denied to this rescue request" });
  }

  return sendSuccess(res, {
    message: "Rescue request retrieved successfully",
    data: request,
  });
});

export const assignNgo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { ngoId } = req.body;
  const updated = await assignNgoToRescue(id, ngoId, req.user);
  return sendSuccess(res, { message: "NGO assigned successfully", data: updated });
});

export const autoAssignNgo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await autoAssignNgoToRescue(id, req.user);
  return sendSuccess(res, { message: "NGO auto-assigned successfully", data: updated });
});

export const rejectRescueMission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await rejectRescueMissionOperation(id, req.user);
  return sendSuccess(res, result);
});

export const assignVolunteer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { volunteerId } = req.body;
  const updated = await assignVolunteerToRescue(id, volunteerId, req.user);
  return sendSuccess(res, { message: "Volunteer assigned successfully", data: updated });
});

export const acceptRescueMission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await acceptMissionOperation(id, req.user);
  return sendSuccess(res, { message: "Mission accepted successfully", data: updated });
});

export const updateMissionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const updated = await updateMissionStatusOperation(id, status, note, req.user);
  return sendSuccess(res, { message: "Mission status updated", data: updated });
});

export const getAssignedRescues = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  let query = {};

  if (req.user.role === "ngo") {
    query.assignedNgo = req.user._id;
  } else if (req.user.role === "volunteer") {
    query.assignedVolunteer = req.user._id;
  } else if (req.user.role === "admin") {
    query.$or = [{ assignedNgo: { $ne: null } }, { assignedVolunteer: { $ne: null } }];
  } else {
    return sendError(res, {
      status: 403,
      message: "Only operational users can view assigned missions",
    });
  }

  const result = await listRescues(query, { page, limit, skip, sort: { createdAt: -1 } });

  return sendSuccess(res, {
    message: "Assigned missions retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const updateRescueStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const updated = await updateRescueStatusOperation(id, status, note, req.user);
  return sendSuccess(res, {
    message: "Rescue status updated successfully",
    data: updated,
  });
});

export const getMyRescueRequests = asyncHandler(async (req, res) => {
  const { status, severity, sortBy } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const query = buildRoleQueryForMy(req.user);
  if (status && RESCUE_STATUSES.includes(status)) query.status = status;
  if (severity && SEVERITY_LEVELS.includes(severity)) query.severity = severity;

  let sort = { createdAt: -1 };
  if (sortBy === "severity-high") sort = { severity: 1, createdAt: -1 };
  if (sortBy === "status") sort = { status: 1, createdAt: -1 };
  if (sortBy === "oldest") sort = { createdAt: 1 };

  const result = await listRescues(query, { page, limit, skip, sort });

  return sendSuccess(res, {
    message: "User rescue requests retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

export const getRescueStats = asyncHandler(async (req, res) => {
  const data = await getRescueStatsAggregate();

  return sendSuccess(res, {
    message: "Rescue statistics retrieved successfully",
    data,
  });
});

export const getCriticalRescues = asyncHandler(async (req, res) => {
  if (!["ngo", "volunteer", "admin"].includes(req.user.role)) {
    return sendError(res, {
      status: 403,
      message: "Only operational roles can access critical rescues",
    });
  }

  const { page, limit, skip } = parsePagination(req.query, { maxLimit: 50, defaultLimit: 10 });

  let query = {
    severity: "critical",
    status: { $ne: "completed" },
  };

  if (req.user.role === "ngo") {
    query.$or = [{ status: "pending" }, { assignedNgo: req.user._id }];
  } else if (req.user.role === "volunteer") {
    query.assignedVolunteer = req.user._id;
  }

  const result = await listRescues(query, { page, limit, skip, sort: { createdAt: -1 } });

  return sendSuccess(res, {
    message: "Critical rescue requests retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});
