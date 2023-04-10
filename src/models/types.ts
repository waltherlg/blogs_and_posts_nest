export type QueryParamsType = {
  sortBy: string,
  sortDirection: string,
  pageNumber: string,
  pageSize: string,
}

export const DEFAULT_QUERY_PARAMS: QueryParamsType = {
  sortBy: 'createdAt',
  sortDirection: 'desc',
  pageNumber: '1',
  pageSize: '10',
};