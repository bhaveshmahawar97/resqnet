import "../config/dns.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import NGO from "../models/NGO.js";

dotenv.config();

const getNGOs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_CORE);
    const ngos = await NGO.find({ verified: true }).select("organizationName city address").lean();
    console.log(JSON.stringify(ngos, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

getNGOs();
