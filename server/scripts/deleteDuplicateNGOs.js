import "../config/dns.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const deleteDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_CORE);
    console.log("Connected to MongoDB CORE");

    const db = mongoose.connection.db;
    const ngosCollection = db.collection("ngos");

    // Clean up duplicates by email
    const emailDuplicates = await ngosCollection.aggregate([
      { $group: { _id: { email: "$email" }, count: { $sum: 1 }, docs: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    for (const duplicate of emailDuplicates) {
      // Keep the first document, delete the rest
      const [keepId, ...deleteIds] = duplicate.docs;
      if (deleteIds.length > 0) {
        await ngosCollection.deleteMany({ _id: { $in: deleteIds } });
        console.log(`Deleted ${deleteIds.length} duplicates for email: ${duplicate._id.email}`);
      }
    }

    // Clean up duplicates by organizationName
    const orgDuplicates = await ngosCollection.aggregate([
      { $group: { _id: { organizationName: "$organizationName" }, count: { $sum: 1 }, docs: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    for (const duplicate of orgDuplicates) {
      // Keep the first document, delete the rest
      const [keepId, ...deleteIds] = duplicate.docs;
      if (deleteIds.length > 0) {
        await ngosCollection.deleteMany({ _id: { $in: deleteIds } });
        console.log(`Deleted ${deleteIds.length} duplicates for organizationName: ${duplicate._id.organizationName}`);
      }
    }

    console.log("Duplicate cleanup complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error cleaning up duplicates:", error);
    process.exit(1);
  }
};

deleteDuplicates();
