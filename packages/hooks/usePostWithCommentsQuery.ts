
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
  console.log('fetchPostWithComments called with postId:', postId);
  
  // Get the authenticated user ID for personalized data
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || '00000000-0000-0000-0000-000000000000';
  console.log('Current user ID:', userId);

  // First, try the edge function approach
  try {
    console.log('Attempting to fetch post via edge function...');
    const { data: postData, error: postError } = await supabase.functions.invoke('get-community-post-detail', {
      body: { post_id: postId }
    });

    if (postError) {
      console.error('Edge function error:', postError);
      throw new Error(`Edge function failed: ${postError.message}`);
    }

    if (!postData) {
      console.error('No post data returned from edge function');
      throw new Error(`Post with ID ${postId} not found`);
    }

    console.log('Post fetched successfully via edge function:', postData);

    // Fetch comments using the optimized RPC function
    const { data: comments, error: commentsError } = await supabase
      .rpc('get_comments_for_post', {
        p_post_id: postId,
        p_user_id: userId
      });

    if (commentsError) {
      console.error('Comments RPC error:', commentsError);
      // Don't fail the entire query if comments fail
      return { post: postData as CommunityPost, comments: [] };
    }

    console.log('Comments fetched successfully:', comments?.length || 0, 'comments');
    
    return {
      post: postData as CommunityPost,
      comments: (comments || []) as CommunityPost[]
    };
    
  } catch (edgeFunctionError) {
    console.error('Edge function approach failed, falling back to direct query:', edgeFunctionError);
    
    // Fallback: Direct database query
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
      console.error('Direct query post error:', postError);
      throw new Error(`Failed to fetch post: ${postError.message}`);
    }

    if (!post) {
      console.error('No post found with direct query');
      throw new Error(`Post with ID ${postId} not found`);
    }

    console.log('Post fetched successfully via direct query:', post);

    // Fetch comments using the optimized RPC function
    const { data: comments, error: commentsError } = await supabase
      .rpc('get_comments_for_post', {
        p_post_id: postId,
        p_user_id: userId
      });

    if (commentsError) {
      console.error('Comments RPC error (fallback):', commentsError);
      // Don't fail the entire query if comments fail
      return { post: post as CommunityPost, comments: [] };
    }

    return {
      post: post as CommunityPost,
      comments: (comments || []) as CommunityPost[]
    };
  }
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
    retry: (failureCount, error) => {
      console.log(`Query retry attempt ${failureCount}:`, error);
      return failureCount < 2; // Retry up to 2 times
    },
  });
};
