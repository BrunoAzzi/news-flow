import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z
    .string({ required_error: "Collection name is required" })
    .min(1, "Collection name is required")
    .max(100, "Collection name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .trim()
    .optional()
    .nullable(),
});

export type CreateCollectionSchema = z.infer<typeof createCollectionSchema>;
