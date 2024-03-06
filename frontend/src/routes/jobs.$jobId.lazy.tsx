import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "@/hooks/use-query.hook";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { dateStringToTimeAndDate } from "@/utils/date-format.utils";
import UpdateJobForm, { UpdateJobFormValues } from "@/components/UpdateJobForm";

export const Route = createLazyFileRoute("/jobs/$jobId")({
  component: Job,
});

function Job() {
  const { jobId } = Route.useParams();
  const { data } = useGetJobByIdQuery(jobId);
  const { mutateAsync, isPending } = useUpdateJobMutation();
  const router = useRouter();

  const onClose = () => {
    router.history.back();
  };

  const onSubmit = async (values: UpdateJobFormValues) => {
    await mutateAsync({ ...values, id: jobId });
    router.history.back();
  };

  const onCancel = () => {
    router.history.back();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        {data && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {data?.position} @ {data?.company}
              </DialogTitle>
              <DialogDescription className="max-w-md">
                About your application to {data?.position} at {data?.company} on{" "}
                {dateStringToTimeAndDate(data?.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <UpdateJobForm
                job={data}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
            </div>
          </DialogContent>
        )}
        {!data && <DialogContent>Loading...</DialogContent>}
      </Dialog>
      <LoadingDialog isLoading={!isPending}>Updating</LoadingDialog>
    </>
  );
}
