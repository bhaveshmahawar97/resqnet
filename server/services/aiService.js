import { mapProviderError } from "../utils/errors.js";
import analyzeAnimalImageMock from "./mockAiService.js";

const AI_PROVIDER = "local-mock";
const VISION_MODEL = "deterministic-mock-v1";

/**
 * Intelligent mock rescue analysis responses.
 * Used when real AI provider fails due to quota, auth, or other issues.
 * Each response is realistic and varied to support testing and demo workflows.
 */
// No remote AI provider calls: use deterministic local mock implementation

const normalizeSeverity = (value) => {
  const raw = String(value || "medium").toLowerCase().trim();
  if (["low", "medium", "high", "critical"].includes(raw)) return raw;
  if (raw.includes("crit")) return "critical";
  if (raw.includes("high") || raw.includes("severe")) return "high";
  if (raw.includes("low") || raw.includes("mild")) return "low";
  return "medium";
};

const normalizePriority = (value, severity) => {
  const raw = String(value || severity || "normal").toLowerCase().trim();
  if (["low", "normal", "high", "critical"].includes(raw)) return raw;
  if (raw.includes("crit")) return "critical";
  if (raw.includes("high") || raw.includes("urgent")) return "high";
  if (raw.includes("low")) return "low";
  return "normal";
};

/**
 * Get a random intelligent mock response.
 * Provides realistic animal rescue analysis for fallback scenarios.
 */
// Delegate to mock service implementation in all cases

/** Canonical scan shape returned to the rest of the backend. */
export const normalizeAnalysis = (parsed) => ({
  animal: String(parsed?.animal || parsed?.species || "unknown").toLowerCase().trim(),
  severity: normalizeSeverity(parsed?.severity),
  condition: String(parsed?.condition || "").trim(),
  priority: normalizePriority(parsed?.priority, parsed?.severity),
  recommendation: String(
    parsed?.recommendation || parsed?.recommendation_text || parsed?.action || ""
  ).trim(),
  confidence: Math.min(
    100,
    Math.max(0, parseInt(parsed?.confidence, 10) || 0)
  ),
});

const isValidImageUrl = (imageUrl) => {
  try {
    const parsed = new URL(imageUrl);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const analyzeAnimalImage = async ({ imageUrl, imageName } = {}) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image input provided to analyzeAnimalImage");
  }

  try {
    // Always use deterministic local mock implementation
    const parsed = await analyzeAnimalImageMock({ imageUrl, imageName });

    const normalized = normalizeAnalysis(parsed);

    return {
      ...normalized,
      provider: AI_PROVIDER,
      providerModel: VISION_MODEL,
      usedFallback: false,
    };
  } catch (err) {
    // If the mock service itself fails (very unlikely), map the error consistently
    console.error("[AI SERVICE] Mock analysis failed", err?.message || err);
    throw mapProviderError(err);
  }
};

export default analyzeAnimalImage;
