import { analyzeAnimalImage, persistScan, fetchScanHistory, fetchScannerStats } from "../services/aiService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";

const mapAiErrorResponse = (aiError, requestId) => {
  const msg = String(aiError?.message || aiError || "AI analysis failed");
  console.error(`[${requestId}] AI Analysis Error:`, msg);

  if (aiError?.code === "AI_QUOTA_EXCEEDED" || /quota|rate limit|429|too many requests|over quota/i.test(msg)) {
    return { status: 429, message: "AI service quota exceeded. Please try again later." };
  }
  if (aiError?.code === "AI_TIMEOUT" || /timed out/i.test(msg)) {
    return { status: 504, message: "Image analysis timed out. Please try again with a smaller image." };
  }
  if (/invalid image url/i.test(msg)) {
    return { status: 400, message: "Invalid image URL. Upload a valid image and try again." };
  }
  if (aiError?.code === "AI_AUTH_FAILED" || /OPENROUTER_API_KEY/i.test(msg)) {
    return { status: 503, message: "AI service is temporarily unavailable. Please try again later." };
  }
  return { status: 500, message: "Image analysis failed. Please try again or contact support." };
};

export const scanAnimal = asyncHandler(async (req, res) => {
  const requestId = Math.random().toString(36).slice(2, 11);
  const { imageUrl, imageName, sourceName } = req.body;
  const uploadedFile = req.file;
  const imageUrlFromUpload = uploadedFile && (uploadedFile.path || uploadedFile.url || uploadedFile.secure_url);
  const effectiveImageUrl = imageUrlFromUpload || imageUrl;
  const effectiveImageName = imageName || sourceName || uploadedFile?.originalname || undefined;

  if (!effectiveImageUrl || typeof effectiveImageUrl !== "string") {
    return sendError(res, { status: 400, message: "Invalid request: provide an uploaded image or imageUrl" });
  }

  let analysisResult;
  try {
    analysisResult = await analyzeAnimalImage({ imageUrl: effectiveImageUrl, imageName: effectiveImageName });
  } catch (aiError) {
    return sendError(res, mapAiErrorResponse(aiError, requestId));
  }

  if (!analysisResult?.animal) {
    return sendError(res, { status: 500, message: "AI returned invalid response structure" });
  }

  let savedScan = null;
  try {
    savedScan = await persistScan({
      user: req.user,
      body: req.body,
      file: req.file,
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
        relatedEntity: null,
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
});

export const getScanHistory = asyncHandler(async (req, res) => {
  const result = await fetchScanHistory(req.user._id, req.query);
  return sendSuccess(res, {
    status: 200,
    message: "Scan history retrieved successfully",
    data: result,
  });
});

export const getScannerStats = asyncHandler(async (req, res) => {
  const stats = await fetchScannerStats();
  return sendSuccess(res, {
    status: 200,
    message: "Scanner stats retrieved successfully",
    data: stats,
  });
});

export default { scanAnimal, getScanHistory, getScannerStats };
