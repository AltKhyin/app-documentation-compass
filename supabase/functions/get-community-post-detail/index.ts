
// ABOUTME: Edge Function for retrieving individual community post details with full content and user interaction data.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/api-helpers.ts";
import { checkRateLimit, rateLimitHeaders } from "../_shared/rate-limit.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return createErrorResponse('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user (optional for public posts)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const userId = user?.id || null;

    console.log(`Get community post detail request from user: ${userId || 'anonymous'}`);

    // Rate limiting check (lighter limit for individual posts)
    const rateLimitResult = await checkRateLimit(supabase, 'get-community-post-detail', userId || 'anonymous');
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: { message: 'Rate limit exceeded', code: 'RATE_LIMIT_EXCEEDED' }
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...rateLimitHeaders(rateLimitResult)
        }
      });
    }

    // Parse and validate request body
    const { post_id } = await req.json();

    if (!post_id || typeof post_id !== 'number') {
      return createErrorResponse('Invalid or missing post_id', 'VALIDATION_FAILED', 400);
    }

    console.log(`Fetching community post detail: ${post_id}`);

    // Fetch the individual post with all details
    const { data: post, error: postError } = await supabase
      .from('CommunityPosts')
      .select(`
        id,
        title,
        content,
        category,
        upvotes,
        downvotes,
        created_at,
        is_pinned,
        is_locked,
        flair_text,
        flair_color,
        image_url,
        video_url,
        poll_data,
        post_type,
        author:Practitioners!CommunityPosts_author_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      console.error('Error fetching post:', postError);
      return createErrorResponse('Post not found', 'POST_NOT_FOUND', 404);
    }

    // Get user's vote on this post (if authenticated)
    let userVote = null;
    if (userId) {
      const { data: voteData } = await supabase
        .from('CommunityPost_Votes')
        .select('vote_type')
        .eq('post_id', post_id)
        .eq('practitioner_id', userId)
        .maybeSingle();

      userVote = voteData?.vote_type || null;
    }

    // Check if user has saved this post (if authenticated)
    let isSaved = false;
    if (userId) {
      const { data: savedData } = await supabase
        .from('SavedPosts')
        .select('id')
        .eq('post_id', post_id)
        .eq('practitioner_id', userId)
        .maybeSingle();

      isSaved = !!savedData;
    }

    // Get reply count
    const { count: replyCount } = await supabase
      .from('CommunityPosts')
      .select('*', { count: 'exact', head: true })
      .eq('parent_post_id', post_id);

    // Transform the data to match the expected format
    const postDetail = {
      ...post,
      user_vote: userVote,
      reply_count: replyCount || 0,
      is_saved: isSaved,
      user_can_moderate: false // Will be populated by frontend if needed
    };

    console.log(`Successfully fetched post detail for post ${post_id}`);

    return createSuccessResponse(postDetail);

  } catch (error) {
    console.error('Unexpected error in get-community-post-detail function:', error);
    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500);
  }
});
