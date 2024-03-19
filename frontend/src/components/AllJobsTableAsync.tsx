import {
  useDeleteJobMutation,
  useGetJobsSuspenseQuery,
} from "@/hooks/use-query.hook";
import AllJobsTable from "./AllJobsTable";
import JobResponse from "@/models/responses/job.response";

const AllJobsTableAsync = () => {
  const { data: jobs } = useGetJobsSuspenseQuery();
  const { mutate, isPending: isPendingDelete } = useDeleteJobMutation();

  const onDeleteJob = (job: JobResponse) => {
    mutate(job.id);
  };

  const onDeleteJobs = (jobs: JobResponse[]) => {
    jobs.forEach((job) => {
      mutate(job.id);
    });
  };

  return (
    <AllJobsTable
      onDeleteJob={onDeleteJob}
      onDeleteJobs={onDeleteJobs}
      isPendingDelete={isPendingDelete}
      jobs={jobs}
    />
  );
};

export default AllJobsTableAsync;
