import mongoose from "mongoose";
import { ADOPTION_STATUSES } from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

/**
 * Future-ready adoption listings — workflow not implemented yet.
 */
const adoptionSchema = new mongoose.Schema(
  {
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    sourceRescue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RescueRequest",
      default: null,
      index: true,
    },
    animalName: {
      type: String,
      trim: true,
      default: "",
    },
    animalType: {
      type: String,
      trim: true,
      required: true,
    },
    breed: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ADOPTION_STATUSES,
      default: "available",
      index: true,
    },
    adoptionFee: {
      type: Number,
      min: 0,
      default: 0,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    healthCondition: {
      type: String,
      trim: true,
      default: "Healthy",
    },
    vaccinationStatus: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    ...schemaOptions,
    collection: "adoptions",
  }
);

adoptionSchema.index({ status: 1, createdAt: -1 });
adoptionSchema.index({ animalType: 1, status: 1 });

export { adoptionSchema };
export default adoptionSchema;
