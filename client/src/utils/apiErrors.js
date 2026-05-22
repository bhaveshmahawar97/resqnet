/**
 * Centralized API error formatting for consistent user-facing messages.
 */

const RATE_LIMIT_PATTERN = /quota|rate limit|429|over quota|too many requests/i;

export const getApiErrorMessage = (error, fallback = "Request failed") => {
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;

  if (status === 429 || (serverMessage && RATE_LIMIT_PATTERN.test(serverMessage))) {
    return "Service temporarily busy. Please try again later.";
  }

  if (serverMessage) {
    return RATE_LIMIT_PATTERN.test(serverMessage)
      ? "Service temporarily busy. Please try again later."
      : serverMessage;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};

export const getFetchErrorMessage = async (response, fallback = "Request failed") => {
  const content = await response.text();
  let payload = null;

  try {
    payload = JSON.parse(content);
  } catch {
    // keep raw content
  }

  const message =
    payload?.message ||
    payload?.error?.message ||
    content ||
    response.statusText ||
    fallback;

  if (response.status === 429 || RATE_LIMIT_PATTERN.test(message)) {
    return "Service temporarily busy. Please try again later.";
  }

  return message || `${fallback} (${response.status})`;
};
