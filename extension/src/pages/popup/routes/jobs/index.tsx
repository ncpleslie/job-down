import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AllJobsTable,
  JobResponse,
  LoadingDialog,
  useDeleteJobMutation,
  useGetJobsSuspenseQuery,
} from "@application-tracker/frontend";
import { Suspense, useEffect } from "react";
import useMessage from "@pages/popup/hooks/use-message.hook";

export const Route = createFileRoute("/jobs/")({
  component: Index,
});

function Index() {
  const {
    data: token,
    isPending,
    callAsync: getTokenAsync,
  } = useMessage({ type: "userToken" }, { enabled: false });

  useEffect(() => {
    if (!token) {
      getTokenAsync({ type: "userToken" });
    }
  }, [token]);

  if (isPending) {
    return <LoadingDialog isLoading={true}>Loading</LoadingDialog>;
  }

  return (
    <div>
      <Suspense
        fallback={<LoadingDialog isLoading={true}>Loading</LoadingDialog>}
      >
        {token && <AllJobsTableAsync token={token} />}
      </Suspense>
    </div>
  );
}

interface AllJobsTableAsyncProps {
  token: string;
}

const AllJobsTableAsync: React.FC<AllJobsTableAsyncProps> = ({ token }) => {
  const navigate = useNavigate();
  const { data: jobs } = useGetJobsSuspenseQuery(token);
  const { mutate, isPending: isPendingDelete } = useDeleteJobMutation();

  const onDeleteJob = (job: JobResponse) => {
    mutate({ jobId: job.id, token });
  };

  const onDeleteJobs = (jobs: JobResponse[]) => {
    jobs.forEach((job) => {
      mutate({ jobId: job.id, token });
    });
  };

  const onViewJob = (job: JobResponse) => {
    navigate({ to: `/jobs/$jobId`, params: { jobId: job.id } });
  };

  return (
    <div className="mx-4">
      <AllJobsTable
        onDeleteJob={onDeleteJob}
        onDeleteJobs={onDeleteJobs}
        onViewJob={onViewJob}
        isPendingDelete={isPendingDelete}
        jobs={jobs}
      />
    </div>
  );
};
