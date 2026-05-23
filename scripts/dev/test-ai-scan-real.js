#!/usr/bin/env node

/**
 * Real operational test of AI Scanner pipeline
 * Tests: image URL → OpenRouter vision → MongoDB save → response
 */

import fetch from "node-fetch";

const SERVER_URL = "http://localhost:5000";
const TEST_IMAGES = [
  {
    name: "dog_injured",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Black_labrador_retriever_portrait.jpg/320px-Black_labrador_retriever_portrait.jpg",
  },
  {
    name: "cat_street",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/400px-Cat03.jpg",
  },
];

async function testAiScan() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧪 AI SCANNER OPERATIONAL TEST");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Step 1: Login to get auth token
  console.log("\n📝 Step 1: Authentication");
  console.log("POST /api/auth/login");

  let token = null;
  try {
    const loginRes = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "aarav.sharma@test.com",
        password: "Aarav@123",
      }),
    });

    const loginData = await loginRes.json();
    console.log(`Status: ${loginRes.status}`);
    console.log("Response:", JSON.stringify(loginData, null, 2));

    if (!loginRes.ok || !loginData.token) {
      console.error("❌ Login failed, cannot proceed with scan test");
      return;
    }

    token = loginData.token;
    console.log("✅ Authenticated successfully");
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return;
  }

  // Step 2: Test AI scan with each image
  for (const testImg of TEST_IMAGES) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📸 Testing: ${testImg.name}`);
    console.log(`URL: ${testImg.url}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    try {
      const scanRes = await fetch(`${SERVER_URL}/api/ai/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: testImg.url,
        }),
      });

      const scanData = await scanRes.json();

      console.log(`\nStatus: ${scanRes.status}`);
      console.log("Full Response:");
      console.log(JSON.stringify(scanData, null, 2));

      if (!scanRes.ok) {
        console.error("❌ SCAN FAILED");
      } else {
        console.log("✅ SCAN SUCCESSFUL");
        if (scanData.data) {
          console.log("\nExtracted Data:");
          console.log(`  Animal: ${scanData.data.animal}`);
          console.log(`  Severity: ${scanData.data.severity}`);
          console.log(`  Confidence: ${scanData.data.confidence}%`);
          console.log(
            `  Recommendation: ${scanData.data.recommendation || "(none)"}`
          );
        }
      }
    } catch (err) {
      console.error("❌ NETWORK ERROR:", err.message);
    }

    // Rate limit pause
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(
    "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );
  console.log("✅ TEST COMPLETE");
  console.log("Check server terminal for debug logs");
  console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );
}

testAiScan().catch(console.error);
