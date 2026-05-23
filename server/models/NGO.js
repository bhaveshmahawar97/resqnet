import mongoose from "mongoose";
import { schemaOptions } from "./plugins/timestamps.js";

const ngoSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null,
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: "",
    },
    ngoType: {
      type: [String],
      enum: ["Rescue", "Shelter", "Medical", "Wildlife", "Adoption", "Sanctuary", "Welfare", "Other"],
      default: ["Rescue"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    socialMedia: {
      facebook: { type: String, trim: true, default: "" },
      instagram: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      youtube: { type: String, trim: true, default: "" },
    },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },
    documents: {
      registrationCertificate: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
      },
      taxId: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
      }
    },
    verificationNotes: {
      type: String,
      default: "",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    staffCount: {
      type: Number,
      min: 0,
      default: null,
    },
    foundedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
      default: null,
    },
    missionsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    responseTime: {
      type: String,
      default: "~20 min",
    },
  },
  {
    ...schemaOptions,
    collection: "ngos",
  }
);

// Compound index for common queries
ngoSchema.index({ city: 1, verified: 1, isActive: 1 });
ngoSchema.index({ ngoType: 1, verified: 1 });
ngoSchema.index({ verificationStatus: 1, createdAt: -1 });

export { ngoSchema };
export default ngoSchema;
