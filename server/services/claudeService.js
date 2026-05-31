import OpenAI from "openai";

const FREEMODEL_API_KEY = process.env.FREEMODEL_API_KEY;
const FREEMODEL_BASE_URL = process.env.FREEMODEL_BASE_URL;
const FREEMODEL_MODEL = process.env.FREEMODEL_MODEL || "claude-opus-4-7";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 30000;
const MAX_RETRIES = 2;
const SUPPORTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const ensureConfiguration = () => {
  if (!FREEMODEL_API_KEY || !FREEMODEL_BASE_URL) {
    throw new Error("Freemodel Claude API is not configured. Set FREEMODEL_API_KEY and FREEMODEL_BASE_URL.");
  }
};

const openai = new OpenAI({
  apiKey: FREEMODEL_API_KEY,
  baseURL: FREEMODEL_BASE_URL,
  timeout: AI_TIMEOUT_MS,
});

const EXPLANATION_PROMPT = `You are an animal rescue triage assistant providing detailed analysis.

An animal has been detected in an image. Your task is to analyze the image and provide:

1. Visible Condition - describe what you observe about the animal's physical state
2. Injury Severity - assess as Low, Medium, High, or Critical
3. Rescue Priority - determine urgency level
4. Immediate Actions - list specific steps rescuers should take
5. Veterinary Attention - recommend level of veterinary care needed

Important:
- You are NOT a veterinarian
- Do not claim medical certainty
- Only describe visible symptoms
- If uncertain, clearly say so

Respond ONLY with valid JSON.

Format:
{
"condition": "",
"severity": "Low|Medium|High|Critical",
"priority": "",
"actions": [],
"veterinaryAttention": ""
}`;

const buildImageInput = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image URL provided for analysis.");
  }

  const trimmed = imageUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error("Image source must be an HTTP or HTTPS URL.");
  }

  return {
    type: "input_image",
    image_url: trimmed,
  };
};

const extractJsonString = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Claude response contained no text content.");
  }

  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude response did not contain valid JSON.");
  }

  return jsonMatch[0];
};

const parseClaudeJson = (text) => {
  const jsonString = extractJsonString(text);
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error("Claude response contained malformed JSON.");
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
  if ([429, 502, 503, 504].includes(status)) return true;
  if (/timeout|timed out|rate limit|quota|ECONNRESET|EAI_AGAIN|ENOTFOUND/.test(message)) return true;
  return false;
};

const sendClaudeRequest = async (payload) => {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await openai.responses.create(payload);
    } catch (err) {
      lastError = err;
      if (attempt >= MAX_RETRIES || !shouldRetry(err)) {
        throw err;
      }
      console.warn(`[ClaudeService] Attempt ${attempt} failed: ${err?.message || "Unknown error"}. Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
};

const getResponseText = (response) => {
  if (!response) return "";
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  if (Array.isArray(response.output)) {
    return response.output
      .map((item) => {
        if (!item || !Array.isArray(item.content)) return "";
        return item.content
          .map((block) => String(block?.text || block?.[0]?.text || ""))
          .filter(Boolean)
          .join(" ");
      })
      .filter(Boolean)
      .join(" \n");
  }

  return "";
};

const validateImageFormat = (imageUrl) => {
  // Relaxed validation: simply ensure it's a valid HTTP URL.
  // Cloudinary often omits file extensions, making regex validation fragile.
  if (!/^https?:\/\//i.test(String(imageUrl).trim())) {
    throw new Error("Unsupported image format. Must provide a valid HTTP/HTTPS image URL.");
  }
};

export const explainAnalysis = async ({ animal, confidence, imageUrl } = {}) => {
  ensureConfiguration();

  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image input provided to explainAnalysis");
  }

  if (!animal) {
    throw new Error("Animal type is required for explanation");
  }

  validateImageFormat(imageUrl);

  const requestId = Math.random().toString(36).slice(2, 10);
  const startTime = Date.now();
  console.info(`[ClaudeService][${requestId}] Getting explanation for detected ${animal} (${confidence}% confidence)`);

  const prompt = [
    { role: "system", content: EXPLANATION_PROMPT },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `A ${animal} has been detected in this image with ${confidence}% confidence. Analyze the image and provide detailed triage information. Return only valid JSON following the requested schema.`
        },
        await buildImageInput(imageUrl),
      ],
    },
  ];

  const payload = {
    model: FREEMODEL_MODEL,
    input: prompt,
    max_output_tokens: 1024,
    temperature: 0.2,
  };

  let response;
  try {
    response = await sendClaudeRequest(payload);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[ClaudeService][${requestId}] Claude explanation failed after ${elapsed}ms:`, error?.message || error);
    throw new Error(error?.message || "AI explanation request failed");
  }

  const elapsed = Date.now() - startTime;
  console.info(`[ClaudeService][${requestId}] Claude explanation succeeded in ${elapsed}ms`);

  const rawText = getResponseText(response);
  const parsed = parseClaudeJson(rawText);

  const normalized = {
    condition: String(parsed.condition || parsed.visibleCondition || "").trim(),
    severity: normalizeSeverity(parsed.severity),
    priority: normalizePriority(parsed.priority, parsed.severity),
    recommendation: String(parsed.actions?.[0] || parsed.recommendation || "").trim(),
    recommendations: normalizeActions(parsed.actions),
    veterinaryAttention: String(parsed.veterinaryAttention || parsed.veterinaryAttentionRecommendation || "").trim(),
    providerModel: FREEMODEL_MODEL,
  };

  if (!normalized.condition) {
    throw new Error("Claude returned invalid explanation structure");
  }

  return normalized;
};
