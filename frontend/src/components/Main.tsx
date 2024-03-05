import { useState } from "react";
import { useAddJobMutation, useGetJobsQuery } from "../hooks/use-query.hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import RequiredText from "./ui/required-text";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AllJobsTable from "./AllJobs";

const Main: React.FC = () => {
  const [addNewJobDialogOpen, setAddNewJobDialogOpen] = useState(false);

  const { data: allJobs } = useGetJobsQuery();

  const { mutate } = useAddJobMutation();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
    setAddNewJobDialogOpen(false);
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setAddNewJobDialogOpen((prev) => !prev)}
      >
        Add New Job
      </Button>
      <CreateJobFormDialog
        onSubmit={onSubmit}
        open={addNewJobDialogOpen}
        onClose={() => setAddNewJobDialogOpen((prev) => !prev)}
      />
      {allJobs && <AllJobsTable jobs={allJobs.jobs} />}
    </div>
  );
};

type CreateJobFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onClose: () => void;
  open: boolean;
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

const CreateJobFormDialog: React.FC<CreateJobFormProps> = ({
  onSubmit,
  onClose,
  open,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: "",
      company: "",
      url: "",
      status: "Applied",
    },
  });

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Add a new job you've applied to.
          </DialogDescription>
        </DialogHeader>
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
                      <Input
                        placeholder="https://somejob.com/id/123"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The URL of the application. It should contain the job
                      description. We will use that to screenshot the
                      application for later.
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
                      The status of your application. Did you apply? Did you get
                      a photo call?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex w-full sm:justify-start md:justify-between">
                <Button type="submit">Submit</Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Main;
