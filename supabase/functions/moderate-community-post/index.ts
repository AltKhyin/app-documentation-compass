
// ABOUTME: Enhanced community post moderation using centralized role checking and error handling.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'
import { 
  createErrorResponse, 
  createSuccessResponse, 
  handleCorsPreflightRequest,
  authenticateUser,
  validateRequiredFields,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError 
} from '../_shared/api-helpers.ts'

interface ModerationRequest {
  post_id: number;
  action_type: 'pin' | 'unpin' | 'lock' | 'unlock' | 'flair' | 'hide';
  reason?: string;
  flair_text?: string;
  flair_color?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    const user = await authenticateUser(supabase, authHeader);

    // Check rate limit (10 actions per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'moderate-community-post', user.id, 10, 60);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // *** THE FIX 1: Centralized RBAC Check ***
    // Instead of fetching the whole profile, just call our new RPC
    const { data: canModerate, error: roleError } = await supabase.rpc('is_editor', { 
      p_user_id: user.id 
    });

    if (roleError || !canModerate) {
      throw ForbiddenError;
    }

    // Parse and validate request body
    const requestBody: ModerationRequest = await req.json();
    validateRequiredFields(requestBody, ['post_id', 'action_type']);
    
    const { post_id, action_type, reason, flair_text, flair_color } = requestBody;

    console.log('Processing moderation action:', { post_id, action_type, moderator: user.id });

    // Validate the post exists
    const { data: post, error: postError } = await supabase
      .from('CommunityPosts')
      .select('id')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      throw NotFoundError;
    }

    // Apply moderation action
    let updateData: any = {};
    
    switch (action_type) {
      case 'pin':
        updateData.is_pinned = true;
        break;
      case 'unpin':
        updateData.is_pinned = false;
        break;
      case 'lock':
        updateData.is_locked = true;
        break;
      case 'unlock':
        updateData.is_locked = false;
        break;
      case 'flair':
        updateData.flair_text = flair_text;
        updateData.flair_color = flair_color;
        break;
      case 'hide':
        // For now, we'll use a special category to hide posts
        updateData.category = 'hidden';
        break;
      default:
        throw ValidationError('Invalid action type');
    }

    // Update the post
    const { error: updateError } = await supabase
      .from('CommunityPosts')
      .update(updateData)
      .eq('id', post_id);

    if (updateError) {
      console.error('Failed to apply moderation action:', updateError);
      throw new Error('Failed to apply moderation action');
    }

    // Log the moderation action
    const { error: logError } = await supabase
      .from('CommunityModerationActions')
      .insert({
        post_id,
        moderator_id: user.id,
        action_type,
        reason: reason || null,
        metadata: { flair_text, flair_color }
      });

    if (logError) {
      console.error('Failed to log moderation action:', logError);
      // Don't fail the request if logging fails
    }

    console.log('Moderation action applied successfully');

    return createSuccessResponse({
      success: true,
      message: 'Moderation action applied successfully'
    }, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    console.error('Moderation action error:', error);
    return createErrorResponse(error);
  }
});
