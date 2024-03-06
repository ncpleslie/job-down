import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { httpStatusToText } from "../lib/utils/http-status-to-text.util";
import JobResponse from "../models/responses/job.response";
import JobsResponse, {
  JobsResponseJson,
} from "@/models/responses/jobs.response";

/**
 * A hook to get a job by its ID.
 * @param jobId - The job's id.
 */
export const useGetJobByIdQuery = (jobId: string) => {
  return useQuery({
    queryKey: ["getJobById", jobId],
    queryFn: async () => {
      const response = await fetch(`/api/job/test1/${jobId}`);
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }

      return new JobResponse(await response.json());
    },
    enabled: Boolean(jobId),
  });
};

/**
 * A hook to get all jobs.
 */
export const useGetJobsSuspenseQuery = () => {
  return useSuspenseQuery({
    queryKey: ["getJobs"],
    queryFn: async () => {
      const response = await fetch("/api/job/test1");
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }
      const jobs = (await response.json()) as JobsResponseJson;

      return new JobsResponse(jobs).jobs;
    },
  });
};

export const useCreateJobQuery = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["createJob"],
    queryFn: async () => {
      const job = queryClient.getQueryData(["createJob"]) as JobResponse;

      if (job) {
        return job;
      }
    },
    enabled: false,
  });
};

/**
 * A hook to add a job.
 */
export const useAddJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: {
      position: string;
      company: string;
      url: string;
      status: string;
    }) => {
      const response = await fetch("/api/job/test1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from stream");
      }

      const readChunk = async () => {
        const { value, done } = await reader.read();
        if (done) {
          return;
        }

        const chunkString = new TextDecoder().decode(value);
        const job = new JobResponse(JSON.parse(chunkString));
        queryClient.setQueryData(["createJob"], () => job);
        queryClient.setQueryData(["getJobById", job.id], () => job);
        queryClient.invalidateQueries({ queryKey: ["getJobs"] });
        queryClient.refetchQueries({ queryKey: ["getJobs"] });

        readChunk();
      };

      readChunk();
    },
  });
};

/**
 * A hook to update a job.
 */
export const useUpdateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: {
      id: string;
      position: string;
      company: string;
      url: string;
      status: string;
    }) => {
      const response = await fetch(`/api/job/test1/${request.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }

      return new JobResponse(await response.json());
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({
        queryKey: ["getJobs", "getJobById"],
      });
      queryClient.setQueryData(["getJobById", job.id], () => job);
      queryClient.refetchQueries({ queryKey: ["getJobs"] });
    },
  });
};

/**
 * A hook to delete a job by its ID.
 */
export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/job/test1/${jobId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getJobs", "getJobById"],
      });
      queryClient.setQueryData(["getJobById", variables], () => null);
      queryClient.refetchQueries({ queryKey: ["getJobs"] });
    },
  });
};
