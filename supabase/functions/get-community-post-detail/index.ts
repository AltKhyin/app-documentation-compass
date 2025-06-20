
// ABOUTME: Edge function for fetching individual community post details with user-specific data (votes, save status).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface PostDetailRequest {
  post_id: number;
}

Deno.serve(async (req) => {
  console.log(`Request method: ${req.method}, URL: ${req.url}`);
  
  // Handle CORS preflight requests first
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    console.log(`Client IP: ${clientIP}`);
    
    // Check rate limit (60 requests per minute per IP)
    const rateLimitResult = await checkRateLimit(supabase, `get-post-detail:${clientIP}`, 60, 60);
    
    if (!rateLimitResult.allowed) {
      console.log('Rate limit exceeded');
      return new Response(
        JSON.stringify({
          error: {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED'
          }
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            ...rateLimitHeaders(rateLimitResult)
          }
        }
      );
    }

    // Get authenticated user (optional for this endpoint)
    const authHeader = req.headers.get('Authorization');
    let user = null;
    
    if (authHeader) {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        );
        if (!authError && authUser) {
          user = authUser;
          console.log(`Authenticated user: ${user.id}`);
        }
      } catch (error) {
        console.log('Optional auth failed, proceeding without user context:', error);
      }
    } else {
      console.log('No authorization header provided, proceeding as anonymous');
    }

    // Parse request to get post ID
    let postId: number;
    
    if (req.method === 'POST') {
      try {
        const body: PostDetailRequest = await req.json();
        
        if (!body.post_id || typeof body.post_id !== 'number') {
          console.log('Invalid post_id in POST body');
          return new Response(
            JSON.stringify({
              error: {
                message: 'Invalid post_id provided',
                code: 'VALIDATION_ERROR'
              }
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        postId = body.post_id;
      } catch (error) {
        console.log('Error parsing POST body:', error);
        return new Response(
          JSON.stringify({
            error: {
              message: 'Invalid JSON in request body',
              code: 'VALIDATION_ERROR'
            }
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } else if (req.method === 'GET') {
      // Support GET requests with URL parameters
      const url = new URL(req.url);
      const postIdParam = url.searchParams.get('post_id');
      
      if (!postIdParam || isNaN(Number(postIdParam))) {
        console.log('Invalid post_id parameter in GET request');
        return new Response(
          JSON.stringify({
            error: {
              message: 'Invalid post_id parameter',
              code: 'VALIDATION_ERROR'
            }
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      postId = Number(postIdParam);
    } else {
      console.log(`Method ${req.method} not allowed`);
      return new Response(
        JSON.stringify({
          error: {
            message: 'Method not allowed',
            code: 'METHOD_NOT_ALLOWED'
          }
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Fetching post detail for ID: ${postId}`);

    // Fetch post with author details
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
      .single();

    if (postError) {
      console.error('Post fetch error:', postError);
      return new Response(
        JSON.stringify({
          error: {
            message: 'Post not found',
            code: 'POST_NOT_FOUND'
          }
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!post) {
      console.log('Post not found in database');
      return new Response(
        JSON.stringify({
          error: {
            message: 'Post not found',
            code: 'POST_NOT_FOUND'
          }
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let userVote = null;
    let isSaved = false;
    let userCanModerate = false;

    if (user) {
      console.log('Fetching user-specific data');
      
      // Get user's vote on this post
      const { data: voteData } = await supabase
        .from('CommunityPost_Votes')
        .select('vote_type')
        .eq('post_id', postId)
        .eq('practitioner_id', user.id)
        .single();
      
      userVote = voteData?.vote_type || null;

      // Check if post is saved by user
      const { data: savedData } = await supabase
        .from('SavedPosts')
        .select('id')
        .eq('post_id', postId)
        .eq('practitioner_id', user.id)
        .single();
      
      isSaved = !!savedData;

      // Check if user can moderate (admin/editor role)
      const { data: userData } = await supabase
        .from('Practitioners')
        .select('role')
        .eq('id', user.id)
        .single();
      
      userCanModerate = userData?.role === 'admin' || userData?.role === 'editor';
    }

    // Get reply count for the post
    const { count: replyCount } = await supabase
      .from('CommunityPosts')
      .select('id', { count: 'exact' })
      .eq('parent_post_id', postId);

    // Format response
    const response = {
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      created_at: post.created_at,
      is_pinned: post.is_pinned || false,
      is_locked: post.is_locked || false,
      flair_text: post.flair_text,
      flair_color: post.flair_color,
      post_type: post.post_type || 'text',
      image_url: post.image_url,
      video_url: post.video_url,
      poll_data: post.poll_data,
      author: post.author,
      user_vote: userVote,
      reply_count: replyCount || 0,
      is_saved: isSaved,
      user_can_moderate: userCanModerate
    };

    console.log(`Post detail fetched successfully for ID: ${postId}`);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Unexpected error in get-community-post-detail function:', error);
    return new Response(
      JSON.stringify({
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR'
        }
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
