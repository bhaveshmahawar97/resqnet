import OpenAI from "openai";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
const HF_BASE_URL = "https://api-inference.huggingface.co/models";
const HF_ROUTER_URL = "https://router.huggingface.co/v1";
const HF_VISION_MODEL = process.env.HF_VISION_MODEL || "meta-llama/Llama-3.2-11B-Vision-Instruct";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 30000;
const MAX_RETRIES = 2;

const ensureConfiguration = () => {
  if (!HF_API_KEY) {
    throw new Error("Hugging Face API is not configured. Set HUGGINGFACE_API_KEY or HF_TOKEN.");
  }
};

// Use OpenAI-compatible client for HF Router
const client = new OpenAI({
  baseURL: HF_ROUTER_URL,
  apiKey: HF_API_KEY,
  timeout: AI_TIMEOUT_MS,
});

const ANIMAL_DETECTION_PROMPT = `You are an expert animal identification assistant for a rescue service.

Analyze the image and identify:
1. The type of animal (dog, cat, bird, cow, horse, monkey, rabbit, snake, deer, etc.)
2. Your confidence level in the identification (0-100%)

Respond ONLY with valid JSON in this exact format:
{
  "animal": "dog",
  "confidence": 95,
  "reasoning": "brief explanation of visible features"
}`;

const ANIMAL_LABELS = {
  dog: ["dog", "puppy", "canine", "hound", "retriever", "shepherd", "terrier", "bulldog", "poodle"],
  cat: ["cat", "kitten", "feline", "tabby", "persian", "siamese"],
  bird: ["bird", "parrot", "eagle", "crow", "sparrow", "pigeon", "owl", "hawk"],
  cow: ["cow", "cattle", "bull", "calf", "ox", "buffalo"],
  horse: ["horse", "pony", "stallion", "mare", "foal", "equine"],
  monkey: ["monkey", "ape", "primate", "chimpanzee", "gorilla", "baboon"],
  rabbit: ["rabbit", "bunny", "hare"],
  snake: ["snake", "serpent", "python", "cobra", "viper"],
  deer: ["deer", "stag", "doe", "fawn", "elk", "moose"],
  elephant: ["elephant", "mammoth"],
  tiger: ["tiger", "bengal"],
  lion: ["lion", "lioness"],
  bear: ["bear", "grizzly", "panda"],
  pig: ["pig", "swine", "hog", "boar"],
  sheep: ["sheep", "lamb", "ram"],
  goat: ["goat", "kid"],
};

const normalizeAnimal = (animal) => {
  const normalized = String(animal || "").toLowerCase().trim();

  for (const [key, keywords] of Object.entries(ANIMAL_LABELS)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return key;
    }
  }

  return normalized || "other";
};

const extractJsonString = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("HF response contained no text content.");
  }

  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("HF response did not contain valid JSON.");
  }

  return jsonMatch[0];
};

const parseHFJson = (text) => {
  const jsonString = extractJsonString(text);
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error("HF response contained malformed JSON.");
  }
};

const shouldRetry = (error) => {
  if (!error) return false;
  const message = String(error.message || "").toLowerCase();
  const status = Number(error?.status || error?.response?.status || 0);
  if ([429, 502, 503, 504].includes(status)) return true;
  if (/timeout|timed out|rate limit|quota|loading|ECONNRESET|EAI_AGAIN|ENOTFOUND/.test(message)) return true;
  return false;
};

const sendHFRequest = async (payload) => {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await client.chat.completions.create(payload);
    } catch (err) {
      lastError = err;
      if (attempt >= MAX_RETRIES || !shouldRetry(err)) {
        throw err;
      }
      console.warn(`[HuggingFaceService] Attempt ${attempt} failed: ${err?.message || "Unknown error"}. Retrying...`);
      // HF models may need time to load
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
  throw lastError;
};

export const detectAnimal = async ({ imageUrl, imageName } = {}) => {
  ensureConfiguration();

  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image input provided to detectAnimal");
  }

  if (!/^https?:\/\//i.test(imageUrl.trim())) {
    throw new Error("Image URL must be a valid HTTP/HTTPS URL");
  }

  const requestId = Math.random().toString(36).slice(2, 10);
  const startTime = Date.now();
  console.info(`[HuggingFaceService][${requestId}] Starting animal detection for: ${imageName || imageUrl}`);

  const messages = [
    { role: "system", content: ANIMAL_DETECTION_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "Identify the animal in this image." },
        { type: "image_url", image_url: { url: imageUrl.trim() } },
      ],
    },
  ];

  const payload = {
    model: HF_VISION_MODEL,
    messages,
    max_tokens: 512,
    temperature: 0.1,
  };

  let response;
  try {
    response = await sendHFRequest(payload);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[HuggingFaceService][${requestId}] Detection failed after ${elapsed}ms:`, error?.message || error);
    throw new Error(error?.message || "Animal detection request failed");
  }

  const elapsed = Date.now() - startTime;
  console.info(`[HuggingFaceService][${requestId}] Detection completed in ${elapsed}ms`);

  const rawText = response.choices?.[0]?.message?.content || "";
  const parsed = parseHFJson(rawText);

  const animal = normalizeAnimal(parsed.animal);
  const confidence = Math.min(100, Math.max(0, parseInt(parsed.confidence, 10) || 0));

  if (!animal || animal === "other") {
    throw new Error("Could not identify animal in image");
  }

  return {
    animal,
    confidence,
    reasoning: String(parsed.reasoning || "").trim(),
    rawResponse: parsed.animal,
    provider: "huggingface",
    providerModel: HF_VISION_MODEL,
  };
};
