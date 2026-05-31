export const fetchMapFacilities = async (lat, lon, radius = 50000) => {
  // Query for veterinary, animal shelters, and animal boarding within a radius
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="veterinary"](around:${radius},${lat},${lon});
      node["amenity"="animal_shelter"](around:${radius},${lat},${lon});
      node["amenity"="animal_boarding"](around:${radius},${lat},${lon});
      way["amenity"="veterinary"](around:${radius},${lat},${lon});
      way["amenity"="animal_shelter"](around:${radius},${lat},${lon});
      way["amenity"="animal_boarding"](around:${radius},${lat},${lon});
    );
    out center;
  `;
  
  const url = `https://overpass-api.de/api/interpreter`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error("Map API request failed with status: " + res.status);
    
    const data = await res.json();
    
    // Map OSM data to the structure expected by NgoCard
    const mappedData = data.elements.map(el => {
      // Determine type
      let type = "Shelter";
      if (el.tags.amenity === "veterinary") type = "Medical";
      if (el.tags.amenity === "animal_boarding") type = "Sanctuary";
      
      const latitude = el.lat || el.center?.lat;
      const longitude = el.lon || el.center?.lon;
      
      const addressParts = [];
      if (el.tags["addr:housenumber"]) addressParts.push(el.tags["addr:housenumber"]);
      if (el.tags["addr:street"]) addressParts.push(el.tags["addr:street"]);
      if (el.tags["addr:city"]) addressParts.push(el.tags["addr:city"]);
      
      const locationString = addressParts.length > 0 
        ? addressParts.join(", ") 
        : (el.tags["addr:city"] || "Location available on map");

      return {
        _id: `map-${el.id}`,
        name: el.tags.name, // Keep undefined if no name yet, fallback later
        organizationName: el.tags.name,
        city: el.tags["addr:city"] || "Unknown City",
        location: locationString,
        specialties: [type],
        verified: false,
        isMapResult: true,
        lat: latitude,
        lon: longitude,
        phone: el.tags.phone || el.tags["contact:phone"] || "",
        website: el.tags.website || el.tags["contact:website"] || "",
      };
    });

    // Deduplicate and filter unnamed facilities
    const seenNames = new Set();
    const finalData = [];
    
    for (const item of mappedData) {
      if (!item.name) continue; // Skip unnamed facilities
      
      const normalizedName = item.name.toLowerCase().trim();
      if (!seenNames.has(normalizedName)) {
        seenNames.add(normalizedName);
        item.organizationName = item.name; // Set organizationName for compatibility
        finalData.push(item);
      }
    }
    
    return finalData;
  } catch (error) {
    console.error("Error fetching map facilities:", error);
    return [];
  }
};
