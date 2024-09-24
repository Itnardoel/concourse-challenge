export type CommitActivity = {
  days: number[];
  total: number;
  week: number;
};

export type OwnerRepo = {
  owner: string;
  repo: string;
};

export type ErrorResponse = {
  documentation_url: string;
  message: string;
};
