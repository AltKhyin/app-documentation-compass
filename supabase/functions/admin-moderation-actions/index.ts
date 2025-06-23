
// ABOUTME: Admin Edge Function for content moderation workflow following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse } from '../_shared/api-helpers.ts';
import { rateLimitCheck, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface ModerationAction {
  type: 'community_post' | 'review' | 'comment';
  targetId: number;
  action: 'approve' | 'reject' | 'hide' | 'delete' | 'pin' | 'unpin' | 'lock' | 'unlock';
  reason?: string;
  notes?: string;
}

Deno.serve(async (req) => {
  // STEP 1: CORS Preflight Handling (MANDATORY FIRST)
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    // STEP 2: Manual Authentication (requires verify_jwt = false in config.toml)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse(new Error('UNAUTHORIZED: Authorization header is required'));
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return createErrorResponse(new Error('UNAUTHORIZED: Invalid authentication token'));
    }
    
    // Verify admin/editor role for moderation
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      return createErrorResponse(new Error('FORBIDDEN: Moderation requires admin or editor role'));
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await rateLimitCheck(req, 'admin-moderation-actions', 60, 60);
    if (!rateLimitResult.allowed) {
      return createErrorResponse(new Error('RATE_LIMIT_EXCEEDED: Rate limit exceeded'), rateLimitHeaders(rateLimitResult));
    }

    // STEP 4: Input Parsing & Validation
    const body = await req.json().catch(() => ({}));
    const moderationAction: ModerationAction = {
      type: body.type,
      targetId: body.targetId,
      action: body.action,
      reason: body.reason,
      notes: body.notes
    };

    if (!moderationAction.type || !moderationAction.targetId || !moderationAction.action) {
      return createErrorResponse(new Error('VALIDATION_FAILED: type, targetId, and action are required'));
    }

    console.log('Moderation action request:', { moderationAction, userRole, userId: user.id });

    // STEP 5: Core Business Logic Execution
    const result = await handleModerationAction(supabase, moderationAction, user.id);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Moderation action error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to handle moderation actions
async function handleModerationAction(supabase: any, action: ModerationAction, moderatorId: string) {
  try {
    let result: any = {};

    switch (action.type) {
      case 'community_post':
        result = await moderateCommunityPost(supabase, action, moderatorId);
        break;
      case 'review':
        result = await moderateReview(supabase, action, moderatorId);
        break;
      case 'comment':
        result = await moderateComment(supabase, action, moderatorId);
        break;
      default:
        throw new Error(`Invalid moderation type: ${action.type}`);
    }

    // Log moderation action
    const { error: logError } = await supabase
      .from('CommunityModerationActions')
      .insert({
        post_id: action.type === 'community_post' ? action.targetId : null,
        moderator_id: moderatorId,
        action_type: action.action,
        reason: action.reason,
        metadata: {
          type: action.type,
          target_id: action.targetId,
          notes: action.notes
        }
      });

    if (logError) {
      console.error('Failed to log moderation action:', logError);
    }

    return {
      success: true,
      action: action.action,
      target: {
        type: action.type,
        id: action.targetId
      },
      result
    };

  } catch (error) {
    console.error('Error in handleModerationAction:', error);
    throw error;
  }
}

async function moderateCommunityPost(supabase: any, action: ModerationAction, moderatorId: string) {
  const updates: any = {};

  switch (action.action) {
    case 'pin':
      updates.is_pinned = true;
      break;
    case 'unpin':
      updates.is_pinned = false;
      break;
    case 'lock':
      updates.is_locked = true;
      break;
    case 'unlock':
      updates.is_locked = false;
      break;
    case 'delete':
      const { error: deleteError } = await supabase
        .from('CommunityPosts')
        .delete()
        .eq('id', action.targetId);
      
      if (deleteError) {
        throw new Error(`Failed to delete post: ${deleteError.message}`);
      }
      
      return { deleted: true };
    default:
      throw new Error(`Invalid community post action: ${action.action}`);
  }

  const { data: updatedPost, error: updateError } = await supabase
    .from('CommunityPosts')
    .update(updates)
    .eq('id', action.targetId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update post: ${updateError.message}`);
  }

  return updatedPost;
}

async function moderateReview(supabase: any, action: ModerationAction, moderatorId: string) {
  // For now, focus on basic review moderation
  const updates: any = {};

  switch (action.action) {
    case 'approve':
      updates.review_status = 'published';
      updates.published_at = new Date().toISOString();
      updates.reviewer_id = moderatorId;
      break;
    case 'reject':
      updates.review_status = 'draft';
      updates.reviewer_id = moderatorId;
      updates.publication_notes = action.notes;
      break;
    case 'hide':
      updates.status = 'draft';
      break;
    default:
      throw new Error(`Invalid review action: ${action.action}`);
  }

  const { data: updatedReview, error: updateError } = await supabase
    .from('Reviews')
    .update(updates)
    .eq('id', action.targetId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update review: ${updateError.message}`);
  }

  return updatedReview;
}

async function moderateComment(supabase: any, action: ModerationAction, moderatorId: string) {
  // Comments are stored as CommunityPosts with parent_post_id
  switch (action.action) {
    case 'delete':
      const { error: deleteError } = await supabase
        .from('CommunityPosts')
        .delete()
        .eq('id', action.targetId)
        .not('parent_post_id', 'is', null);
      
      if (deleteError) {
        throw new Error(`Failed to delete comment: ${deleteError.message}`);
      }
      
      return { deleted: true };
    default:
      throw new Error(`Invalid comment action: ${action.action}`);
  }
}
