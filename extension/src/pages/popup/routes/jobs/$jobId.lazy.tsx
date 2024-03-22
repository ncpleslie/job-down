import {
  ImageViewer,
  JobFormValues,
  LoadingDialog,
  useGetJobByIdQuery,
  useUpdateJobMutation,
  ScrollArea,
  Button,
  JobForm,
} from "@application-tracker/frontend";
import { createLazyFileRoute } from "@tanstack/react-router";
import useMessage from "@pages/popup/hooks/use-message.hook";
import { useState } from "react";

export const Route = createLazyFileRoute("/jobs/$jobId")({
  component: Job,
});

function Job() {
  const [editMode, setEditMode] = useState(false);
  const { jobId } = Route.useParams();
  const { data: job } = useGetJobByIdQuery(jobId);
  const { mutateAsync, isPending } = useUpdateJobMutation();

  const { data: token } = useMessage({ type: "userToken" });

  const onSubmit = async (values: JobFormValues) => {
    // The returned value may be the same as what was passed in
    // so we need to check if the values are different from the current job before submitting.
    if (!JobForm.formValuesDifferentFromDefaultValues(values, job)) {
      setEditMode(false);
      return;
    }

    await mutateAsync({ payload: { ...values, id: jobId }, token });
    setEditMode(false);
  };

  return (
    <>
      {job && (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col flex-wrap justify-between gap-2 border-b w-full pb-2">
            <h2 className="text-center text-xl">
              {job?.position} @ {job?.company}
            </h2>
            <p className="text-center">Applied on {job?.createdAt}</p>
          </div>
          <ScrollArea className="h-[400px]" type="always">
            <div className="flex flex-col items-center my-2 gap-4 mx-4">
              <ImageViewer
                src={job.imageUrl}
                alt={`${job.position} at ${job.company}`}
              />
              <JobForm.JobForm
                onSubmit={onSubmit}
                defaultValues={job}
                disabled={!editMode}
              >
                <JobForm.JobFormFooter>
                  <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between border border-t bg-white px-8 py-4">
                    {editMode && <Button type="submit">Update</Button>}
                    <Button
                      variant={editMode ? "outline" : "destructive"}
                      className={editMode ? "" : "mr-auto"}
                      onClick={() => setEditMode((prev) => !prev)}
                    >
                      {editMode ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </JobForm.JobFormFooter>
              </JobForm.JobForm>
            </div>
          </ScrollArea>
        </div>
      )}
      <LoadingDialog isLoading={!job}>Loading</LoadingDialog>
      <LoadingDialog isLoading={isPending}>Updating</LoadingDialog>
    </>
  );
}
