import { mapProviderError } from "../utils/errors.js";
import analyzeAnimalImageMock from "./mockAiService.js";
import { getAiModels } from "../models/registerAi.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";

const AI_PROVIDER = "local-mock";
const VISION_MODEL = "deterministic-mock-v1";

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

export const analyzeAnimalImage = async ({ imageUrl, imageName } = {}) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image input provided to analyzeAnimalImage");
  }

  try {
    const parsed = await analyzeAnimalImageMock({ imageUrl, imageName });
    const normalized = normalizeAnalysis(parsed);

    return {
      ...normalized,
      provider: AI_PROVIDER,
      providerModel: VISION_MODEL,
      usedFallback: false,
    };
  } catch (err) {
    console.error("[AI SERVICE] Mock analysis failed", err?.message || err);
    throw mapProviderError(err);
  }
};

export const persistScan = async ({ user, body, file, effectiveImageUrl, analysisResult, requestId }) => {
  const AIScan = getAiModels().AIScan;
  if (!AIScan) {
    console.warn(`[${requestId}] AIScan model unavailable — skipping persistence`);
    return null;
  }

  const recommendations = Array.isArray(analysisResult.recommendations)
    ? analysisResult.recommendations
    : analysisResult.recommendation
      ? [analysisResult.recommendation]
      : [];

  return AIScan.create({
    scannedBy: user?._id,
    relatedRescue: body?.relatedRescue || null,
    imageUrl: effectiveImageUrl,
    imagePublicId: file?.filename || "",
    status: "completed",
    analysis: analysisResult,
    predictedSeverity: analysisResult.severity,
    confidence: analysisResult.confidence,
    recommendations,
    provider: analysisResult.provider || "openrouter",
    providerMetadata: {
      model: analysisResult.providerModel,
      usedFallback: Boolean(analysisResult.usedFallback),
    },
  });
};

export const fetchScanHistory = async (userId, query) => {
  const AIScan = getAiModels().AIScan;
  if (!AIScan) throw new Error("AI database not initialized");

  const { page, limit, skip } = parsePagination(query, {
    defaultLimit: 8,
    maxLimit: 50,
  });

  const filter = { scannedBy: userId };

  const [scans, total] = await Promise.all([
    AIScan.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AIScan.countDocuments(filter),
  ]);

  const normalizedScans = scans.map((scan) => ({
    scanId: scan._id?.toString(),
    animal: scan.analysis?.animal || "unknown",
    severity: scan.predictedSeverity || scan.analysis?.severity || "unknown",
    condition: scan.analysis?.condition || "",
    priority: scan.analysis?.priority || "normal",
    recommendation: scan.recommendations?.[0] || scan.analysis?.recommendation || "",
    recommendations: scan.recommendations || scan.analysis?.recommendations || [],
    confidence: scan.confidence ?? scan.analysis?.confidence ?? 0,
    imageUrl: scan.imageUrl,
    timestamp: scan.createdAt,
    status: scan.status,
    fullAnalysis: scan.analysis || {},
  }));

  return { scans: normalizedScans, pagination: buildPaginationMeta(page, limit, total) };
};

export const fetchScannerStats = async () => {
  const AIScan = getAiModels().AIScan;
  if (!AIScan) throw new Error("AI database not initialized");

  const [completed, processing, failed, critical, high] = await Promise.all([
    AIScan.countDocuments({ status: "completed" }),
    AIScan.countDocuments({ status: "processing" }),
    AIScan.countDocuments({ status: "failed" }),
    AIScan.countDocuments({ predictedSeverity: "critical" }),
    AIScan.countDocuments({ predictedSeverity: "high" }),
  ]);

  return {
    totalScans: completed + processing + failed,
    completed,
    processing,
    failed,
    severityDistribution: { critical, high },
  };
};
