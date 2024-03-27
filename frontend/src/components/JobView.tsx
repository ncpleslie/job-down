import ImageViewer from "@/components/ImageViewer";
import JobForm from "@/components/JobForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JobFormValues } from "@/constants/job-form.constants";
import { JobResponse } from "@/models";

interface JobViewProps {
  job: JobResponse;
  editMode: boolean;
  toggleEditMode: () => void;
  onSubmit: (values: JobFormValues) => void;
}

const JobView: React.FC<JobViewProps> = ({
  job,
  editMode,
  toggleEditMode,
  onSubmit,
}) => {
  return (
    <div className="flex items-center justify-center">
      <Card className="p-8">
        <div className="flex flex-row flex-wrap justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-center text-xl">
              {job?.position} @ {job?.company}
            </h2>
            <p className="text-center">Applied on {job?.createdAt}</p>
          </div>
          {job.imageFilename && (
            <ImageViewer
              src={job.imageUrl}
              alt={`Job description for ${job.position} at ${job.company}`}
            />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <JobForm.JobForm
            onSubmit={onSubmit}
            defaultValues={job}
            disabled={!editMode}
          >
            <JobForm.JobFormFooter>
              <div className="flex w-full gap-4 sm:justify-start md:justify-between">
                {editMode && <Button type="submit">Update</Button>}
                <Button
                  variant={editMode ? "outline" : "destructive"}
                  className={editMode ? "" : "mr-auto"}
                  onClick={toggleEditMode}
                >
                  {editMode ? "Cancel" : "Edit"}
                </Button>
              </div>
            </JobForm.JobFormFooter>
          </JobForm.JobForm>
        </div>
      </Card>
    </div>
  );
};

export default JobView;
