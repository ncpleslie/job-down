import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "./ui/input";
import RequiredText from "./ui/required-text";
import JobResponse from "@/models/responses/job.response";
import { useState } from "react";

export type UpdateJobFormValues = z.infer<typeof formSchema>;

type UpdateJobFormProps = {
  job: JobResponse;
  onSubmit: (values: UpdateJobFormValues) => void;
  onCancel: () => void;
};

const formSchema = z.object({
  position: z.string().trim().min(1, {
    message: "Position must be at least 1 characters.",
  }),
  company: z.string().trim().min(1, {
    message: "Company must be at least 1 characters.",
  }),
  url: z.string().trim().url({
    message: "Application URL must be a valid URL.",
  }),
  status: z.string().trim().min(1, {
    message: "Status must be at least 1 characters.",
  }),
});

const UpdateJobForm: React.FC<UpdateJobFormProps> = ({
  job,
  onSubmit,
  onCancel,
}) => {
  const [editMode, setEditMode] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: job.position,
      company: job.company,
      url: job.url,
      status: job.status,
    },
    disabled: !editMode,
  });

  return (
    <div className="flex items-center space-x-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Position <RequiredText>*</RequiredText>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the position you applied for. E.g. Software
                  Engineer.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company <RequiredText>*</RequiredText>
                </FormLabel>
                <FormControl>
                  <Input placeholder="XYZ Corp" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the Company you applied for. E.g. XYZ Corp.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Application URL <RequiredText>*</RequiredText>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://somejob.com/id/123" {...field} />
                </FormControl>
                <FormDescription>
                  The URL of the application. It should contain the job
                  description. We will use that to screenshot the application
                  for later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input placeholder="Applied" {...field} />
                </FormControl>
                <FormDescription>
                  The status of your application. Did you apply? Did you get a
                  photo call?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger disabled={!job.imageUrl}>
                Application Page {!job.imageUrl && "Is Processing..."}
              </AccordionTrigger>
              <AccordionContent>
                {job.imageUrl && (
                  <img
                    src={job.imageUrl}
                    loading="lazy"
                    alt={`Job description for ${job.position} at ${job.company}`}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex w-full sm:justify-start md:justify-between">
            {editMode && <Button type="submit">Update</Button>}
            {!editMode && (
              <Button
                variant="destructive"
                className="mr-auto"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
            <Button
              type="button"
              className="ml-auto"
              variant="secondary"
              onClick={onCancel}
            >
              Close
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateJobForm;
