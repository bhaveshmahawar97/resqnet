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
  errors = [],
}) => {
  const payload = {
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : (errors ? [errors] : []),
  };

  return res.status(status).json(payload);
};

