export type StatsResponseJson = {
  total: number;
  current: StatResponseJson;
  historical: StatResponseJson;
};

export type StatResponseJson = {
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  other: number;
  accepted: number;
  withdrawn: number;
};

export default class StatsResponse {
  constructor(data: StatsResponseJson) {
    this.total = data.total;
    this.current = new StatResponse(data.current);
    this.historical = new StatResponse(data.historical);
  }

  public total: number;
  public current: StatResponse;
  public historical: StatResponse;
}

export class StatResponse {
  constructor(data: StatResponseJson) {
    this.applied = data.applied;
    this.interview = data.interview;
    this.offer = data.offer;
    this.rejected = data.rejected;
    this.other = data.other;
    this.accepted = data.accepted;
    this.withdrawn = data.withdrawn;
  }

  public applied: number;
  public interview: number;
  public offer: number;
  public rejected: number;
  public other: number;
  public accepted: number;
  public withdrawn: number;
}
