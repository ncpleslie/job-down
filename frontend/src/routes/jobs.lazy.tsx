import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useDeleteJobMutation, useGetJobsQuery } from "../hooks/use-query.hook";
import AllJobsTable from "../components/AllJobsTable";
import JobResponse from "@/models/responses/job.response";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/jobs")({
  component: Index,
});

function Index() {
  const { data: allJobs } = useGetJobsQuery();
  const { mutate, isPending: isPendingDelete } = useDeleteJobMutation();

  const onDeleteJobs = (jobs: JobResponse[]) => {
    jobs.forEach((job) => {
      mutate(job.id);
    });
  };

  return (
    <div>
      {allJobs && <AllJobsTable jobs={allJobs} onDeleteJobs={onDeleteJobs} />}
      <LoadingDialog isLoading={!isPendingDelete}>Deleting</LoadingDialog>
      <Outlet />
    </div>
  );
}
