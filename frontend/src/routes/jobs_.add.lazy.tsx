import JobForm from "@/components/JobForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAddJob from "@/hooks/use-add-job.hook";
import useHead from "@/hooks/use-head.hook";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useRef } from "react";

export const Route = createLazyFileRoute("/jobs/add")({
  component: AddJob,
});

function AddJob() {
  useHead("Add");
  const { onClose, onSubmit, jobImage, setJobImage } = useAddJob();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addFile = () => {
    if (!imageInputRef.current) {
      return;
    }

    imageInputRef.current.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const image = e.target?.result as string;
        if (image) {
          setJobImage(image);
        }
      };
      reader.readAsDataURL(file);
    };

    imageInputRef.current.click();
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-center text-xl">Add a new job</h2>
          <JobForm.JobForm onSubmit={onSubmit}>
            <JobForm.JobFormFooter>
              <div className="flex w-full sm:justify-start md:justify-between">
                <Button type="submit">Add</Button>
                <Button
                  variant="secondary"
                  type="button"
                  disabled={Boolean(jobImage)}
                  onClick={addFile}
                >
                  Add Image
                  <Upload className="ml-4 h-5 w-5" />
                </Button>
                <Button variant="secondary" type="button" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </JobForm.JobFormFooter>
          </JobForm.JobForm>
        </Card>
      </div>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        ref={imageInputRef}
      />
    </>
  );
}
