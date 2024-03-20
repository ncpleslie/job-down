import JobView from "@/components/JobView";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { type JobFormValues } from "@/constants/job-form.constants";
import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "@/hooks/use-query.hook";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/jobs/$jobId")({
  component: Job,
});

function Job() {
  const { jobId } = Route.useParams();
  const { data: job } = useGetJobByIdQuery(jobId);
  const { mutateAsync, isPending } = useUpdateJobMutation();

  const onSubmit = async (values: JobFormValues) => {
    await mutateAsync({ payload: { ...values, id: jobId } });
  };

  return (
    <>
      {job && <JobView job={job} onSubmit={onSubmit} />}
      <LoadingDialog isLoading={!job}>Loading</LoadingDialog>
      <LoadingDialog isLoading={isPending}>Updating</LoadingDialog>
    </>
  );
}
