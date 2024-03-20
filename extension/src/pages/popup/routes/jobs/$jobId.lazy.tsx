import {
  JobFormValues,
  JobView,
  LoadingDialog,
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "@application-tracker/frontend";
import { createLazyFileRoute } from "@tanstack/react-router";
import useMessage from "@pages/popup/hooks/use-message.hook";

export const Route = createLazyFileRoute("/jobs/$jobId")({
  component: Job,
});

function Job() {
  const { jobId } = Route.useParams();
  const { data: job } = useGetJobByIdQuery(jobId);
  const { mutate, isPending } = useUpdateJobMutation();

  const sendMessage = useMessage();
  const { data: token } = sendMessage("userToken");

  const onSubmit = async (values: JobFormValues) => {
    mutate({ payload: { ...values, id: jobId }, token });
  };

  return (
    <>
      {job && <JobView job={job} onSubmit={onSubmit} />}
      <LoadingDialog isLoading={!job}>Loading</LoadingDialog>
      <LoadingDialog isLoading={isPending}>Updating</LoadingDialog>
    </>
  );
}
