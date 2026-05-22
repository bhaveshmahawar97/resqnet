import mongoose from "mongoose";
import {
  RESCUE_STATUSES,
  DISPATCH_STATUSES,
  SEVERITY_LEVELS,
  USER_ROLES,
} from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: RESCUE_STATUSES,
      required: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: USER_ROLES,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const rescueRequestSchema = new mongoose.Schema(
  {
    animalType: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: SEVERITY_LEVELS,
      default: "medium",
      required: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: RESCUE_STATUSES,
      default: "pending",
      required: true,
      index: true,
    },
    dispatchStatus: {
      type: String,
      enum: DISPATCH_STATUSES,
      default: "unassigned",
      required: true,
      index: true,
    },
    missionPriority: {
      type: String,
      enum: SEVERITY_LEVELS,
      default: "medium",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedNgo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    lastStatusChangeAt: {
      type: Date,
      default: Date.now,
    },
    rescueTimeline: {
      type: [timelineEntrySchema],
      default: [],
    },
    statusHistory: {
      type: [timelineEntrySchema],
      default: [],
    },
  },
  {
    ...schemaOptions,
    collection: "rescuerequests",
  }
);

rescueRequestSchema.index({ status: 1, createdAt: -1 });
rescueRequestSchema.index({ severity: 1, createdAt: -1 });
rescueRequestSchema.index({ missionPriority: 1, createdAt: -1 });
rescueRequestSchema.index({ createdBy: 1, createdAt: -1 });
rescueRequestSchema.index({ assignedNgo: 1, createdAt: -1 });
rescueRequestSchema.index({ assignedVolunteer: 1, createdAt: -1 });
rescueRequestSchema.index({ status: 1, severity: 1 });
rescueRequestSchema.index({ dispatchStatus: 1, missionPriority: -1, createdAt: -1 });

export { rescueRequestSchema };
export default rescueRequestSchema;
