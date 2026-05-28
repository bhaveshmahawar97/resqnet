import { analyzeAnimalImage, fetchScanHistory } from "../services/aiService.js";
import { sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const mapScannerErrorResponse = (error, requestId) => {
  const message = String(error?.message || error || "Image analysis failed");
  console.error(`[${requestId}] Scanner analysis error:`, message);

  if (/quota|rate limit|429|too many requests|over quota/i.test(message)) {
    return { status: 429, message: "AI service quota exceeded. Please try again later." };
  }
  if (/timeout|timed out/i.test(message)) {
    return { status: 504, message: "Image analysis timed out. Please try again with a smaller image." };
  }
  if (/unsupported image format|unsupported file type/i.test(message)) {
    return { status: 400, message: "Unsupported file type. Upload JPG, JPEG, PNG, or WebP images." };
  }
  if (/invalid image input|invalid image url|invalid image source/i.test(message)) {
    return { status: 400, message: "Invalid image. Upload a valid image and try again." };
  }
  if (/not configured/i.test(message)) {
    return { status: 503, message: "AI service is temporarily unavailable. Please try again later." };
  }

  return { status: 500, message: "Image analysis failed. Please try again or contact support." };
};

export const analyzeScannerImage = asyncHandler(async (req, res) => {
  const requestId = Math.random().toString(36).slice(2, 11);
  console.info(`[${requestId}] Scanner analyze request received`);

  const { imageUrl, imageName, sourceName } = req.body;
  const uploadedFile = req.file;
  const effectiveImageUrl = uploadedFile && (uploadedFile.path || uploadedFile.url || uploadedFile.secure_url) ? uploadedFile.path || uploadedFile.url || uploadedFile.secure_url : imageUrl;
  const effectiveImageName = imageName || sourceName || uploadedFile?.originalname || undefined;

  if (!effectiveImageUrl || typeof effectiveImageUrl !== "string") {
    return sendError(res, { status: 400, message: "Invalid request: provide an uploaded image or imageUrl." });
  }

  let analysisResult;
  try {
    analysisResult = await analyzeAnimalImage({ imageUrl: effectiveImageUrl, imageName: effectiveImageName });
  } catch (scanError) {
    return sendError(res, mapScannerErrorResponse(scanError, requestId));
  }

  console.info(`[${requestId}] Scanner analysis succeeded`);

  return res.status(200).json({
    success: true,
    analysis: analysisResult,
  });
});

export const getScannerHistory = asyncHandler(async (req, res) => {
  const result = await fetchScanHistory(req.user._id, req.query);
  return res.status(200).json({
    success: true,
    scans: result.scans,
    pagination: result.pagination,
  });
});

export default { analyzeScannerImage, getScannerHistory };

