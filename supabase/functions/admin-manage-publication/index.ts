
// ABOUTME: Publication management Edge Function for admin content workflow following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  authenticateUser,
  handleCorsPreflightRequest,
  RateLimitError
} from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface PublicationPayload {
  action: 'schedule' | 'publish' | 'reject' | 'request_changes';
  reviewId: number;
  scheduledDate?: string;
  notes?: string;
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
      throw new Error('FORBIDDEN: Publication management requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-manage-publication', 30, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    const payload: PublicationPayload = await req.json();
    
    if (!payload.action || !payload.reviewId) {
      throw new Error('VALIDATION_FAILED: Action and reviewId are required');
    }

    if (payload.action === 'schedule' && !payload.scheduledDate) {
      throw new Error('VALIDATION_FAILED: Scheduled date is required for schedule action');
    }

    console.log('Publication management request:', { 
      action: payload.action, 
      reviewId: payload.reviewId,
      userRole 
    });

    // STEP 5: Core Business Logic Execution
    const result = await handlePublicationAction(supabase, payload, user.id);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Publication management error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to handle publication actions
async function handlePublicationAction(supabase: any, payload: PublicationPayload, performedBy: string) {
  try {
    // First, verify the review exists and get current state
    const { data: currentReview, error: fetchError } = await supabase
      .from('Reviews')
      .select('*')
      .eq('id', payload.reviewId)
      .single();

    if (fetchError || !currentReview) {
      throw new Error(`Review not found: ${payload.reviewId}`);
    }

    let updateData: any = {};
    let historyAction = '';

    switch (payload.action) {
      case 'publish':
        updateData = {
          status: 'published',
          published_at: new Date().toISOString(),
          reviewer_id: performedBy,
          reviewed_at: new Date().toISOString(),
          review_status: 'approved'
        };
        historyAction = 'published';
        break;

      case 'schedule':
        updateData = {
          status: 'scheduled',
          scheduled_publish_at: payload.scheduledDate,
          reviewer_id: performedBy,
          reviewed_at: new Date().toISOString(),
          review_status: 'approved'
        };
        historyAction = 'scheduled';
        break;

      case 'reject':
        updateData = {
          review_status: 'rejected',
          reviewer_id: performedBy,
          reviewed_at: new Date().toISOString(),
          publication_notes: payload.notes
        };
        historyAction = 'rejected';
        break;

      case 'request_changes':
        updateData = {
          review_status: 'changes_requested',
          reviewer_id: performedBy,
          reviewed_at: new Date().toISOString(),
          publication_notes: payload.notes
        };
        historyAction = 'changes_requested';
        break;

      default:
        throw new Error(`Invalid action: ${payload.action}`);
    }

    // Update the review
    const { data: updatedReview, error: updateError } = await supabase
      .from('Reviews')
      .update(updateData)
      .eq('id', payload.reviewId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update review: ${updateError.message}`);
    }

    // Log the action in publication history
    const { error: historyError } = await supabase
      .from('Publication_History')
      .insert({
        review_id: payload.reviewId,
        action: historyAction,
        performed_by: performedBy,
        notes: payload.notes,
        metadata: {
          ...payload.metadata,
          scheduled_date: payload.scheduledDate,
          previous_status: currentReview.status,
          previous_review_status: currentReview.review_status
        }
      });

    if (historyError) {
      console.error('Failed to log publication history:', historyError);
    }

    // Log audit event
    await supabase.rpc('log_audit_event', {
      p_performed_by: performedBy,
      p_action_type: payload.action.toUpperCase(),
      p_resource_type: 'Reviews',
      p_resource_id: payload.reviewId.toString(),
      p_old_values: currentReview,
      p_new_values: updatedReview,
      p_metadata: { 
        source: 'admin_panel',
        action: payload.action,
        notes: payload.notes
      }
    });

    return {
      reviewId: payload.reviewId,
      action: payload.action,
      previousStatus: currentReview.status,
      newStatus: updatedReview.status,
      scheduledDate: payload.scheduledDate,
      notes: payload.notes,
      updatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in handlePublicationAction:', error);
    throw error;
  }
}
