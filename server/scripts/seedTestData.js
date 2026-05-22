/**
 * ResQNet — Indian operational test data seed
 * Run: npm run seed:test
 */
import "../config/dns.js";
import dotenv from "dotenv";
import fs from "fs";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import connectDatabases from "../config/database.js";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { User, RescueRequest, DispatchLog, MissionHistory, Notification } from "../models/index.js";
import { buildTimelineEntry } from "../services/rescueService.js";
import { recordDispatchEvent, recordMissionHistory } from "../services/dispatchService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = fs.existsSync(path.join(__dirname, "../.env.local")) ? ".env.local" : ".env";
dotenv.config({ path: path.join(__dirname, `../${envFile}`) });

const TEST_USERS = [
  {
    fullName: "Aarav Sharma",
    email: "aarav.sharma@test.com",
    password: "Aarav@123",
    role: "user",
    phone: "+91 98765 43210",
  },
  {
    fullName: "Jeev Raksha Foundation",
    email: "contact@jeevraksha.org",
    password: "NGO@123",
    role: "ngo",
    phone: "+91 141 255 7890",
    ngoProfile: {
      organizationName: "Jeev Raksha Foundation",
      registrationId: "RJ-NGO-2018-4521",
      serviceAreas: ["Jaipur", "Ajmer", "Tonk"],
      description:
        "Registered animal welfare NGO serving Jaipur and surrounding districts since 2018.",
      website: "https://jeevraksha.org",
      verified: true,
    },
  },
  {
    fullName: "Priya Verma",
    email: "priya.verma@test.com",
    password: "Volunteer@123",
    role: "volunteer",
    phone: "+91 98290 11223",
    volunteerProfile: {
      skills: ["First aid", "Animal handling", "Transport"],
      availability: "available",
      serviceRadiusKm: 25,
      bio: "Volunteer rescuer based in Jaipur — 3 years field experience.",
      verified: true,
    },
  },
  {
    fullName: "Rohan Mehta",
    email: "admin@resqnet.in",
    password: "Admin@123",
    role: "admin",
    phone: "+91 11 4000 9000",
  },
];

/** Stable public images (fetched by Cloudinary into resqnet/rescues) */
const SAMPLE_IMAGES = {
  dog: [
    "https://picsum.photos/id/237/900/600",
    "https://picsum.photos/id/1080/900/600",
    "https://picsum.photos/id/419/900/600",
  ],
  cat: [
    "https://picsum.photos/id/452/900/600",
    "https://picsum.photos/id/1025/900/600",
  ],
};

const uploadImageFromUrl = async (url, publicIdSuffix) => {
  if (!isCloudinaryConfigured()) {
    console.warn("  ⚠ Cloudinary not configured — using remote URL as fallback");
    return url;
  }

  const result = await cloudinary.uploader.upload(url, {
    folder: "resqnet/rescues",
    resource_type: "image",
    public_id: `seed_${publicIdSuffix}_${Date.now()}`,
    overwrite: false,
  });

  return result.secure_url;
};

