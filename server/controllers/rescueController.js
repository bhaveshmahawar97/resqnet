import mongoose from "mongoose";
import { RescueRequest } from "../models/index.js";
import {
  createRescue,
  getRescueById,
  applyStatusUpdate,
  buildRoleQueryForAll,
  buildRoleQueryForMy,
  listRescues,
  getRescueStatsAggregate,
  buildTimelineEntry,
  RESCUE_STATUSES,
  SEVERITY_LEVELS,
  parsePagination,
  snapshotRescueState,
} from "../services/rescueService.js";
import { recordDispatchEvent, recordMissionHistory } from "../services/dispatchService.js";
import {
  notifyNgoAssignment,
  notifyVolunteerAssignment,
  notifyRescueAcceptedByNgo,
  notifyRescueCompleted,
} from "../services/missionNotificationService.js";
import {
  validateCreateRescueBody,
  validateStatusUpdate,
  extractUploadedImageUrls,
  parseImageField,
} from "../validators/rescueValidator.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const createRescueRequest = async (req, res) => {
  try {
    const validation = validateCreateRescueBody(req.body);
    if (!validation.valid) {
      return sendError(res, {
        status: 400,
        message: validation.errors.join("; "),
      });
    }

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
  } catch (error) {
    console.error("CREATE RESCUE ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to create rescue request",
      error,
    });
  }
};

export const getAllRescueRequests = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("GET ALL RESCUE REQUESTS ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to retrieve rescue requests",
      error,
    });
  }
};

export const getSingleRescueRequest = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("GET SINGLE RESCUE REQUEST ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to retrieve rescue request",
      error,
    });
  }
};

export const assignNgo = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngoId } = req.body;
    const request = await RescueRequest.findById(id);
    if (!request) return sendError(res, { status: 404, message: "Rescue request not found" });

    const previousState = snapshotRescueState(request);

    if (req.user.role === "ngo") {
      request.assignedNgo = req.user._id;
    } else if (req.user.role === "admin") {
      if (!ngoId || !mongoose.Types.ObjectId.isValid(ngoId)) {
        return sendError(res, { status: 400, message: "Valid ngoId must be provided" });
      }
      request.assignedNgo = ngoId;
    } else {
      return sendError(res, { status: 403, message: "Not authorized to assign NGO" });
    }

    request.dispatchStatus = "assigned";
    const entry = buildTimelineEntry("accepted", req.user, "NGO assigned to mission");
    request.rescueTimeline.push(entry);
    request.statusHistory.push(entry);
    await request.save();

    await recordDispatchEvent({
      rescueRequestId: id,
      eventType: "assignment_change",
      actor: req.user,
      previousState,
      newState: snapshotRescueState(request),
      note: "NGO assigned",
    });

    const updated = await getRescueById(id);
    await notifyNgoAssignment(updated, request.assignedNgo);

    return sendSuccess(res, { message: "NGO assigned successfully", data: updated });
  } catch (error) {
    console.error("ASSIGN NGO ERROR:", error);
    return sendError(res, { status: 500, message: error.message || "Unable to assign NGO", error });
  }
};

export const assignVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteerId } = req.body;
    const request = await RescueRequest.findById(id);
    if (!request) return sendError(res, { status: 404, message: "Rescue request not found" });

    const previousState = snapshotRescueState(request);

    if (req.user.role === "volunteer") {
      request.assignedVolunteer = req.user._id;
    } else if (req.user.role === "admin") {
      if (!volunteerId || !mongoose.Types.ObjectId.isValid(volunteerId)) {
        return sendError(res, { status: 400, message: "Valid volunteerId must be provided" });
      }
      request.assignedVolunteer = volunteerId;
    } else {
      return sendError(res, { status: 403, message: "Not authorized to assign volunteer" });
    }

    request.dispatchStatus =
      request.dispatchStatus === "accepted" ? "accepted" : "assigned";
    const entry = buildTimelineEntry("accepted", req.user, "Volunteer assigned to mission");
    request.rescueTimeline.push(entry);
    request.statusHistory.push(entry);
    await request.save();

    await recordDispatchEvent({
      rescueRequestId: id,
      eventType: "assignment_change",
      actor: req.user,
      previousState,
      newState: snapshotRescueState(request),
      note: "Volunteer assigned",
    });

    const updated = await getRescueById(id);
    await notifyVolunteerAssignment(updated, request.assignedVolunteer);

    return sendSuccess(res, { message: "Volunteer assigned successfully", data: updated });
  } catch (error) {
    console.error("ASSIGN VOLUNTEER ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to assign volunteer",
      error,
    });
  }
};

