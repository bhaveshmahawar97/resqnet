import mongoose from "mongoose";
import { connectCore, getCoreConnection, CORE_DB_NAME, isCoreConnected } from "./coreDb.js";
import { connectAi, getAiConnection, AI_DB_NAME, isAiConnected } from "./aiDb.js";
import { bindCoreModels } from "../models/registerCore.js";
import { bindAiModels } from "../models/registerAi.js";

export { CORE_DB_NAME, AI_DB_NAME, getCoreConnection, getAiConnection, isCoreConnected, isAiConnected };

/**
 * Connect both Atlas databases and register all Mongoose models.
 */
export const connectDatabases = async () => {
  mongoose.set("strictQuery", true);

  await Promise.all([connectCore(), connectAi()]);

  bindCoreModels(getCoreConnection());
  bindAiModels(getAiConnection());

  return {
    core: getCoreConnection(),
    ai: getAiConnection(),
  };
};

export default connectDatabases;
