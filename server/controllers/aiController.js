import { analyzeAnimalImage } from "../services/aiService.js";
import { getAiModels } from "../models/registerAi.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { createNotification } from "../services/notificationService.js";

const mapAiErrorResponse = (aiError, requestId) => {
  const msg = String(aiError?.message || aiError || "AI analysis failed");
  console.error(`[${requestId}] AI Analysis Error:`, msg);

  if (
    aiError?.code === "AI_QUOTA_EXCEEDED" ||
    /quota|rate limit|429|too many requests|over quota/i.test(msg)
  ) {
    return { status: 429, message: "AI service quota exceeded. Please try again later." };
  }

  if (aiError?.code === "AI_TIMEOUT" || /timed out/i.test(msg)) {
    return {
      status: 504,
      message: "Image analysis timed out. Please try again with a smaller image.",
    };
  }

  if (/invalid image url/i.test(msg)) {
    return { status: 400, message: "Invalid image URL. Upload a valid image and try again." };
  }

  if (aiError?.code === "AI_AUTH_FAILED" || /OPENROUTER_API_KEY/i.test(msg)) {
    return {
      status: 503,
      message: "AI service is temporarily unavailable. Please try again later.",
    };
  }

  return {
    status: 500,
    message: "Image analysis failed. Please try again or contact support.",
  };
};

const persistScan = async ({ req, effectiveImageUrl, analysisResult, requestId }) => {
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

  const scanDoc = await AIScan.create({
    scannedBy: req.user?._id,
    relatedRescue: req.body?.relatedRescue || null,
    imageUrl: effectiveImageUrl,
    imagePublicId: req.file?.filename || "",
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

  return scanDoc;
};

/**
 * POST /api/ai/scan
 * Scan an animal image using OpenRouter vision models.
 * Expects: { imageUrl, relatedRescue? } or multipart image upload.
 */
export const scanAnimal = async (req, res) => {
  const requestId = Math.random().toString(36).slice(2, 11);

  try {
    const { imageUrl, imageName, sourceName } = req.body;
    const uploadedFile = req.file;
    const imageUrlFromUpload =
      uploadedFile && (uploadedFile.path || uploadedFile.url || uploadedFile.secure_url);
    const effectiveImageUrl = imageUrlFromUpload || imageUrl;
    const effectiveImageName =
      imageName || sourceName || uploadedFile?.originalname || undefined;

    if (!effectiveImageUrl || typeof effectiveImageUrl !== "string") {
      return sendError(res, {
        status: 400,
        message: "Invalid request: provide an uploaded image or imageUrl",
      });
    }

    let analysisResult;
    try {
      analysisResult = await analyzeAnimalImage({
        imageUrl: effectiveImageUrl,
        imageName: effectiveImageName,
      });
    } catch (aiError) {
      const mapped = mapAiErrorResponse(aiError, requestId);
      return sendError(res, mapped);
    }

    if (!analysisResult?.animal) {
      return sendError(res, {
        status: 500,
        message: "AI returned invalid response structure",
      });
    }

    let savedScan = null;
    try {
      savedScan = await persistScan({
        req,
        effectiveImageUrl,
        analysisResult,
        requestId,
      });

      if (savedScan && req.user) {
        await createNotification({
          recipientId: req.user._id,
          type: "ai_scan_completed",
          title: "AI Scan Completed",
          message: `Scan for ${analysisResult.animal} finished. Severity: ${analysisResult.severity}.`,
          priority: analysisResult.severity === "critical" || analysisResult.severity === "high" ? analysisResult.severity : "medium",
          relatedEntity: null, // Scans don't have a direct model route in front-end yet
          data: { severity: analysisResult.severity },
        });
      }
    } catch (dbError) {
      console.error(`[${requestId}] Failed to persist AI scan:`, dbError.message);
    }

    return sendSuccess(res, {
      status: 200,
      message: "Animal scan analysis completed successfully",
      data: {
        scanId: savedScan?._id?.toString() || null,
        animal: analysisResult.animal,
        severity: analysisResult.severity,
        confidence: analysisResult.confidence,
        condition: analysisResult.condition,
        priority: analysisResult.priority,
        recommendation: analysisResult.recommendation,
        recommendations: analysisResult.recommendations || [],
        imageUrl: effectiveImageUrl,
        fullAnalysis: analysisResult,
        timestamp: savedScan?.createdAt?.toISOString() || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(`[${requestId}] Unexpected error in scanAnimal:`, error);

    return sendError(res, {
      status: 500,
      message: "An unexpected error occurred during AI analysis",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * GET /api/ai/scans
 * Paginated scan history for the authenticated user.
 */
export const getScanHistory = async (req, res) => {
  try {
    const AIScan = getAiModels().AIScan;

    if (!AIScan) {
      return sendError(res, {
        status: 500,
        message: "AI database not initialized",
      });
    }

    const { page, limit, skip } = parsePagination(req.query, {
      defaultLimit: 8,
      maxLimit: 50,
    });

    const filter = { scannedBy: req.user._id };

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
      recommendation:
        scan.recommendations?.[0] || scan.analysis?.recommendation || "",
      recommendations: scan.recommendations || scan.analysis?.recommendations || [],
      confidence: scan.confidence ?? scan.analysis?.confidence ?? 0,
      imageUrl: scan.imageUrl,
      timestamp: scan.createdAt,
      status: scan.status,
      fullAnalysis: scan.analysis || {},
    }));

    return sendSuccess(res, {
      status: 200,
      message: "Scan history retrieved successfully",
      data: {
        scans: normalizedScans,
        pagination: buildPaginationMeta(page, limit, total),
      },
    });
  } catch (error) {
    console.error("GET SCAN HISTORY ERROR:", error);

    return sendError(res, {
      status: 500,
      message: "Failed to retrieve scan history",
    });
  }
};

/**
 * GET /api/ai/stats
 * Get AI scanner statistics
 */
export const getScannerStats = async (req, res) => {
  try {
    const AIScan = getAiModels().AIScan;

    if (!AIScan) {
      return sendError(res, {
        status: 500,
        message: "AI database not initialized",
      });
    }

    const [completed, processing, failed, critical, high] = await Promise.all([
      AIScan.countDocuments({ status: "completed" }),
      AIScan.countDocuments({ status: "processing" }),
      AIScan.countDocuments({ status: "failed" }),
      AIScan.countDocuments({ predictedSeverity: "critical" }),
      AIScan.countDocuments({ predictedSeverity: "high" }),
    ]);

    return sendSuccess(res, {
      status: 200,
      message: "Scanner stats retrieved successfully",
      data: {
        totalScans: completed + processing + failed,
        completed,
        processing,
        failed,
        severityDistribution: {
          critical,
          high,
        },
      },
    });
  } catch (error) {
    console.error("GET STATS ERROR:", error);

    return sendError(res, {
      status: 500,
      message: "Failed to retrieve scanner stats",
    });
  }
};

export default {
  scanAnimal,
  getScanHistory,
  getScannerStats,
};
