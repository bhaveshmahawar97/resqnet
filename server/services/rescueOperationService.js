import mongoose from "mongoose";
import { RescueRequest } from "../models/index.js";
import {
  snapshotRescueState,
  buildTimelineEntry,
  getRescueById,
  findNearestNgo,
  applyStatusUpdate
} from "./rescueService.js";
import { recordDispatchEvent } from "./dispatchService.js";
import {
  notifyNgoAssignment,
  notifyVolunteerAssignment,
  notifyRescueAcceptedByNgo,
  notifyRescueCompleted
} from "./missionNotificationService.js";

export const assignNgoToRescue = async (id, ngoId, user) => {
  const request = await RescueRequest.findById(id);
  if (!request) throw { status: 404, message: "Rescue request not found" };

  const previousState = snapshotRescueState(request);

  if (user.role === "ngo") {
    request.assignedNgo = user._id;
  } else if (user.role === "admin") {
    if (!ngoId || !mongoose.Types.ObjectId.isValid(ngoId)) {
      throw { status: 400, message: "Valid ngoId must be provided" };
    }
    request.assignedNgo = ngoId;
  } else {
    throw { status: 403, message: "Not authorized to assign NGO" };
  }

  request.dispatchStatus = "assigned";
  const entry = buildTimelineEntry("accepted", user, "NGO assigned to mission");
  request.rescueTimeline.push(entry);
  request.statusHistory.push(entry);
  await request.save();

  await recordDispatchEvent({
    rescueRequestId: id,
    eventType: "assignment_change",
    actor: user,
    previousState,
    newState: snapshotRescueState(request),
    note: "NGO assigned",
  });

  const updated = await getRescueById(id);
  await notifyNgoAssignment(updated, request.assignedNgo);
  return updated;
};

export const autoAssignNgoToRescue = async (id, user) => {
  const request = await RescueRequest.findById(id);
  if (!request) throw { status: 404, message: "Rescue request not found" };

  if (["completed", "cancelled"].includes(request.status)) {
    throw { status: 400, message: "Cannot assign NGO to completed or cancelled rescue" };
  }

  const nearestNgo = await findNearestNgo(request);
  if (!nearestNgo) throw { status: 404, message: "No available NGOs found nearby" };

  const previousState = snapshotRescueState(request);
  request.assignedNgo = nearestNgo._id;
  request.status = "assigned";
  request.dispatchStatus = "assigned";
  
  const entry = buildTimelineEntry("assigned", user, "System auto-assigned NGO");
  request.rescueTimeline.push(entry);
  request.statusHistory.push(entry);
  await request.save();

  await recordDispatchEvent({
    rescueRequestId: id,
    eventType: "assignment_change",
    actor: user,
    previousState,
    newState: snapshotRescueState(request),
    note: "NGO auto-assigned",
  });

  const updated = await getRescueById(id);
  await notifyNgoAssignment(updated, request.assignedNgo);
  return updated;
};

export const rejectRescueMissionOperation = async (id, user) => {
  const request = await RescueRequest.findById(id);
  if (!request) throw { status: 404, message: "Rescue request not found" };

  if (user.role === "ngo" && (!request.assignedNgo || !request.assignedNgo.equals(user._id))) {
    throw { status: 403, message: "Not authorized to reject this mission" };
  }

  const previousState = snapshotRescueState(request);
  request.rejectedBy.push(user._id);
  request.assignedNgo = null;
  request.status = "pending";
  request.dispatchStatus = "unassigned";

  const entry = buildTimelineEntry("rejected", user, "NGO rejected mission");
  request.rescueTimeline.push(entry);
  request.statusHistory.push(entry);
  await request.save();

  await recordDispatchEvent({
    rescueRequestId: id,
    eventType: "assignment_change",
    actor: user,
    previousState,
    newState: snapshotRescueState(request),
    note: "Mission rejected by NGO",
  });

  const nearestNgo = await findNearestNgo(request);
  if (nearestNgo) {
    request.assignedNgo = nearestNgo._id;
    request.status = "assigned";
    request.dispatchStatus = "assigned";
    
    const nextEntry = buildTimelineEntry("assigned", user, "System auto-assigned next NGO");
    request.rescueTimeline.push(nextEntry);
    request.statusHistory.push(nextEntry);
    await request.save();
    
    const updated = await getRescueById(id);
    await notifyNgoAssignment(updated, request.assignedNgo);
    return { message: "Mission rejected. Re-assigned to next nearby NGO", data: updated };
  }

  const updated = await getRescueById(id);
  return { message: "Mission rejected. No other NGOs available nearby", data: updated };
};

