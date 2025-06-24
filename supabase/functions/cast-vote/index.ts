
// ABOUTME: Cast vote Edge Function following mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPrelight } from '../_shared/cors.ts';
import { checkRateLimit } from '../_shared/rate-limit.ts';
import { authenticateRequest } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  // STEP 1: Handle CORS preflight
  const corsResponse = handleCorsPrelight(req);
  if (corsResponse) return corsResponse;

  try {
    // STEP 2: Rate limiting (voting - 20 requests per 60 seconds)
    const rateLimitResult = await checkRateLimit(req, { windowMs: 60000, maxRequests: 20 });
    if (!rateLimitResult.success) {
      return new Response(JSON.stringify({ 
        error: rateLimitResult.error || 'Rate limit exceeded',
        details: 'Too many voting requests'
      }), {
        status: 429,
        headers: { ...corsHeaders, ...rateLimitResult.headers, 'Content-Type': 'application/json' },
      });
    }

    // STEP 3: Authentication (required for voting)
    const authResult = await authenticateRequest(req);
    if (!authResult.success) {
      return new Response(JSON.stringify({ 
        error: authResult.error || 'Authentication failed',
        details: 'Authentication required to vote'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 4: Authorization (authenticated users can vote)
    // No additional authorization required

    // STEP 5: Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // STEP 6: Business Logic - Vote casting with atomic updates
    const body = await req.json();
    const { post_id, vote_type } = body;

    // Validate required fields
    if (!post_id || typeof post_id !== 'number') {
      throw new Error('VALIDATION_FAILED: Post ID is required');
    }

    if (!vote_type || !['up', 'down', 'none'].includes(vote_type)) {
      throw new Error('VALIDATION_FAILED: Invalid vote type');
    }

    console.log(`Processing vote: ${vote_type} on post ${post_id} by user ${authResult.user.id}`);

    // Get current vote status
    const { data: currentVote } = await supabase
      .from('CommunityPost_Votes')
      .select('vote_type')
      .eq('post_id', post_id)
      .eq('practitioner_id', authResult.user.id)
      .single();

    const currentVoteType = currentVote?.vote_type || null;

    // Calculate vote deltas
    let upvoteDelta = 0;
    let downvoteDelta = 0;
    let contributionDelta = 0;

    // Remove old vote effects
    if (currentVoteType === 'up') {
      upvoteDelta -= 1;
      contributionDelta -= 1;
    } else if (currentVoteType === 'down') {
      downvoteDelta -= 1;
    }

    // Apply new vote effects (only if not 'none')
    if (vote_type === 'up') {
      upvoteDelta += 1;
      contributionDelta += 1;
    } else if (vote_type === 'down') {
      downvoteDelta += 1;
    }

    // Update or delete vote record
    if (vote_type === 'none') {
      if (currentVote) {
        const { error: deleteError } = await supabase
          .from('CommunityPost_Votes')
          .delete()
          .eq('post_id', post_id)
          .eq('practitioner_id', authResult.user.id);

        if (deleteError) {
          console.error('Vote deletion error:', deleteError);
          throw new Error(`Failed to remove vote: ${deleteError.message}`);
        }
      }
    } else {
      const { error: voteError } = await supabase
        .from('CommunityPost_Votes')
        .upsert({
          post_id,
          practitioner_id: authResult.user.id,
          vote_type
        });

      if (voteError) {
        console.error('Vote upsert error:', voteError);
        throw new Error(`Failed to cast vote: ${voteError.message}`);
      }
    }

    // Update post vote counts
    const { data: updatedPost, error: postUpdateError } = await supabase
      .from('CommunityPosts')
      .update({
        upvotes: supabase.raw(`upvotes + ${upvoteDelta}`),
        downvotes: supabase.raw(`downvotes + ${downvoteDelta}`)
      })
      .eq('id', post_id)
      .select('id, upvotes, downvotes, author_id')
      .single();

    if (postUpdateError) {
      console.error('Post update error:', postUpdateError);
      throw new Error(`Failed to update post counts: ${postUpdateError.message}`);
    }

    // Update author's contribution score (only for upvotes)
    if (contributionDelta !== 0) {
      const { error: scoreError } = await supabase
        .from('Practitioners')
        .update({
          contribution_score: supabase.raw(`contribution_score + ${contributionDelta}`)
        })
        .eq('id', updatedPost.author_id);

      if (scoreError) {
        console.error('Contribution score update error:', scoreError);
        // Don't fail the vote for score update errors
      }
    }

    console.log(`Vote processed successfully: post ${post_id} now has ${updatedPost.upvotes} upvotes, ${updatedPost.downvotes} downvotes`);

    const response = {
      post_id: updatedPost.id,
      new_upvotes: updatedPost.upvotes,
      new_downvotes: updatedPost.downvotes,
      user_vote: vote_type === 'none' ? null : vote_type,
      message: 'Vote cast successfully'
    };

    // STEP 7: Return structured success response
    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        ...rateLimitResult.headers,
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Vote casting error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = errorMessage.includes('VALIDATION_FAILED') ? 400 :
                      errorMessage.includes('authentication') ? 401 :
                      errorMessage.includes('permissions') ? 403 : 500;

    return new Response(JSON.stringify({ 
      error: errorMessage.replace('VALIDATION_FAILED: ', ''),
      details: 'Vote casting failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  }
});
