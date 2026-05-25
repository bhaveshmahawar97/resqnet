/**
 * Async handler to wrap Express routes and automatically forward 
 * Promise rejections to the global error middleware.
 * This eliminates the need for repeated try/catch blocks in controllers.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
