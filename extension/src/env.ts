import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const stringToJSONSchema = z
  .string()
  .min(1)
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().min(1),
    VITE_FIREBASE_CONFIG: stringToJSONSchema,
    VITE_WEB_URL: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
