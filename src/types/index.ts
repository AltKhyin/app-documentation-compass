
// ABOUTME: Central type exports for the EVIDENS application - optimized and consolidated

// Re-export auth types
export type { UserProfile } from './auth';

// Re-export API types - new consolidated API types
export type { 
  ApiResponse, 
  ApiError, 
  FormFieldError, 
  FormValidationResult,
  PaginationParams,
  PaginationResponse,
  HttpMethod,
  QueryParams
} from './api';

// Base entity interface for database entities
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Utility types for better type safety
export type Maybe<T> = T | null | undefined;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Status and state enums for consistency
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';

// NOTE: Community types are exported from src/types/community.ts
// This maintains clean separation of concerns and prevents circular dependencies
