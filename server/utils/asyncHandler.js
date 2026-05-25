/**
 * Async Handler Utility
 * Wraps async route handlers to automatically catch exceptions and pass them to Express's next()
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
