
// ABOUTME: Moderation actions Edge Function for admin community management following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  authenticateUser,
  handleCorsPreflightRequest,
  RateLimitError
} from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface ModerationPayload {
  action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'delete' | 'feature' | 'warn_user';
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  reason?: string;
  duration?: number; // in hours for temporary actions
  metadata?: Record<string, any>;
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
    
    const user = await authenticateUser(supabase, req.headers.get('Authorization'));
    
    // Verify admin/editor role using JWT claims
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      throw new Error('FORBIDDEN: Moderation actions require admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-moderation-actions', 60, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    const payload: ModerationPayload = await req.json();
    
    if (!payload.action || !payload.targetType || !payload.targetId) {
      throw new Error('VALIDATION_FAILED: Action, targetType, and targetId are required');
    }

    const validActions = ['pin', 'unpin', 'lock', 'unlock', 'delete', 'feature', 'warn_user'];
    if (!validActions.includes(payload.action)) {
      throw new Error(`VALIDATION_FAILED: Invalid action: ${payload.action}`);
    }

    const validTargetTypes = ['post', 'comment', 'user'];
    if (!validTargetTypes.includes(payload.targetType)) {
      throw new Error(`VALIDATION_FAILED: Invalid targetType: ${payload.targetType}`);
    }

    console.log('Moderation action request:', { 
      action: payload.action, 
      targetType: payload.targetType,
      targetId: payload.targetId,
      userRole 
    });

    // STEP 5: Core Business Logic Execution
    const result = await handleModerationAction(supabase, payload, user.id);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Moderation action error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to handle moderation actions
async function handleModerationAction(supabase: any, payload: ModerationPayload, moderatorId: string) {
  try {
    let result;

    switch (payload.targetType) {
      case 'post':
      case 'comment':
        result = await moderatePost(supabase, payload, moderatorId);
        break;
      case 'user':
        result = await moderateUser(supabase, payload, moderatorId);
        break;
      default:
        throw new Error(`Unsupported target type: ${payload.targetType}`);
    }

    // Log the moderation action
    const { error: logError } = await supabase
      .from('CommunityModerationActions')
      .insert({
        post_id: payload.targetType === 'post' ? parseInt(payload.targetId) : null,
        moderator_id: moderatorId,
        action_type: payload.action,
        reason: payload.reason,
        metadata: {
          ...payload.metadata,
          target_type: payload.targetType,
          target_id: payload.targetId,
          duration: payload.duration
        }
      });

    if (logError) {
      console.error('Failed to log moderation action:', logError);
    }

    // Log audit event
    await supabase.rpc('log_audit_event', {
      p_performed_by: moderatorId,
      p_action_type: `MODERATE_${payload.action.toUpperCase()}`,
      p_resource_type: payload.targetType === 'post' ? 'CommunityPosts' : 'Practitioners',
      p_resource_id: payload.targetId,
      p_metadata: { 
        source: 'admin_panel',
        moderation_action: payload.action,
        target_type: payload.targetType,
        reason: payload.reason,
        duration: payload.duration
      }
    });

    return {
      action: payload.action,
      targetType: payload.targetType,
      targetId: payload.targetId,
      reason: payload.reason,
      moderatorId,
      result,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in handleModerationAction:', error);
    throw error;
  }
}

// Helper function to moderate posts/comments
async function moderatePost(supabase: any, payload: ModerationPayload, moderatorId: string) {
  const postId = parseInt(payload.targetId);

  switch (payload.action) {
    case 'pin':
      return await supabase.rpc('handle_post_action', {
        p_post_id: postId,
        p_user_id: moderatorId,
        p_action_type: 'pin'
      });

    case 'unpin':
      return await supabase.rpc('handle_post_action', {
        p_post_id: postId,
        p_user_id: moderatorId,
        p_action_type: 'unpin'
      });

    case 'lock':
      return await supabase.rpc('handle_post_action', {
        p_post_id: postId,
        p_user_id: moderatorId,
        p_action_type: 'lock'
      });

    case 'unlock':
      return await supabase.rpc('handle_post_action', {
        p_post_id: postId,
        p_user_id: moderatorId,
        p_action_type: 'unlock'
      });

    case 'delete':
      return await supabase.rpc('handle_post_action', {
        p_post_id: postId,
        p_user_id: moderatorId,
        p_action_type: 'delete'
      });

    default:
      throw new Error(`Unsupported post action: ${payload.action}`);
  }
}

// Helper function to moderate users
async function moderateUser(supabase: any, payload: ModerationPayload, moderatorId: string) {
  const userId = payload.targetId;

  switch (payload.action) {
    case 'warn_user':
      // Create a notification for the user
      const { data, error } = await supabase
        .from('Notifications')
        .insert({
          practitioner_id: userId,
          content: `Moderator warning: ${payload.reason || 'Please review community guidelines'}`,
          link: '/community/guidelines'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to warn user: ${error.message}`);
      }

      return { notificationId: data.id, warned: true };

    default:
      throw new Error(`Unsupported user action: ${payload.action}`);
  }
}
