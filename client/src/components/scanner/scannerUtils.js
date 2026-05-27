/**
 * Scanner utilities for data normalization and formatting
 */

export const SEVERITY_CONFIG = {
  critical: { label: "Critical", color: "#DC2626" },
  high: { label: "High", color: "#F97316" },
  medium: { label: "Medium", color: "#EAB308" },
  low: { label: "Low", color: "#16A34A" },
  unknown: { label: "Unknown", color: "#64748B" },
};

export const VALID_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const formatTime = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getSeverityMeta = (severity) => {
  if (!severity) return SEVERITY_CONFIG.unknown;
  return SEVERITY_CONFIG[severity.toLowerCase()] || SEVERITY_CONFIG.unknown;
};

export const normalizeImageUrl = (url) => {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;

  if (!/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Handle Wikipedia thumb URLs
  const wikiThumbPattern = /^(https?:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/thumb\/(.+?)\/[^/]+$/i;
  const match = trimmed.match(wikiThumbPattern);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }

  return trimmed;
};

export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: "No file selected" };

  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Unsupported file type. Upload JPEG, PNG, or WebP images.",
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      valid: false,
      error: "Image too large. Please use a file smaller than 10 MB.",
    };
  }

  return { valid: true };
};
