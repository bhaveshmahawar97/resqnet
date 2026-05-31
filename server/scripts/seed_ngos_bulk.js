/*
 * Server-side bulk NGO + User seed script
 * Run from `server` folder: `node scripts/seed_ngos_bulk.js`
 */
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import crypto from "crypto";

// Load env from server/.env.local or server/.env
const envFile = fs.existsSync(path.resolve(process.cwd(), ".env.local")) ? ".env.local" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Ensure DNS helpers load before Mongo SRV resolution
await import("../config/dns.js");

const { connectDatabases } = await import("../config/database.js");
const { getCoreModels } = await import("../models/index.js");
const { registerUser, generateToken } = await import("../services/authService.js");
const bcrypt = (await import("bcryptjs")).default;

const ORGS = [
  { name: "GSM SQUAD", city: "Kota", state: "Rajasthan", category: "Animal Rescue", address: "Vigyan Nagar, Kota, Rajasthan" },
  { name: "Raj Bhanwar Welfare Trust", city: "Kota", state: "Rajasthan", category: "NGO", address: "Shastri Nagar, Dadabari, Kota, Rajasthan" },
  { name: "Apple Dog Society", city: "Kota", state: "Rajasthan", category: "Animal Shelter", address: "Dadabari, Kota, Rajasthan" },
  { name: "City Pet Hospital", city: "Kota", state: "Rajasthan", category: "Animal Hospital", address: "Shastri Nagar, Dadabari, Kota, Rajasthan" },
  { name: "Urban Pet Clinic", city: "Kota", state: "Rajasthan", category: "Veterinary Clinic", address: "Shrinath Puram, Kota, Rajasthan" },
  { name: "Pet Health Care Center", city: "Kota", state: "Rajasthan", category: "Veterinary Clinic", address: "New Jawahar Nagar, Kota, Rajasthan" },
  { name: "Vishal Vishwas Rescue Animal Service", city: "Kota", state: "Rajasthan", category: "Animal Rescue", address: "Industrial Area, Kota, Rajasthan" },
  { name: "Bejubano Ka Aashiyana", city: "Jaipur", state: "Rajasthan", category: "Animal Shelter", address: "Kalwar Road, Jaipur, Rajasthan" },
  { name: "Hope And Beyond", city: "Jaipur", state: "Rajasthan", category: "NGO", address: "Vaishali Nagar, Jaipur, Rajasthan" },
  { name: "Hope And Beyond Heerapura", city: "Jaipur", state: "Rajasthan", category: "Animal Rescue", address: "Heerapura, Jaipur, Rajasthan" },
  { name: "Snake Helpline Jaipur Nature Care", city: "Jaipur", state: "Rajasthan", category: "Wildlife Rescue", address: "Durgapura, Jaipur, Rajasthan" },
  { name: "Sanjay Gandhi Animal Care Centre", city: "New Delhi", state: "Delhi", category: "Animal Shelter", address: "Raja Garden, New Delhi" },
  { name: "People For Animals Delhi", city: "New Delhi", state: "Delhi", category: "NGO", address: "New Delhi, Delhi" },
  { name: "People For Animals Dehradun", city: "Dehradun", state: "Uttarakhand", category: "NGO", address: "Dehradun, Uttarakhand" },
  { name: "Animals People Alliance", city: "Dehradun", state: "Uttarakhand", category: "Animal Rescue", address: "Dehradun, Uttarakhand" },
  { name: "Animal Aid Unlimited", city: "Udaipur", state: "Rajasthan", category: "Animal Shelter", address: "Badi Village, Udaipur, Rajasthan" },
  { name: "SPCA Udaipur", city: "Udaipur", state: "Rajasthan", category: "Animal Shelter", address: "Udaipur, Rajasthan" },
  { name: "SPCA Ajmer", city: "Ajmer", state: "Rajasthan", category: "Animal Shelter", address: "Ajmer, Rajasthan" },
  { name: "Karni Animal Welfare Society", city: "Ajmer", state: "Rajasthan", category: "NGO", address: "Ajmer, Rajasthan" },
];

