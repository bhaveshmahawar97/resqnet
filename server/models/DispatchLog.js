import mongoose from "mongoose";
import { DISPATCH_EVENT_TYPES, USER_ROLES } from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

const dispatchLogSchema = new mongoose.Schema(
  {
    rescueRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RescueRequest",
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: DISPATCH_EVENT_TYPES,
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
    previousState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    ...schemaOptions,
    collection: "dispatchlogs",
  }
);

dispatchLogSchema.index({ rescueRequest: 1, createdAt: -1 });
dispatchLogSchema.index({ eventType: 1, createdAt: -1 });
dispatchLogSchema.index({ actor: 1, createdAt: -1 });

export { dispatchLogSchema };
export default dispatchLogSchema;
