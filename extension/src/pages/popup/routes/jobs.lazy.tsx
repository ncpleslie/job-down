import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  AllJobsTable,
  JobResponse,
  LoadingDialog,
  useDeleteJobMutation,
  useGetJobsSuspenseQuery,
} from "@application-tracker/frontend";
import { Suspense } from "react";
import useMessage from "../hooks/use-message.hook";

export const Route = createLazyFileRoute("/jobs")({
  component: Index,
});

function Index() {
  const sendMessage = useMessage();
  const { data: token, isPending } = sendMessage("userToken");

  if (!token) {
    return <LoadingDialog isLoading={true}>Loading</LoadingDialog>;
  }

  return (
    <div>
      <Suspense
        fallback={<LoadingDialog isLoading={true}>Loading</LoadingDialog>}
      >
        <AllJobsTableAsync token={token} />
      </Suspense>
      <Outlet />
    </div>
  );
}

interface AllJobsTableAsyncProps {
  token: string;
}

const AllJobsTableAsync: React.FC<AllJobsTableAsyncProps> = ({ token }) => {
  const { data: jobs } = useGetJobsSuspenseQuery(token);
  const { mutate, isPending: isPendingDelete } = useDeleteJobMutation(token);

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