const upsertUser = async (spec) => {
  const hashed = await bcrypt.hash(spec.password, 10);
  const update = {
    fullName: spec.fullName,
    password: hashed,
    role: spec.role,
    phone: spec.phone || "",
    isActive: true,
    lastLoginAt: new Date(),
    ...(spec.ngoProfile && { ngoProfile: spec.ngoProfile }),
    ...(spec.volunteerProfile && { volunteerProfile: spec.volunteerProfile }),
  };

  const user = await User.findOneAndUpdate(
    { email: spec.email.toLowerCase() },
    { $set: update },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  return user;
};

const seedRescue = async ({
  creator,
  animalType,
  condition,
  description,
  severity,
  address,
  latitude,
  longitude,
  imageUrls,
  status = "pending",
  dispatchStatus = "unassigned",
  assignedNgo = null,
  assignedVolunteer = null,
  acceptedBy = null,
}) => {
  const existing = await RescueRequest.findOne({
    createdBy: creator._id,
    address,
    animalType,
  });

  if (existing) {
    console.log(`  ↳ Rescue already exists: ${animalType} @ ${address}`);
    return existing;
  }

  const timelineEntry = buildTimelineEntry("pending", creator, "Rescue request created (test seed)");

  const rescue = await RescueRequest.create({
    animalType,
    condition,
    description,
    severity,
    missionPriority: severity,
    images: imageUrls,
    latitude,
    longitude,
    address,
    contactPhone: creator.phone || "+91 90000 00000",
    status,
    dispatchStatus,
    createdBy: creator._id,
    assignedNgo,
    assignedVolunteer,
    acceptedBy,
    acceptedAt: acceptedBy ? new Date() : null,
    rescueTimeline: [timelineEntry],
    statusHistory: [timelineEntry],
  });

  await recordDispatchEvent({
    rescueRequestId: rescue._id,
    eventType: "rescue_created",
    actor: creator,
    newState: { status, dispatchStatus, severity },
    note: "Seeded test rescue",
  });

  await recordMissionHistory({
    rescueRequestId: rescue._id,
    actor: creator,
    action: "rescue_created",
    toStatus: "pending",
    note: timelineEntry.note,
  });

  return rescue;
};

const main = async () => {
  console.log("\n🌱 ResQNet — Seeding Indian operational test data\n");

  await connectDatabases();

  console.log("👤 Creating test accounts...");
  const users = {};
  for (const spec of TEST_USERS) {
    const user = await upsertUser(spec);
    if (spec.email === "aarav.sharma@test.com") users.aarav = user;
    if (spec.email === "contact@jeevraksha.org") users.ngo = user;
    if (spec.email === "priya.verma@test.com") users.priya = user;
    if (spec.email === "admin@resqnet.in") users.admin = user;
    console.log(`  ✓ ${spec.role.padEnd(10)} ${spec.email}`);
  }

  await User.findByIdAndUpdate(users.admin._id, {
    $set: { role: "admin" },
    $inc: { "missionStats.rescuesCreated": 0 },
  });
  console.log("  ✓ admin@resqnet.in promoted to role: admin\n");

  console.log("📷 Uploading rescue images to Cloudinary (resqnet/rescues)...");
  const dogImages = [];
  for (let i = 0; i < SAMPLE_IMAGES.dog.length; i++) {
    const url = await uploadImageFromUrl(SAMPLE_IMAGES.dog[i], `dog_${i}`);
    dogImages.push(url);
    console.log(`  ✓ Dog image ${i + 1}: ${url.slice(0, 60)}...`);
  }

  const catImages = [];
  for (let i = 0; i < SAMPLE_IMAGES.cat.length; i++) {
    const url = await uploadImageFromUrl(SAMPLE_IMAGES.cat[i], `cat_${i}`);
    catImages.push(url);
    console.log(`  ✓ Cat image ${i + 1}: ${url.slice(0, 60)}...`);
  }

  console.log("\n🚨 Creating rescue requests...");
  const rescue1 = await seedRescue({
    creator: users.aarav,
    animalType: "Street Dog",
    condition: "Severe leg injury",
    description:
      "Dog hit by vehicle near Bapu Bazaar market area. Bleeding from hind leg, unable to stand. Crowd gathered — needs urgent rescue and vet care.",
    severity: "critical",
    address: "Bapu Bazaar, Johari Bazaar Road, Jaipur, Rajasthan 302003",
    latitude: 26.9240,
    longitude: 75.8266,
    imageUrls: dogImages,
    status: "accepted",
    dispatchStatus: "accepted",
    assignedNgo: users.ngo._id,
    assignedVolunteer: users.priya._id,
    acceptedBy: users.ngo._id,
  });
  console.log(`  ✓ Rescue 1 (critical, Jaipur): ${rescue1._id}`);

  const rescue2 = await seedRescue({
    creator: users.aarav,
    animalType: "Cat",
    condition: "Dehydrated and unable to walk",
    description:
      "Female cat found near Fateh Sagar Lake — extremely weak, not eating for 2 days. Suspected dehydration in summer heat.",
    severity: "medium",
    address: "Fateh Sagar Lake, Udaipur, Rajasthan 313001",
    latitude: 24.6012,
    longitude: 73.6822,
    imageUrls: catImages,
    status: "pending",
    dispatchStatus: "unassigned",
  });
  console.log(`  ✓ Rescue 2 (medium, Udaipur): ${rescue2._id}`);

  const rescue3 = await seedRescue({
    creator: users.aarav,
    animalType: "Cow",
    condition: "Limping on front leg",
    description:
      "Injured cow near MI Road — possible traffic injury. Needs NGO assessment and shelter transport.",
    severity: "high",
    address: "MI Road, Jaipur, Rajasthan 302001",
    latitude: 26.9124,
    longitude: 75.7873,
    imageUrls: [dogImages[0]],
    status: "pending",
    dispatchStatus: "unassigned",
  });
  console.log(`  ✓ Rescue 3 (high, Jaipur): ${rescue3._id} — extra queue item for NGO\n`);

  const counts = {
    users: await User.countDocuments(),
    rescues: await RescueRequest.countDocuments(),
    dispatchLogs: await DispatchLog.countDocuments(),
    notifications: await Notification.countDocuments(),
    missionHistory: await MissionHistory.countDocuments(),
  };

  console.log("📊 Collection counts:");
  Object.entries(counts).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("TEST ACCOUNTS (use on http://localhost:5173)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  TEST_USERS.forEach((u) => {
    console.log(`  ${u.role.toUpperCase().padEnd(10)} ${u.email} / ${u.password}`);
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(0);
};

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
