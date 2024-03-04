import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpStatusToText } from "../lib/utils/http-status-to-text.util";
import JobResponse from "../models/responses/job.response";

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
export const useGetJobsQuery = () => {
  return useQuery({
    queryKey: ["getJobs"],
    queryFn: async () => {
      const response = await fetch("/api/job/test1");
      if (!response.ok) {
        throw new Error(
          "An error has occurred: " + httpStatusToText(response.status),
        );
      }

      return (await response.json()).map(
        (job: JobResponse) => new JobResponse(job),
      );
    },
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

      return new JobResponse(await response.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getJobs"] });
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
        method: "PUT",
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getJobs", "getJobById"],
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getJobs", "getJobById"] });
    },
  });
};
