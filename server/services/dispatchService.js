import { DispatchLog, MissionHistory } from "../models/index.js";

/**
 * Records operational dispatch events for audit + future realtime feeds.
 */
export const recordDispatchEvent = async ({
  rescueRequestId,
  eventType,
  actor,
  previousState = null,
  newState = null,
  note = "",
  metadata = {},
}) => {
  const log = await DispatchLog.create({
    rescueRequest: rescueRequestId,
    eventType,
    actor: actor?._id || actor || null,
    actorRole: actor?.role,
    previousState,
    newState,
    note,
    metadata,
  });

  return log;
};

/**
 * Records mission status transitions for analytics.
 */
export const recordMissionHistory = async ({
  rescueRequestId,
  actor,
  action,
  fromStatus,
  toStatus,
  note = "",
  durationMs,
  metadata = {},
}) => {
  return MissionHistory.create({
    rescueRequest: rescueRequestId,
    actor: actor?._id || actor || null,
    actorRole: actor?.role,
    action,
    fromStatus,
    toStatus,
    note,
    durationMs,
    metadata,
  });
};

export const getDispatchLogsForRescue = async (rescueRequestId, { limit = 50 } = {}) => {
  return DispatchLog.find({ rescueRequest: rescueRequestId })
    .populate("actor", "fullName email role avatar")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export default {
  recordDispatchEvent,
  recordMissionHistory,
  getDispatchLogsForRescue,
};
