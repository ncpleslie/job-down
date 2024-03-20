import {
  Button,
  Card,
  JobForm,
  LoadingDialog,
  useAddJob,
  ScrollArea,
} from "@application-tracker/frontend";
import { createLazyFileRoute } from "@tanstack/react-router";
import useMessage from "@pages/popup/hooks/use-message.hook";
import useScreenshot from "@pages/popup/hooks/use-screenshot.hook";

export const Route = createLazyFileRoute("/jobs/add")({
  component: AddJob,
});

function AddJob() {
  const { captureFullPageScreenshot, canvasRef } = useScreenshot();

  const sendMessage = useMessage();
  const { data: token } = sendMessage("userToken");
  const { onSubmit, onClose, setJobImage, jobImage, isPending } =
    useAddJob(token);

  const onCapture = () => {
    captureFullPageScreenshot((dataUrl) => {
      setJobImage(dataUrl);
    });
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-center text-xl">Add a new job</h2>
          <ScrollArea className="max-h-[500px]">
            <div className="mb-32 flex items-center space-x-2 px-5 md:px-8">
              <JobForm.JobForm onSubmit={onSubmit}>
                <JobForm.JobFormFooter>
                  <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between border border-t-2 bg-white px-8 py-8">
                    <Button
                      variant={jobImage ? "outline" : "secondary"}
                      disabled={Boolean(jobImage)}
                      type="button"
                      onClick={onCapture}
                    >
                      Capture
                    </Button>
                    <div className="flex w-full justify-between">
                      <Button type="submit">Add</Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </JobForm.JobFormFooter>
              </JobForm.JobForm>
            </div>
          </ScrollArea>
        </Card>
      </div>
      <LoadingDialog isLoading={isPending}>Adding job</LoadingDialog>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
