/**
 * ResQNet — Full MongoDB Atlas infrastructure verification
 * Run: npm run verify:atlas
 */
import "../config/dns.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = fs.existsSync(path.join(__dirname, "../.env.local")) ? ".env.local" : ".env";
dotenv.config({ path: path.join(__dirname, `../${envFile}`) });

const results = { passed: [], failed: [], warnings: [] };

const pass = (phase, msg) => {
  results.passed.push({ phase, msg });
  console.log(`  ✅ ${msg}`);
};

const fail = (phase, msg, detail = "") => {
  results.failed.push({ phase, msg, detail });
  console.log(`  ❌ ${msg}${detail ? ` — ${detail}` : ""}`);
};

const warn = (phase, msg) => {
  results.warnings.push({ phase, msg });
  console.log(`  ⚠️  ${msg}`);
};

const TEST_EMAIL = `verify-atlas-${Date.now()}@resqnet.in`;
const TEST_PASSWORD = "Verify@12345";

async function main() {
  console.log("\n🔍 ResQNet Atlas Infrastructure Verification\n");
  console.log("═".repeat(56));

  // ─── PHASE 1: Connection ─────────────────────────────────────
  console.log("\n📡 PHASE 1 — Atlas connection\n");

  if (process.env.MONGO_URI) {
    fail("P1", "Obsolete MONGO_URI still in .env");
  } else {
    pass("P1", "No obsolete MONGO_URI in environment");
  }

  if (!process.env.MONGO_URI_CORE) fail("P1", "MONGO_URI_CORE missing");
  else pass("P1", "MONGO_URI_CORE configured");

  if (!process.env.MONGO_URI_AI) fail("P1", "MONGO_URI_AI missing");
  else pass("P1", "MONGO_URI_AI configured");

  if (process.env.MONGO_URI_CORE?.includes("127.0.0.1") || process.env.MONGO_URI_CORE?.includes("localhost")) {
    fail("P1", "MONGO_URI_CORE points to localhost");
  } else {
    pass("P1", "MONGO_URI_CORE is cloud (not localhost)");
  }

  const { connectDatabases, CORE_DB_NAME, AI_DB_NAME, isCoreConnected, isAiConnected, getCoreConnection, getAiConnection } =
    await import("../config/database.js");

  try {
    await connectDatabases();
    if (isCoreConnected()) pass("P1", `Core DB connected (${CORE_DB_NAME})`);
    else fail("P1", "Core DB not connected");
    if (isAiConnected()) pass("P1", `AI DB connected (${AI_DB_NAME})`);
    else fail("P1", "AI DB not connected");
  } catch (e) {
    fail("P1", "connectDatabases() failed", e.message);
    printSummary();
    process.exit(1);
  }

  const coreConn = getCoreConnection();
  const aiConn = getAiConnection();

  if (coreConn.name === CORE_DB_NAME || coreConn.db?.databaseName === CORE_DB_NAME) {
    pass("P1", `Core connection database name: ${CORE_DB_NAME}`);
  } else {
    warn("P1", `Core connection name: ${coreConn.name} (expected ${CORE_DB_NAME})`);
  }

  // ─── PHASE 2: Collections ────────────────────────────────────
  console.log("\n📦 PHASE 2 — Database structure\n");

  const { getCoreModels, getAiModels, CORE_COLLECTIONS, AI_COLLECTIONS } = await import("../models/index.js");
  const coreModels = getCoreModels();
  const aiModels = getAiModels();

  const coreCollections = [
    "users",
    "rescuerequests",
    "dispatchlogs",
    "missionhistory",
    "notifications",
    "adoptions",
    "analytics",
    "reports",
  ];
  const aiCollections = ["ai_scans", "ai_predictions", "scanner_analytics"];

  for (const name of coreCollections) {
    const exists = (await coreConn.db.listCollections({ name }).toArray()).length > 0;
    const count = exists ? await coreConn.db.collection(name).countDocuments() : 0;
    if (exists) pass("P2", `resqnet_core.${name} exists (${count} docs)`);
    else warn("P2", `resqnet_core.${name} not yet created (will auto-create on first write)`);
  }

  for (const name of aiCollections) {
    const exists = (await aiConn.db.listCollections({ name }).toArray()).length > 0;
    const count = exists ? await aiConn.db.collection(name).countDocuments() : 0;
    if (exists) pass("P2", `resqnet_ai.${name} exists (${count} docs)`);
    else warn("P2", `resqnet_ai.${name} not yet created (scaffold ready)`);
  }

  const { User, RescueRequest, DispatchLog, MissionHistory, AIScan } = await import("../models/index.js");

  // ─── PHASE 3: Auth ───────────────────────────────────────────
  console.log("\n🔐 PHASE 3 — User auth\n");

  let testUser;
  let testToken;
  try {
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);
    testUser = await User.create({
      fullName: "Atlas Verify User",
      email: TEST_EMAIL,
      password: hash,
      role: "user",
    });
    pass("P3", "User.create() works on core DB");

    if (testUser.role === "user" && testUser.createdAt) {
      pass("P3", "User has role + timestamps");
    } else {
      fail("P3", "User missing role or timestamps");
    }

    testToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
    const found = await User.findById(decoded.id);
    if (found?.email === TEST_EMAIL) pass("P3", "JWT + User.findById works");
    else fail("P3", "JWT user lookup failed");

    const loginCheck = await User.findOne({ email: TEST_EMAIL }).select("+password");
    const match = await bcrypt.compare(TEST_PASSWORD, loginCheck.password);
    if (match) pass("P3", "Password hash + compare works");
    else fail("P3", "Password verification failed");
  } catch (e) {
    fail("P3", "Auth test failed", e.message);
  }

  // ─── PHASE 4 & 5 & 7: Rescue workflow ───────────────────────
  console.log("\n🚨 PHASE 4/5/7 — Rescue workflow + Cloudinary URLs + dispatch\n");

  let testRescue;
  const cloudinaryUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  try {
    const { buildTimelineEntry } = await import("../services/rescueService.js");
    const entry = buildTimelineEntry("pending", { _id: testUser._id, role: "user" }, "Verify test");

    testRescue = await RescueRequest.create({
      animalType: "Street Dog",
      condition: "Verification test",
      description: "Atlas infrastructure verification rescue",
      severity: "high",
      missionPriority: "high",
      address: "Jaipur, Rajasthan",
      images: [cloudinaryUrl],
      createdBy: testUser._id,
      dispatchStatus: "unassigned",
      rescueTimeline: [entry],
      statusHistory: [entry],
    });
    pass("P4", "RescueRequest.create() persists to rescuerequests");

    if (testRescue.images?.[0]?.startsWith("https://")) {
      pass("P5", "Cloudinary/full HTTPS image URL stored (no localhost path)");
    } else {
      fail("P5", "Image URL not stored as HTTPS", testRescue.images?.[0]);
    }

    const { recordDispatchEvent, recordMissionHistory } = await import("../services/dispatchService.js");

    await recordDispatchEvent({
      rescueRequestId: testRescue._id,
      eventType: "status_change",
      actor: testUser,
      previousState: { status: "pending" },
      newState: { status: "accepted" },
      note: "Verify accept",
    });

    await recordMissionHistory({
      rescueRequestId: testRescue._id,
      actor: testUser,
      action: "status_change",
      fromStatus: "pending",
      toStatus: "accepted",
      note: "Verify mission history",
    });

    testRescue.status = "accepted";
    testRescue.dispatchStatus = "accepted";
    await testRescue.save();

    const dispatchCount = await DispatchLog.countDocuments({ rescueRequest: testRescue._id });
    const historyCount = await MissionHistory.countDocuments({ rescueRequest: testRescue._id });

    if (dispatchCount > 0) pass("P7", `dispatchlogs has ${dispatchCount} entry(ies) for test rescue`);
    else fail("P7", "No dispatch log entries");

    if (historyCount > 0) pass("P7", `missionhistory has ${historyCount} entry(ies) for test rescue`);
    else fail("P7", "No mission history entries");

    const reloaded = await RescueRequest.findById(testRescue._id);
    if (reloaded?.status === "accepted") pass("P4", "Rescue status persists after update");
    else fail("P4", "Rescue status not persisted");
  } catch (e) {
    fail("P4", "Rescue workflow failed", e.message);
  }

  // ─── PHASE 8: AI isolation ─────────────────────────────────────
  console.log("\n🤖 PHASE 8 — AI database isolation\n");

  let tempScanId;
  try {
    const scan = await AIScan.create({
      scannedBy: testUser._id,
      imageUrl: cloudinaryUrl,
      status: "pending",
      provider: "verify-script",
    });
    tempScanId = scan._id;
    pass("P8", "AIScan.create() works on resqnet_ai");

    const inCore = await coreConn.db.collection("ai_scans").countDocuments({ _id: tempScanId });
    const inAi = await aiConn.db.collection("ai_scans").countDocuments({ _id: tempScanId });

    if (inAi === 1 && inCore === 0) pass("P8", "AIScan stored ONLY in resqnet_ai (not in core)");
    else fail("P8", `AI isolation breach — core:${inCore} ai:${inAi}`);

    await AIScan.deleteOne({ _id: tempScanId });
    pass("P8", "Temporary AIScan document removed");
  } catch (e) {
    fail("P8", "AI isolation test failed", e.message);
    if (tempScanId) await AIScan.deleteOne({ _id: tempScanId }).catch(() => {});
  }

  // ─── PHASE 9: Indexes ──────────────────────────────────────────
  console.log("\n⚡ PHASE 9 — Indexes\n");

  const checkIndexes = async (conn, coll, expectedFields) => {
    const indexes = await conn.db.collection(coll).indexes();
    const keys = indexes.flatMap((idx) => Object.keys(idx.key));
    for (const field of expectedFields) {
      if (keys.includes(field)) pass("P9", `${coll} index includes ${field}`);
      else warn("P9", `${coll} missing index on ${field} (may appear after first write)`);
    }
  };

  if ((await coreConn.db.listCollections({ name: "users" }).toArray()).length) {
    await checkIndexes(coreConn, "users", ["email", "role"]);
  }
  if ((await coreConn.db.listCollections({ name: "rescuerequests" }).toArray()).length) {
    await checkIndexes(coreConn, "rescuerequests", ["status", "createdAt", "assignedNgo", "assignedVolunteer"]);
  }

  // ─── API health via HTTP ───────────────────────────────────────
  console.log("\n🌐 API health endpoint\n");

  const { default: app } = await import("../app.js");
  const http = await import("http");
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;

  try {
    const health = await fetch(`http://127.0.0.1:${port}/api/health`).then((r) => r.json());
    if (health.data?.databases?.core?.connected && health.data?.databases?.ai?.connected) {
      pass("P1", "/api/health reports both DBs connected");
    } else {
      fail("P1", "/api/health DB status incorrect", JSON.stringify(health.data?.databases));
    }

    if (testToken) {
      const reg = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      });
      const loginData = await reg.json();
      if (reg.status === 200 && loginData.token) pass("P3", "POST /api/auth/login returns token");
      else fail("P3", "Login API failed", loginData.message);

      const me = await fetch(`http://127.0.0.1:${port}/api/auth/me`, {
        headers: { Authorization: `Bearer ${loginData.token}` },
      });
      if (me.status === 200) pass("P3", "GET /api/auth/me authorized");
      else fail("P3", "GET /api/auth/me failed", String(me.status));

      const my = await fetch(`http://127.0.0.1:${port}/api/rescue/my`, {
        headers: { Authorization: `Bearer ${loginData.token}` },
      });
      const myData = await my.json();
      if (my.status === 200 && Array.isArray(myData.data)) {
        pass("P4", `GET /api/rescue/my returns ${myData.data.length} rescue(s)`);
      } else {
        fail("P4", "GET /api/rescue/my failed", myData.message);
      }
    }
  } catch (e) {
    fail("API", "HTTP tests failed", e.message);
  } finally {
    server.close();
  }

  // ─── Cleanup test data ─────────────────────────────────────────
  console.log("\n🧹 Cleanup test documents\n");
  if (testRescue?._id) {
    await DispatchLog.deleteMany({ rescueRequest: testRescue._id });
    await MissionHistory.deleteMany({ rescueRequest: testRescue._id });
    await RescueRequest.deleteOne({ _id: testRescue._id });
  }
  if (testUser?._id) await User.deleteOne({ _id: testUser._id });
  pass("CLEANUP", "Verification test data removed");

  printSummary();
  process.exit(results.failed.length > 0 ? 1 : 0);
}

function printSummary() {
  console.log("\n" + "═".repeat(56));
  console.log(`\n📊 SUMMARY: ${results.passed.length} passed, ${results.failed.length} failed, ${results.warnings.length} warnings\n`);
  if (results.failed.length) {
    console.log("Failed:");
    results.failed.forEach((f) => console.log(`  • [${f.phase}] ${f.msg}${f.detail ? ` (${f.detail})` : ""}`));
  }
  if (results.warnings.length) {
    console.log("\nWarnings:");
    results.warnings.forEach((w) => console.log(`  • [${w.phase}] ${w.msg}`));
  }
  console.log("");
}

main().catch((e) => {
  console.error("Verification crashed:", e);
  process.exit(1);
});
