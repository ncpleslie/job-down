import AddJobForm from "@/components/AddJobForm";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import useAddJob from "@/hooks/use-add-job.hook";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/jobs/addmodal")({
  component: AddJobModal,
});

function AddJobModal() {
  const { onClose, onSubmit } = useAddJob();

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
