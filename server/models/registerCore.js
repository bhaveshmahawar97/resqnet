import { userSchema } from "./User.js";
import { rescueRequestSchema } from "./RescueRequest.js";
import { dispatchLogSchema } from "./DispatchLog.js";
import { notificationSchema } from "./Notification.js";
import { missionHistorySchema } from "./MissionHistory.js";
import { adoptionSchema } from "./Adoption.js";
import { adoptionApplicationSchema } from "./AdoptionApplication.js";
import { analyticsSchema } from "./Analytics.js";
import { reportSchema } from "./Report.js";

/** @type {Record<string, import('mongoose').Model<any>>} */
const coreModels = {};

export const bindCoreModels = (connection) => {
  coreModels.User = connection.model("User", userSchema);
  coreModels.RescueRequest = connection.model("RescueRequest", rescueRequestSchema);
  coreModels.DispatchLog = connection.model("DispatchLog", dispatchLogSchema);
  coreModels.Notification = connection.model("Notification", notificationSchema);
  coreModels.MissionHistory = connection.model("MissionHistory", missionHistorySchema);
  coreModels.Adoption = connection.model("Adoption", adoptionSchema);
  coreModels.AdoptionApplication = connection.model(
    "AdoptionApplication",
    adoptionApplicationSchema
  );
  coreModels.Analytics = connection.model("Analytics", analyticsSchema);
  coreModels.Report = connection.model("Report", reportSchema);
  return coreModels;
};

export const getCoreModels = () => coreModels;
