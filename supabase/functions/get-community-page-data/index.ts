
// ABOUTME: Community page data Edge Function using simplified pattern proven to work in production

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting community page data fetch...');

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log('Authenticated user:', user.id);

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);

    console.log('Request params:', { page, limit });

    // Fetch community posts with pagination
    const postsQuery = supabase
      .from('CommunityPosts')
      .select(`
        id,
        title,
        content,
        author_id,
        created_at,
        upvotes,
        downvotes,
        is_pinned,
        is_locked,
        flair_text,
        flair_color,
        category,
        post_type,
        image_url,
        video_url,
        poll_data,
        parent_post_id,
        Practitioners!author_id(
          id,
          full_name,
          avatar_url,
          role,
          profession_flair
        )
      `)
      .is('parent_post_id', null)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    const { data: posts, error: postsError } = await postsQuery;

    if (postsError) {
      console.error('Error fetching community posts:', postsError);
      throw new Error(`Failed to fetch community posts: ${postsError.message}`);
    }

    // Fetch community stats
    const { data: statsData, error: statsError } = await supabase
      .from('CommunityStats')
      .select('stat_key, stat_value')
      .in('stat_key', ['total_discussions', 'today_posts', 'active_authors_24h']);

    if (statsError) {
      console.error('Error fetching community stats:', statsError);
    }

    // Transform stats data
    const stats = (statsData || []).reduce((acc: any, stat: any) => {
      acc[stat.stat_key] = stat.stat_value?.count || 0;
      return acc;
    }, {
      total_discussions: 0,
      today_posts: 0,
      active_authors_24h: 0
    });

    // Fetch featured polls
    const { data: polls, error: pollsError } = await supabase
      .from('Polls')
      .select(`
        id,
        question,
        total_votes,
        expires_at,
        created_at,
        PollOptions(
          id,
          option_text,
          vote_count
        )
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (pollsError) {
      console.error('Error fetching polls:', pollsError);
    }

    const result = {
      posts: posts || [],
      stats,
      polls: polls || [],
      pagination: {
        page,
        limit,
        hasMore: (posts || []).length === limit
      }
    };

    console.log('Community page data response:', {
      postsCount: result.posts.length,
      statsKeys: Object.keys(result.stats),
      pollsCount: result.polls.length,
      hasMore: result.pagination.hasMore
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Community page data fetch error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = errorMessage.includes('authentication') ? 401 : 500;

    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Community page data fetch failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  }
});
