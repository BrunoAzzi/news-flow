import { z } from "zod";

export const searchNewsSchema = z.object({
  query: z
    .string({ required_error: "Search query is required" })
    .min(1, "Search query is required")
    .trim(),
});

export type SearchNewsSchema = z.infer<typeof searchNewsSchema>;
