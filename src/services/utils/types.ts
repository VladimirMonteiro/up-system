export type PagedResponse<T> = {
  content: T[];
  totalPages: number;
};