import AddJobForm, { AddJobFormValues } from "@/components/AddJobForm";
import { useAddJobMutation } from "@/hooks/use-query.hook";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/jobs/add")({
  component: AddJob,
});

function AddJob() {
  const { mutate } = useAddJobMutation();
  const router = useRouter();

  const onSubmit = (values: AddJobFormValues) => {
    mutate(values);
    router.history.back();
  };

  const onClose = () => {
    router.history.back();
  };

  return (
    <div>
      <AddJobForm onSubmit={onSubmit} onCancel={onClose} />
    </div>
  );
}
