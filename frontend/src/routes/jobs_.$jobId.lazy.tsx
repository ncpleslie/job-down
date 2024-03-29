import JobForm from "@/components/JobForm";
import JobView from "@/components/JobView";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { type JobFormValues } from "@/constants/job-form.constants";
import useHead from "@/hooks/use-head.hook";
import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "@/hooks/use-query.hook";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/jobs/$jobId")({
  component: Job,
});

function Job() {
  const [editMode, setEditMode] = useState(false);
  const { jobId } = Route.useParams();
  const { data: job, isPending: isJobPending } = useGetJobByIdQuery(jobId);
  const { mutateAsync, isPending } = useUpdateJobMutation();
  useHead(
    `${isJobPending ? "Loading..." : `${job?.position} @ ${job?.company}`}` ||
      "Job Details",
  );

  const onSubmit = async (values: JobFormValues) => {
    if (!job || !JobForm.formValuesDifferentFromDefaultValues(values, job)) {
      return;
    }

    await mutateAsync({ payload: { ...values, id: jobId } });
    setEditMode(false);
  };

  return (
    <>
      <div className="mb-8">
        {job && (
          <JobView
            job={job}
            editMode={editMode}
            toggleEditMode={() => setEditMode((prev) => !prev)}
            onSubmit={onSubmit}
          />
        )}
      </div>
      <LoadingDialog isLoading={!job}>Loading</LoadingDialog>
      <LoadingDialog isLoading={isPending}>Updating</LoadingDialog>
    </>
  );
}
