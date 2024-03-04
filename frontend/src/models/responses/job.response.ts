import BaseResponse from "./base.response";

export default class JobResponse extends BaseResponse {
  constructor(data: {
    id: string;
    position: string;
    company: string;
    url: string;
    status: string;
    created_at: string;
    updated_at: string;
  }) {
    super();
    this.id = data.id;
    this.position = data.position;
    this.company = data.company;
    this.url = data.url;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public id: string;
  public position: string;
  public company: string;
  public url: string;
  public status: string;
  public created_at: string;
  public updated_at: string;
}
