import { z } from "zod";

export type LoginFormValues = z.infer<typeof formSchema>;

export const formSchema = z.object({
  email: z.string().trim().email().min(3, {
    message: "Email must be at least 3 characters.",
  }),
  password: z.string().trim().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  signUpMode: z.boolean(),
});
