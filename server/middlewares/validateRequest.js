import { sendError } from "../utils/apiResponse.js";
import { ZodError } from "zod";

/**
 * Middleware to validate req.body, req.query, or req.params using a Zod schema.
 * @param {import("zod").ZodSchema} schema 
 * @param {"body" | "query" | "params"} source 
 */
export const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const parsedData = schema.parse(req[source]);
      // Replace the request data with the sanitized, parsed data from Zod
      req[source] = parsedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map Zod errors to a readable array of messages
        const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
        return sendError(res, {
          status: 400,
          message: "Validation Error",
          error: errorMessages,
        });
      }
      next(error);
    }
  };
};
