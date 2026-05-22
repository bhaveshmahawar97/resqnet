/**
 * DNS must be configured before MongoDB driver loads (mongodb+srv uses SRV lookup).
 */
import "./config/dns.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envFile = fs.existsSync(path.resolve(process.cwd(), ".env.local")) ? ".env.local" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const PORT = process.env.PORT || 5000;

try {
  const { connectDatabases } = await import("./config/database.js");
  await connectDatabases();

  const { default: app } = await import("./app.js");

  app.listen(PORT, () => {
    console.log(`🚀 ResQNet API — port ${PORT} (MongoDB Atlas)`);
  });
} catch (err) {
  console.error("❌ Server startup failed:", err.message);
  if (err.message?.includes("querySrv")) {
    console.error(
      "Tip: Set DNS_SERVERS=8.8.8.8,1.1.1.1 in .env or .env.local or use a standard mongodb:// URI from Atlas (Connect → Drivers)."
    );
  }
  process.exit(1);
}
