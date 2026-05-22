import mongoose from "mongoose";

export const AI_DB_NAME = "resqnet_ai";

let aiConnection = null;

/**
 * AI / scanner database — isolated for scaling and future ML pipelines.
 */
export const connectAi = async () => {
  const uri = process.env.MONGO_URI_AI;

  if (!uri) {
    throw new Error(
      "MONGO_URI_AI is required. Set your MongoDB Atlas AI connection string in server/.env or server/.env.local"
    );
  }

  aiConnection = mongoose.createConnection(uri, {
    dbName: AI_DB_NAME,
    maxPoolSize: 5,
  });

  aiConnection.on("error", (err) => {
    console.error("AI DB connection error:", err.message);
  });

  await aiConnection.asPromise();

  console.log(`✅ AI MongoDB Connected — database: ${aiConnection.name || AI_DB_NAME}`);
  return aiConnection;
};

export const getAiConnection = () => {
  if (!aiConnection) {
    throw new Error("AI database not connected. Call connectDatabases() first.");
  }
  return aiConnection;
};

export const isAiConnected = () =>
  aiConnection?.readyState === 1;

export default connectAi;
