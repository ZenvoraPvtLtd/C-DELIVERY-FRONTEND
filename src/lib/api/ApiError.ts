export type ApiErrorCategory = 
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export class ApiError extends Error {
  public status: number;
  public category: ApiErrorCategory;
  public details?: any;

  constructor(status: number, message: string, category: ApiErrorCategory, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.category = category;
    this.details = details;
  }
}
