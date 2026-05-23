import { z } from "zod";
import { RESCUE_STATUSES, SEVERITY_LEVELS } from "../constants/enums.js";

export const createRescueSchema = z.object({
  animalType: z.string().trim().min(1, "animalType is required"),
  condition: z.string().trim().min(1, "condition is required"),
  description: z.string().trim().min(1, "description is required"),
  address: z.string().trim().min(1, "address is required"),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  severity: z.enum(SEVERITY_LEVELS),
  latitude: z.union([z.string(), z.number()]).optional().transform(v => v === "" ? undefined : Number(v)).refine(val => val === undefined || (val >= -90 && val <= 90), { message: "invalid latitude" }),
  longitude: z.union([z.string(), z.number()]).optional().transform(v => v === "" ? undefined : Number(v)).refine(val => val === undefined || (val >= -180 && val <= 180), { message: "invalid longitude" }),
  images: z.union([z.string(), z.array(z.string())]).optional(),
  contactPhone: z.string().trim().optional()
});

export const updateRescueStatusSchema = z.object({
  status: z.enum(RESCUE_STATUSES, { errorMap: () => ({ message: `Invalid status. Valid options: ${RESCUE_STATUSES.join(", ")}` }) }),
  notes: z.string().optional()
});

export const extractUploadedImageUrls = (files) => {
  if (!files) return [];
  const list = Array.isArray(files) ? files : [files];
  return list.map((f) => f?.path || f?.secure_url || f?.url).filter(Boolean);
};

export const parseImageField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    if (trimmed) return [trimmed];
  }
  return [];
};
