import "../config/dns.js";
import { connectDatabases } from "../config/database.js";
import { NGO } from "../models/index.js";

const run = async () => {
  try {
    await connectDatabases();
    console.log("Connected. Updating NGO addresses...");

    const addresses = [
      "123 Rescue Road, Block C, Green Park",
      "45 Shelter Ave, Industrial Area Phase 1",
      "89 Wildlife Sanctorum, Forest Reserve Road",
      "12 Medical Wing, City Hospital Complex",
      "56 Welfare Street, Downtown District",
    ];

    const ngos = await NGO.find({});
    console.log(`Found ${ngos.length} NGOs to update.`);

    for (let i = 0; i < ngos.length; i++) {
      const ngo = ngos[i];
      // assign a random address from the list
      ngo.address = addresses[i % addresses.length];
      await ngo.save();
    }

    console.log("Successfully updated all NGO addresses.");
    process.exit(0);
  } catch (err) {
    console.error("Error updating NGOs:", err);
    process.exit(1);
  }
};

run();
