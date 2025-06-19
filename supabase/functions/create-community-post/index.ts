
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreatePostRequest {
  title?: string;
  content: string;
  category: string;
  review_id?: number;
  parent_post_id?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: { message: 'Invalid authentication', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check rate limit (5 posts per 300 seconds = 5 minutes)
    const rateLimitResult = await checkRateLimit(supabase, 'create-community-post', user.id, 5, 300);
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: { message: 'Rate limit exceeded. Please wait before creating another post.', code: 'RATE_LIMIT_EXCEEDED' }
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...rateLimitHeaders(rateLimitResult)
        }
      });
    }

    const requestBody: CreatePostRequest = await req.json();
    const { title, content, category, review_id, parent_post_id } = requestBody;

    console.log('Creating community post:', { title, category, user_id: user.id });

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({
        error: { message: 'Content is required', code: 'VALIDATION_ERROR' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (!category) {
      return new Response(JSON.stringify({
        error: { message: 'Category is required', code: 'VALIDATION_ERROR' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Create the post
    const { data: newPost, error: createError } = await supabase
      .from('CommunityPosts')
      .insert({
        title: title?.trim() || null,
        content: content.trim(),
        category,
        review_id: review_id || null,
        parent_post_id: parent_post_id || null,
        author_id: user.id
      })
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
        author:Practitioners!author_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (createError) {
      console.error('Failed to create post:', createError);
      return new Response(JSON.stringify({
        error: { message: 'Failed to create post', code: 'CREATE_FAILED' }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Auto-upvote the post by the author
    const { error: voteError } = await supabase
      .from('CommunityPost_Votes')
      .insert({
        post_id: newPost.id,
        practitioner_id: user.id,
        vote_type: 'up'
      });

    if (voteError) {
      console.error('Failed to auto-upvote post:', voteError);
      // Continue despite vote error - post creation is more important
    }

    // Format response with initial vote data
    const responsePost = {
      ...newPost,
      user_vote: 'up',
      reply_count: 0,
      upvotes: 1 // Account for auto-upvote
    };

    console.log('Community post created successfully:', responsePost.id);

    return new Response(JSON.stringify(responsePost), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Create community post error:', error);
    
    return new Response(JSON.stringify({
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
