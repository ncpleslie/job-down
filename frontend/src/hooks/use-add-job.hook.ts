import { AddJobFormValues } from "@/components/AddJobForm";
import { useAddJobMutation, useCreateJobQuery } from "./use-query.hook";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

const useAddJob = () => {
  const { data } = useCreateJobQuery();
  const { mutate } = useAddJobMutation();
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
  }, [data]);

  const onSubmit = (values: AddJobFormValues) => {
    mutate(values);
  };

  const onClose = () => {
    router.history.back();
  };

  return { onSubmit, onClose };
};

export default useAddJob;
