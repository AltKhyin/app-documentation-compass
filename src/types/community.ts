
// ABOUTME: TypeScript type definitions for community module components and data structures.

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
  is_saved?: boolean;
  user_can_moderate?: boolean;
  post_type?: 'text' | 'image' | 'poll' | 'video';
  image_url?: string | null;
  video_url?: string | null;
  poll_data?: {
    question: string;
    options: Array<{
      id: number;
      text: string;
      votes: number;
    }>;
    total_votes: number;
  };
  flair_text?: string;
  flair_color?: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  user_vote?: 'up' | 'down' | null;
  reply_count: number;
}

export interface CreateCommunityPostResponse {
  id: number;
  success: boolean;
  message?: string;
}

export interface SidebarData {
  rules: string[];
  links: Array<{ title: string; url: string }>;
  trendingDiscussions: Array<{
    id: number;
    title: string;
    content: string;
    category: string;
    reply_count: number;
    upvotes: number;
    created_at: string;
    author: {
      full_name: string | null;
    } | null;
    flair_text?: string;
    is_pinned?: boolean;
  }>;
  featuredPoll?: {
    id: number;
    question: string;
    total_votes: number;
    PollOptions: Array<{
      id: number;
      option_text: string;
      vote_count: number;
    }>;
  };
  recentActivity: Array<{
    id: number;
    title: string;
    created_at: string;
    Practitioners: { full_name: string };
  }>;
}

export interface CommunityPageResponse {
  posts: CommunityPost[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  sidebarData: SidebarData;
}