const CITY_COORDS = {
  Kota: { lat: 25.2138, lon: 75.8648 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  "New Delhi": { lat: 28.6139, lon: 77.2090 },
  Dehradun: { lat: 30.3165, lon: 78.0322 },
  Udaipur: { lat: 24.5854, lon: 73.7125 },
  Ajmer: { lat: 26.4499, lon: 74.6399 },
};

const CATEGORY_MAP = {
  "NGO": ["Welfare"],
  "Animal Shelter": ["Shelter"],
  "Animal Rescue": ["Rescue"],
  "Veterinary Clinic": ["Medical"],
  "Animal Hospital": ["Medical"],
  "Wildlife Rescue": ["Wildlife"],
};

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");

const generatePhone = (i) => `+91 90000${(10000 + i).toString().slice(-5)}`;

const generatePassword = () => {
  return "ResqNet!" + crypto.randomBytes(3).toString("hex");
};

async function run() {
  console.log("🚀 Starting bulk NGO + user seed (server context)...");

  try {
    await connectDatabases();
    const models = getCoreModels();
    const NGO = models.NGO;
    const User = models.User;

    if (!NGO || !User) throw new Error("Required models not found");

    const report = [];

    let phoneCounter = 1;
    for (const org of ORGS) {
      try {
        // prepare data
        const email = `${slug(org.name)}.${slug(org.city)}@example.com`;
        const phone = generatePhone(phoneCounter++);
        const password = generatePassword();
        const { lat, lon } = CITY_COORDS[org.city] || { lat: null, lon: null };
        const ngoType = CATEGORY_MAP[org.category] || ["Other"];

        // check duplicate NGO by organizationName + city OR email
        const existingNgo = await NGO.findOne({ $or: [{ organizationName: org.name }, { email }] });
        if (existingNgo) {
          report.push({ name: org.name, skipped: true, reason: "duplicate" , id: existingNgo._id.toString()});
          continue;
        }

        // ensure user exists
        let user = await User.findOne({ email });
        if (!user) {
          const hashed = await bcrypt.hash(password, 10);
          user = await User.create({ fullName: org.name, email, password: hashed, role: "ngo", phone });
        }

        // create NGO document
        const ngoDoc = new NGO({
          organizationName: org.name,
          email,
          phone,
          address: org.address,
          city: org.city,
          state: org.state,
          pincode: org.pincode || "",
          ngoType,
          description: org.description || `${org.name} - ${org.category} in ${org.city}`,
          website: org.website || "",
          logo: { url: "https://via.placeholder.com/150", publicId: "" },
          verified: true,
          verificationStatus: "approved",
          verifiedAt: new Date(),
          isActive: true,
          latitude: lat,
          longitude: lon,
        });

        await ngoDoc.save();

        // link NGO to user profile
        user.role = "ngo";
        user.ngoProfile = {
          organizationName: org.name,
          city: org.city,
          latitude: lat ?? null,
          longitude: lon ?? null,
          registrationId: ngoDoc.registrationNumber || "",
          serviceAreas: [org.city],
          description: ngoDoc.description || "",
          website: ngoDoc.website || "",
          verified: true,
        };
        await user.save();

        // generate auth token
        const token = generateToken(user._id);

        report.push({ name: org.name, id: ngoDoc._id.toString(), email, phone, password, token });
      } catch (err) {
        console.error(`Failed to insert ${org.name}:`, err.message || err);
        report.push({ name: org.name, error: err.message || String(err) });
      }
    }

    const inserted = report.filter((r) => r.id).length;
    console.log(`\n✅ Seed completed. NGOs inserted: ${inserted}/${ORGS.length}`);
    console.log(JSON.stringify(report, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("Seed script failed:", err.message || err);
    process.exit(1);
  }
}

run();
