import mongoose from "mongoose";

export const CORE_DB_NAME = "resqnet_core";

let coreConnection = null;

/**
 * Operational database — users, rescues, dispatch, notifications, etc.
 */
export const connectCore = async () => {
  const uri = process.env.MONGO_URI_CORE;

  if (!uri) {
    throw new Error(
      "MONGO_URI_CORE is required. Set your MongoDB Atlas connection string in server/.env or server/.env.local"
    );
  }

  coreConnection = mongoose.createConnection(uri, {
    dbName: CORE_DB_NAME,
    maxPoolSize: 10,
  });

  coreConnection.on("error", (err) => {
    console.error("Core DB connection error:", err.message);
  });

  await coreConnection.asPromise();

  console.log(`✅ MongoDB Atlas Core — database: ${coreConnection.name || CORE_DB_NAME}`);
  return coreConnection;
};

export const getCoreConnection = () => {
  if (!coreConnection) {
    throw new Error("Core database not connected. Call connectDatabases() first.");
  }
  return coreConnection;
};

export const isCoreConnected = () =>
  coreConnection?.readyState === 1;

export default connectCore;
