
// ABOUTME: Main Edge Function to fetch all homepage data in a single consolidated request.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface PopularityScore {
  review_id: number;
  popularityScore: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user ID from the request
    const authHeader = req.headers.get('Authorization');
    let practitionerId = null;
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      practitionerId = user?.id;
    }

    console.log(`Fetching homepage feed for user: ${practitionerId || 'anonymous'}`);

    // Execute all queries in parallel using Promise.all
    const [
      layoutResult,
      featuredResult,
      recentResult,
      suggestionsResult,
      popularityData,
      recommendationsResult
    ] = await Promise.all([
      // 1. Fetch homepage layout from Site Settings
      supabase
        .from('SiteSettings')
        .select('value')
        .eq('key', 'homepage_layout')
        .single(),

      // 2. Fetch featured review
      supabase
        .from('SiteSettings')
        .select('value')
        .eq('key', 'featured_review_id')
        .single()
        .then(async (result) => {
          if (result.data?.value && result.data.value !== 'null') {
            const featuredId = JSON.parse(result.data.value);
            return supabase
              .from('Reviews')
              .select('id, title, description, cover_image_url, published_at, view_count')
              .eq('id', featuredId)
              .eq('status', 'published')
              .single();
          }
          // Fallback: get most recent published review as featured
          return supabase
            .from('Reviews')
            .select('id, title, description, cover_image_url, published_at, view_count')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(1)
            .single();
        }),

      // 3. Fetch 10 most recent published reviews
      supabase
        .from('Reviews')
        .select('id, title, description, cover_image_url, published_at, view_count')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10),

      // 4. Fetch current suggestions for poll
      supabase
        .from('Suggestions')
        .select(`
          id, title, description, upvotes, created_at,
          Practitioners!Suggestions_submitted_by_fkey(full_name)
        `)
        .eq('status', 'pending')
        .order('upvotes', { ascending: false })
        .limit(10),

      // 5. Get data for popularity calculation
      supabase
        .from('Reviews')
        .select(`
          id, view_count, published_at, created_at,
          CommunityPosts!Reviews_community_post_id_fkey(upvotes, downvotes)
        `)
        .eq('status', 'published'),

      // 6. Get personalized recommendations (if user is authenticated)
      practitionerId ? 
        supabase.functions.invoke('get-personalized-recommendations', {
          body: { practitionerId }
        }) : 
        Promise.resolve({ data: [], error: null })
    ]);

    // Handle errors for critical queries
    if (layoutResult.error) {
      console.error('Layout fetch error:', layoutResult.error);
    }

    if (featuredResult.error) {
      console.error('Featured review fetch error:', featuredResult.error);
    }

    if (recentResult.error) {
      console.error('Recent reviews fetch error:', recentResult.error);
      return new Response(
        JSON.stringify({ 
          error: { 
            message: 'Failed to fetch recent reviews', 
            code: 'DATABASE_ERROR' 
          } 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate popularity scores using the time-decaying algorithm
    const popularReviews = popularityData.data ? calculatePopularityScores(popularityData.data) : [];

    // Get the top 10 popular reviews with full details
    const popularReviewIds = popularReviews.slice(0, 10).map(r => r.review_id);
    const { data: popularReviewsDetails } = await supabase
      .from('Reviews')
      .select('id, title, description, cover_image_url, published_at, view_count')
      .in('id', popularReviewIds)
      .eq('status', 'published');

    // Sort popular reviews by their calculated popularity score
    const sortedPopularReviews = popularReviewsDetails?.sort((a, b) => {
      const scoreA = popularReviews.find(p => p.review_id === a.id)?.popularityScore || 0;
      const scoreB = popularReviews.find(p => p.review_id === b.id)?.popularityScore || 0;
      return scoreB - scoreA;
    }) || [];

    // Prepare the consolidated response
    const response = {
      layout: layoutResult.data?.value ? JSON.parse(layoutResult.data.value) : ["featured", "recent", "suggestions", "popular"],
      featured: featuredResult.data || null,
      recent: recentResult.data || [],
      popular: sortedPopularReviews,
      recommendations: recommendationsResult.data || [],
      suggestions: suggestionsResult.data || []
    };

    console.log(`Returning homepage feed with ${response.recent.length} recent, ${response.popular.length} popular, ${response.recommendations.length} recommended reviews`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-homepage-feed:', error);
    return new Response(
      JSON.stringify({ 
        error: { 
          message: 'Internal server error', 
          code: 'INTERNAL_ERROR' 
        } 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Popularity calculation function implementing the time-decaying algorithm
function calculatePopularityScores(reviews: any[]): PopularityScore[] {
  const now = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

  return reviews.map(review => {
    const publishedTime = new Date(review.published_at).getTime();
    const daysSincePublish = (now - publishedTime) / (24 * 60 * 60 * 1000);

    // Calculate views in different time windows (simulated based on total views and recency)
    const viewDecayFactor = Math.max(0.1, 1 - (daysSincePublish / 90)); // Decay over 90 days
    const views_last_7_days = Math.floor(review.view_count * viewDecayFactor * 0.4);
    const views_last_30_days = Math.floor(review.view_count * viewDecayFactor * 0.7);

    // Get comment and upvote counts from community posts
    const totalComments = review.CommunityPosts?.length || 0;
    const totalUpvotes = review.CommunityPosts?.reduce((sum: number, post: any) => sum + (post.upvotes || 0), 0) || 0;

    // Apply the popularity formula from the blueprint:
    // popularityScore = (views_last_7_days * 3) + (views_last_30_days * 1) + (total_comments * 5) + (total_upvotes * 2)
    const popularityScore = (views_last_7_days * 3) + (views_last_30_days * 1) + (totalComments * 5) + (totalUpvotes * 2);

    return {
      review_id: review.id,
      popularityScore
    };
  }).sort((a, b) => b.popularityScore - a.popularityScore);
}
