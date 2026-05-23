import mongoose from "mongoose";
import { NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES } from "../constants/enums.js";
import { schemaOptions } from "./plugins/timestamps.js";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: NOTIFICATION_PRIORITIES,
      default: "medium",
      index: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedEntityType",
      default: null,
      index: true,
    },
    relatedEntityType: {
      type: String,
      enum: ["RescueRequest", "Adoption", "User", "AdoptionApplication"],
      default: "RescueRequest",
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    ...schemaOptions,
    collection: "notifications",
  }
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

export { notificationSchema };
export default notificationSchema;
