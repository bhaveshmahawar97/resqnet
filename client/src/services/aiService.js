import api from "./api";
import { getFetchErrorMessage } from "../utils/apiErrors";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || "resqnet/scanner";
const CLOUDINARY_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : null;

const isCloudinaryPresetConfigured = (preset) => {
  if (!preset) return false;
  const trimmed = preset.trim();
  if (!trimmed) return false;
  return !/your[_-]?upload[_-]?preset/i.test(trimmed);
};

const isCloudinaryConfigured = () => {
  if (!CLOUDINARY_CLOUD_NAME) return false;
  const cloudNameTrim = String(CLOUDINARY_CLOUD_NAME).trim();
  if (!cloudNameTrim) return false;
  if (/your[_-]?cloud|example|demo/i.test(cloudNameTrim)) return false;
  if (!isCloudinaryPresetConfigured(CLOUDINARY_UPLOAD_PRESET)) return false;
  return true;
};

export const uploadToCloudinary = async (file) => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary upload is not configured correctly. Add a valid VITE_CLOUDINARY_CLOUD_NAME and an UNSIGNED VITE_CLOUDINARY_UPLOAD_PRESET to client/.env, then restart the dev server. See SECURITY_SETUP.md for details."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", CLOUDINARY_FOLDER);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await getFetchErrorMessage(response, "Cloudinary upload failed");
    throw new Error(message);
  }

  const data = await response.json();

  if (!data?.secure_url) {
    throw new Error("Cloudinary did not return a valid image URL.");
  }

  return data.secure_url;
};

const normalizeScanResponse = (payload) => {
  const scan = payload?.analysis || payload?.data || payload || {};
  const rawRecommendations = scan.recommendations || scan.fullAnalysis?.recommendations || [];
  const normalizedRecommendations = Array.isArray(rawRecommendations)
    ? rawRecommendations.filter((item) => Boolean(item)).map(String)
    : typeof rawRecommendations === "string"
    ? [rawRecommendations]
    : [];
  const confidenceValue = Number.isFinite(scan.confidence)
    ? scan.confidence
    : parseInt(scan.confidence, 10);

  return {
    scanId: scan.scanId || scan._id || null,
    animal: scan.animal || scan.fullAnalysis?.animal || "unknown",
    severity: String(scan.severity || scan.predictedSeverity || scan.fullAnalysis?.severity || "unknown").toLowerCase(),
    condition: scan.condition || scan.fullAnalysis?.condition || "",
    priority: String(scan.priority || scan.fullAnalysis?.priority || "normal").toLowerCase(),
    recommendation: scan.recommendation || scan.fullAnalysis?.recommendation || "",
    recommendations: normalizedRecommendations,
    confidence: Number.isFinite(confidenceValue) ? Math.min(100, Math.max(0, confidenceValue)) : 0,
    timestamp: scan.timestamp || scan.createdAt || null,
    fullAnalysis: scan.fullAnalysis || scan.analysis || {},
    ...scan,
  };
};

export const scanAnimal = async (imageUrl, imageName) => {
  const payload = { imageUrl };
  if (imageName) payload.imageName = imageName;
  const response = await api.post("/scanner/analyze", payload);
  return normalizeScanResponse(response.data);
};

export const fetchScanHistory = async ({ limit = 8, page = 1 } = {}) => {
  const response = await api.get(`/scanner/history?limit=${limit}&page=${page}`);
  return response.data || { scans: [], pagination: null };
};

export default {
  uploadToCloudinary,
  scanAnimal,
  fetchScanHistory,
};