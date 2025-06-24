
// ABOUTME: Bulk content operations Edge Function for admin content management following the mandatory 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  authenticateUser,
  handleCorsPreflightRequest,
  RateLimitError
} from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface BulkContentPayload {
  action: 'publish' | 'unpublish' | 'delete' | 'archive';
  reviewIds: number[];
  reason?: string;
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
      throw new Error('FORBIDDEN: Bulk content operations require admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(req, 'admin-bulk-content-actions', 30, 60000);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // STEP 4: Input Parsing & Validation
    const payload: BulkContentPayload = await req.json();
    
    if (!payload.action || !payload.reviewIds || !Array.isArray(payload.reviewIds)) {
      throw new Error('VALIDATION_FAILED: Action and reviewIds array are required');
    }

    if (payload.reviewIds.length === 0) {
      throw new Error('VALIDATION_FAILED: At least one review ID is required');
    }

    if (payload.reviewIds.length > 50) {
      throw new Error('VALIDATION_FAILED: Maximum 50 reviews can be processed at once');
    }

    console.log('Bulk content action request:', { 
      action: payload.action, 
      count: payload.reviewIds.length,
      userRole 
    });

    // STEP 5: Core Business Logic Execution
    const result = await handleBulkContentAction(supabase, payload, user.id);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Bulk content action error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to handle bulk content operations
async function handleBulkContentAction(supabase: any, payload: BulkContentPayload, performedBy: string) {
  const results = [];
  const errors = [];

  for (const reviewId of payload.reviewIds) {
    try {
      let result;
      
      switch (payload.action) {
        case 'publish':
          result = await publishReview(supabase, reviewId, performedBy);
          break;
        case 'unpublish':
          result = await unpublishReview(supabase, reviewId, performedBy);
          break;
        case 'delete':
          result = await deleteReview(supabase, reviewId, performedBy);
          break;
        case 'archive':
          result = await archiveReview(supabase, reviewId, performedBy);
          break;
        default:
          throw new Error(`Invalid action: ${payload.action}`);
      }

      results.push({ reviewId, success: true, result });
    } catch (error) {
      console.error(`Error processing review ${reviewId}:`, error);
      errors.push({ reviewId, error: error.message });
    }
  }

  // Log bulk operation
  await supabase.rpc('log_audit_event', {
    p_performed_by: performedBy,
    p_action_type: `BULK_${payload.action.toUpperCase()}`,
    p_resource_type: 'Reviews',
    p_metadata: { 
      source: 'admin_panel',
      review_ids: payload.reviewIds,
      success_count: results.length,
      error_count: errors.length,
      reason: payload.reason
    }
  });

  return {
    action: payload.action,
    processed: payload.reviewIds.length,
    successful: results.length,
    failed: errors.length,
    results,
    errors
  };
}

// Helper functions for individual review operations
async function publishReview(supabase: any, reviewId: number, performedBy: string) {
  const { data, error } = await supabase
    .from('Reviews')
    .update({ 
      status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw new Error(`Failed to publish review: ${error.message}`);
  return data;
}

async function unpublishReview(supabase: any, reviewId: number, performedBy: string) {
  const { data, error } = await supabase
    .from('Reviews')
    .update({ 
      status: 'draft',
      published_at: null
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw new Error(`Failed to unpublish review: ${error.message}`);
  return data;
}

async function deleteReview(supabase: any, reviewId: number, performedBy: string) {
  const { data, error } = await supabase
    .from('Reviews')
    .delete()
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw new Error(`Failed to delete review: ${error.message}`);
  return data;
}

async function archiveReview(supabase: any, reviewId: number, performedBy: string) {
  const { data, error } = await supabase
    .from('Reviews')
    .update({ status: 'archived' })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw new Error(`Failed to archive review: ${error.message}`);
  return data;
}
