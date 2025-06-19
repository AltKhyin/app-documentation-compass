
// ABOUTME: Transactional community post creation using RPC for data consistency.

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
  RateLimitError 
} from '../_shared/api-helpers.ts'

interface CreatePostRequest {
  title?: string;
  content: string;
  category: string;
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

    // Check rate limit (5 posts per 5 minutes)
    const rateLimitResult = await checkRateLimit(supabase, 'create-community-post', user.id, 5, 300);
    if (!rateLimitResult.allowed) {
      throw RateLimitError;
    }

    // Parse and validate request body
    const requestBody: CreatePostRequest = await req.json();
    validateRequiredFields(requestBody, ['content', 'category']);
    
    const { title, content, category } = requestBody;

    // Additional validation
    if (content.trim().length < 10) {
      throw ValidationError('Post content must be at least 10 characters long');
    }

    if (title && title.trim().length > 200) {
      throw ValidationError('Post title cannot exceed 200 characters');
    }

    console.log('Creating community post via transactional RPC:', { 
      userId: user.id, 
      category, 
      hasTitle: !!title 
    });

    // *** THE FIX: Call the single transactional RPC ***
    const { data: newPost, error } = await supabase.rpc('create_post_and_auto_vote', {
      p_author_id: user.id,
      p_title: title?.trim() || null,
      p_content: content.trim(),
      p_category: category,
    }).single(); // .single() is important as our RPC returns a single record

    if (error) {
      console.error('Failed to create post via RPC:', error);
      throw new Error('Failed to create post');
    }

    console.log('Post created successfully via RPC:', newPost.id);

    return createSuccessResponse({
      success: true,
      post_id: newPost.id,
      message: 'Post created successfully'
    }, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    console.error('Post creation error:', error);
    return createErrorResponse(error);
  }
});
