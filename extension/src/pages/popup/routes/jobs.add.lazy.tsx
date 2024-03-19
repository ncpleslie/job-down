import {
  Button,
  Card,
  JobForm,
  useAddJob,
} from "@application-tracker/frontend";
import { createLazyFileRoute } from "@tanstack/react-router";
import useMessage from "../hooks/use-message.hook";

export const Route = createLazyFileRoute("/jobs/add")({
  component: AddJob,
});

function AddJob() {
  const sendMessage = useMessage();
  const { data } = sendMessage("userToken");

  const { onClose, onSubmit } = useAddJob(data);

  return (
    <div className="flex items-center justify-center">
      <Card className="p-8">
        <h2 className="text-center text-xl">Add a new job</h2>
        <JobForm.JobForm onSubmit={onSubmit}>
          <JobForm.JobFormFooter>
            <div className="flex w-full sm:justify-start md:justify-between">
              <Button type="submit">Add</Button>
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
