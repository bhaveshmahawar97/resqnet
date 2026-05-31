/**
 * Rule-based fallback for animal analysis when AI services fail
 * Provides basic severity assessment based on keywords and heuristics
 */

const SEVERITY_KEYWORDS = {
  critical: [
    "bleeding", "blood", "unconscious", "not moving", "severe injury",
    "broken bone", "open wound", "trauma", "hit by vehicle", "accident",
    "seizure", "convulsing", "difficulty breathing", "gasping"
  ],
  high: [
    "injured", "limping", "wound", "cut", "bite", "attack", "hurt",
    "pain", "distress", "crying", "whimpering", "aggressive", "rabid"
  ],
  medium: [
    "stray", "lost", "abandoned", "thin", "malnourished", "dirty",
    "scared", "hiding", "weak", "lethargic", "sick"
  ],
  low: [
    "healthy", "active", "playful", "friendly", "calm", "normal"
  ]
};

const ANIMAL_RECOMMENDATIONS = {
  dog: {
    critical: [
      "Call emergency veterinary service immediately",
      "Do not move the animal unless necessary",
      "Keep the animal warm and calm",
      "Control bleeding if present with clean cloth"
    ],
    high: [
      "Contact local animal rescue or veterinarian",
      "Approach carefully - injured animals may bite",
      "Provide water if conscious",
      "Keep away from other animals"
    ],
    medium: [
      "Contact local animal shelter or NGO",
      "Provide food and water",
      "Check for identification tags or microchip",
      "Keep in safe, enclosed area if possible"
    ],
    low: [
      "Monitor the animal's condition",
      "Contact local animal welfare if stray",
      "Ensure access to water and shade"
    ]
  },
  cat: {
    critical: [
      "Call emergency veterinary service immediately",
      "Handle with extreme care - use thick gloves",
      "Keep in dark, quiet space",
      "Do not force food or water"
    ],
    high: [
      "Contact veterinarian or animal rescue",
      "Use carrier or box for transport",
      "Minimize stress and handling",
      "Isolate from other pets"
    ],
    medium: [
      "Contact local animal shelter",
      "Provide food, water, and shelter",
      "Check for collar or microchip",
      "Allow time to calm down before approaching"
    ],
    low: [
      "Monitor behavior and condition",
      "Provide food and water if stray",
      "Contact local TNR program if feral"
    ]
  },
  default: {
    critical: [
      "Contact wildlife rescue or emergency vet immediately",
      "Do not approach - maintain safe distance",
      "Keep people and pets away from the area",
      "Document location and condition"
    ],
    high: [
      "Contact local animal rescue or wildlife authority",
      "Do not attempt to handle without expertise",
      "Provide water at safe distance if possible",
      "Monitor until help arrives"
    ],
    medium: [
      "Contact local animal welfare organization",
      "Observe from safe distance",
      "Document with photos if possible",
      "Provide location details to authorities"
    ],
    low: [
      "Monitor the animal's condition",
      "Contact local wildlife or animal welfare if needed",
      "Ensure animal has access to water and shelter"
    ]
  }
};

const assessSeverity = (condition = "") => {
  const normalized = condition.toLowerCase();

  for (const [severity, keywords] of Object.entries(SEVERITY_KEYWORDS)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return severity;
    }
  }

  return "medium"; // Default
};

const getRecommendations = (animal, severity) => {
  const animalKey = ["dog", "cat"].includes(animal) ? animal : "default";
  return ANIMAL_RECOMMENDATIONS[animalKey]?.[severity] || ANIMAL_RECOMMENDATIONS.default[severity];
};

const calculateConfidence = (animal, condition) => {
  // Rule engine has lower confidence than AI
  let confidence = 40;

  // Increase confidence if we have condition information
  if (condition && condition.length > 10) {
    confidence += 20;
  }

  // Increase confidence for common animals
  if (["dog", "cat", "bird", "cow"].includes(animal)) {
    confidence += 15;
  }

  return Math.min(confidence, 75); // Max 75% for rule engine
};

export const analyzeWithRules = ({ animal = "unknown", condition = "", imageUrl } = {}) => {
  console.info("[RuleEngineService] Using rule-based analysis as fallback");

  const severity = assessSeverity(condition);
  const recommendations = getRecommendations(animal, severity);
  const confidence = calculateConfidence(animal, condition);

  // Map severity to priority
  const priorityMap = {
    critical: "critical",
    high: "high",
    medium: "normal",
    low: "low"
  };

  return {
    animal: animal || "unknown",
    severity,
    condition: condition || "Unable to assess condition without AI analysis",
    priority: priorityMap[severity],
    recommendation: recommendations[0] || "Contact local animal welfare organization",
    recommendations,
    confidence,
    veterinaryAttention: severity === "critical" || severity === "high"
      ? "Immediate veterinary attention recommended"
      : "Veterinary check-up recommended when possible",
    provider: "rule-engine",
    providerModel: "heuristic-v1",
    usedFallback: true,
  };
};
