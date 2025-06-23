
// ABOUTME: Admin Edge Function to execute publication workflow actions with state transitions and audit logging

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { rateLimitCheck } from '../_shared/rate-limit.ts'
import { sendSuccess, sendError } from '../_shared/api-helpers.ts'

type PublicationAction = 
  | 'submit_for_review'
  | 'approve' 
  | 'reject'
  | 'schedule'
  | 'publish_now'
  | 'unpublish'
  | 'archive';

interface PublicationRequest {
  reviewId: number;
  action: PublicationAction;
  scheduledDate?: string;
  notes?: string;
  reviewerId?: string;
}

const STATE_TRANSITIONS: Record<string, PublicationAction[]> = {
  'draft': ['submit_for_review', 'archive'],
  'under_review': ['approve', 'reject'],
  'scheduled': ['publish_now', 'unpublish', 'archive'],
  'published': ['unpublish', 'archive'],
  'archived': ['submit_for_review']
};

const ACTION_TO_STATUS: Record<PublicationAction, string> = {
  'submit_for_review': 'under_review',
  'approve': 'scheduled',
  'reject': 'draft',
  'schedule': 'scheduled',
  'publish_now': 'published',
  'unpublish': 'draft',
  'archive': 'archived'
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return sendError('METHOD_NOT_ALLOWED', 'Only POST method is allowed', 405);
  }

  try {
    // Step 1: Rate limiting check (20 requests per 60 seconds)
    const rateLimitResult = await rateLimitCheck(req, 'admin-manage-publication', 20, 60);
    if (!rateLimitResult.allowed) {
      return sendError('RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', 429);
    }

    // Step 2: Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Step 3: Verify user authentication and authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return sendError('UNAUTHORIZED', 'Authorization header is required', 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return sendError('UNAUTHORIZED', 'Invalid authentication token', 401);
    }

    // Step 4: Verify admin/editor role
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      return sendError('FORBIDDEN', 'Admin or editor role required', 403);
    }

    // Step 5: Parse and validate request body
    let requestData: PublicationRequest;
    try {
      requestData = await req.json();
    } catch {
      return sendError('INVALID_REQUEST', 'Invalid JSON in request body', 400);
    }

    const { reviewId, action, scheduledDate, notes, reviewerId } = requestData;

    if (!reviewId || !action) {
      return sendError('INVALID_REQUEST', 'reviewId and action are required', 400);
    }

    if (!Object.keys(ACTION_TO_STATUS).includes(action)) {
      return sendError('INVALID_ACTION', `Invalid action: ${action}`, 400);
    }

    // Step 6: Fetch current review state
    const { data: currentReview, error: fetchError } = await supabase
      .from('Reviews')
      .select('id, title, review_status, author_id, reviewer_id')
      .eq('id', reviewId)
      .single();

    if (fetchError || !currentReview) {
      return sendError('REVIEW_NOT_FOUND', 'Review not found', 404);
    }

    // Step 7: Validate state transition
    const currentStatus = currentReview.review_status || 'draft';
    const allowedActions = STATE_TRANSITIONS[currentStatus] || [];

    if (!allowedActions.includes(action)) {
      return sendError('INVALID_TRANSITION', 
        `Cannot perform action '${action}' from status '${currentStatus}'`, 400);
    }

    // Validate scheduling requirements
    if ((action === 'schedule' || action === 'approve') && !scheduledDate) {
      return sendError('MISSING_SCHEDULE_DATE', 'Scheduled date is required for this action', 400);
    }

    if (scheduledDate && new Date(scheduledDate) <= new Date()) {
      return sendError('INVALID_SCHEDULE_DATE', 'Scheduled date must be in the future', 400);
    }

    // Begin transaction-like operations
    const newStatus = ACTION_TO_STATUS[action];
    const now = new Date().toISOString();

    // Prepare update data
    const updateData: any = {
      review_status: newStatus,
    };

    // Set specific fields based on action
    switch (action) {
      case 'submit_for_review':
        updateData.review_requested_at = now;
        break;
      case 'approve':
      case 'reject':
        updateData.reviewed_at = now;
        updateData.reviewer_id = user.id;
        if (action === 'approve' && scheduledDate) {
          updateData.scheduled_publish_at = scheduledDate;
        }
        break;
      case 'schedule':
        updateData.scheduled_publish_at = scheduledDate;
        break;
      case 'publish_now':
        updateData.published_at = now;
        updateData.scheduled_publish_at = null;
        break;
      case 'unpublish':
        updateData.published_at = null;
        break;
    }

    if (notes) {
      updateData.publication_notes = notes;
    }

    if (reviewerId) {
      updateData.reviewer_id = reviewerId;
    }

    // Step 8: Update review status
    const { data: updatedReview, error: updateError } = await supabase
      .from('Reviews')
      .update(updateData)
      .eq('id', reviewId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating review:', updateError);
      return sendError('UPDATE_FAILED', 'Failed to update review status', 500);
    }

    // Step 9: Log action in Publication_History
    const { error: historyError } = await supabase
      .from('Publication_History')
      .insert({
        review_id: reviewId,
        action: action,
        performed_by: user.id,
        notes: notes || null,
        metadata: {
          previous_status: currentStatus,
          new_status: newStatus,
          scheduled_date: scheduledDate || null,
          reviewer_id: reviewerId || null
        }
      });

    if (historyError) {
      console.error('Error logging publication history:', historyError);
      // Don't fail the request for history logging errors, but log it
    }

    return sendSuccess({
      success: true,
      review: updatedReview,
      message: `Successfully ${action.replace('_', ' ')} review "${currentReview.title}"`
    });

  } catch (error) {
    console.error('Unexpected error in admin-manage-publication:', error);
    return sendError('INTERNAL_ERROR', 'An unexpected error occurred', 500);
  }
});
