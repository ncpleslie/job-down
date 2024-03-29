import JobForm from "@/components/JobForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAddJob from "@/hooks/use-add-job.hook";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";

export const Route = createLazyFileRoute("/jobs/add/modal")({
  component: AddJobModal,
});

function AddJobModal() {
  const { onClose, onSubmit, addFile, imageInputRef, jobImage } = useAddJob();

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-h-[100dvh] md:max-h-[90dvh] md:rounded-md">
          <DialogHeader className="mt-6 flex items-center justify-center border-b-2 pb-4">
            <DialogTitle>Add New Job</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[90vh] md:max-h-[75vh]">
            <div className="mb-32 flex items-center space-x-2 px-5 md:px-8">
              <JobForm.JobForm onSubmit={onSubmit}>
                <JobForm.JobFormFooter>
                  <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between border border-t-2 bg-white px-8 py-8">
                    <Button type="submit">Add</Button>
                    <Button
                      variant="secondary"
                      type="button"
                      disabled={Boolean(jobImage)}
                      onClick={addFile}
                    >
                      Add Image
                      <Upload className="ml-4 h-5 w-5" />
                    </Button>
                    <Button variant="secondary" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>
                </JobForm.JobFormFooter>
              </JobForm.JobForm>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        ref={imageInputRef}
      />
    </>
  );
}
