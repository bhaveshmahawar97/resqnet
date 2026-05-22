import { RESCUE_STATUSES, SEVERITY_LEVELS } from "../constants/enums.js";

export const validateCreateRescueBody = (body) => {
  const errors = [];
  const { animalType, condition, description, severity, address } = body;

  if (!animalType?.trim()) errors.push("animalType is required");
  if (!condition?.trim()) errors.push("condition is required");
  if (!description?.trim()) errors.push("description is required");
  if (!address?.trim()) errors.push("address is required");
  if (!severity || !SEVERITY_LEVELS.includes(severity)) {
    errors.push(`severity must be one of: ${SEVERITY_LEVELS.join(", ")}`);
  }

  if (body.latitude !== undefined && body.latitude !== "") {
    const lat = Number(body.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) errors.push("invalid latitude");
  }

  if (body.longitude !== undefined && body.longitude !== "") {
    const lng = Number(body.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) errors.push("invalid longitude");
  }

  return { valid: errors.length === 0, errors };
};

export const validateStatusUpdate = (status) => ({
  valid: RESCUE_STATUSES.includes(status),
  message: `Invalid status. Valid options: ${RESCUE_STATUSES.join(", ")}`,
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
