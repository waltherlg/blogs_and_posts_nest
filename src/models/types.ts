export type QueryParamsType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type RequestBlogsQueryModel = {
  searchNameTerm: string;
} & QueryParamsType;

export const DEFAULT_BLOGS_QUERY_PARAMS: RequestBlogsQueryModel = {
  searchNameTerm: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  pageNumber: '1',
  pageSize: '10',
};

export type PaginationOutputModel<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};
