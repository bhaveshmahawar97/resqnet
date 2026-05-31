/*
 * Bulk Adoption seeding script
 * Run from `server` folder: `node scripts/seed_adoptions_bulk.js`
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

const PETS_DATA = [
  {
    name: "Sheru",
    species: "Dog",
    breed: "Indian Pariah",
    age: "2 Years",
    gender: "Male",
    color: "Brown",
    ngo: "Animal Aid Unlimited",
    city: "Udaipur",
    description: "Friendly and playful Indian Pariah looking for a loving home. Sheru is energetic and loves playtime.",
    temperament: "Friendly, Active, Playful, Good with Kids",
    weight: "18 kg",
  },
  {
    name: "Tommy",
    species: "Dog",
    breed: "Labrador Mix",
    age: "3 Years",
    gender: "Male",
    color: "Golden",
    ngo: "GSM SQUAD",
    city: "Kota",
    description: "Golden Labrador mix with a calm temperament. Tommy enjoys walks and is great with families.",
    temperament: "Calm, Friendly, Good with Kids",
    weight: "28 kg",
  },
  {
    name: "Bruno",
    species: "Dog",
    breed: "German Shepherd Mix",
    age: "1.5 Years",
    gender: "Male",
    color: "Black Tan",
    ngo: "Raj Bhanwar Welfare Trust",
    city: "Kota",
    description: "Intelligent and loyal German Shepherd mix. Bruno is trained and responds well to commands.",
    temperament: "Active, Friendly, Playful",
    weight: "26 kg",
  },
  {
    name: "Julie",
    species: "Dog",
    breed: "Indian Pariah",
    age: "8 Months",
    gender: "Female",
    color: "White Brown",
    ngo: "Bejubano Ka Aashiyana",
    city: "Jaipur",
    description: "Young energetic pup with a playful nature. Julie is perfect for an active family.",
    temperament: "Active, Playful, Friendly",
    weight: "12 kg",
  },
  {
    name: "Rocky",
    species: "Dog",
    breed: "Indie",
    age: "4 Years",
    gender: "Male",
    color: "Black",
    ngo: "People For Animals Delhi",
    city: "New Delhi",
    description: "Calm and composed indie dog with good manners. Rocky is a great companion for seniors too.",
    temperament: "Calm, Friendly",
    weight: "20 kg",
  },
  {
    name: "Mimi",
    species: "Cat",
    breed: "Indian Domestic",
    age: "1 Year",
    gender: "Female",
    color: "White",
    ngo: "Animal Aid Unlimited",
    city: "Udaipur",
    description: "Sweet white kitten who loves cuddles and play. Mimi is affectionate and gentle.",
    temperament: "Calm, Friendly, Playful",
    weight: "3 kg",
  },
  {
    name: "Simba",
    species: "Cat",
    breed: "Indian Domestic",
    age: "2 Years",
    gender: "Male",
    color: "Orange",
    ngo: "SPCA Udaipur",
    city: "Udaipur",
    description: "Orange tabby with a bold personality. Simba is independent but loves attention from his humans.",
    temperament: "Active, Playful",
    weight: "4.5 kg",
  },
  {
    name: "Kitty",
    species: "Cat",
    breed: "Persian Mix",
    age: "10 Months",
    gender: "Female",
    color: "Grey",
    ngo: "People For Animals Dehradun",
    city: "Dehradun",
    description: "Beautiful grey Persian mix with soft fur. Kitty loves lounging and calm environments.",
    temperament: "Calm, Friendly",
    weight: "3.5 kg",
  },
  {
    name: "Oreo",
    species: "Cat",
    breed: "Indian Domestic",
    age: "1.5 Years",
    gender: "Male",
    color: "Black White",
    ngo: "SPCA Ajmer",
    city: "Ajmer",
    description: "Adorable black and white cat with unique markings. Oreo is playful and curious.",
    temperament: "Playful, Active, Friendly",
    weight: "4 kg",
  },
  {
    name: "Snowy",
    species: "Rabbit",
    breed: "White Rabbit",
    age: "8 Months",
    gender: "Female",
    color: "White",
    ngo: "Karni Animal Welfare Society",
    city: "Ajmer",
    description: "Cute fluffy white rabbit. Snowy is gentle and perfect for families with children.",
    temperament: "Calm, Friendly",
    weight: "2 kg",
  },
  {
    name: "Bunny",
    species: "Rabbit",
    breed: "Dutch Rabbit",
    age: "1 Year",
    gender: "Male",
    color: "Black White",
    ngo: "Hope And Beyond",
    city: "Jaipur",
    description: "Energetic Dutch rabbit with distinctive markings. Bunny enjoys hopping around spacious areas.",
    temperament: "Active, Playful",
    weight: "2.5 kg",
  },
  {
    name: "Mithu",
    species: "Parrot",
    breed: "Indian Ringneck",
    age: "2 Years",
    gender: "Male",
    color: "Green",
    ngo: "Animals People Alliance",
    city: "Dehradun",
    description: "Intelligent Indian Ringneck parrot. Mithu can mimic sounds and loves interaction.",
    temperament: "Active, Playful, Friendly",
    weight: "0.15 kg",
  },
  {
    name: "Chintu",
    species: "Parrot",
    breed: "Alexandrine Parakeet",
    age: "1 Year",
    gender: "Male",
    color: "Green Red",
    ngo: "People For Animals Delhi",
    city: "New Delhi",
    description: "Beautiful Alexandrine parakeet with vibrant colors. Chintu is social and playful.",
    temperament: "Active, Playful, Friendly",
    weight: "0.3 kg",
  },
  {
    name: "Luna",
    species: "Dog",
    breed: "Indie",
    age: "6 Months",
    gender: "Female",
    color: "Cream",
    ngo: "Apple Dog Society",
    city: "Kota",
    description: "Sweet cream-colored pup full of energy and love. Luna will grow into a wonderful companion.",
    temperament: "Active, Playful, Friendly, Good with Kids",
    weight: "10 kg",
  },
  {
    name: "Coco",
    species: "Cat",
    breed: "Indian Domestic",
    age: "7 Months",
    gender: "Female",
    color: "Calico",
    ngo: "Sanjay Gandhi Animal Care Centre",
    city: "New Delhi",
    description: "Colorful calico kitten with a vibrant personality. Coco is curious and loves exploring.",
    temperament: "Active, Playful, Friendly",
    weight: "3.2 kg",
  },
];

const CITY_COORDS = {
  Kota: { lat: 25.2138, lon: 75.8648 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  "New Delhi": { lat: 28.6139, lon: 77.2090 },
  Dehradun: { lat: 30.3165, lon: 78.0322 },
  Udaipur: { lat: 24.5854, lon: 73.7125 },
  Ajmer: { lat: 26.4499, lon: 74.6399 },
};

// Generate adoption fee based on species
const getAdoptionFee = (species) => {
  const fees = {
    Dog: Math.floor(Math.random() * (2500 - 1000 + 1) + 1000), // 1000-2500
    Cat: Math.floor(Math.random() * (1500 - 500 + 1) + 500),   // 500-1500
    Rabbit: Math.floor(Math.random() * (800 - 300 + 1) + 300), // 300-800
    Parrot: Math.floor(Math.random() * (3000 - 1500 + 1) + 1500), // 1500-3000
  };
  return fees[species] || 1000;
};

// Generate image URLs based on species and breed
const generateImageUrl = (name, species, breed) => {
  const imageMap = {
    Dog: [
      "https://images.unsplash.com/photo-1633722715463-d30628519e8c?w=400&h=300&fit=crop", // Happy dog
      "https://images.unsplash.com/photo-1587300411515-150663f45d55?w=400&h=300&fit=crop", // Brown dog
      "https://images.unsplash.com/photo-1560807707-38cc1e9b112d?w=400&h=300&fit=crop", // Dog portrait
      "https://images.unsplash.com/photo-1537151608828-8e48b1a4ff6f?w=400&h=300&fit=crop", // Puppy
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=300&fit=crop", // Golden retriever
    ],
    Cat: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop", // Orange cat
      "https://images.unsplash.com/photo-1592194996744-658276eab0da?w=400&h=300&fit=crop", // White cat
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400&h=300&fit=crop", // Kitten
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop", // Cat close-up
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop", // Sleeping cat
    ],
    Rabbit: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f0?w=400&h=300&fit=crop", // White rabbit
      "https://images.unsplash.com/photo-1585252261c3b1f6e7fb65e8e16d1f16bfb7a0a0?w=400&h=300&fit=crop", // Bunny
      "https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f0?w=400&h=300&fit=crop", // Fluffy rabbit
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop", // Rabbit face
    ],
    Parrot: [
      "https://images.unsplash.com/photo-1552053831-71594a27c62d?w=400&h=300&fit=crop", // Green parrot
      "https://images.unsplash.com/photo-1552053831-71594a27c62d?w=400&h=300&fit=crop", // Colorful parrot
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop", // Parrot side view
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop", // Macaw
    ],
  };

  const speciesImages = imageMap[species] || imageMap["Dog"];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const primaryImage = speciesImages[hash % speciesImages.length];
  const secondaryImage = speciesImages[(hash + 1) % speciesImages.length];

  return [primaryImage, secondaryImage];
};

async function run() {
  console.log("🚀 Starting bulk adoption seeding...\n");

  try {
    await connectDatabases();
    const models = getCoreModels();
    const NGO = models.NGO;
    const User = models.User;
    const Adoption = models.Adoption;

    if (!NGO || !User || !Adoption) throw new Error("Required models not found");

    // Build NGO name -> ID mapping
    const ngoMap = {};
    const ngoList = await NGO.find({}, { organizationName: 1, _id: 1 });
    for (const ngo of ngoList) {
      ngoMap[ngo.organizationName] = ngo._id;
    }

    console.log("📋 NGO Mapping:", Object.keys(ngoMap));
    console.log("");

    const report = [];
    let createdCount = 0;

    for (const pet of PETS_DATA) {
      try {
        // Find NGO ID
        const ngoId = ngoMap[pet.ngo];
        if (!ngoId) {
          report.push({ name: pet.name, error: `NGO "${pet.ngo}" not found` });
          continue;
        }

        // Check duplicate
        const existing = await Adoption.findOne({
          animalName: pet.name,
          listedBy: ngoId,
        });
        if (existing) {
          report.push({ name: pet.name, skipped: true, reason: "duplicate", id: existing._id.toString() });
          continue;
        }

        // Get coordinates
        const { lat, lon } = CITY_COORDS[pet.city] || { lat: null, lon: null };

        // Create adoption listing
        const adoption = new Adoption({
          listedBy: ngoId,
          animalName: pet.name,
          animalType: pet.species,
          breed: pet.breed,
          description: pet.description,
          location: pet.city,
          status: "available",
          adoptionFee: getAdoptionFee(pet.species),
          urgency: "low",
          healthCondition: "Vaccinated and Healthy",
          vaccinationStatus: "Fully Vaccinated",
          images: generateImageUrl(pet.name, pet.species, pet.breed),
          metadata: {
            gender: pet.gender,
            age: pet.age,
            color: pet.color,
            weight: pet.weight,
            temperament: pet.temperament,
            rescueStory: `${pet.name} was rescued from the streets of ${pet.city} and has been well cared for. This wonderful ${pet.species} is now ready for adoption.`,
            coordinates: { latitude: lat, longitude: lon },
            city: pet.city,
          },
        });

        await adoption.save();

        report.push({
          name: pet.name,
          id: adoption._id.toString(),
          ngo: pet.ngo,
          city: pet.city,
          species: pet.species,
          breed: pet.breed,
          fee: adoption.adoptionFee,
          status: adoption.status,
        });

        createdCount++;
      } catch (err) {
        console.error(`Failed to insert ${pet.name}:`, err.message || err);
        report.push({ name: pet.name, error: err.message || String(err) });
      }
    }

    // Print Summary
    console.log(`✅ Adoption seeding completed!\n`);
    console.log(`📊 STATISTICS`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total Pets Created: ${createdCount}/${PETS_DATA.length}`);
    console.log(`NGOs Involved: ${new Set(report.map(r => r.ngo)).size}`);

    // Stats by species
    const bySpecies = report
      .filter(r => r.species)
      .reduce((acc, r) => {
        acc[r.species] = (acc[r.species] || 0) + 1;
        return acc;
      }, {});
    console.log(`\n🐾 PETS BY SPECIES`);
    Object.entries(bySpecies).forEach(([species, count]) => {
      console.log(`  ${species}: ${count}`);
    });

    // Stats by NGO
    const byNgo = report
      .filter(r => r.ngo)
      .reduce((acc, r) => {
        if (!acc[r.ngo]) acc[r.ngo] = [];
        acc[r.ngo].push(r.name);
        return acc;
      }, {});
    console.log(`\n🏢 PETS BY NGO`);
    Object.entries(byNgo).forEach(([ngo, pets]) => {
      console.log(`  ${ngo}: ${pets.length} (${pets.join(", ")})`);
    });

    // Fee summary
    const avgFee = Math.round(report.filter(r => r.fee).reduce((sum, r) => sum + r.fee, 0) / createdCount);
    console.log(`\n💰 ADOPTION FEES`);
    console.log(`  Average Fee: ₹${avgFee}`);
    console.log(`  Range: ₹${Math.min(...report.filter(r => r.fee).map(r => r.fee))} - ₹${Math.max(...report.filter(r => r.fee).map(r => r.fee))}`);

    console.log(`\n📋 FULL REPORT`);
    console.log(JSON.stringify(report, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed script failed:", err.message || err);
    process.exit(1);
  }
}

run();
