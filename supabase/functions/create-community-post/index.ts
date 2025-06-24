
// ABOUTME: Create community post Edge Function following mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPrelight } from '../_shared/cors.ts';
import { checkRateLimit } from '../_shared/rate-limit.ts';
import { authenticateRequest } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  // STEP 1: Handle CORS preflight
  const corsResponse = handleCorsPrelight(req);
  if (corsResponse) return corsResponse;

  try {
    // STEP 2: Rate limiting (community post creation - 5 requests per 300 seconds)
    const rateLimitResult = await checkRateLimit(req, { windowMs: 300000, maxRequests: 5 });
    if (!rateLimitResult.success) {
      return new Response(JSON.stringify({ 
        error: rateLimitResult.error || 'Rate limit exceeded',
        details: 'Too many post creation requests'
      }), {
        status: 429,
        headers: { ...corsHeaders, ...rateLimitResult.headers, 'Content-Type': 'application/json' },
      });
    }

    // STEP 3: Authentication (required for post creation)
    const authResult = await authenticateRequest(req);
    if (!authResult.success) {
      return new Response(JSON.stringify({ 
        error: authResult.error || 'Authentication failed',
        details: 'Authentication required to create posts'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 4: Authorization (authenticated users can create posts)
    // No additional authorization required

    // STEP 5: Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // STEP 6: Business Logic - Post creation with auto-upvote
    const body = await req.json();
    const { review_id, parent_post_id, title, content, category, poll } = body;

    // Validate required fields
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('VALIDATION_FAILED: Content is required');
    }

    if (!category || typeof category !== 'string') {
      throw new Error('VALIDATION_FAILED: Category is required');
    }

    console.log(`Creating community post by user: ${authResult.user.id}`);

    // Start transaction-like operations
    // 1. Create the post with initial upvote
    const { data: newPost, error: postError } = await supabase
      .from('CommunityPosts')
      .insert({
        author_id: authResult.user.id,
        review_id: review_id || null,
        parent_post_id: parent_post_id || null,
        title: title || null,
        content: content.trim(),
        category,
        upvotes: 1, // Auto-upvote
        downvotes: 0,
        poll_data: poll ? { question: poll.question, options: poll.options } : null,
        post_type: poll ? 'poll' : 'text'
      })
      .select()
      .single();

    if (postError) {
      console.error('Post creation error:', postError);
      throw new Error(`Failed to create post: ${postError.message}`);
    }

    // 2. Add the auto-upvote
    const { error: voteError } = await supabase
      .from('CommunityPost_Votes')
      .insert({
        post_id: newPost.id,
        practitioner_id: authResult.user.id,
        vote_type: 'up'
      });

    if (voteError) {
      console.error('Auto-upvote error:', voteError);
      // Don't fail the post creation for vote error
    }

    // 3. Update contribution score
    const { error: scoreError } = await supabase
      .from('Practitioners')
      .update({ 
        contribution_score: supabase.raw('contribution_score + 1') 
      })
      .eq('id', authResult.user.id);

    if (scoreError) {
      console.error('Contribution score update error:', scoreError);
      // Don't fail the post creation for score error
    }

    // 4. Create poll options if poll data exists
    if (poll && poll.options && Array.isArray(poll.options)) {
      const pollOptions = poll.options.map((option: string, index: number) => ({
        post_id: newPost.id,
        option_text: option,
        option_order: index,
        vote_count: 0
      }));

      const { error: pollError } = await supabase
        .from('Poll_Options')
        .insert(pollOptions);

      if (pollError) {
        console.error('Poll options creation error:', pollError);
        // Don't fail the post creation for poll error
      }
    }

    console.log(`Successfully created community post with ID: ${newPost.id}`);

    const response = {
      post_id: newPost.id,
      post: newPost,
      message: 'Post created successfully'
    };

    // STEP 7: Return structured success response
    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        ...rateLimitResult.headers,
        'Content-Type': 'application/json' 
      },
      status: 201,
    });

  } catch (error) {
    console.error('Community post creation error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = errorMessage.includes('VALIDATION_FAILED') ? 400 :
                      errorMessage.includes('authentication') ? 401 :
                      errorMessage.includes('permissions') ? 403 : 500;

    return new Response(JSON.stringify({ 
      error: errorMessage.replace('VALIDATION_FAILED: ', ''),
      details: 'Post creation failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  }
});
