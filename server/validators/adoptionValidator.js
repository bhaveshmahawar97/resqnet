import { z } from "zod";

export const createAdoptionListingSchema = z.object({
  rescueId: z.string().optional(),
  animalType: z.string().trim().min(1, "Animal type is required"),
  animalName: z.string().trim().optional(),
  breed: z.string().trim().optional(),
  age: z.string().trim().optional(),
  healthStatus: z.string().trim().min(1, "Health status is required"),
  vaccinationStatus: z.string().trim().optional(),
  temperament: z.string().trim().optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  specialRequirements: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  images: z.array(z.string()).optional(),
});

export const createAdoptionApplicationSchema = z.object({
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
  experience: z.string().trim().min(10, "Experience details must be at least 10 characters"),
  livingEnvironment: z.string().trim().min(10, "Living environment details must be at least 10 characters"),
  contactInfo: z.string().trim().min(5, "Contact info must be provided"),
  address: z.string().trim().min(5, "Address must be provided"),
});

export const reviewAdoptionApplicationSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  reviewNote: z.string().trim().optional(),
});
