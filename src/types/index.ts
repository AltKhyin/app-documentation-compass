
// ABOUTME: Central type exports for the EVIDENS application

// Re-export auth types
export type { UserProfile } from './auth';

// Re-export general types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    total?: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  success: boolean;
}

// Form types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

// NOTE: CommunityPost and related community types are exported from src/types/community.ts
// This resolves the duplicate export conflict identified in the audit
