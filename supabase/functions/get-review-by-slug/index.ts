
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReviewDetailResponse {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  structured_content: any;
  published_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  access_level: string;
  community_post_id: number | null;
  view_count: number | null;
  tags: string[];
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

    // Extract slug from URL
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop();

    if (!slug) {
      return new Response(JSON.stringify({
        error: { message: 'Review slug is required', code: 'MISSING_SLUG' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get user for rate limiting and RLS
    const authHeader = req.headers.get('Authorization');
    let userId = 'anonymous';
    let userSubscriptionTier = 'free';
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        userId = user.id;
        // Get user's subscription tier from JWT claims
        userSubscriptionTier = user.user_metadata?.subscription_tier || 'free';
      }
    }

    // Check rate limit (20 requests per 60 seconds) - enhanced per [DOC_5]
    const rateLimitResult = await checkRateLimit(supabase, 'get-review-by-slug', userId, 20, 60);
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

    console.log(`Fetching review with slug: ${slug} for user: ${userId}`);

    // Enhanced query with tags and better error handling per [D3.4]
    const { data: review, error } = await supabase
      .from('Reviews')
      .select(`
        id,
        title,
        description,
        cover_image_url,
        structured_content,
        published_at,
        access_level,
        community_post_id,
        view_count,
        author:Practitioners!author_id(
          id,
          full_name,
          avatar_url
        ),
        Review_Tags!inner(
          Tags(tag_name)
        )
      `)
      .eq('status', 'published')
      .eq('title', decodeURIComponent(slug))
      .single();

    if (error) {
      console.error('Review fetch error:', error);
      
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({
          error: { message: 'Review not found', code: 'REVIEW_NOT_FOUND' }
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
      
      throw new Error(`Failed to fetch review: ${error.message}`);
    }

    // Check access level permissions (following RLS logic but explicit for clarity)
    const isPublic = review.access_level === 'public';
    const isFreeUser = userId !== 'anonymous' && review.access_level === 'free_users_only';
    const isPaying = userId !== 'anonymous' && userSubscriptionTier === 'paying' && review.access_level === 'paying_users_only';
    const hasAccess = isPublic || isFreeUser || isPaying;

    if (!hasAccess) {
      return new Response(JSON.stringify({
        error: { 
          message: 'Access denied. This content requires a higher subscription tier.',
          code: 'ACCESS_DENIED',
          required_tier: review.access_level
        }
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Asynchronously increment view count (fire and forget) - performance optimization
    if (userId !== 'anonymous') {
      supabase
        .from('Reviews')
        .update({ view_count: (review.view_count || 0) + 1 })
        .eq('id', review.id)
        .then(() => console.log(`View count incremented for review ${review.id}`))
        .catch(err => console.error('Failed to increment view count:', err));
    }

    // Extract tags from nested structure
    const tags = review.Review_Tags?.map((rt: any) => rt.Tags?.tag_name).filter(Boolean) || [];

    const response: ReviewDetailResponse = {
      id: review.id,
      title: review.title,
      description: review.description,
      cover_image_url: review.cover_image_url,
      structured_content: review.structured_content,
      published_at: review.published_at,
      author: review.author,
      access_level: review.access_level,
      community_post_id: review.community_post_id,
      view_count: review.view_count,
      tags
    };

    console.log(`Successfully fetched review: ${review.title} with ${tags.length} tags`);

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Review detail fetch error:', error);
    
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
