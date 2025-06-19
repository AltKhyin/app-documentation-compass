
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CommunityPost {
  id: number;
  title: string | null;
  content: string;
  category: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  user_vote: string | null;
  reply_count: number;
  is_pinned?: boolean;
  is_locked?: boolean;
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

    // Get user for rate limiting and personalization
    const authHeader = req.headers.get('Authorization');
    let userId = 'anonymous';
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        userId = user.id;
      }
    }

    // Check rate limit (30 requests per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'get-community-feed', userId, 30, 60);
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

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
    const category = url.searchParams.get('category');
    const sort = url.searchParams.get('sort') || 'recent'; // recent, popular, trending

    console.log(`Fetching community feed: page=${page}, limit=${limit}, category=${category}, sort=${sort}`);

    // Build the main query with enhanced fields
    let query = supabase
      .from('CommunityPosts')
      .select(`
        id,
        title,
        content,
        category,
        upvotes,
        downvotes,
        created_at,
        is_pinned,
        is_locked,
        flair_text,
        flair_color,
        author:Practitioners!author_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .is('parent_post_id', null) // Only top-level posts
      .range(page * limit, (page + 1) * limit - 1);

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply sorting with pinned posts priority
    switch (sort) {
      case 'popular':
        query = query.order('is_pinned', { ascending: false }).order('upvotes', { ascending: false });
        break;
      case 'trending':
        // Simple trending: posts with most engagement in last 48 hours, with pinned posts first
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        query = query
          .gte('created_at', twoDaysAgo)
          .order('is_pinned', { ascending: false })
          .order('upvotes', { ascending: false });
        break;
      default: // recent
        query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data: posts, error: postsError } = await query;

    if (postsError) {
      console.error('Posts fetch error:', postsError);
      throw new Error(`Failed to fetch community posts: ${postsError.message}`);
    }

    // Get user votes and reply counts for each post
    const postsWithMetadata = await Promise.all(
      (posts || []).map(async (post) => {
        // Get user's vote for this post
        let userVote = null;
        if (userId !== 'anonymous') {
          const { data: voteData } = await supabase
            .from('CommunityPost_Votes')
            .select('vote_type')
            .eq('post_id', post.id)
            .eq('practitioner_id', userId)
            .maybeSingle();
          
          userVote = voteData?.vote_type || null;
        }

        // Get reply count
        const { count: replyCount } = await supabase
          .from('CommunityPosts')
          .select('id', { count: 'exact' })
          .eq('parent_post_id', post.id);

        return {
          ...post,
          user_vote: userVote,
          reply_count: replyCount || 0
        };
      })
    );

    console.log(`Successfully fetched ${postsWithMetadata.length} community posts with moderation data`);

    return new Response(JSON.stringify({
      posts: postsWithMetadata,
      pagination: {
        page,
        limit,
        hasMore: postsWithMetadata.length === limit
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Community feed fetch error:', error);
    
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
