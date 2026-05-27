import { z } from "zod";

export const ngoRegistrationSchema = z.object({
  organizationName: z.string().trim().min(2, "Organization name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email format"),
  phone: z.string().trim().regex(/^\+?[\d\s-]{10,15}$/, "Invalid phone number format"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pincode: z.string().optional(),
  latitude: z.union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }),
  longitude: z.union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }),
  registrationNumber: z.string().optional(),
  ngoType: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  socialMedia: z.any().optional(),
  documents: z.any().optional(),
});
