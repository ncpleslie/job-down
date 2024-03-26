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
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { PlusSquare } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { snakeCaseToTitleCase } from "@/lib/utils/helper.utils";
import { Textarea } from "@/components/ui/textarea";
import JobFormConstants, {
  JobFormValues,
  formSchema,
} from "@/constants/job-form.constants";

type JobFormProps = {
  onSubmit: (values: JobFormValues) => void;
  defaultValues?: JobFormValues;
  disabled?: boolean;
};

/**
 * A function to check if the form values are different from the default values.
 * @param value - The form values
 * @param defaultValue - The default values
 * @returns - A boolean indicating if the form values are different from the default values
 */
const formValuesDifferentFromDefaultValues = <T extends JobFormValues>(
  values: JobFormValues,
  defaultValue: T,
) => {
  const keys = Object.keys(values) as (keyof JobFormValues)[];
  return keys.some((key) => values[key] !== defaultValue?.[key]);
};

const JobForm: React.FC<PropsWithChildren<JobFormProps>> = ({
  onSubmit,
  defaultValues,
  disabled,
  children,
}) => {
  const [statuses, setStatuses] = useState<typeof JobFormConstants.JobStatuses>(
    JobFormConstants.JobStatuses,
  );
  const [newStatus, setNewStatus] = useState<string>("");
  const defaultValuesClone = useMemo(
    () => structuredClone(defaultValues),
    [defaultValues],
  );

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValuesClone || {
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
    const newDefaultStatus = defaultValuesClone?.status;

    if (newDefaultStatus) {
      addStatus(newDefaultStatus);
    }
  }, [defaultValuesClone]);

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
            name="notes"
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
                  The status of your application. E.g. Applied, Interviewing.
                </FormDescription>
                <FormControl>
                  <>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={disabled}
                    >
                      {statuses.map((status) => (
                        <FormItem
                          key={status.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={status.id} id={status.id} />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {snakeCaseToTitleCase(status.label)}
                          </FormLabel>
                        </FormItem>
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

export default { JobForm, JobFormFooter, formValuesDifferentFromDefaultValues };
