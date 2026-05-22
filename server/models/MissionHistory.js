import mongoose from "mongoose";
import { RESCUE_STATUSES, USER_ROLES } from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

/**
 * Mission-level history for analytics and audit (complements dispatchlogs).
 */
const missionHistorySchema = new mongoose.Schema(
  {
    rescueRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RescueRequest",
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    actorRole: {
      type: String,
      enum: USER_ROLES,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    fromStatus: {
      type: String,
      enum: RESCUE_STATUSES,
    },
    toStatus: {
      type: String,
      enum: RESCUE_STATUSES,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    durationMs: {
      type: Number,
      min: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    ...schemaOptions,
    collection: "missionhistory",
  }
);

missionHistorySchema.index({ rescueRequest: 1, createdAt: -1 });
missionHistorySchema.index({ actor: 1, createdAt: -1 });

export { missionHistorySchema };
export default missionHistorySchema;
