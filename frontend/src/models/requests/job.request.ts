export default class JobRequest {
  constructor(data: {
    position: string;
    company: string;
    url: string;
    status: string;
  }) {
    this.position = data.position;
    this.company = data.company;
    this.url = data.url;
    this.status = data.status;
  }

  public position: string;
  public company: string;
  public url: string;
  public status: string;
}
