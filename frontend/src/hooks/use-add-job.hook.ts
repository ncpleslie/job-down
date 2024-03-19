import { JobFormValues } from "@/constants/job-form.constants";
import { useAddJobMutation, useCreateJobQuery } from "./use-query.hook";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

const useAddJob = (token?: string) => {
  const { data } = useCreateJobQuery();
  const { mutate } = useAddJobMutation(token);
  const router = useRouter();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate({
        to: "/jobs/$jobId",
        params: { jobId: data.id },
        replace: true,
      });
    }
  }, [data, navigate]);

  const onSubmit = (values: JobFormValues) => {
    mutate(values);
  };

  const onClose = () => {
    router.history.back();
  };

  return { onSubmit, onClose };
};

export default useAddJob;
