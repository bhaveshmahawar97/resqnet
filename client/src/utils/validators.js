import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Please confirm your password."),
  role: z.enum(["user", "ngo", "volunteer", "admin"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const ngoRegistrationSchema = z.object({
  organizationName: z.string().trim().min(2, "Organization name is required."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().regex(/^\+?[\d\s-]{10,15}$/, "Enter a valid phone number (e.g., 1234567890)."),
  address: z.string().trim().min(5, "Address must be at least 5 characters."),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
  pincode: z.string().optional(),
  registrationNumber: z.string().min(2, "Registration number is required."),
  ngoType: z.array(z.string()).min(1, "Select at least one NGO type."),
  description: z.string().optional(),
  website: z.string().optional(),
});

export const reportRescueSchema = z.object({
  animalType: z.string().trim().min(1, "Animal type is required."),
  condition: z.string().trim().min(1, "Current condition is required."),
  notes: z.string().optional(),
  address: z.string().trim().min(1, "Address is required."),
  severity: z.enum(["critical", "high", "medium", "low"], {
    errorMap: () => ({ message: "Please select a valid severity level." }),
  }),
  contactPhone: z.string().trim().min(1, "Contact is required.").regex(/^\+?[\d\s-]{10,15}$/, "Enter a valid phone number (e.g., 1234567890)."),
  breed: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).optional().transform(v => v === "" ? undefined : Number(v)),
  longitude: z.union([z.string(), z.number()]).optional().transform(v => v === "" ? undefined : Number(v)),
  images: z.any().optional(),
});

export const adoptionApplicationSchema = z.object({
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
  experience: z.string().trim().min(10, "Experience details must be at least 10 characters"),
  livingEnvironment: z.string().trim().min(10, "Living environment details must be at least 10 characters"),
  contactInfo: z.string().trim().min(5, "Contact info must be provided"),
  address: z.string().trim().min(5, "Address must be provided"),
});

export const createAdoptionListingSchema = z.object({
  animalName: z.string().trim().min(1, "Animal name is required."),
  animalType: z.string().trim().min(1, "Species is required."),
  age: z.string().trim().min(1, "Age is required."),
  healthStatus: z.string().trim().min(1, "Health status is required."),
  city: z.string().trim().min(1, "City is required."),
  description: z.string().trim().min(10, "Description must be at least 10 characters."),
  images: z.any().optional(),
});
