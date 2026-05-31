import { mapProviderError } from "../utils/errors.js";
import { getAiModels } from "../models/registerAi.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { detectAnimal } from "./huggingFaceService.js";
import { explainAnalysis } from "./claudeService.js";
import { analyzeWithRules } from "./ruleEngineService.js";

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

const parseConfidence = (value) => {
  if (Number.isFinite(value)) {
    return Math.min(100, Math.max(0, Math.round(value)));
  }

  const normalized = String(value || "").replace(/[^0-9]/g, "");
  if (!normalized) {
    return 0;
  }

  const parsed = parseInt(normalized, 10);
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
};

export const normalizeAnalysis = (parsed) => ({
  animal: String(parsed?.animal || parsed?.species || parsed?.animalType || "unknown").toLowerCase().trim(),
  severity: normalizeSeverity(parsed?.severity),
  condition: String(parsed?.condition || parsed?.visibleCondition || "").trim(),
  priority: normalizePriority(parsed?.priority, parsed?.severity),
  recommendation: String(
    parsed?.recommendation || parsed?.action || parsed?.recommendation_text || ""
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

  const formatResult = (result, providerName, usedFallback) => {
    const recommendations = Array.isArray(result.recommendations)
      ? result.recommendations
      : Array.isArray(result.actions)
      ? result.actions
      : result.recommendations
      ? String(result.recommendations).split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean)
      : [];

    return {
      animal: String(result.animal || result.animalType || result.species || "unknown").trim(),
      severity: normalizeSeverity(result.severity),
      condition: String(result.condition || result.visibleCondition || "").trim(),
      priority: normalizePriority(result.priority, result.severity),
      recommendation: String(result.recommendation || recommendations[0] || "").trim(),
      recommendations,
      confidence: parseConfidence(result.confidence),
      veterinaryAttention: String(result.veterinaryAttention || result.veterinaryAttentionRecommendation || "").trim(),
      provider: providerName,
      providerModel: result.providerModel || "unknown",
      usedFallback,
    };
  };

  let detectionResult;
  let lastError;

  // Step 1: Animal Detection with Hugging Face
  try {
    console.info("[AI SERVICE] Step 1: Detecting animal with Hugging Face...");
    detectionResult = await detectAnimal({ imageUrl, imageName });
    console.info(`[AI SERVICE] Detection successful: ${detectionResult.animal} (${detectionResult.confidence}% confidence)`);
  } catch (err) {
    console.warn(`[AI SERVICE] Hugging Face detection failed: ${err?.message || err}`);
    lastError = err;

    // Fallback to rule engine immediately if detection fails
    console.warn("[AI SERVICE] Falling back to rule engine for complete analysis");
    const ruleResult = analyzeWithRules({ imageUrl, imageName });
    return formatResult(ruleResult, "rule-engine", true);
  }

  // Step 2: Optional - Get detailed explanation from Claude
  let explanation = null;
  try {
    console.info("[AI SERVICE] Step 2: Getting detailed analysis from Claude...");
    explanation = await explainAnalysis({
      animal: detectionResult.animal,
      confidence: detectionResult.confidence,
      imageUrl,
    });
    console.info("[AI SERVICE] Claude explanation successful");
  } catch (err) {
    console.warn(`[AI SERVICE] Claude explanation failed (non-critical): ${err?.message || err}`);
    // Continue without explanation - not critical
  }

  // Step 3: Combine results or use rule engine for missing data
  if (explanation) {
    // We have both detection and explanation
    const combined = {
      animal: detectionResult.animal,
      confidence: detectionResult.confidence,
      severity: explanation.severity,
      condition: explanation.condition,
      priority: explanation.priority,
      recommendation: explanation.recommendation,
      recommendations: explanation.recommendations,
      veterinaryAttention: explanation.veterinaryAttention,
      provider: "huggingface+claude",
      providerModel: `${detectionResult.providerModel} + ${explanation.providerModel}`,
      usedFallback: false,
    };
    return formatResult(combined, "huggingface+claude", false);
  } else {
    // Use rule engine to fill in missing analysis
    console.info("[AI SERVICE] Using rule engine to complete analysis");
    const ruleAnalysis = analyzeWithRules({
      animal: detectionResult.animal,
      imageUrl,
    });

    const combined = {
      ...ruleAnalysis,
      animal: detectionResult.animal,
      confidence: Math.round((detectionResult.confidence + ruleAnalysis.confidence) / 2),
      provider: "huggingface+rules",
      providerModel: `${detectionResult.providerModel} + heuristic-v1`,
      usedFallback: true,
    };
    return formatResult(combined, "huggingface+rules", true);
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
