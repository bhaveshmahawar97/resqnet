/**
 * Seed script for NGO data
 * Run: node server/scripts/seedNgos.js
 */
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load env from server/.env or server/.env.local (relative to current working dir)
const envFile = fs.existsSync(path.resolve(process.cwd(), ".env.local")) ? ".env.local" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Ensure DNS servers are configured before any MongoDB SRV resolution happens
await import("../../server/config/dns.js");

const { connectDatabases } = await import("../../server/config/database.js");
const { getCoreModels } = await import("../../server/models/index.js");

const NGOS_DATA = [
  // Kota, Rajasthan
  {
    organizationName: "Apple dog society ngo kota",
    email: "appledog.kota@example.com",
    phone: "+91 86964 25625",
    address: "Dadabari, near Vanshika Beauty Parlour, Kota, Rajasthan 324005",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324005",
    ngoType: ["Rescue", "Welfare"],
    description: "Animal rescue & welfare NGO dedicated to helping stray animals in Kota",
    verified: true,
    latitude: 25.2108,
    longitude: 75.8863,
  },
  {
    organizationName: "Vishal vishvash rescue animals service",
    email: "vishal.rescue@example.com",
    phone: "+91 86964 25625",
    address: "Surya Nagar Choraha, near SR School, Kota Industrial Area, Kota, Rajasthan 324003",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324003",
    ngoType: ["Rescue"],
    description: "Professional animal rescue service for Kota and surrounding areas",
    verified: true,
    latitude: 25.1908,
    longitude: 75.9085,
  },
  {
    organizationName: "GSM SQUAD",
    email: "gsm.squad@example.com",
    phone: "+91 86964 25625",
    address: "2, CH-13, Vigyan Nagar, Kota, Rajasthan 324005",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324005",
    ngoType: ["Rescue", "Welfare"],
    description: "Active rescue & welfare group committed to animal protection",
    verified: true,
    latitude: 25.2157,
    longitude: 75.9019,
  },
  {
    organizationName: "RAJ Bhanwar Welfare Trust",
    email: "raj.bhanwar@example.com",
    phone: "+91 86964 25625",
    address: "Flat No. 204, Orient Brij, 760, Shastri Nagar, Dadabari, Kota, Rajasthan 324009",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324009",
    ngoType: ["Welfare"],
    description: "Welfare trust focused on animal care and rehabilitation",
    verified: true,
    latitude: 25.2087,
    longitude: 75.8901,
  },
  {
    organizationName: "P.A.H.A.L. Foundation",
    email: "pahal.foundation@example.com",
    phone: "+91 86964 25625",
    address: "GF-16, Akash Mall, Aerodrome Circle, Ramchandrapura, Dhanmandi, Kota, Rajasthan 324009",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324009",
    ngoType: ["Welfare", "Adoption"],
    description: "NGO & animal support initiatives for rescue and adoption",
    verified: true,
    latitude: 25.1832,
    longitude: 75.8752,
  },
  {
    organizationName: "ROCKY DENIYAL SNAKE AND REPTILE RESCUE",
    email: "rocky.deniyal@example.com",
    phone: "+91 80056 58667",
    address: "Jhalawar Road, Pandit Deen Dayal Nagar, Rangbari, Kota, Rajasthan 324005",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324005",
    ngoType: ["Rescue", "Wildlife"],
    description: "Specialized snake and reptile rescue operations",
    verified: true,
    latitude: 25.2245,
    longitude: 75.8934,
  },
  {
    organizationName: "Snakes and Reptile Rescue by Changej Khan",
    email: "changej.reptile@example.com",
    phone: "+91 63501 04992",
    address: "House No. 560, Purani Sabjimandi, Indra Market Road, Rampura, Kota, Rajasthan 324006",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324006",
    ngoType: ["Rescue", "Wildlife"],
    description: "Expert reptile and snake rescue service",
    verified: true,
    latitude: 25.1945,
    longitude: 75.8678,
  },
  {
    organizationName: "Godavri dham gaushala",
    email: "godavri.gaushala@example.com",
    phone: "+91 86964 25625",
    address: "Waqf Nagar, Dadabari, Kota, Rajasthan 324009",
    city: "Kota",
    state: "Rajasthan",
    pincode: "324009",
    ngoType: ["Sanctuary", "Welfare"],
    description: "Cow shelter and gaushala dedicated to cattle care",
    verified: true,
    latitude: 25.2001,
    longitude: 75.8976,
  },

  // Jaipur, Rajasthan
  {
    organizationName: "Help In Suffering",
    email: "help.suffering@example.com",
    phone: "+91 141 2368899",
    address: "Maharani Farm, Durgapura, Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    ngoType: ["Rescue", "Medical", "Shelter"],
    description: "Comprehensive animal rescue and medical services",
    verified: true,
    latitude: 26.9124,
    longitude: 75.8032,
  },
  {
    organizationName: "RAKSHA JAIPUR SHELTER",
    email: "raksha.jaipur@example.com",
    phone: "+91 141 5169999",
    address: "Malviya Nagar, Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    ngoType: ["Shelter", "Rescue"],
    description: "Animal shelter providing rescue and rehabilitation services",
    verified: true,
    latitude: 26.8845,
    longitude: 75.7878,
  },
  {
    organizationName: "We For Animals",
    email: "weforanimals@example.com",
    phone: "+91 141 4050505",
    address: "Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    ngoType: ["Rescue", "Welfare", "Adoption"],
    description: "Animal welfare & rescue NGO with focus on adoption",
    verified: true,
    latitude: 26.9124,
    longitude: 75.7873,
  },
  {
    organizationName: "Go Nirvana Foundation",
    email: "gonirvana@example.com",
    phone: "+91 141 4545454",
    address: "Mansarovar, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    ngoType: ["Welfare", "Adoption"],
    description: "Animal welfare organization dedicated to rescue and rehabilitation",
    verified: true,
    latitude: 26.8945,
    longitude: 75.7645,
  },
  {
    organizationName: "Ashray Rescue & Relief Shelter",
    email: "ashray.shelter@example.com",
    phone: "+91 85610 44444",
    address: "Niwaru Road, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    ngoType: ["Shelter", "Rescue", "Medical"],
    description: "Rescue and relief shelter with medical facilities",
    verified: true,
    latitude: 26.9678,
    longitude: 75.7823,
  },

  // Udaipur, Rajasthan
  {
    organizationName: "Animal Aid Unlimited",
    email: "animalaid.udaipur@example.com",
    phone: "+91 98298 43726",
    address: "Badi Village, Liyo Ka Gurha, near Badi TB Hospital, Udaipur, Rajasthan 313001",
    city: "Udaipur",
    state: "Rajasthan",
    pincode: "313001",
    ngoType: ["Rescue", "Medical", "Shelter"],
    description: "One of India's largest street-animal rescue centers",
    verified: true,
    latitude: 24.5854,
    longitude: 73.9932,
  },
  {
    organizationName: "Animal Protection Society",
    email: "aps.udaipur@example.com",
    phone: "+91 94689 57783",
    address: "New Bhupalpura, Rupsagar, Udaipur, Rajasthan 313001",
    city: "Udaipur",
    state: "Rajasthan",
    pincode: "313001",
    ngoType: ["Rescue", "Welfare"],
    description: "Dedicated to animal protection and welfare",
    verified: true,
    latitude: 24.5741,
    longitude: 73.9834,
  },
  {
    organizationName: "Udaipur animal feed NGO",
    email: "udaipur.feed@example.com",
    phone: "+91 63671 39345",
    address: "Sidharth Nagar, New Bhupalpura, Udaipur, Rajasthan 313001",
    city: "Udaipur",
    state: "Rajasthan",
    pincode: "313001",
    ngoType: ["Welfare"],
    description: "NGO focused on animal feeding and care programs",
    verified: true,
    latitude: 24.5745,
    longitude: 73.9856,
  },
  {
    organizationName: "Udaipur Animal Welfare",
    email: "udaipur.welfare@example.com",
    phone: "+91 63762 04936",
    address: "A-5, Gayatri Nagar, Sector 5, Hiran Magri, Udaipur, Rajasthan 313002",
    city: "Udaipur",
    state: "Rajasthan",
    pincode: "313002",
    ngoType: ["Welfare", "Medical"],
    description: "Comprehensive animal welfare and medical services",
    verified: true,
    latitude: 24.5612,
    longitude: 73.9945,
  },

  // Dehradun, Uttarakhand
  {
    organizationName: "Animal rescue help",
    email: "help.dehradun@example.com",
    phone: "+91 135 2600000",
    address: "Dehradun, Uttarakhand",
    city: "Dehradun",
    state: "Uttarakhand",
    ngoType: ["Rescue"],
    description: "24×7 rescue support for animals in distress",
    verified: true,
    latitude: 30.1332,
    longitude: 78.0321,
  },
  {
    organizationName: "People For Animals",
    email: "pfa.dehradun@example.com",
    phone: "+91 135 2765432",
    address: "Dehradun, Uttarakhand",
    city: "Dehradun",
    state: "Uttarakhand",
    ngoType: ["Rescue", "Medical", "Welfare"],
    description: "National animal welfare NGO network",
    verified: true,
    latitude: 30.1401,
    longitude: 78.0234,
  },

  // Roorkee, Uttarakhand
  {
    organizationName: "People For Animals Roorkee Unit",
    email: "pfa.roorkee@example.com",
    phone: "+91 1332 234567",
    address: "Roorkee, Uttarakhand",
    city: "Roorkee",
    state: "Uttarakhand",
    ngoType: ["Rescue", "Welfare"],
    description: "Animal rescue & welfare support in Roorkee",
    verified: true,
    latitude: 29.8565,
    longitude: 77.8737,
  },

  // Jaisalmer, Rajasthan
  {
    organizationName: "Local Camel & Animal Rescue Networks",
    email: "camel.rescue@example.com",
    phone: "+91 2992 251234",
    address: "Jaisalmer district, Rajasthan",
    city: "Jaisalmer",
    state: "Rajasthan",
    ngoType: ["Rescue", "Wildlife"],
    description: "Specialized camel rescue & rural animal support",
    verified: true,
    latitude: 26.9124,
    longitude: 70.8903,
  },

  // Mumbai, Maharashtra
  {
    organizationName: "World For All Animal Care & Adoptions",
    email: "worldforall@example.com",
    phone: "+91 22 61919191",
    address: "Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    ngoType: ["Adoption", "Rescue", "Welfare"],
    description: "Animal adoption & rescue network",
    verified: true,
    latitude: 19.0760,
    longitude: 72.8777,
  },
  {
    organizationName: "The Feline Foundation",
    email: "feline.mumbai@example.com",
    phone: "+91 22 65000001",
    address: "Andheri, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    ngoType: ["Rescue", "Sanctuary"],
    description: "Cat rescue & shelter focusing on feline welfare",
    verified: true,
    latitude: 19.1136,
    longitude: 72.8697,
  },
  {
    organizationName: "Resqink Association for Wildlife Welfare",
    email: "resqink@example.com",
    phone: "+91 22 25872556",
    address: "Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    ngoType: ["Wildlife", "Rescue"],
    description: "Wildlife rescue organization",
    verified: true,
    latitude: 19.0760,
    longitude: 72.8777,
  },
];

async function seedNgos() {
  try {
    console.log("🚀 Starting NGO seed script...");

    await connectDatabases();
    const models = getCoreModels();
    const NGO = models.NGO;

    if (!NGO) {
      throw new Error("NGO model not found");
    }

    // Check if NGOs already exist
    const existingCount = await NGO.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing NGOs. Skipping duplicate seed.`);
      console.log(
        "💡 To reset: Delete entries manually or run: db.ngos.deleteMany({})"
      );
      process.exit(0);
    }

    console.log(`📝 Inserting ${NGOS_DATA.length} NGO records...`);

    const result = await NGO.insertMany(NGOS_DATA);

    console.log(
      `✅ Successfully seeded ${result.length} NGOs into the database`
    );
    const byCity = result.reduce((acc, ngo) => {
      acc[ngo.city] = (acc[ngo.city] || 0) + 1;
      return acc;
    }, {});
    console.log(`📊 NGOs by city: ${JSON.stringify(byCity)}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seedNgos();
