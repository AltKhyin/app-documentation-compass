
// ABOUTME: Homepage feed Edge Function using simplified pattern proven to work in production

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

    console.log('Fetching homepage feed data...');

    // Get authenticated user (optional for homepage)
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      userId = user?.id;
    }

    // Fetch recent published reviews
    const { data: recentReviews, error: reviewsError } = await supabase
      .from('Reviews')
      .select(`
        review_id,
        title,
        description,
        cover_image_url,
        published_at,
        view_count,
        Practitioners!author_id(
          full_name,
          avatar_url
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6);

    if (reviewsError) {
      console.error('Error fetching recent reviews:', reviewsError);
    }

    // Fetch featured community posts
    const { data: featuredPosts, error: postsError } = await supabase
      .from('CommunityPosts')
      .select(`
        id,
        title,
        content,
        created_at,
        upvotes,
        category,
        Practitioners!author_id(
          full_name,
          avatar_url
        )
      `)
      .is('parent_post_id', null)
      .eq('is_pinned', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (postsError) {
      console.error('Error fetching featured posts:', postsError);
    }

    // Fetch trending suggestions using the dedicated function
    let suggestions = [];
    if (userId) {
      const { data: suggestionsData, error: suggestionsError } = await supabase.rpc(
        'get_homepage_suggestions',
        { p_user_id: userId }
      );

      if (suggestionsError) {
        console.error('Error fetching suggestions:', suggestionsError);
      } else {
        suggestions = suggestionsData || [];
      }
    } else {
      // For anonymous users, get top suggestions
      const { data: anonSuggestions, error: anonError } = await supabase
        .from('Suggestions')
        .select(`
          id,
          title,
          description,
          upvotes,
          created_at,
          Practitioners!submitted_by(full_name)
        `)
        .eq('status', 'pending')
        .order('upvotes', { ascending: false })
        .limit(5);

      if (anonError) {
        console.error('Error fetching anonymous suggestions:', anonError);
      } else {
        suggestions = (anonSuggestions || []).map(s => ({
          ...s,
          user_has_voted: false,
          Practitioners: s.Practitioners
        }));
      }
    }

    const result = {
      recentReviews: recentReviews || [],
      featuredPosts: featuredPosts || [],
      suggestions: suggestions || []
    };

    console.log('Homepage feed response:', {
      reviewsCount: result.recentReviews.length,
      postsCount: result.featuredPosts.length,
      suggestionsCount: result.suggestions.length
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Homepage feed error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      details: 'Homepage feed fetch failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
