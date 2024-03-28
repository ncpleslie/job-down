import { JobFormValues } from "@/constants/job-form.constants";
import { useAddJobMutation, useCreateJobQuery } from "./use-query.hook";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const useAddJob = (token?: string | null) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [jobImage, setJobImage] = useState<string | undefined>();
  const { mutateAsync, isPending, status } = useAddJobMutation();
  const { data } = useCreateJobQuery();
  const router = useRouter();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && status === "success") {
      navigate({
        to: "/jobs/$jobId",
        params: { jobId: data.id },
        replace: true,
      });
    }
  }, [data, status, navigate]);

  const onSubmit = async (values: JobFormValues) => {
    await mutateAsync({
      payload: {
        ...values,
        image: jobImage,
      },
      token,
    });
  };

  const onClose = () => {
    router.history.back();
  };

  const addFile = () => {
    if (!imageInputRef.current) {
      throw new Error("Image input ref is not set");
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

  return {
    onSubmit,
    onClose,
    setJobImage,
    addFile,
    jobImage,
    isPending,
    imageInputRef,
  };
};

export default useAddJob;
