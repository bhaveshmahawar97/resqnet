/**
 * Model registry — dual Atlas databases:
 *   resqnet_core (operational)
 *   resqnet_ai (scanner / ML)
 *
 * Models are bound after connectDatabases() in config/database.js
 */
import { getCoreModels } from "./registerCore.js";
import { getAiModels } from "./registerAi.js";

export { bindCoreModels } from "./registerCore.js";
export { bindAiModels } from "./registerAi.js";

export const CORE_COLLECTIONS = {
  users: "users",
  rescuerequests: "rescuerequests",
  dispatchlogs: "dispatchlogs",
  notifications: "notifications",
  missionhistory: "missionhistory",
  adoptions: "adoptions",
  adoption_applications: "adoption_applications",
  analytics: "analytics",
  reports: "reports",
  ngos: "ngos",
  feedbacks: "feedbacks",
};

export const AI_COLLECTIONS = {
  ai_scans: "ai_scans",
  ai_predictions: "ai_predictions",
  scanner_analytics: "scanner_analytics",
};

const requireCoreModel = (name) => {
  const model = getCoreModels()[name];
  if (!model) {
    throw new Error(
      `Core model "${name}" is not registered. Ensure connectDatabases() ran before handling requests.`
    );
  }
  return model;
};

const requireAiModel = (name) => {
  const model = getAiModels()[name];
  if (!model) {
    throw new Error(
      `AI model "${name}" is not registered. Ensure connectDatabases() ran before handling requests.`
    );
  }
  return model;
};

/**
 * Mongoose models must keep correct `this` binding on static methods (findOne, create, etc.).
 */
const createModelProxy = (resolveModel) =>
  new Proxy(
    function ModelProxy() {},
    {
      get(_target, prop) {
        const model = resolveModel();
        const value = model[prop];
        if (typeof value === "function") {
          return value.bind(model);
        }
        return value;
      },
      construct(_target, args) {
        const model = resolveModel();
        return new model(...args);
      },
    }
  );

export const User = createModelProxy(() => requireCoreModel("User"));
export const RescueRequest = createModelProxy(() => requireCoreModel("RescueRequest"));
export const DispatchLog = createModelProxy(() => requireCoreModel("DispatchLog"));
export const Notification = createModelProxy(() => requireCoreModel("Notification"));
export const MissionHistory = createModelProxy(() => requireCoreModel("MissionHistory"));
export const Adoption = createModelProxy(() => requireCoreModel("Adoption"));
export const Analytics = createModelProxy(() => requireCoreModel("Analytics"));
export const Report = createModelProxy(() => requireCoreModel("Report"));
export const NGO = createModelProxy(() => requireCoreModel("NGO"));
export const Feedback = createModelProxy(() => requireCoreModel("Feedback"));

export const AIScan = createModelProxy(() => requireAiModel("AIScan"));
export const AIPrediction = createModelProxy(() => requireAiModel("AIPrediction"));
export const ScannerAnalytics = createModelProxy(() => requireAiModel("ScannerAnalytics"));

/** Direct accessors for services/scripts after DB connect */
export { getCoreModels, getAiModels };
