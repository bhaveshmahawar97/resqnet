import mongoose from "mongoose";
import { USER_ROLES } from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

const notificationPreferencesSchema = new mongoose.Schema(
  {
    email: { type: Boolean, default: true },
    rescueAlerts: { type: Boolean, default: true },
    missionUpdates: { type: Boolean, default: true },
    criticalOnly: { type: Boolean, default: false },
  },
  { _id: false }
);

const ngoProfileSchema = new mongoose.Schema(
  {
    organizationName: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    registrationId: { type: String, trim: true, default: "" },
    serviceAreas: { type: [String], default: [] },
    description: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const volunteerProfileSchema = new mongoose.Schema(
  {
    skills: { type: [String], default: [] },
    availability: { type: String, enum: ["available", "limited", "unavailable"], default: "available" },
    city: { type: String, trim: true, default: "" },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    serviceRadiusKm: { type: Number, default: 10, min: 0 },
    bio: { type: String, trim: true, default: "" },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const missionStatsSchema = new mongoose.Schema(
  {
    rescuesCreated: { type: Number, default: 0, min: 0 },
    missionsAccepted: { type: Number, default: 0, min: 0 },
    missionsCompleted: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "user",
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    age: {
      type: Number,
      min: 0,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: null,
      index: { sparse: true },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    ngoProfile: {
      type: ngoProfileSchema,
      default: () => ({}),
    },
    volunteerProfile: {
      type: volunteerProfileSchema,
      default: () => ({}),
    },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({}),
    },
    missionStats: {
      type: missionStatsSchema,
      default: () => ({}),
    },
  },
  {
    ...schemaOptions,
    collection: "users",
  }
);

userSchema.index({ role: 1, createdAt: -1 });

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export { userSchema };
export default userSchema;
