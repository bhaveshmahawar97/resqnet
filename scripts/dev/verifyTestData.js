/**
 * Verifies seeded test data via live API (server must be running on PORT).
 * Run: npm run verify:test
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = fs.existsSync(path.join(__dirname, "../../server/.env.local")) ? ".env.local" : ".env";
dotenv.config({ path: path.join(__dirname, `../../server/${envFile}`) });

const API = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}/api`;

const ACCOUNTS = [
  { label: "User", email: "aarav.sharma@test.com", password: "Aarav@123", endpoints: ["/rescue/my"] },
  { label: "NGO", email: "contact@jeevraksha.org", password: "NGO@123", endpoints: ["/rescue/all", "/rescue/assigned"] },
  { label: "Volunteer", email: "priya.verma@test.com", password: "Volunteer@123", endpoints: ["/rescue/my", "/rescue/assigned"] },
  { label: "Admin", email: "admin@resqnet.in", password: "Admin@123", endpoints: ["/rescue/all", "/rescue/stats/overview"] },
];

const login = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.token) throw new Error(data.message || `Login failed for ${email}`);
  return data;
};

const get = async (path, token) => {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

const main = async () => {
  console.log(`\n🔍 Verifying test data against ${API}\n`);
  let passed = 0;
  let failed = 0;

  for (const account of ACCOUNTS) {
    try {
      const { token, user } = await login(account.email, account.password);
      console.log(`✓ ${account.label} login — role: ${user.role}`);

      for (const ep of account.endpoints) {
        const result = await get(ep, token);
        const count = Array.isArray(result.data?.data) ? result.data.data.length : "—";
        if (result.ok) {
          console.log(`  ✓ GET ${ep} → ${result.status} (${count} records)`);
          passed++;
        } else {
          console.log(`  ✗ GET ${ep} → ${result.status} ${result.data?.message}`);
          failed++;
        }
      }
    } catch (err) {
      console.log(`✗ ${account.label}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
