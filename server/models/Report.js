import mongoose from "mongoose";
import { REPORT_STATUSES } from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

/**
 * Future-ready operational reports (admin KPI exports, etc.).
 */
const reportSchema = new mongoose.Schema(
  {
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      trim: true,
      default: "operational",
      index: true,
    },
    status: {
      type: String,
      enum: REPORT_STATUSES,
      default: "draft",
      index: true,
    },
    periodStart: {
      type: Date,
    },
    periodEnd: {
      type: Date,
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    fileUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    ...schemaOptions,
    collection: "reports",
  }
);

reportSchema.index({ reportType: 1, createdAt: -1 });

export { reportSchema };
export default reportSchema;
