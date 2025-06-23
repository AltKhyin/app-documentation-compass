
// ABOUTME: Admin Edge Function for tag operations following the mandatory 7-step pattern from DOC_5

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse, authenticateUser } from '../_shared/api-helpers.ts';
import { rateLimitCheck, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface TagOperationPayload {
  action: 'create' | 'update' | 'delete' | 'merge' | 'move' | 'cleanup';
  tagId?: number;
  parentId?: number | null;
  name?: string;
  description?: string;
  mergeTargetId?: number;
  bulkTagIds?: number[];
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
    
    // Verify admin/editor role for tag management
    const userRole = user.app_metadata?.role;
    if (!userRole || !['admin', 'editor'].includes(userRole)) {
      throw new Error('FORBIDDEN: Tag management requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await rateLimitCheck(req, 'admin-tag-operations', 30, 60);
    if (!rateLimitResult.allowed) {
      throw new Error('RATE_LIMIT_EXCEEDED: Rate limit exceeded');
    }

    // STEP 4: Input Parsing & Validation
    const payload: TagOperationPayload = await req.json().catch(() => ({}));
    
    if (!payload.action) {
      throw new Error('VALIDATION_FAILED: action is required');
    }

    console.log('Tag operation request:', { payload, userRole, userId: user.id });

    // STEP 5: Core Business Logic Execution
    const result = await handleTagOperation(supabase, payload, user.id);

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Tag operation error:', error);
    return createErrorResponse(error);
  }
});

// Helper function to handle different tag operations
async function handleTagOperation(supabase: any, payload: TagOperationPayload, userId: string) {
  try {
    switch (payload.action) {
      case 'create':
        return await createTag(supabase, payload, userId);
      case 'update':
        return await updateTag(supabase, payload, userId);
      case 'delete':
        return await deleteTag(supabase, payload, userId);
      case 'merge':
        return await mergeTags(supabase, payload, userId);
      case 'move':
        return await moveTag(supabase, payload, userId);
      case 'cleanup':
        return await cleanupTags(supabase, payload, userId);
      default:
        throw new Error(`VALIDATION_FAILED: Invalid tag operation: ${payload.action}`);
    }
  } catch (error) {
    console.error('Error in handleTagOperation:', error);
    throw error;
  }
}

async function createTag(supabase: any, payload: TagOperationPayload, userId: string) {
  if (!payload.name) {
    throw new Error('VALIDATION_FAILED: Tag name is required for creation');
  }

  // Check if tag already exists
  const { data: existingTag } = await supabase
    .from('Tags')
    .select('id')
    .eq('tag_name', payload.name)
    .single();

  if (existingTag) {
    throw new Error('VALIDATION_FAILED: Tag with this name already exists');
  }

  const { data: newTag, error } = await supabase
    .from('Tags')
    .insert({
      tag_name: payload.name,
      parent_id: payload.parentId || null
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create tag: ${error.message}`);
  }

  return { action: 'create', tag: newTag };
}

async function updateTag(supabase: any, payload: TagOperationPayload, userId: string) {
  if (!payload.tagId) {
    throw new Error('VALIDATION_FAILED: Tag ID is required for update');
  }

  const updates: any = {};
  if (payload.name) updates.tag_name = payload.name;
  if (payload.parentId !== undefined) updates.parent_id = payload.parentId;

  const { data: updatedTag, error } = await supabase
    .from('Tags')
    .update(updates)
    .eq('id', payload.tagId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tag: ${error.message}`);
  }

  return { action: 'update', tag: updatedTag };
}

async function deleteTag(supabase: any, payload: TagOperationPayload, userId: string) {
  const tagIds = payload.bulkTagIds || (payload.tagId ? [payload.tagId] : []);
  
  if (tagIds.length === 0) {
    throw new Error('VALIDATION_FAILED: No tags specified for deletion');
  }

  // Check if any tags have children or are in use
  const { data: tagUsage, error: usageError } = await supabase
    .from('Tags')
    .select(`
      id,
      tag_name,
      ReviewTags(count)
    `)
    .in('id', tagIds);

  if (usageError) {
    throw new Error(`Failed to check tag usage: ${usageError.message}`);
  }

  const tagsInUse = tagUsage.filter(tag => 
    Array.isArray(tag.ReviewTags) && tag.ReviewTags.length > 0
  );

  if (tagsInUse.length > 0) {
    throw new Error(`VALIDATION_FAILED: Cannot delete tags that are in use: ${tagsInUse.map(t => t.tag_name).join(', ')}`);
  }

  // Delete the tags
  const { error: deleteError } = await supabase
    .from('Tags')
    .delete()
    .in('id', tagIds);

  if (deleteError) {
    throw new Error(`Failed to delete tags: ${deleteError.message}`);
  }

  return { action: 'delete', deletedCount: tagIds.length };
}

async function mergeTags(supabase: any, payload: TagOperationPayload, userId: string) {
  if (!payload.tagId || !payload.bulkTagIds || payload.bulkTagIds.length === 0) {
    throw new Error('VALIDATION_FAILED: Target tag and source tags are required for merge');
  }

  // Update all ReviewTags to point to the target tag
  const { error: reviewTagsError } = await supabase
    .from('ReviewTags')
    .update({ tag_id: payload.tagId })
    .in('tag_id', payload.bulkTagIds);

  if (reviewTagsError) {
    throw new Error(`Failed to update review tags: ${reviewTagsError.message}`);
  }

  // Update child tags to point to the target tag
  const { error: childTagsError } = await supabase
    .from('Tags')
    .update({ parent_id: payload.tagId })
    .in('parent_id', payload.bulkTagIds);

  if (childTagsError) {
    throw new Error(`Failed to update child tags: ${childTagsError.message}`);
  }

  // Delete the source tags
  const { error: deleteError } = await supabase
    .from('Tags')
    .delete()
    .in('id', payload.bulkTagIds);

  if (deleteError) {
    throw new Error(`Failed to delete source tags: ${deleteError.message}`);
  }

  return { 
    action: 'merge', 
    targetTagId: payload.tagId,
    mergedCount: payload.bulkTagIds.length 
  };
}

async function moveTag(supabase: any, payload: TagOperationPayload, userId: string) {
  if (!payload.tagId) {
    throw new Error('VALIDATION_FAILED: Tag ID is required for move operation');
  }

  const { data: updatedTag, error } = await supabase
    .from('Tags')
    .update({ parent_id: payload.parentId || null })
    .eq('id', payload.tagId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to move tag: ${error.message}`);
  }

  return { action: 'move', tag: updatedTag };
}

async function cleanupTags(supabase: any, payload: TagOperationPayload, userId: string) {
  // Find unused tags
  const { data: allTags, error: tagsError } = await supabase
    .from('Tags')
    .select(`
      id,
      tag_name,
      ReviewTags(count)
    `);

  if (tagsError) {
    throw new Error(`Failed to fetch tags for cleanup: ${tagsError.message}`);
  }

  const unusedTags = allTags.filter(tag => 
    !Array.isArray(tag.ReviewTags) || tag.ReviewTags.length === 0
  );

  if (unusedTags.length === 0) {
    return { action: 'cleanup', message: 'No unused tags found', cleanedCount: 0 };
  }

  // Delete unused tags
  const unusedTagIds = unusedTags.map(tag => tag.id);
  const { error: deleteError } = await supabase
    .from('Tags')
    .delete()
    .in('id', unusedTagIds);

  if (deleteError) {
    throw new Error(`Failed to cleanup tags: ${deleteError.message}`);
  }

  return { 
    action: 'cleanup', 
    message: `Cleaned up ${unusedTags.length} unused tags`,
    cleanedCount: unusedTags.length,
    cleanedTags: unusedTags.map(t => t.tag_name)
  };
}
