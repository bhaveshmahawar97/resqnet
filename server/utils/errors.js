/**
 * Shared error mapping for API and provider failures.
 */

const RATE_LIMIT_PATTERN = /quota|rate limit|too many requests/i;

export const mapProviderError = (err) => {
  const status = err?.status || err?.response?.status;
  const message = String(err?.message || err || "Provider request failed");

  if (err?.code === "AI_TIMEOUT" || /timed out/i.test(message)) {
    const timeoutError = new Error("AI model request timed out");
    timeoutError.code = "AI_TIMEOUT";
    return timeoutError;
  }

  if (status === 429 || RATE_LIMIT_PATTERN.test(message)) {
    const quotaError = new Error("AI service quota exceeded. Please try again later.");
    quotaError.code = "AI_QUOTA_EXCEEDED";
    return quotaError;
  }

  if (
    status === 401 ||
    status === 403 ||
    err?.code === "AI_AUTH_FAILED" ||
    /invalid.*api.*key|unauthorized|OPENROUTER/i.test(message)
  ) {
    const authError = new Error("AI provider authentication failed");
    authError.code = "AI_AUTH_FAILED";
    return authError;
  }

  return err instanceof Error ? err : new Error(message);
};

export const getErrorMessage = (err, fallback = "Request failed") =>
  err?.message || fallback;
