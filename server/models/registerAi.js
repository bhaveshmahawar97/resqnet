import { aiScanSchema } from "./ai/AIScan.js";
import { aiPredictionSchema } from "./ai/AIPrediction.js";
import { scannerAnalyticsSchema } from "./ai/ScannerAnalytics.js";

/** @type {Record<string, import('mongoose').Model<any>>} */
const aiModels = {};

export const bindAiModels = (connection) => {
  aiModels.AIScan = connection.model("AIScan", aiScanSchema);
  aiModels.AIPrediction = connection.model("AIPrediction", aiPredictionSchema);
  aiModels.ScannerAnalytics = connection.model("ScannerAnalytics", scannerAnalyticsSchema);
  return aiModels;
};

export const getAiModels = () => aiModels;
