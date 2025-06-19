
// ABOUTME: Centralized TypeScript interfaces and types for the entire application.

// Core entity types matching database schema
export interface Review {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  view_count: number;
  status: 'draft' | 'published' | 'archived';
  access_level: 'public' | 'free' | 'premium'; // Fixed: aligned with documentation
  structured_content: Record<string, any>;
  author_id: string | null;
  community_post_id: number | null;
  created_at: string;
}

export interface Suggestion {
  id: number;
  title: string;
  description: string | null;
  upvotes: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  submitted_by: string | null;
  Practitioners: { full_name: string } | null;
  user_has_voted?: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'practitioner' | 'moderator' | 'admin' | 'editor';
  subscription_tier: 'free' | 'premium' | 'professional';
  contribution_score: number;
  profession_flair: string | null;
  display_hover_card: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  practitioner_id: string;
  content: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

// Enhanced community types for better type safety
export interface CommunityPost {
  id: number;
  title: string | null;
  content: string;
  category: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  is_pinned?: boolean;
  is_locked?: boolean;
  flair_text?: string;
  flair_color?: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  user_vote: 'up' | 'down' | null;
  reply_count: number;
}

export interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  total_votes: number;
  expires_at: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface PollOption {
  id: number;
  option_text: string;
  vote_count: number;
  poll_id: number;
}

export interface PollVote {
  id: string;
  poll_id: number;
  option_id: number;
  practitioner_id: string;
  created_at: string;
}

// API Response types
export interface ConsolidatedHomepageData {
  layout: string[];
  featured: Review | null;
  recent: Review[];
  popular: Review[];
  recommendations: Review[];
  suggestions: Suggestion[];
  userProfile: UserProfile | null;
  notificationCount: number;
}

export interface AcervoData {
  reviews: Review[];
  tags: string[];
  total_count: number;
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
  };
}

// UI Component types
export interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
  mobileLabel?: string;
  requiredRole?: UserProfile['role'];
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  full_name: string;
}

export interface SuggestionFormData {
  title: string;
  description: string;
}

export interface CreatePostFormData {
  title?: string;
  content: string;
  category: string;
}

// API Error types
export interface APIError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface StandardizedAPIError {
  error: {
    message: string;
    code: string;
  };
}

// Auth types
export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string;
    app_metadata: {
      role: UserProfile['role'];
      subscription_tier: UserProfile['subscription_tier'];
    };
  };
}

// Editor types (for future implementation)
export interface EditorState {
  currentReview: Review | null;
  selectedElements: string[];
  canvasState: Record<string, any>;
  undoStack: any[];
  redoStack: any[];
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'chart' | 'reference';
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: Record<string, any>;
}

// Rate limiting types
export interface RateLimitResponse {
  allowed: boolean;
  remaining?: number;
  resetTime?: number;
}

// Moderation types
export interface ModerationAction {
  id: string;
  post_id: number;
  moderator_id: string;
  action_type: 'pin' | 'unpin' | 'lock' | 'unlock' | 'flair' | 'hide';
  reason: string | null;
  metadata: Record<string, any>;
  created_at: string;
}
