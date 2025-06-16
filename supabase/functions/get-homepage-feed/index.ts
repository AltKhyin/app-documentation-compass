
// ABOUTME: Main Edge Function to fetch all homepage data with robust error handling and rate limiting.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Rate limiting configuration (100 requests per 60 seconds as per plan)
const RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  requestCounts: new Map<string, { count: number; resetTime: number }>()
}

interface PopularityScore {
  review_id: number;
  popularityScore: number;
}

// Consolidated response interface that includes all homepage data
interface ConsolidatedHomepageData {
  layout: string[];
  featured: any | null;
  recent: any[];
  popular: any[];
  recommendations: any[];
  suggestions: any[];
  userProfile: any | null;
  notificationCount: number;
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const userLimit = RATE_LIMIT.requestCounts.get(clientId);
  
  if (!userLimit || now > userLimit.resetTime) {
    RATE_LIMIT.requestCounts.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs
    });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientId = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientId)) {
      console.log(`Rate limit exceeded for client: ${clientId}`);
      return new Response(
        JSON.stringify({ 
          error: { 
            message: 'Rate limit exceeded. Please try again later.', 
            code: 'RATE_LIMIT_EXCEEDED' 
          } 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user ID from the request
    const authHeader = req.headers.get('Authorization');
    let practitionerId = null;
    let userProfile = null;
    let notificationCount = 0;
    
    if (authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        practitionerId = user?.id;
        console.log(`Fetching consolidated homepage feed for user: ${practitionerId || 'anonymous'}`);
      } catch (authError) {
        console.log('Auth error (continuing as anonymous):', authError);
      }
    }

    // Execute all queries in parallel with graceful error handling
    const promises = [
      // 1. Fetch homepage layout from Site Settings with fallback
      supabase
        .from('SiteSettings')
        .select('value')
        .eq('key', 'homepage_layout')
        .single()
        .then(result => {
          if (result.error) {
            console.log('No homepage layout setting found, using default');
            return { data: { value: '["featured", "recent", "suggestions", "popular"]' }, error: null };
          }
          return result;
        }),

      // 2. Fetch featured review with multiple fallbacks
      supabase
        .from('SiteSettings')
        .select('value')
        .eq('key', 'featured_review_id')
        .single()
        .then(async (result) => {
          if (result.data?.value && result.data.value !== 'null' && result.data.value !== '""') {
            try {
              const featuredId = typeof result.data.value === 'string' 
                ? JSON.parse(result.data.value) 
                : result.data.value;
              
              if (featuredId && typeof featuredId === 'number') {
                const reviewResult = await supabase
                  .from('Reviews')
                  .select('id, title, description, cover_image_url, published_at, view_count')
                  .eq('id', featuredId)
                  .eq('status', 'published')
                  .single();
                
                if (!reviewResult.error) {
                  return reviewResult;
                }
              }
            } catch (parseError) {
              console.log('Error parsing featured review ID, falling back to most recent');
            }
          }
          
          // Fallback: get most recent published review as featured
          return supabase
            .from('Reviews')
            .select('id, title, description, cover_image_url, published_at, view_count')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(1)
            .maybeSingle();
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

      // 5. Get data for popularity calculation (simplified for missing relationships)
      supabase
        .from('Reviews')
        .select('id, title, description, cover_image_url, published_at, view_count, created_at')
        .eq('status', 'published'),

      // 6. Get personalized recommendations (if user is authenticated)
      practitionerId ? 
        supabase.functions.invoke('get-personalized-recommendations', {
          body: { practitionerId }
        }).catch(error => {
          console.log('Recommendations function failed:', error);
          return { data: [], error: null };
        }) : 
        Promise.resolve({ data: [], error: null }),

      // 7. Fetch user profile (if authenticated)
      practitionerId ?
        supabase
          .from('Practitioners')
          .select('*')
          .eq('id', practitionerId)
          .single()
          .catch(error => {
            console.log('User profile fetch failed:', error);
            return { data: null, error: null };
          }) :
        Promise.resolve({ data: null, error: null }),

      // 8. Fetch notification count (if authenticated)
      practitionerId ?
        supabase
          .from('Notifications')
          .select('*', { count: 'exact', head: true })
          .eq('practitioner_id', practitionerId)
          .eq('is_read', false)
          .then(result => ({ count: result.count ?? 0, error: result.error }))
          .catch(error => {
            console.log('Notification count fetch failed:', error);
            return { count: 0, error: null };
          }) :
        Promise.resolve({ count: 0, error: null })
    ];

    const [
      layoutResult,
      featuredResult,
      recentResult,
      suggestionsResult,
      popularityData,
      recommendationsResult,
      userProfileResult,
      notificationCountResult
    ] = await Promise.allSettled(promises);

    // Process results with graceful degradation
    let layout = ["featured", "recent", "suggestions", "popular"]; // Default layout
    
    if (layoutResult.status === 'fulfilled' && layoutResult.value.data?.value) {
      try {
        const layoutValue = layoutResult.value.data.value;
        layout = typeof layoutValue === 'string' ? JSON.parse(layoutValue) : layoutValue;
      } catch (parseError) {
        console.log('Error parsing layout, using default:', parseError);
      }
    }

    const featured = featuredResult.status === 'fulfilled' && !featuredResult.value.error 
      ? featuredResult.value.data 
      : null;

    const recent = recentResult.status === 'fulfilled' && !recentResult.value.error 
      ? recentResult.value.data || [] 
      : [];

    const suggestions = suggestionsResult.status === 'fulfilled' && !suggestionsResult.value.error 
      ? suggestionsResult.value.data || [] 
      : [];

    // Calculate popularity scores using simplified algorithm (no community posts for now)
    const popular = popularityData.status === 'fulfilled' && !popularityData.value.error
      ? calculateSimplifiedPopularityScores(popularityData.value.data || [])
      : [];

    const recommendations = recommendationsResult.status === 'fulfilled' 
      ? recommendationsResult.value.data || [] 
      : [];

    // Extract user profile and notification count
    if (userProfileResult.status === 'fulfilled' && !userProfileResult.value.error) {
      userProfile = userProfileResult.value.data;
    }

    if (notificationCountResult.status === 'fulfilled') {
      notificationCount = notificationCountResult.value.count || 0;
    }

    // Log any errors for debugging but don't fail the request
    if (layoutResult.status === 'rejected') {
      console.error('Layout fetch failed:', layoutResult.reason);
    }
    if (featuredResult.status === 'rejected') {
      console.error('Featured review fetch failed:', featuredResult.reason);
    }
    if (recentResult.status === 'rejected') {
      console.error('Recent reviews fetch failed:', recentResult.reason);
    }
    if (suggestionsResult.status === 'rejected') {
      console.error('Suggestions fetch failed:', suggestionsResult.reason);
    }
    if (popularityData.status === 'rejected') {
      console.error('Popularity data fetch failed:', popularityData.reason);
    }
    if (userProfileResult.status === 'rejected') {
      console.error('User profile fetch failed:', userProfileResult.reason);
    }
    if (notificationCountResult.status === 'rejected') {
      console.error('Notification count fetch failed:', notificationCountResult.reason);
    }

    // Prepare the consolidated response
    const response: ConsolidatedHomepageData = {
      layout,
      featured,
      recent,
      popular,
      recommendations,
      suggestions,
      userProfile,
      notificationCount
    };

    console.log(`Returning consolidated homepage feed with ${response.recent.length} recent, ${response.popular.length} popular, ${response.recommendations.length} recommended reviews, ${response.suggestions.length} suggestions, user profile: ${!!response.userProfile}, notifications: ${response.notificationCount}`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Critical error in get-homepage-feed:', error);
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

// Simplified popularity calculation function for when community posts aren't available
function calculateSimplifiedPopularityScores(reviews: any[]): any[] {
  const now = Date.now();
  
  return reviews.map(review => {
    const publishedTime = new Date(review.published_at).getTime();
    const daysSincePublish = (now - publishedTime) / (24 * 60 * 60 * 1000);

    // Calculate simplified popularity score based on views and recency only
    const viewDecayFactor = Math.max(0.1, 1 - (daysSincePublish / 90)); // Decay over 90 days
    const recentViews = Math.floor(review.view_count * viewDecayFactor);

    // Simplified formula: recent views weighted by time decay
    const popularityScore = recentViews * (1 + (30 / Math.max(1, daysSincePublish)));

    return {
      ...review,
      popularityScore
    };
  })
  .sort((a, b) => b.popularityScore - a.popularityScore)
  .slice(0, 10); // Top 10 most popular
}
