import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters long"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "ngo", "volunteer", "admin"]).optional().default("user"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
