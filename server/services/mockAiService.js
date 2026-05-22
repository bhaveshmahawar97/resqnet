/**
 * Deterministic mock AI service for ResQNet scanner.
 *
 * Behavior:
 * - Inspect the uploaded image filename or URL (lowercased)
 * - Detect a supported animal keyword (puppy, kitten, dog, cat, cow, bird, horse)
 * - Return a predefined, deterministic analysis object for that animal
 * - If no supported keyword is found, return an "Unknown" analysis
 *
 * This file intentionally contains no external API calls and is deterministic
 * so the same image/URL always returns the same analysis.
 */

const SUPPORTED = ["puppy", "kitten", "dog", "cat", "cow", "bird", "horse"];

const TITLE = (s) => (typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s);

const PREDEFINED = {
  dog: {
    animal: "Dog",
    severity: "medium",
    condition: "Visible leg injury detected",
    priority: "high",
    recommendation: "Immediate rescue assistance recommended.",
    confidence: 92,
  },
  cat: {
    animal: "Cat",
    severity: "medium",
    condition: "Open wound near flank; possible infection",
    priority: "high",
    recommendation: "Urgent veterinary inspection recommended.",
    confidence: 88,
  },
  cow: {
    animal: "Cow",
    severity: "high",
    condition: "Limb swelling and impaired mobility observed",
    priority: "high",
    recommendation: "Livestock rescue and veterinary assessment required.",
    confidence: 90,
  },
  bird: {
    animal: "Bird",
    severity: "critical",
    condition: "Wing damage and bleeding; unable to fly",
    priority: "critical",
    recommendation: "Immediate wildlife rescue and emergency care needed.",
    confidence: 93,
  },
  horse: {
    animal: "Horse",
    severity: "high",
    condition: "Visible laceration and possible fracture on limb",
    priority: "high",
    recommendation: "Do not move — await trained large-animal rescue and veterinarian.",
    confidence: 91,
  },
  puppy: {
    animal: "Puppy",
    severity: "medium",
    condition: "Small dog with visible limp and mild abrasions",
    priority: "high",
    recommendation: "Prompt rescue and veterinary check advised.",
    confidence: 89,
  },
  kitten: {
    animal: "Kitten",
    severity: "medium",
    condition: "Small cat with skin wound and lethargy",
    priority: "high",
    recommendation: "Immediate warmth and veterinary triage recommended.",
    confidence: 87,
  },
  unknown: {
    animal: "Unknown",
    severity: "medium",
    condition: "Unable to determine animal type",
    priority: "medium",
    recommendation: "Manual rescue inspection recommended.",
    confidence: 70,
  },
};

const extractFilename = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return "";
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1].toLowerCase() : url.hostname.toLowerCase();
  } catch {
    // Not a valid URL — treat input as a filename or path
    const parts = imageUrl.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1].toLowerCase() : imageUrl.toLowerCase();
  }
};

const resolveInputName = (imageUrl, imageName) => {
  if (imageName && typeof imageName === "string" && imageName.trim()) {
    return imageName.trim().toLowerCase();
  }
  return extractFilename(imageUrl);
};

/**
 * Deterministically analyze an image URL or filename and return a fixed analysis object.
 * @param {{ imageUrl: string, imageName?: string }} params
 * @returns {object} analysis
 */
export const analyzeAnimalImageMock = async ({ imageUrl, imageName } = {}) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image input provided to analyzeAnimalImageMock");
  }

  const filename = resolveInputName(imageUrl, imageName);

  // Find the first supported keyword that appears in the filename or source name.
  const found = SUPPORTED.find((kw) => filename.includes(kw));

  const key = found || "unknown";
  const base = PREDEFINED[key] || PREDEFINED.unknown;

  // Return a shallow copy to avoid accidental mutation elsewhere
  const result = {
    animal: base.animal,
    severity: base.severity,
    condition: base.condition,
    priority: base.priority,
    recommendation: base.recommendation,
    confidence: base.confidence,
    // Make results traceable
    detectedKeyword: key,
    inputFilename: filename,
    timestamp: Date.now(),
  };

  return result;
};

export default analyzeAnimalImageMock;
