import mongoose from "mongoose";
import { RescueRequest, User } from "../models/index.js";
import {
  RESCUE_STATUSES,
  SEVERITY_LEVELS,
  DISPATCH_STATUSES,
} from "../constants/enums.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { recordDispatchEvent, recordMissionHistory } from "./dispatchService.js";
import { notifyNewRescue, notifyStatusChange } from "./notificationService.js";

export const RESCUE_POPULATE_FIELDS =
  "fullName email role avatar phone ngoProfile.organizationName volunteerProfile.availability";

export const buildTimelineEntry = (status, user, note = "") => ({
  status,
  note,
  updatedBy: user._id,
  role: user.role,
  createdAt: new Date(),
});

const appendStatusHistory = (request, entry) => {
  request.rescueTimeline.push(entry);
  request.statusHistory.push(entry);
  request.lastStatusChangeAt = new Date();
};

const syncDispatchStatus = (request, status) => {
  if (DISPATCH_STATUSES.includes(status)) {
    request.dispatchStatus = status;
  }
};

export const snapshotRescueState = (request) => ({
  status: request.status,
  dispatchStatus: request.dispatchStatus,
  assignedNgo: request.assignedNgo,
  assignedVolunteer: request.assignedVolunteer,
  missionPriority: request.missionPriority,
});

export const getRescueById = async (id, populate = true) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  let query = RescueRequest.findById(id);
  if (populate) {
    query = query.populate(
      "createdBy assignedNgo assignedVolunteer acceptedBy",
      RESCUE_POPULATE_FIELDS
    );
  }
  return query;
};

export const createRescue = async ({ body, user, imageUrls = [] }) => {
  const {
    animalType,
    condition,
    description,
    severity,
    latitude,
    longitude,
    city,
    state,
    address,
    contactPhone,
  } = body;

  const timelineEntry = buildTimelineEntry("pending", user, "Rescue request created");

  const rescue = await RescueRequest.create({
    animalType: String(animalType).trim(),
    condition: String(condition).trim(),
    description: String(description).trim(),
    severity,
    missionPriority: severity,
    images: imageUrls,
    latitude: latitude !== undefined && latitude !== "" ? Number(latitude) : undefined,
    longitude: longitude !== undefined && longitude !== "" ? Number(longitude) : undefined,
    city: city ? String(city).trim() : "",
    state: state ? String(state).trim() : "",
    address: String(address).trim(),
    contactPhone: contactPhone ? String(contactPhone).trim() : "",
    createdBy: user._id,
    dispatchStatus: "unassigned",
    rescueTimeline: [timelineEntry],
    statusHistory: [timelineEntry],
  });

  await User.findByIdAndUpdate(user._id, {
    $inc: { "missionStats.rescuesCreated": 1 },
  });

  await recordDispatchEvent({
    rescueRequestId: rescue._id,
    eventType: "rescue_created",
    actor: user,
    newState: snapshotRescueState(rescue),
    note: "Rescue request created",
  });

  await recordMissionHistory({
    rescueRequestId: rescue._id,
    actor: user,
    action: "rescue_created",
    toStatus: "pending",
    note: timelineEntry.note,
  });

  notifyNewRescue(rescue, user).catch((err) =>
    console.error("NOTIFY NEW RESCUE ERROR:", err.message)
  );

  return getRescueById(rescue._id);
};

export const applyStatusUpdate = async (request, { status, note, user }) => {
  const previousState = snapshotRescueState(request);
  const fromStatus = request.status;

  request.status = status;
  syncDispatchStatus(request, status);

  if (status === "accepted") {
    request.acceptedAt = request.acceptedAt || new Date();
    request.acceptedBy = user._id;
    await User.findByIdAndUpdate(user._id, {
      $inc: { "missionStats.missionsAccepted": 1 },
    });
  }

  if (status === "completed") {
    request.completedAt = new Date();
    await User.findByIdAndUpdate(user._id, {
      $inc: { "missionStats.missionsCompleted": 1 },
    });
  }

  const entry = buildTimelineEntry(
    status,
    user,
    note ? String(note).trim() : `Status updated to ${status}`
  );
  appendStatusHistory(request, entry);

  await request.save();

  await recordDispatchEvent({
    rescueRequestId: request._id,
    eventType: "status_change",
    actor: user,
    previousState,
    newState: snapshotRescueState(request),
    note: entry.note,
  });

  await recordMissionHistory({
    rescueRequestId: request._id,
    actor: user,
    action: "status_change",
    fromStatus,
    toStatus: status,
    note: entry.note,
  });

  notifyStatusChange(request, user, status).catch((err) =>
    console.error("NOTIFY STATUS CHANGE ERROR:", err.message)
  );

  return getRescueById(request._id);
};

export const buildRoleQueryForAll = (user, baseQuery = {}) => {
  const query = { ...baseQuery };

  if (user.role === "ngo") {
    const ngoFilter = {
      $or: [{ status: "pending" }, { assignedNgo: user._id }],
    };
    return Object.keys(query).length > 0 ? { $and: [query, ngoFilter] } : ngoFilter;
  }

  if (user.role === "volunteer") {
    query.$or = [{ assignedVolunteer: user._id }, { dispatchStatus: "unassigned" }];
  }

  if (user.role === "user") {
    query.createdBy = user._id;
  }

  return query;
};

export const buildRoleQueryForMy = (user) => {
  if (user.role === "user") return { createdBy: user._id };
  if (user.role === "ngo") return { assignedNgo: user._id };
  if (user.role === "volunteer") return { assignedVolunteer: user._id };
  return {};
};

export const listRescues = async (query, { page, limit, skip, sort, populate = true }) => {
  let finder = RescueRequest.find(query);
  if (populate) {
    finder = finder.populate(
      "createdBy assignedNgo assignedVolunteer acceptedBy",
      RESCUE_POPULATE_FIELDS
    );
  }

  const [data, total] = await Promise.all([
    finder.sort(sort).limit(limit).skip(skip).lean(),
    RescueRequest.countDocuments(query),
  ]);

  return {
    data,
    pagination: buildPaginationMeta(page, limit, total),
  };
};

export const getRescueStatsAggregate = async () => {
  const stats = await RescueRequest.aggregate([
    {
      $facet: {
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { _id: 1 } }],
        bySeverity: [{ $group: { _id: "$severity", count: { $sum: 1 } } }, { $sort: { _id: 1 } }],
        totalRescues: [{ $count: "count" }],
        pendingRescues: [{ $match: { status: "pending" } }, { $count: "count" }],
        completedRescues: [{ $match: { status: "completed" } }, { $count: "count" }],
        criticalRescues: [{ $match: { severity: "critical" } }, { $count: "count" }],
      },
    },
  ]);

  const facet = stats[0] || {};

  return {
    byStatus: (facet.byStatus || []).reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    bySeverity: (facet.bySeverity || []).reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    total: facet.totalRescues?.[0]?.count || 0,
    pending: facet.pendingRescues?.[0]?.count || 0,
    completed: facet.completedRescues?.[0]?.count || 0,
    critical: facet.criticalRescues?.[0]?.count || 0,
  };
};

export { RESCUE_STATUSES, SEVERITY_LEVELS, parsePagination };
