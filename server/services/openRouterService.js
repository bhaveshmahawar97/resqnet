import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "openai/gpt-4o-mini";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 30000;
const MAX_RETRIES = 2;

const ensureConfiguration = () => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API is not configured. Set OPENROUTER_API_KEY.");
  }
};

const openai = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: OPENROUTER_BASE_URL,
  timeout: AI_TIMEOUT_MS,
  defaultHeaders: {
    "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
    "X-Title": "ResQNet",
  },
});

const SYSTEM_PROMPT = `You are an animal rescue triage assistant.

Analyze the uploaded animal image.

Provide:

Animal Type
Visible Condition
Injury Severity
Rescue Priority
Immediate Actions
Veterinary Attention Recommendation
Confidence Level

Important:

You are NOT a veterinarian.

Do not claim medical certainty.

Only describe visible symptoms.

If uncertain, clearly say so.

Respond ONLY with valid JSON.

Format:

{
"animalType": "",
"condition": "",
"severity": "Low|Medium|High|Critical",
"priority": "",
"actions": [],
"veterinaryAttention": "",
"confidence": ""
}`;

const extractJsonString = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("OpenRouter response contained no text content.");
  }

  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("OpenRouter response did not contain valid JSON.");
  }

  return jsonMatch[0];
};

const parseOpenRouterJson = (text) => {
  const jsonString = extractJsonString(text);
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error("OpenRouter response contained malformed JSON.");
  }
};

const normalizeSeverity = (value) => {
  const raw = String(value || "medium").toLowerCase().trim();
  if (["low", "medium", "high", "critical"].includes(raw)) return raw;
  if (raw.includes("crit")) return "critical";
  if (raw.includes("high") || raw.includes("severe")) return "high";
  if (raw.includes("low") || raw.includes("mild")) return "low";
  return "medium";
};

const normalizePriority = (value, severity) => {
  const raw = String(value || severity || "normal").toLowerCase().trim();
  if (["low", "normal", "high", "critical"].includes(raw)) return raw;
  if (raw.includes("crit")) return "critical";
  if (raw.includes("high") || raw.includes("urgent")) return "high";
  if (raw.includes("low")) return "low";
  return "normal";
};

const normalizeActions = (actions) => {
  if (!actions) return [];
  if (Array.isArray(actions)) return actions.filter(Boolean).map((item) => String(item).trim());
  if (typeof actions === "string") return actions.split(/\n|;|\.|,/).map((item) => item.trim()).filter(Boolean);
  return [];
};

const parseConfidence = (value) => {
  if (Number.isFinite(value)) {
    return Math.min(100, Math.max(0, Math.round(value)));
  }
  const normalized = String(value || "").replace(/[^0-9]/g, "");
  if (!normalized) return 0;
  const number = parseInt(normalized, 10);
  return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : 0;
};

const shouldRetry = (error) => {
  if (!error) return false;
  const message = String(error.message || "").toLowerCase();
  const status = Number(error?.status || error?.response?.status || 0);
  // OpenRouter 402 is insufficient credits, do not retry
  if (status === 402) return false;
  if ([429, 502, 503, 504].includes(status)) return true;
  if (/timeout|timed out|rate limit|quota|ECONNRESET|EAI_AGAIN|ENOTFOUND/.test(message)) return true;
  return false;
};

const sendOpenRouterRequest = async (payload) => {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await openai.chat.completions.create(payload);
    } catch (err) {
      lastError = err;
      if (attempt >= MAX_RETRIES || !shouldRetry(err)) {
        throw err;
      }
      console.warn(`[OpenRouterService] Attempt ${attempt} failed: ${err?.message || "Unknown error"}. Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
};

const validateImageFormat = (imageUrl) => {
  if (!/^https?:\/\//i.test(String(imageUrl).trim())) {
    throw new Error("Unsupported image format. Must provide a valid HTTP/HTTPS image URL.");
  }
};

export const analyzeAnimalImage = async ({ imageUrl, imageName } = {}) => {
  ensureConfiguration();

  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image input provided to analyzeAnimalImage");
  }

  validateImageFormat(imageUrl);

  const requestId = Math.random().toString(36).slice(2, 10);
  const startTime = Date.now();
  console.info(`[OpenRouterService][${requestId}] Starting image analysis for: ${imageName || imageUrl}`);

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "Analyze this uploaded animal image and return only valid JSON following the requested schema." },
        { type: "image_url", image_url: { url: imageUrl.trim() } },
      ],
    },
  ];

  const payload = {
    model: OPENROUTER_VISION_MODEL,
    messages: messages,
    max_tokens: 1024,
    temperature: 0.2,
    response_format: { type: "json_object" }
  };

  let response;
  try {
    response = await sendOpenRouterRequest(payload);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[OpenRouterService][${requestId}] OpenRouter request failed after ${elapsed}ms:`, error?.message || error);
    throw new Error(error?.message || "AI analysis request failed");
  }

  const elapsed = Date.now() - startTime;
  console.info(`[OpenRouterService][${requestId}] OpenRouter request succeeded in ${elapsed}ms`);

  const rawText = response.choices?.[0]?.message?.content || "";
  const parsed = parseOpenRouterJson(rawText);

  const normalized = {
    animal: String(parsed.animalType || parsed.animal || parsed.species || "unknown").trim(),
    condition: String(parsed.condition || parsed.visibleCondition || "").trim(),
    severity: normalizeSeverity(parsed.severity),
    priority: normalizePriority(parsed.priority, parsed.severity),
    recommendation: String(parsed.actions?.[0] || parsed.recommendation || "").trim(),
    recommendations: normalizeActions(parsed.actions),
    veterinaryAttention: String(parsed.veterinaryAttention || parsed.veterinaryAttentionRecommendation || "").trim(),
    confidence: parseConfidence(parsed.confidence),
    providerModel: OPENROUTER_VISION_MODEL,
  };

  if (!normalized.animal) {
    throw new Error("AI returned invalid analysis structure");
  }

  return normalized;
};