export const assignVolunteerToRescue = async (id, volunteerId, user) => {
  const request = await RescueRequest.findById(id);
  if (!request) throw { status: 404, message: "Rescue request not found" };

  const previousState = snapshotRescueState(request);

  if (user.role === "volunteer") {
    request.assignedVolunteer = user._id;
  } else if (user.role === "ngo" && request.assignedNgo && request.assignedNgo.equals(user._id)) {
    if (!volunteerId || !mongoose.Types.ObjectId.isValid(volunteerId)) {
      throw { status: 400, message: "Valid volunteerId must be provided" };
    }
    request.assignedVolunteer = volunteerId;
  } else if (user.role === "admin") {
    if (!volunteerId || !mongoose.Types.ObjectId.isValid(volunteerId)) {
      throw { status: 400, message: "Valid volunteerId must be provided" };
    }
    request.assignedVolunteer = volunteerId;
  } else {
    throw { status: 403, message: "Not authorized to assign volunteer" };
  }

  request.status = "volunteer_assigned";
  request.dispatchStatus = "volunteer_assigned";
  const entry = buildTimelineEntry("volunteer_assigned", user, "Volunteer assigned to mission");
  request.rescueTimeline.push(entry);
  request.statusHistory.push(entry);
  await request.save();

  await recordDispatchEvent({
    rescueRequestId: id,
    eventType: "assignment_change",
    actor: user,
    previousState,
    newState: snapshotRescueState(request),
    note: "Volunteer assigned",
  });

  const updated = await getRescueById(id);
  await notifyVolunteerAssignment(updated, request.assignedVolunteer);
  return updated;
};

export const acceptMissionOperation = async (id, user) => {
  const request = await RescueRequest.findById(id);
  if (!request) throw { status: 404, message: "Rescue request not found" };

  if (user.role === "ngo") {
    if (request.assignedNgo && !request.assignedNgo.equals(user._id)) {
      throw { status: 403, message: "Not authorized to accept this NGO mission" };
    }
    request.assignedNgo = user._id;
  } else if (user.role === "volunteer") {
    if (request.assignedVolunteer && !request.assignedVolunteer.equals(user._id)) {
      throw { status: 403, message: "Not authorized to accept this volunteer mission" };
    }
    request.assignedVolunteer = user._id;
  } else if (user.role !== "admin") {
    throw { status: 403, message: "Not authorized to accept missions" };
  }

  const updated = await applyStatusUpdate(request, {
    status: "accepted",
    note: "Mission claimed and accepted",
    user,
  });

  await recordDispatchEvent({
    rescueRequestId: id,
    eventType: "mission_accepted",
    actor: user,
    newState: snapshotRescueState(updated),
  });

  if (user.role === "ngo") {
    await notifyRescueAcceptedByNgo(updated);
  }
  return updated;
};

export const updateMissionStatusOperation = async (id, status, note, user) => {
  if (!status || !["in_progress", "rescued", "completed", "cancelled"].includes(status)) {
    throw { status: 400, message: "Invalid mission status" };
  }

  const request = await RescueRequest.findById(id).populate("assignedNgo assignedVolunteer", "_id");
  if (!request) throw { status: 404, message: "Rescue request not found" };

  const isAssignedNgo = request.assignedNgo?._id?.equals(user._id);
  const isAssignedVolunteer = request.assignedVolunteer?._id?.equals(user._id);
  const isAdmin = user.role === "admin";

  if (!isAdmin && user.role === "ngo" && !isAssignedNgo) {
    throw { status: 403, message: "Not authorized to update this mission" };
  }
  if (!isAdmin && user.role === "volunteer" && !isAssignedVolunteer) {
    throw { status: 403, message: "Not authorized to update this mission" };
  }

  const updated = await applyStatusUpdate(request, {
    status,
    note: note || `Mission marked ${status}`,
    user,
  });

  if (status === "completed") {
    await notifyRescueCompleted(updated);
  }
  return updated;
};

export const updateRescueStatusOperation = async (id, status, note, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { status: 400, message: "Invalid rescue request id" };
  }

  const request = await RescueRequest.findById(id);
  if (!request) throw { status: 404, message: "Rescue request not found" };

  const isAssignedNgo = request.assignedNgo?.equals(user._id);
  const isAssignedVolunteer = request.assignedVolunteer?.equals(user._id);
  const isAdmin = user.role === "admin";

  let authorized = isAdmin;

  if (!authorized && user.role === "ngo") {
    if (status === "accepted" && request.status === "pending") {
      request.assignedNgo = user._id;
      authorized = true;
    } else if (isAssignedNgo) {
      authorized = true;
    }
  }

  if (!authorized && user.role === "volunteer") {
    if (status === "accepted" && request.status === "pending") {
      request.assignedVolunteer = user._id;
      authorized = true;
    } else if (isAssignedVolunteer) {
      authorized = true;
    }
  }

  if (!authorized) {
    throw { status: 403, message: "Not authorized to update this rescue request status" };
  }

  const updated = await applyStatusUpdate(request, {
    status,
    note: note || `Status updated to ${status}`,
    user,
  });

  if (status === "completed") {
    await notifyRescueCompleted(updated);
  }
  return updated;
};
