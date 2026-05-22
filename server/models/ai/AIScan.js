import mongoose from "mongoose";
import { AI_SCAN_STATUSES, SEVERITY_LEVELS } from "../../constants/enums.js";
import { schemaOptions } from "../plugins/timestamps.js";

const aiScanSchema = new mongoose.Schema(
  {
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    relatedRescue: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    imagePublicId: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: AI_SCAN_STATUSES,
      default: "pending",
      index: true,
    },
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    predictedSeverity: {
      type: String,
      enum: SEVERITY_LEVELS,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },
    recommendations: {
      type: [String],
      default: [],
    },
    provider: {
      type: String,
      trim: true,
      default: "",
    },
    providerMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    ...schemaOptions,
    collection: "ai_scans",
  }
);

aiScanSchema.index({ scannedBy: 1, createdAt: -1 });
aiScanSchema.index({ status: 1, createdAt: -1 });

export { aiScanSchema };
