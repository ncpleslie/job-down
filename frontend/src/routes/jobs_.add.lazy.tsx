import AddJobForm from "@/components/AddJobForm";
import { Card } from "@/components/ui/card";
import useAddJob from "@/hooks/use-add-job.hook";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/jobs/add")({
  component: AddJob,
});

function AddJob() {
  const { onClose, onSubmit } = useAddJob();

  return (
    <div className="flex items-center justify-center">
      <Card className="p-8">
        <h2 className="text-center text-xl">Add a new job</h2>
        <AddJobForm onSubmit={onSubmit} onCancel={onClose} />
      </Card>
    </div>
  );
}
