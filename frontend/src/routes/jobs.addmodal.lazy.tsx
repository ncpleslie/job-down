import AddJobForm, { AddJobFormValues } from "@/components/AddJobForm";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAddJobMutation } from "@/hooks/use-query.hook";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/jobs/addmodal")({
  component: AddJobModal,
});

function AddJobModal() {
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Add a new job you've applied to.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <AddJobForm onSubmit={onSubmit} onCancel={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
