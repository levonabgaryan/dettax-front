export interface JsonApiEnvelope<TData = unknown> {
  data: TData;
  included?: unknown[];
  meta?: { total?: number };
  links?: Record<string, string>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
