import { z } from "zod";

// User validation schemas
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Gig validation schemas
export const createGigSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  budget: z.number().int().nonnegative("Budget must be a positive number"),
});

// Bid validation schemas
export const createBidSchema = z.object({
  gigId: z.string().min(1, "Gig ID is required"),
  message: z.string().min(1, "Message is required"),
  price: z.number().int().nonnegative("Price must be a positive number"),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateGigInput = z.infer<typeof createGigSchema>;
export type CreateBidInput = z.infer<typeof createBidSchema>;
