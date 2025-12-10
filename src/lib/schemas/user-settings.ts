import { z } from "zod";

export const apiTokenSchema = z.object({
  apiToken: z
    .string({ required_error: "API token is required" })
    .min(1, "API token is required")
    .trim(),
});

export type ApiTokenSchema = z.infer<typeof apiTokenSchema>;
