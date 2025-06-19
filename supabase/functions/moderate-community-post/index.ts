
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: { message: 'Invalid authentication', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check user role (must be editor or admin)
    const { data: profile } = await supabase
      .from('Practitioners')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['editor', 'admin'].includes(profile.role)) {
      return new Response(JSON.stringify({
        error: { message: 'Insufficient permissions', code: 'FORBIDDEN' }
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check rate limit (10 actions per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'moderate-community-post', user.id, 10, 60);
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: { message: 'Rate limit exceeded', code: 'RATE_LIMIT_EXCEEDED' }
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...rateLimitHeaders(rateLimitResult)
        }
      });
    }

    const requestBody: ModerationRequest = await req.json();
    const { post_id, action_type, reason, flair_text, flair_color } = requestBody;

    console.log('Processing moderation action:', { post_id, action_type, moderator: user.id });

    // Validate the post exists
    const { data: post, error: postError } = await supabase
      .from('CommunityPosts')
      .select('id')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      return new Response(JSON.stringify({
        error: { message: 'Post not found', code: 'NOT_FOUND' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
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
        return new Response(JSON.stringify({
          error: { message: 'Invalid action type', code: 'INVALID_ACTION' }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    // Update the post
    const { error: updateError } = await supabase
      .from('CommunityPosts')
      .update(updateData)
      .eq('id', post_id);

    if (updateError) {
      console.error('Failed to apply moderation action:', updateError);
      return new Response(JSON.stringify({
        error: { message: 'Failed to apply moderation action', code: 'UPDATE_FAILED' }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
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

    return new Response(JSON.stringify({
      success: true,
      message: 'Moderation action applied successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Moderation action error:', error);
    
    return new Response(JSON.stringify({
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
