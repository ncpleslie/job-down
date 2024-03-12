import { z } from "zod";

export type JobFormValues = z.infer<typeof formSchema>;

export const formSchema = z.object({
  position: z.string().trim().min(1, {
    message: "Position must be at least 1 characters.",
  }),
  company: z.string().trim().min(1, {
    message: "Company must be at least 1 characters.",
  }),
  url: z.string().trim().url({
    message: "Application URL must be a valid URL.",
  }),
  additionalNotes: z.string().optional(),
  status: z.string().trim().min(1, {
    message: "Status must be at least 1 characters.",
  }),
});
