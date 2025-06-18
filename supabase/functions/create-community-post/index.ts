
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: 'Authorization required', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: { message: 'Invalid authorization', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check rate limit (5 requests per 300 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'create-community-post', user.id, 5, 300);
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

    // Parse request body
    const { title, content, category, review_id, parent_post_id } = await req.json();

    // Validate required fields
    if (!content || !category) {
      return new Response(JSON.stringify({
        error: { message: 'Content and category are required', code: 'VALIDATION_ERROR' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log(`Creating community post for user: ${user.id}`);

    // Create the post
    const { data: post, error: postError } = await supabase
      .from('CommunityPosts')
      .insert({
        title: title || null,
        content,
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
        author:Practitioners!author_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (postError) {
      console.error('Post creation error:', postError);
      throw new Error(`Failed to create post: ${postError.message}`);
    }

    // Auto-upvote the new post
    const { error: voteError } = await supabase
      .from('CommunityPost_Votes')
      .insert({
        post_id: post.id,
        practitioner_id: user.id,
        vote_type: 'up'
      });

    if (voteError) {
      console.warn('Auto-upvote failed:', voteError);
      // Don't fail the entire operation for this
    }

    // Update user's contribution score
    const { error: scoreError } = await supabase
      .from('Practitioners')
      .update({
        contribution_score: supabase.raw('contribution_score + 1')
      })
      .eq('id', user.id);

    if (scoreError) {
      console.warn('Contribution score update failed:', scoreError);
      // Don't fail the entire operation for this
    }

    console.log(`Successfully created community post: ${post.id}`);

    return new Response(JSON.stringify({
      ...post,
      user_vote: 'up', // User auto-upvoted
      reply_count: 0
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Community post creation error:', error);
    
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
