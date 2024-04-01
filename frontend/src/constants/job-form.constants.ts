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
    message: "Job application URL must be a valid URL.",
  }),
  notes: z.string().optional(),
  status: z.string().trim().min(1, {
    message: "Status must be at least 1 characters.",
  }),
});

export default class JobFormConstants {
  public static readonly JobStatuses = [
    {
      id: "applied",
      label: "Applied",
    },
    {
      id: "phone_screen",
      label: "Phone Screen",
    },
    {
      id: "coding_challenge",
      label: "Coding Challenge",
    },
    {
      id: "first_interview",
      label: "First Interview",
    },
    {
      id: "second_interview",
      label: "Second Interview",
    },
    {
      id: "final_interview",
      label: "Final Interview",
    },
    {
      id: "offer",
      label: "Offer",
    },
    {
      id: "accepted",
      label: "Accepted",
    },
    {
      id: "rejected",
      label: "Rejected",
    },
    {
      id: "withdrawn",
      label: "Withdrawn",
    },
  ];

  public static readonly DisabledJobStatuses = "rejected";
}
