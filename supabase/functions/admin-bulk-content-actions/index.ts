
// ABOUTME: Bulk content operations Edge Function for efficient mass content management

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse, authenticateUser } from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface BulkContentPayload {
  action: 'bulk_approve' | 'bulk_reject' | 'bulk_archive' | 'bulk_delete' | 'bulk_publish' | 'bulk_tag';
  contentIds: number[];
  contentType: 'reviews' | 'community_posts';
  metadata?: {
    tagIds?: number[];
    publishDate?: string;
    reason?: string;
  };
}

Deno.serve(async (req) => {
  // STEP 1: CORS Preflight Handling (MANDATORY FIRST)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // STEP 2: Manual Authentication (requires verify_jwt = false in config.toml)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const user = await authenticateUser(supabase, req.headers.get('Authorization'));
    
    // Verify admin/editor role for bulk content operations
    const { data: hasRole, error: roleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'admin' 
      });
    
    const { data: hasEditorRole, error: editorRoleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'editor' 
      });

    if (roleError || editorRoleError || (!hasRole && !hasEditorRole)) {
      throw new Error('FORBIDDEN: Bulk content operations require admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation (more restrictive for bulk operations)
    const rateLimitResult = await checkRateLimit(supabase, 'admin-bulk-content-actions', user.id, 10, 300); // 10 requests per 5 minutes
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: { message: 'Rate limit exceeded for bulk operations', code: 'RATE_LIMIT_EXCEEDED' }
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...rateLimitHeaders(rateLimitResult)
        }
      });
    }

    // STEP 4: Input Parsing & Validation
    const payload: BulkContentPayload = await req.json();
    
    if (!payload.contentIds || !Array.isArray(payload.contentIds) || payload.contentIds.length === 0) {
      throw new Error('Content IDs array is required and must not be empty');
    }

    if (payload.contentIds.length > 100) {
      throw new Error('Maximum 100 items can be processed in a single bulk operation');
    }

    console.log('Bulk content operation:', { 
      action: payload.action, 
      contentType: payload.contentType,
      itemCount: payload.contentIds.length 
    });

    // STEP 5: Core Business Logic Execution
    let result;

    switch (payload.action) {
      case 'bulk_approve':
        result = await handleBulkApprove(supabase, payload, user.id);
        break;
      
      case 'bulk_reject':
        result = await handleBulkReject(supabase, payload, user.id);
        break;
      
      case 'bulk_archive':
        result = await handleBulkArchive(supabase, payload, user.id);
        break;
      
      case 'bulk_delete':
        // Only admins can bulk delete
        if (!hasRole) {
          throw new Error('FORBIDDEN: Bulk delete requires admin privileges');
        }
        result = await handleBulkDelete(supabase, payload, user.id);
        break;
      
      case 'bulk_publish':
        result = await handleBulkPublish(supabase, payload, user.id);
        break;
      
      case 'bulk_tag':
        result = await handleBulkTag(supabase, payload, user.id);
        break;
      
      default:
        throw new Error(`Invalid bulk action: ${payload.action}`);
    }

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Bulk content operation error:', error);
    return createErrorResponse(error);
  }
});

