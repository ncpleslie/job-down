import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AllJobsTable,
  JobResponse,
  LoadingDialog,
  useDeleteJobMutation,
  useUpdateJobMutation,
} from "@application-tracker/frontend";
import { useEffect } from "react";
import useMessage from "@pages/popup/hooks/use-message.hook";
import { useGetJobsQuery } from "@application-tracker/frontend/src/hooks/use-query.hook";

export const Route = createFileRoute("/jobs/")({
  component: Index,
});

function Index() {
  const {
    data: token,
    isPending,
    callAsync: getTokenAsync,
  } = useMessage({ type: "userToken" });
  const navigate = useNavigate();
  const { data: jobs, isPending: isPendingJobs } = useGetJobsQuery(token || "");
  const { mutateAsync, isPending: isPendingDelete } = useDeleteJobMutation();
  const { mutateAsync: updateJobAsync } = useUpdateJobMutation();

  const onDeleteJob = async (job: JobResponse) => {
    if (!token) {
    }
    await getTokenAsync({ type: "userToken" });
    await mutateAsync({ jobId: job.id, token: token || "" });
  };

  const onDeleteJobs = async (jobs: JobResponse[]) => {
    await getTokenAsync({ type: "userToken" });
    jobs.forEach(async (job) => {
      if (!token) {
        return;
      }

      await mutateAsync({ jobId: job.id, token });
    });
  };

  const onUpdateJob = async (job: JobResponse) => {
    await getTokenAsync({ type: "userToken" });
    await updateJobAsync({ payload: job, token });
  };

  const onViewJob = (job: JobResponse) => {
    navigate({ to: `/jobs/$jobId`, params: { jobId: job.id } });
  };

  if (isPending) {
    return <LoadingDialog isLoading={true}>Loading</LoadingDialog>;
  }

  return (
    <div className="mx-4">
      {jobs && (
        <AllJobsTable
          onDeleteJob={onDeleteJob}
          onDeleteJobs={onDeleteJobs}
          onViewJob={onViewJob}
          onUpdateJob={onUpdateJob}
          isPendingDelete={isPendingDelete}
          jobs={jobs}
          addNewJobUrl="/jobs/add"
        />
      )}
      {isPendingJobs && <LoadingDialog isLoading={true}>Loading</LoadingDialog>}
    </div>
  );
}
