
// ABOUTME: API response and request type definitions for standardized data handling.

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

// Community-specific API types
export interface SavePostMutationData {
  post_id: number;
  is_saved?: boolean;
}

export interface SavePostResponse {
  success: boolean;
  is_saved: boolean;
  message?: string;
}
