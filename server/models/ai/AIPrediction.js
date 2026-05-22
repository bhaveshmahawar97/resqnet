import mongoose from "mongoose";
import { SEVERITY_LEVELS } from "../../constants/enums.js";
import { schemaOptions } from "../plugins/timestamps.js";

/**
 * AI prediction records — future ML pipeline output storage.
 */
const aiPredictionSchema = new mongoose.Schema(
  {
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    modelVersion: {
      type: String,
      trim: true,
      default: "",
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
    labels: {
      type: [String],
      default: [],
    },
    rawOutput: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    provider: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    ...schemaOptions,
    collection: "ai_predictions",
  }
);

aiPredictionSchema.index({ scanId: 1, createdAt: -1 });

export { aiPredictionSchema };
export default aiPredictionSchema;
