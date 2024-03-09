import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "@/hooks/use-query.hook";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import JobForm, { JobFormValues } from "@/components/JobForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageViewer from "@/components/ImageViewer";

export const Route = createLazyFileRoute("/jobs/$jobId/modal")({
  component: JobModal,
});

function JobModal() {
  const [editMode, setEditMode] = useState(false);
  const { jobId } = Route.useParams();
  const { data: job } = useGetJobByIdQuery(jobId);
  const { mutateAsync, isPending } = useUpdateJobMutation();
  const router = useRouter();

  const onClose = () => {
    router.history.back();
  };

  const onSubmit = async (values: JobFormValues) => {
    await mutateAsync({ ...values, id: jobId });
    router.history.back();
  };

  const onCancel = () => {
    router.history.back();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        {job && (
          <DialogContent className="max-h-[100vh] md:max-h-[90vh] md:rounded-md">
            <DialogHeader className="mt-6 flex items-center justify-center border-b-2 px-8 pb-4">
              <DialogTitle>
                {job?.position} @ {job?.company}
              </DialogTitle>
              <DialogDescription className="max-w-md">
                Applied on {job?.createdAt}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[90vh] md:max-h-[75vh]">
              <div className="mb-24 flex flex-1 items-center space-x-2 overflow-y-auto px-5 py-6 md:px-8">
                <JobForm.JobForm
                  onSubmit={onSubmit}
                  defaultValues={job}
                  disabled={!editMode}
                >
                  <JobForm.JobFormFooter>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger disabled={!job.imageUrl}>
                          Application Page {!job.imageUrl && "Is Processing..."}
                        </AccordionTrigger>
                        <AccordionContent className="flex justify-center">
                          <ImageViewer
                            src={job.imageUrl}
                            alt={`Job description for ${job.position} at ${job.company}`}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t-2 bg-white px-8 py-8">
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
                  </JobForm.JobFormFooter>
                </JobForm.JobForm>
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
      <LoadingDialog isLoading={!job}>Loading</LoadingDialog>
      <LoadingDialog isLoading={isPending}>Updating</LoadingDialog>
    </>
  );
}
