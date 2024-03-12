export type JobResponseJson = {
  id: string;
  position: string;
  company: string;
  url: string;
  image_filename?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  status: string;
  additionalNotes?: string;
};

export default class JobResponse {
  constructor(data: JobResponseJson) {
    this.id = data.id;
    this.position = data.position;
    this.company = data.company;
    this.url = data.url;
    this.imageFilename = data.image_filename;
    this.imageUrl = data.image_url;
    this.createdAt = this.dateStringToTimeAndDate(data.created_at);
    this.updatedAt = data.updated_at
      ? this.dateStringToTimeAndDate(data.updated_at)
      : undefined;
    this.status = data.status;
    this.additionalNotes = data.additionalNotes;
  }

  public id: string;
  public position: string;
  public company: string;
  public url: string;
  public imageFilename?: string;
  public imageUrl?: string;
  public createdAt: string;
  public updatedAt?: string;
  public status: string;
  public additionalNotes?: string;

  private dateStringToTimeAndDate(date: string) {
    const dateObj = new Date(date);
    return `${dateObj.toLocaleTimeString()} - ${dateObj.toLocaleDateString()}`;
  }
}
