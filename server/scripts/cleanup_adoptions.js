/*
 * Cleanup script to delete all adoptions
 * Run from `server` folder: `node scripts/cleanup_adoptions.js`
 */
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load env from server/.env.local or server/.env
const envFile = fs.existsSync(path.resolve(process.cwd(), ".env.local")) ? ".env.local" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Ensure DNS helpers load before Mongo SRV resolution
await import("../config/dns.js");

const { connectDatabases } = await import("../config/database.js");
const { getCoreModels } = await import("../models/index.js");

async function run() {
  try {
    await connectDatabases();
    const models = getCoreModels();
    const Adoption = models.Adoption;

    if (!Adoption) throw new Error("Adoption model not found");

    const result = await Adoption.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} adoption records`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

run();
