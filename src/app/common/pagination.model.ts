export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalPage: number;
}