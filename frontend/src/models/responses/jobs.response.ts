import BaseResponse from "./base.response";
import JobResponse, { JobResponseJson } from "./job.response";

export type JobsResponseJson = {
  jobs: JobResponseJson[];
};

export default class JobsResponse extends BaseResponse {
  constructor(data: JobsResponseJson) {
    super();
    this.jobs = data.jobs.map((job) => new JobResponse(job));
  }

  public jobs: JobResponse[];
}
