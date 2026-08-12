export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
  success?: boolean;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
