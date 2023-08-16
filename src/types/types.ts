export type DataSource = {
  endpoint: string;
  token: string;
};

export type DataSources = Record<string, DataSource>;