// Handle bulk approval of content
async function handleBulkApprove(supabase: any, payload: BulkContentPayload, performedBy: string) {
  const results: any[] = [];
  const errors: any[] = [];

  for (const contentId of payload.contentIds) {
    try {
      if (payload.contentType === 'reviews') {
        const { data, error } = await supabase
          .from('Reviews')
          .update({ 
            review_status: 'approved',
            reviewer_id: performedBy,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', contentId)
          .select()
          .single();

        if (error) {
          errors.push({ contentId, error: error.message });
        } else {
          results.push(data);
          
          // Log audit event
          await supabase.rpc('log_audit_event', {
            p_performed_by: performedBy,
            p_action_type: 'BULK_APPROVE',
            p_resource_type: 'Reviews',
            p_resource_id: contentId.toString(),
            p_metadata: { source: 'admin_panel', bulk_operation: true }
          });
        }
      }
    } catch (err) {
      errors.push({ contentId, error: err.message });
    }
  }

  return {
    action: 'bulk_approve',
    processed: results.length,
    errors: errors.length,
    results,
    errors
  };
}

// Handle bulk rejection of content
async function handleBulkReject(supabase: any, payload: BulkContentPayload, performedBy: string) {
  const results: any[] = [];
  const errors: any[] = [];

  for (const contentId of payload.contentIds) {
    try {
      if (payload.contentType === 'reviews') {
        const { data, error } = await supabase
          .from('Reviews')
          .update({ 
            review_status: 'rejected',
            reviewer_id: performedBy,
            reviewed_at: new Date().toISOString(),
            publication_notes: payload.metadata?.reason || 'Bulk rejected by admin'
          })
          .eq('id', contentId)
          .select()
          .single();

        if (error) {
          errors.push({ contentId, error: error.message });
        } else {
          results.push(data);
          
          // Log audit event
          await supabase.rpc('log_audit_event', {
            p_performed_by: performedBy,
            p_action_type: 'BULK_REJECT',
            p_resource_type: 'Reviews',
            p_resource_id: contentId.toString(),
            p_metadata: { 
              source: 'admin_panel', 
              bulk_operation: true,
              reason: payload.metadata?.reason 
            }
          });
        }
      }
    } catch (err) {
      errors.push({ contentId, error: err.message });
    }
  }

  return {
    action: 'bulk_reject',
    processed: results.length,
    errors: errors.length,
    results,
    errors
  };
}

// Handle bulk archiving of content
async function handleBulkArchive(supabase: any, payload: BulkContentPayload, performedBy: string) {
  const results: any[] = [];
  const errors: any[] = [];

  for (const contentId of payload.contentIds) {
    try {
      if (payload.contentType === 'reviews') {
        const { data, error } = await supabase
          .from('Reviews')
          .update({ 
            review_status: 'archived',
            reviewer_id: performedBy,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', contentId)
          .select()
          .single();

        if (error) {
          errors.push({ contentId, error: error.message });
        } else {
          results.push(data);
          
          // Log audit event
          await supabase.rpc('log_audit_event', {
            p_performed_by: performedBy,
            p_action_type: 'BULK_ARCHIVE',
            p_resource_type: 'Reviews',
            p_resource_id: contentId.toString(),
            p_metadata: { source: 'admin_panel', bulk_operation: true }
          });
        }
      }
    } catch (err) {
      errors.push({ contentId, error: err.message });
    }
  }

  return {
    action: 'bulk_archive',
    processed: results.length,
    errors: errors.length,
    results,
    errors
  };
}

// Handle bulk deletion of content (admin only)
async function handleBulkDelete(supabase: any, payload: BulkContentPayload, performedBy: string) {
  const results: any[] = [];
  const errors: any[] = [];

  for (const contentId of payload.contentIds) {
    try {
      if (payload.contentType === 'reviews') {
        // First get the content for audit logging
        const { data: contentData, error: fetchError } = await supabase
          .from('Reviews')
          .select('*')
          .eq('id', contentId)
          .single();

        if (fetchError) {
          errors.push({ contentId, error: `Failed to fetch: ${fetchError.message}` });
          continue;
        }

        // Log audit event before deletion
        await supabase.rpc('log_audit_event', {
          p_performed_by: performedBy,
          p_action_type: 'BULK_DELETE',
          p_resource_type: 'Reviews',
          p_resource_id: contentId.toString(),
          p_old_values: contentData,
          p_metadata: { source: 'admin_panel', bulk_operation: true }
        });

        // Delete the content
        const { error: deleteError } = await supabase
          .from('Reviews')
          .delete()
          .eq('id', contentId);

        if (deleteError) {
          errors.push({ contentId, error: deleteError.message });
        } else {
          results.push({ id: contentId, deleted: true });
        }
      }
    } catch (err) {
      errors.push({ contentId, error: err.message });
    }
  }

  return {
    action: 'bulk_delete',
    processed: results.length,
    errors: errors.length,
    results,
    errors
  };
}

// Handle bulk publishing of content
async function handleBulkPublish(supabase: any, payload: BulkContentPayload, performedBy: string) {
  const publishDate = payload.metadata?.publishDate ? new Date(payload.metadata.publishDate) : new Date();
  const results: any[] = [];
  const errors: any[] = [];

  for (const contentId of payload.contentIds) {
    try {
      if (payload.contentType === 'reviews') {
        const { data, error } = await supabase
          .from('Reviews')
          .update({ 
            review_status: 'published',
            status: 'published',
            published_at: publishDate.toISOString(),
            reviewer_id: performedBy,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', contentId)
          .select()
          .single();

        if (error) {
          errors.push({ contentId, error: error.message });
        } else {
          results.push(data);
          
          // Log audit event
          await supabase.rpc('log_audit_event', {
            p_performed_by: performedBy,
            p_action_type: 'BULK_PUBLISH',
            p_resource_type: 'Reviews',
            p_resource_id: contentId.toString(),
            p_metadata: { 
              source: 'admin_panel', 
              bulk_operation: true,
              publish_date: publishDate.toISOString()
            }
          });
        }
      }
    } catch (err) {
      errors.push({ contentId, error: err.message });
    }
  }

  return {
    action: 'bulk_publish',
    processed: results.length,
    errors: errors.length,
    results,
    errors
  };
}

// Handle bulk tagging of content
async function handleBulkTag(supabase: any, payload: BulkContentPayload, performedBy: string) {
  if (!payload.metadata?.tagIds || payload.metadata.tagIds.length === 0) {
    throw new Error('Tag IDs are required for bulk tagging');
  }

  const results: any[] = [];
  const errors: any[] = [];

  for (const contentId of payload.contentIds) {
    try {
      if (payload.contentType === 'reviews') {
        // Add tags to the review
        for (const tagId of payload.metadata.tagIds) {
          const { error: tagError } = await supabase
            .from('ReviewTags')
            .upsert({
              review_id: contentId,
              tag_id: tagId
            }, {
              onConflict: 'review_id,tag_id'
            });

          if (tagError) {
            errors.push({ contentId, tagId, error: tagError.message });
          }
        }

        results.push({ contentId, tagsAdded: payload.metadata.tagIds.length });
        
        // Log audit event
        await supabase.rpc('log_audit_event', {
          p_performed_by: performedBy,
          p_action_type: 'BULK_TAG',
          p_resource_type: 'Reviews',
          p_resource_id: contentId.toString(),
          p_metadata: { 
            source: 'admin_panel', 
            bulk_operation: true,
            tag_ids: payload.metadata.tagIds
          }
        });
      }
    } catch (err) {
      errors.push({ contentId, error: err.message });
    }
  }

  return {
    action: 'bulk_tag',
    processed: results.length,
    errors: errors.length,
    results,
    errors
  };
}
