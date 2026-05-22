export default {
  scanId: "sample-ai-scan-001",
  imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  animal: "Dog",
  severity: "high",
  condition: "Open wound and suspected fracture on the right hind leg.",
  priority: "urgent",
  recommendation: "Transport the animal to the nearest veterinary clinic immediately and keep it calm and warm.",
  recommendations: [
    "Keep the animal still and avoid moving the injured limb.",
    "Apply a clean, sterile dressing to the wound.",
    "Seek immediate veterinary attention or NGO assistance.",
    "Monitor breathing and keep the animal hydrated with small amounts of water.",
  ],
  confidence: 88,
  timestamp: new Date().toISOString(),
};
