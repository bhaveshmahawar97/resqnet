import mongoose from "mongoose";
import { ANALYTICS_PERIODS } from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

/**
 * Lightweight analytics snapshots — populated by future batch jobs / admin tools.
 */
const analyticsSchema = new mongoose.Schema(
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
    metrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    rescueKpis: {
      total: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      critical: { type: Number, default: 0 },
    },
    generatedBy: {
      type: String,
      default: "system",
    },
  },
  {
    ...schemaOptions,
    collection: "analytics",
  }
);

analyticsSchema.index({ period: 1, periodStart: -1 });

export { analyticsSchema };
export default analyticsSchema;
