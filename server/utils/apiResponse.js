/**
 * Standardized API response helpers.
 * Shape: { success, message, data?, error?, pagination? }
 */

export const sendSuccess = (res, {
  status = 200,
  message = "Success",
  data = null,
  pagination = null,
  extra = {},
}) => {
  const payload = {
    success: true,
    message,
    ...extra,
  };

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(status).json(payload);
};

export const sendError = (res, {
  status = 500,
  message = "Request failed",
  error = null,
}) => {
  const payload = {
    success: false,
    message,
  };

  if (error && process.env.NODE_ENV !== "production") {
    payload.error = typeof error === "string" ? error : error.message || error;
  }

  return res.status(status).json(payload);
};

