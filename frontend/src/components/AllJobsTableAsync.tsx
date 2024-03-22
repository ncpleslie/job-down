import {
  useDeleteJobMutation,
  useGetJobsSuspenseQuery,
} from "@/hooks/use-query.hook";
import AllJobsTable from "./AllJobsTable";
import JobResponse from "@/models/responses/job.response";
import { useNavigate } from "@tanstack/react-router";

const AllJobsTableAsync = () => {
  const navigate = useNavigate();
  const { data: jobs } = useGetJobsSuspenseQuery();
  const { mutate, isPending: isPendingDelete } = useDeleteJobMutation();

  const onDeleteJob = (job: JobResponse) => {
    mutate({ jobId: job.id });
  };

  const onDeleteJobs = (jobs: JobResponse[]) => {
    jobs.forEach((job) => {
      mutate({ jobId: job.id });
    });
  };

  const onViewJob = (job: JobResponse) => {
    navigate({ to: "/jobs/$jobId/modal", params: { jobId: job.id } });
  };

  return (
    <AllJobsTable
      onDeleteJob={onDeleteJob}
      onDeleteJobs={onDeleteJobs}
      onViewJob={onViewJob}
      isPendingDelete={isPendingDelete}
      jobs={jobs}
    />
  );
};

export default AllJobsTableAsync;
