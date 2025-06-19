
// ABOUTME: Edge Function for saving/unsaving community posts with proper rate limiting and error handling.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/api-helpers.ts";
import { checkRateLimit, rateLimitHeaders } from "../_shared/rate-limit.ts";

interface SavePostRequest {
  post_id: number;
  is_saved?: boolean; // Optional: if not provided, toggles the save status
}

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

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return createErrorResponse('Authentication required', 'UNAUTHORIZED', 401);
    }

    console.log(`Save post request from user: ${user.id}`);

    // Rate limiting check
    const rateLimitResult = await checkRateLimit(supabase, 'save-post', user.id);
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
    const { post_id, is_saved }: SavePostRequest = await req.json();

    if (!post_id || typeof post_id !== 'number') {
      return createErrorResponse('Invalid or missing post_id', 'VALIDATION_FAILED', 400);
    }

    console.log(`Processing save request for post ${post_id}, is_saved: ${is_saved}`);

    // Check if post exists and is accessible
    const { data: post, error: postError } = await supabase
      .from('CommunityPosts')
      .select('id')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      return createErrorResponse('Post not found', 'POST_NOT_FOUND', 404);
    }

    // Check current saved status if is_saved not explicitly provided
    const { data: existingSave } = await supabase
      .from('SavedPosts')
      .select('id')
      .eq('practitioner_id', user.id)
      .eq('post_id', post_id)
      .maybeSingle();

    const currentlySaved = !!existingSave;
    const shouldSave = is_saved !== undefined ? is_saved : !currentlySaved;

    console.log(`Current save status: ${currentlySaved}, target status: ${shouldSave}`);

    if (shouldSave && !currentlySaved) {
      // Save the post
      const { error: saveError } = await supabase
        .from('SavedPosts')
        .insert({
          practitioner_id: user.id,
          post_id: post_id
        });

      if (saveError) {
        console.error('Error saving post:', saveError);
        return createErrorResponse('Failed to save post', 'SAVE_FAILED', 500);
      }

      console.log(`Post ${post_id} saved successfully`);
      return createSuccessResponse({
        success: true,
        is_saved: true,
        message: 'Post saved successfully'
      });

    } else if (!shouldSave && currentlySaved) {
      // Unsave the post
      const { error: unsaveError } = await supabase
        .from('SavedPosts')
        .delete()
        .eq('practitioner_id', user.id)
        .eq('post_id', post_id);

      if (unsaveError) {
        console.error('Error unsaving post:', unsaveError);
        return createErrorResponse('Failed to unsave post', 'UNSAVE_FAILED', 500);
      }

      console.log(`Post ${post_id} unsaved successfully`);
      return createSuccessResponse({
        success: true,
        is_saved: false,
        message: 'Post unsaved successfully'
      });

    } else {
      // No change needed
      return createSuccessResponse({
        success: true,
        is_saved: currentlySaved,
        message: `Post is already ${currentlySaved ? 'saved' : 'not saved'}`
      });
    }

  } catch (error) {
    console.error('Unexpected error in save-post function:', error);
    return createErrorResponse('Internal server error', 'INTERNAL_ERROR', 500);
  }
});
