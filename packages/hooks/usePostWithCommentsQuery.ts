
// ABOUTME: TanStack Query hook for fetching a post with its complete comment tree using optimized RPC.

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/integrations/supabase/client';
import type { CommunityPost } from '../../src/types/community';

interface PostWithCommentsData {
  post: CommunityPost;
  comments: CommunityPost[];
}

/**
 * Fetches a single post with its complete comment tree.
 * Uses the optimized RPC function for performance.
 * @param postId The ID of the post to fetch
 */
const fetchPostWithComments = async (postId: number): Promise<PostWithCommentsData> => {
  // Get the authenticated user ID for personalized data
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || '00000000-0000-0000-0000-000000000000';

  // Fetch the main post
  const { data: post, error: postError } = await supabase
    .from('CommunityPosts')
    .select(`
      *,
      author:Practitioners!author_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('id', postId)
    .is('parent_post_id', null) // Ensure it's a top-level post
    .single();

  if (postError) {
    throw new Error(`Failed to fetch post: ${postError.message}`);
  }

  // Fetch comments using the optimized RPC function
  const { data: comments, error: commentsError } = await supabase
    .rpc('get_comments_for_post', {
      p_post_id: postId,
      p_user_id: userId
    });

  if (commentsError) {
    console.error('Comments fetch error:', commentsError);
    // Don't fail the entire query if comments fail
    return { post: post as CommunityPost, comments: [] };
  }

  return {
    post: post as CommunityPost,
    comments: (comments || []) as CommunityPost[]
  };
};

/**
 * Custom hook for fetching a post with all its comments.
 * Follows [D3.4] Data Access Layer patterns.
 * @param postId The ID of the post to fetch
 */
export const usePostWithCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: ['postWithComments', postId],
    queryFn: () => fetchPostWithComments(postId),
    enabled: !!postId && postId > 0,
    staleTime: 30 * 1000, // 30 seconds - comments change frequently
  });
};
