const lat = 19.0760, lon = 72.8777; // Mumbai
const radius = 50000;
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
fetch(url, {
  method: 'POST',
  body: `data=${encodeURIComponent(query)}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'User-Agent': 'ResQNet/1.0 (contact@resqnet.org)'
  }
})
  .then(res => {
    if(!res.ok) throw new Error(res.status + " " + res.statusText);
    return res.json();
  })
  .then(data => {
    console.log('Found:', data.elements.length);
  })
  .catch(console.error);