export const acceptRescueMission = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RescueRequest.findById(id);
    if (!request) return sendError(res, { status: 404, message: "Rescue request not found" });

    if (req.user.role === "ngo") {
      if (request.assignedNgo && !request.assignedNgo.equals(req.user._id)) {
        return sendError(res, { status: 403, message: "Not authorized to accept this NGO mission" });
      }
      request.assignedNgo = req.user._id;
    } else if (req.user.role === "volunteer") {
      if (request.assignedVolunteer && !request.assignedVolunteer.equals(req.user._id)) {
        return sendError(res, {
          status: 403,
          message: "Not authorized to accept this volunteer mission",
        });
      }
      request.assignedVolunteer = req.user._id;
    } else if (req.user.role !== "admin") {
      return sendError(res, { status: 403, message: "Not authorized to accept missions" });
    }

    const updated = await applyStatusUpdate(request, {
      status: "accepted",
      note: "Mission claimed and accepted",
      user: req.user,
    });

    await recordDispatchEvent({
      rescueRequestId: id,
      eventType: "mission_accepted",
      actor: req.user,
      newState: snapshotRescueState(updated),
    });

    if (req.user.role === "ngo") {
      await notifyRescueAcceptedByNgo(updated);
    }

    return sendSuccess(res, { message: "Mission accepted successfully", data: updated });
  } catch (error) {
    console.error("ACCEPT MISSION ERROR:", error);
    return sendError(res, { status: 500, message: error.message || "Unable to accept mission", error });
  }
};

export const updateMissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status || !["in_progress", "rescued", "completed", "cancelled"].includes(status)) {
      return sendError(res, { status: 400, message: "Invalid mission status" });
    }

    const request = await RescueRequest.findById(id).populate(
      "assignedNgo assignedVolunteer",
      "_id"
    );
    if (!request) return sendError(res, { status: 404, message: "Rescue request not found" });

    const isAssignedNgo = request.assignedNgo?._id?.equals(req.user._id);
    const isAssignedVolunteer = request.assignedVolunteer?._id?.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && req.user.role === "ngo" && !isAssignedNgo) {
      return sendError(res, { status: 403, message: "Not authorized to update this mission" });
    }
    if (!isAdmin && req.user.role === "volunteer" && !isAssignedVolunteer) {
      return sendError(res, { status: 403, message: "Not authorized to update this mission" });
    }

    const updated = await applyStatusUpdate(request, {
      status,
      note: note || `Mission marked ${status}`,
      user: req.user,
    });

    if (status === "completed") {
      await notifyRescueCompleted(updated);
    }

    return sendSuccess(res, { message: "Mission status updated", data: updated });
  } catch (error) {
    console.error("UPDATE MISSION STATUS ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to update mission status",
      error,
    });
  }
};

export const getAssignedRescues = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("GET ASSIGNED RESCUES ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to retrieve assigned missions",
      error,
    });
  }
};

export const updateRescueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, { status: 400, message: "Invalid rescue request id" });
    }

    const statusCheck = validateStatusUpdate(status);
    if (!statusCheck.valid) {
      return sendError(res, { status: 400, message: statusCheck.message });
    }

    const request = await RescueRequest.findById(id);
    if (!request) return sendError(res, { status: 404, message: "Rescue request not found" });

    const isAssignedNgo = request.assignedNgo?.equals(req.user._id);
    const isAssignedVolunteer = request.assignedVolunteer?.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    let authorized = isAdmin;

    if (!authorized && req.user.role === "ngo") {
      if (status === "accepted" && request.status === "pending") {
        request.assignedNgo = req.user._id;
        authorized = true;
      } else if (isAssignedNgo) {
        authorized = true;
      }
    }

    if (!authorized && req.user.role === "volunteer") {
      if (status === "accepted" && request.status === "pending") {
        request.assignedVolunteer = req.user._id;
        authorized = true;
      } else if (isAssignedVolunteer) {
        authorized = true;
      }
    }

    if (!authorized) {
      return sendError(res, {
        status: 403,
        message: "Not authorized to update this rescue request status",
      });
    }

    const updated = await applyStatusUpdate(request, {
      status,
      note: note || `Status updated to ${status}`,
      user: req.user,
    });

    if (status === "completed") {
      await notifyRescueCompleted(updated);
    }

    return sendSuccess(res, {
      message: "Rescue status updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE RESCUE STATUS ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to update rescue status",
      error,
    });
  }
};

export const getMyRescueRequests = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("GET MY RESCUE REQUESTS ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to retrieve rescue requests",
      error,
    });
  }
};

export const getRescueStats = async (req, res) => {
  try {
    const data = await getRescueStatsAggregate();

    return sendSuccess(res, {
      message: "Rescue statistics retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("GET RESCUE STATS ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to retrieve rescue statistics",
      error,
    });
  }
};

export const getCriticalRescues = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("GET CRITICAL RESCUES ERROR:", error);
    return sendError(res, {
      status: 500,
      message: error.message || "Unable to retrieve critical rescues",
      error,
    });
  }
};
