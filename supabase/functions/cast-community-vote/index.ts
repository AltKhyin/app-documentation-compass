
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

    // Check rate limit (20 requests per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'cast-community-vote', user.id, 20, 60);
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
    const { post_id, vote_type } = await req.json();

    // Validate input
    if (!post_id || !['up', 'down', 'none'].includes(vote_type)) {
      return new Response(JSON.stringify({
        error: { message: 'Invalid post_id or vote_type', code: 'VALIDATION_ERROR' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log(`Casting vote: post_id=${post_id}, vote_type=${vote_type}, user=${user.id}`);

    // Check if vote exists
    const { data: existingVote } = await supabase
      .from('CommunityPost_Votes')
      .select('vote_type')
      .eq('post_id', post_id)
      .eq('practitioner_id', user.id)
      .maybeSingle();

    if (vote_type === 'none') {
      // Remove vote if it exists
      if (existingVote) {
        const { error: deleteError } = await supabase
          .from('CommunityPost_Votes')
          .delete()
          .eq('post_id', post_id)
          .eq('practitioner_id', user.id);

        if (deleteError) {
          throw new Error(`Failed to remove vote: ${deleteError.message}`);
        }
      }
    } else {
      // Upsert vote
      const { error: upsertError } = await supabase
        .from('CommunityPost_Votes')
        .upsert({
          post_id,
          practitioner_id: user.id,
          vote_type
        }, {
          onConflict: 'post_id,practitioner_id'
        });

      if (upsertError) {
        throw new Error(`Failed to cast vote: ${upsertError.message}`);
      }
    }

    // Get updated post data
    const { data: post, error: postError } = await supabase
      .from('CommunityPosts')
      .select('id, upvotes, downvotes')
      .eq('id', post_id)
      .single();

    if (postError) {
      throw new Error(`Failed to fetch updated post: ${postError.message}`);
    }

    console.log(`Vote cast successfully: post_id=${post_id}, new_upvotes=${post.upvotes}, new_downvotes=${post.downvotes}`);

    return new Response(JSON.stringify({
      post_id: post.id,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      user_vote: vote_type === 'none' ? null : vote_type
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Community vote error:', error);
    
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
