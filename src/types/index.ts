
// ABOUTME: Central type exports for the EVIDENS application - optimized and consolidated

// Re-export auth types
export type { UserProfile, AuthState } from './auth';

// Re-export API types - consolidated API types
export type { 
  ApiResponse, 
  ApiError, 
  FormFieldError, 
  FormValidationResult,
  PaginationParams,
  PaginationResponse,
  HttpMethod,
  QueryParams,
  SavePostMutationData,
  SavePostResponse
} from './api';

// Re-export community types
export type { 
  CommunityPost,
  PostType,
  VoteType,
  FlairColor,
  AuthorInfo,
  PollData,
  PollOption,
  CreateCommunityPostResponse,
  SidebarData,
  SidebarLink,
  TrendingDiscussion,
  FeaturedPoll,
  RecentActivity,
  CommunityPageResponse,
  PaginationInfo,
  CreatePostPayload,
  ModerationAction,
  PostActionParams,
  VotePayload
} from './community';

// Base entity interface for database entities
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Acervo-specific types
export interface Tag {
  id: number;
  tag_name: string;
  parent_id?: number;
  children?: Tag[];
}

export interface Review {
  review_id: number;
  title: string;
  description: string;
  cover_image_url: string;
  published_at: string;
  view_count: number;
  access_level: string;
  tags_json: Record<string, any>;
}

// Utility types for better type safety
export type Maybe<T> = T | null | undefined;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Status and state enums for consistency
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';
