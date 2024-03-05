import BaseResponse from "./base.response";

export type JobResponseJson = {
  id: string;
  position: string;
  company: string;
  url: string;
  image_filename: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  status: string;
};

export default class JobResponse extends BaseResponse {
  constructor(data: JobResponseJson) {
    super();
    this.id = data.id;
    this.position = data.position;
    this.company = data.company;
    this.url = data.url;
    this.imageFilename = data.image_filename;
    this.imageUrl = data.image_url;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.status = data.status;
  }

  public id: string;
  public position: string;
  public company: string;
  public url: string;
  public imageFilename: string;
  public imageUrl: string;
  public createdAt: string;
  public updatedAt: string;
  public status: string;
}
