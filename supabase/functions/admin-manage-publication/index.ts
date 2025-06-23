
// ABOUTME: Admin Edge Function for publication workflow management following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse } from '../_shared/api-helpers.ts';
import { rateLimitCheck, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface PublicationAction {
  reviewId: number;
  action: 'submit_for_review' | 'approve' | 'reject' | 'schedule' | 'publish_now' | 'unpublish' | 'archive';
  scheduledDate?: string;
  notes?: string;
  reviewerId?: string;
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
    
    // Verify admin/editor role using JWT claims
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      return createErrorResponse(new Error('FORBIDDEN: Publication management requires admin or editor role'));
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await rateLimitCheck(req, 'admin-manage-publication', 30, 60);
    if (!rateLimitResult.allowed) {
      return createErrorResponse(new Error('RATE_LIMIT_EXCEEDED: Rate limit exceeded'), rateLimitHeaders(rateLimitResult));
    }

    // STEP 4: Input Parsing & Validation
    const body = await req.json().catch(() => ({}));
    const action: PublicationAction = {
      reviewId: body.reviewId,
      action: body.action,
      scheduledDate: body.scheduledDate,
      notes: body.notes,
      reviewerId: body.reviewerId
    };

    if (!action.reviewId || !action.action) {
      return createErrorResponse(new Error('VALIDATION_FAILED: reviewId and action are required'));
    }

    console.log('Publication action request:', { action, userRole, userId: user.id });

    // STEP 5: Core Business Logic Execution
    const result = await handlePublicationAction(supabase, action, user.id);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Publication action error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to handle publication workflow actions
async function handlePublicationAction(supabase: any, action: PublicationAction, performedBy: string) {
  try {
    // Get current review state
    const { data: review, error: reviewError } = await supabase
      .from('Reviews')
      .select('*')
      .eq('id', action.reviewId)
      .single();

    if (reviewError || !review) {
      throw new Error(`Review with ID ${action.reviewId} not found`);
    }

    // Validate state transitions
    const validTransitions = {
      'draft': ['submit_for_review', 'archive'],
      'under_review': ['approve', 'reject', 'archive'],
      'scheduled': ['publish_now', 'unpublish', 'archive'],
      'published': ['unpublish', 'archive'],
      'archived': ['submit_for_review']
    };

    const currentStatus = review.review_status || 'draft';
    if (!validTransitions[currentStatus]?.includes(action.action)) {
      throw new Error(`Invalid transition: Cannot ${action.action} from ${currentStatus} state`);
    }

    // Execute action
    let updates: any = {};
    let newStatus = currentStatus;

    switch (action.action) {
      case 'submit_for_review':
        newStatus = 'under_review';
        updates = {
          review_status: newStatus,
          review_requested_at: new Date().toISOString(),
          reviewer_id: action.reviewerId
        };
        break;

      case 'approve':
        newStatus = action.scheduledDate ? 'scheduled' : 'published';
        updates = {
          review_status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewer_id: performedBy,
          publication_notes: action.notes,
          ...(action.scheduledDate && { scheduled_publish_at: action.scheduledDate }),
          ...(newStatus === 'published' && { published_at: new Date().toISOString() })
        };
        break;

      case 'reject':
        newStatus = 'draft';
        updates = {
          review_status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewer_id: performedBy,
          publication_notes: action.notes
        };
        break;

      case 'schedule':
        if (!action.scheduledDate) {
          throw new Error('Scheduled date is required for schedule action');
        }
        newStatus = 'scheduled';
        updates = {
          review_status: newStatus,
          scheduled_publish_at: action.scheduledDate,
          publication_notes: action.notes
        };
        break;

      case 'publish_now':
        newStatus = 'published';
        updates = {
          review_status: newStatus,
          published_at: new Date().toISOString(),
          scheduled_publish_at: null,
          publication_notes: action.notes
        };
        break;

      case 'unpublish':
        newStatus = 'draft';
        updates = {
          review_status: newStatus,
          published_at: null,
          publication_notes: action.notes
        };
        break;

      case 'archive':
        newStatus = 'archived';
        updates = {
          review_status: newStatus,
          publication_notes: action.notes
        };
        break;
    }

    // Update review
    const { data: updatedReview, error: updateError } = await supabase
      .from('Reviews')
      .update(updates)
      .eq('id', action.reviewId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update review: ${updateError.message}`);
    }

    // Log publication history
    const { error: historyError } = await supabase
      .from('Publication_History')
      .insert({
        review_id: action.reviewId,
        action: action.action,
        performed_by: performedBy,
        notes: action.notes,
        metadata: {
          previous_status: currentStatus,
          new_status: newStatus,
          scheduled_date: action.scheduledDate
        }
      });

    if (historyError) {
      console.error('Failed to log publication history:', historyError);
    }

    return {
      success: true,
      review: updatedReview,
      message: `Review ${action.action} completed successfully`
    };

  } catch (error) {
    console.error('Error in handlePublicationAction:', error);
    throw error;
  }
}
