import {
  Button,
  JobForm,
  LoadingDialog,
  useAddJob,
  ScrollArea,
} from "@application-tracker/frontend";
import { createLazyFileRoute } from "@tanstack/react-router";
import useMessage from "@pages/popup/hooks/use-message.hook";
import useScreenshot from "@pages/popup/hooks/use-screenshot.hook";
import { Aperture, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createLazyFileRoute("/jobs/add")({
  component: AddJob,
});

function AddJob() {
  const [capturing, setCapturing] = useState(false);
  const { captureFullPageScreenshot, canvasRef } = useScreenshot();

  const { data: token } = useMessage({ type: "userToken" });
  const { onSubmit, onClose, setJobImage, jobImage, isPending } =
    useAddJob(token);

  const onCapture = () => {
    setCapturing(true);
    captureFullPageScreenshot((dataUrl) => {
      setJobImage(dataUrl);
      setCapturing(false);
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <ScrollArea className="h-[455px]" type="always">
          <div className="my-2 flex items-center mx-4">
            <JobForm.JobForm onSubmit={onSubmit}>
              <JobForm.JobFormFooter>
                <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between border border-t bg-white px-8 py-4">
                  <Button type="submit">Add</Button>
                  <Button
                    variant={jobImage ? "outline" : "secondary"}
                    disabled={Boolean(jobImage) || capturing}
                    type="button"
                    onClick={onCapture}
                    title="Capture screenshot of the job posting"
                  >
                    {!capturing && <Aperture className="h-6 w-6" />}
                    {capturing && <Loader2 className="animate-spin h-6 w-6" />}
                  </Button>
                  <Button variant="secondary" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </JobForm.JobFormFooter>
            </JobForm.JobForm>
          </div>
        </ScrollArea>
      </div>
      <LoadingDialog isLoading={isPending}>Adding job</LoadingDialog>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
