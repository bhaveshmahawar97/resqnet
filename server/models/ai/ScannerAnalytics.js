import mongoose from "mongoose";
import { ANALYTICS_PERIODS } from "../../constants/enums.js";
import { schemaOptions } from "../plugins/timestamps.js";

/**
 * Scanner usage analytics — aggregated scan KPIs for AI dashboard.
 */
const scannerAnalyticsSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      enum: ANALYTICS_PERIODS,
      default: "daily",
      index: true,
    },
    periodStart: {
      type: Date,
      required: true,
      index: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    totalScans: {
      type: Number,
      default: 0,
    },
    completedScans: {
      type: Number,
      default: 0,
    },
    failedScans: {
      type: Number,
      default: 0,
    },
    avgConfidence: {
      type: Number,
      default: 0,
    },
    severityBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    ...schemaOptions,
    collection: "scanner_analytics",
  }
);

scannerAnalyticsSchema.index({ period: 1, periodStart: -1 });

export { scannerAnalyticsSchema };
export default scannerAnalyticsSchema;
