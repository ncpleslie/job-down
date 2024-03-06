import JobResponse, { JobResponseJson } from "./job.response";

export type JobsResponseJson = {
  jobs?: JobResponseJson[];
};

export default class JobsResponse {
  constructor(data: JobsResponseJson) {
    this.jobs = data.jobs?.map((job) => new JobResponse(job)) ?? [];
  }

  public jobs: JobResponse[];
}
