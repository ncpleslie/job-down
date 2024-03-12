import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import RequiredText from "./ui/required-text";
import { PropsWithChildren, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PlusSquare } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AppConstants from "@/constants/app.constants";
import { snakeCaseToTitleCase } from "@/lib/utils/helper.utils";
import { Textarea } from "@/components/ui/textarea";
import { JobFormValues, formSchema } from "@/constants/job-form.constants";

type JobFormProps = {
  onSubmit: (values: JobFormValues) => void;
  defaultValues?: JobFormValues;
  disabled?: boolean;
};

const JobForm: React.FC<PropsWithChildren<JobFormProps>> = ({
  onSubmit,
  defaultValues,
  disabled,
  children,
}) => {
  const [statuses, setStatuses] = useState<typeof AppConstants.JobStatuses>(
    AppConstants.JobStatuses,
  );
  const [newStatus, setNewStatus] = useState<string>("");
  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      position: "",
      company: "",
      url: "",
      status: "applied",
    },
    disabled: disabled,
  });

  const addStatus = (status: string) => {
    setStatuses((prev) => {
      const statusObj = {
        id: status.trim().replace(/\s/g, "_").toLowerCase(),
        label: status,
      };

      const exists = prev.some((s) => s.id === statusObj.id);
      if (exists) {
        return prev;
      }

      return [...prev, statusObj];
    });

    form.setValue("status", status);
  };

  useEffect(() => {
    const newDefaultStatus = defaultValues?.status;

    if (newDefaultStatus) {
      addStatus(newDefaultStatus);
    }
  }, [defaultValues, addStatus]);

  const addNewStatus = () => {
    if (newStatus.trim() === "") {
      return;
    }

    addStatus(newStatus);
    setNewStatus("");
  };

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
                  Position {!disabled && <RequiredText>*</RequiredText>}
                </FormLabel>
                <FormDescription>
                  The name of the position you applied for. E.g. Software
                  Engineer.
                </FormDescription>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
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
                  Company {!disabled && <RequiredText>*</RequiredText>}
                </FormLabel>
                <FormDescription>
                  The name of the Company you applied for. E.g. XYZ Corp.
                </FormDescription>
                <FormControl>
                  <Input placeholder="XYZ Corp" {...field} />
                </FormControl>

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
                  Application URL {!disabled && <RequiredText>*</RequiredText>}
                </FormLabel>
                <FormDescription>
                  The URL of the application. It should contain the job
                  description. We will use that to screenshot the application
                  for later.
                </FormDescription>
                <FormControl>
                  <Input placeholder="https://somejob.com/id/123" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormDescription>
                  Important information such as salary, benefits, or other
                </FormDescription>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Status {!disabled && <RequiredText>*</RequiredText>}
                </FormLabel>
                <FormDescription>
                  The status of your application. Did you apply? Did you get a
                  photo call?
                </FormDescription>
                <FormControl>
                  <>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={disabled}
                    >
                      {statuses.map((status) => (
                        <FormField
                          key={status.id}
                          control={form.control}
                          name="status"
                          render={() => {
                            return (
                              <FormItem
                                key={status.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={status.id}
                                    id={status.id}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">
                                  {snakeCaseToTitleCase(status.label)}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      {!disabled && (
                        <div className="flex w-[250px] flex-col gap-2">
                          <div className="flex flex-row gap-2">
                            <Input
                              value={newStatus}
                              onInput={(e) =>
                                setNewStatus(
                                  (e.target as HTMLInputElement).value,
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addNewStatus();
                                }
                              }}
                            />
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={addNewStatus}
                            >
                              <PlusSquare />
                            </Button>
                          </div>
                        </div>
                      )}
                    </RadioGroup>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {children}
        </form>
      </Form>
    </div>
  );
};

const JobFormFooter: React.FC<PropsWithChildren> = ({ children }) => {
  return <> {children}</>;
};

JobFormFooter.displayName = "JobFormFooter";

export default { JobForm, JobFormFooter };
