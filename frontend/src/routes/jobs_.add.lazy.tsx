import JobForm from "@/components/JobForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAddJob from "@/hooks/use-add-job.hook";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/jobs/add")({
  component: AddJob,
});

function AddJob() {
  const { onClose, onSubmit } = useAddJob();

  return (
    <div className="flex items-center justify-center">
      <Card className="p-8">
        <h2 className="text-center text-xl">Add a new job</h2>
        <JobForm.JobForm onSubmit={onSubmit}>
          <JobForm.JobFormFooter>
            <div className="flex w-full sm:justify-start md:justify-between">
              <Button type="submit" onClick={() => console.log("clik")}>
                Add
              </Button>
              <Button variant="secondary" type="button" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </JobForm.JobFormFooter>
        </JobForm.JobForm>
      </Card>
    </div>
  );
}
