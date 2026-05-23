import mongoose from "mongoose";
import { ADOPTION_APPLICATION_STATUSES } from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

const adoptionApplicationSchema = new mongoose.Schema(
  {
    adoption: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adoption",
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    livingEnvironment: {
      type: String,
      trim: true,
      default: "",
    },
    contactInfo: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ADOPTION_APPLICATION_STATUSES,
      default: "pending",
      index: true,
    },
    reviewNote: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    ...schemaOptions,
    collection: "adoption_applications",
  }
);

adoptionApplicationSchema.index({ adoption: 1, applicant: 1 }, { unique: true });

export { adoptionApplicationSchema };
export default adoptionApplicationSchema;
