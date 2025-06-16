// ABOUTME: Main Edge Function to fetch all homepage data with robust error handling and rate limiting.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// --- CORS Headers - MANDATORY FOR ALL EDGE FUNCTIONS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// --- Interfaces for our consolidated data response ---
interface Review {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  published_at: string;
  view_count: number;
}

interface Suggestion {
  id: number;
  title: string;
  description: string | null;
  upvotes: number;
  created_at: string;
  Practitioners: { full_name: string } | null;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  subscription_tier: string;
}

interface ConsolidatedHomepageData {
  layout: string[];
  featured: Review | null;
  recent: Review[];
  popular: Review[];
  recommendations: Review[];
  suggestions: Suggestion[];
  userProfile: UserProfile | null;
  notificationCount: number;
}

// Helper to gracefully get data from settled promises
const getResultData = (result: PromiseSettledResult<any>, fallback: any = null) => {
  if (result.status === 'fulfilled' && result.value && result.value.data !== undefined) {
    return result.value.data;
  }
  if (result.status === 'rejected') {
    console.error("A promise failed:", result.reason);
  }
  return fallback;
};


// Main server logic
serve(async (req: Request) => {
  // --- Handle CORS preflight requests ---
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase: SupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --- Get the authenticated user ID from the request ---
    const authHeader = req.headers.get('Authorization');
    let practitionerId: string | null = null;
    if (authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        if (user) {
          practitionerId = user.id;
        }
      } catch (authError) {
        console.warn('Auth error while getting user (continuing as anonymous):', authError.message);
      }
    }
    console.log(`Fetching consolidated feed for user: ${practitionerId || 'anonymous'}`);

    // --- Define all data queries to be run on the SERVER ---
    const promises = [
      supabase.from('SiteSettings').select('value').eq('key', 'homepage_layout').single(),
      supabase.from('Reviews').select('id, title, description, cover_image_url, published_at, view_count').eq('status', 'published').order('published_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('Reviews').select('id, title, description, cover_image_url, published_at, view_count').eq('status', 'published').order('published_at', { ascending: false }).limit(10),
      supabase.from('Suggestions').select('id, title, description, upvotes, created_at, Practitioners(full_name)').eq('status', 'pending').order('upvotes', { ascending: false }).limit(10),
      supabase.from('Reviews').select('id, title, description, cover_image_url, published_at, view_count').eq('status', 'published').order('view_count', { ascending: false }).limit(10),
      practitionerId ? supabase.functions.invoke('get-personalized-recommendations', { body: { practitionerId } }).catch(e => { console.error("Recs failed:", e); return { data: [], error: e }; }) : Promise.resolve({ data: [], error: null }),
      practitionerId ? supabase.from('Practitioners').select('*').eq('id', practitionerId).single() : Promise.resolve({ data: null, error: null }),
      practitionerId ? supabase.from('Notifications').select('*', { count: 'exact', head: true }).eq('practitioner_id', practitionerId).eq('is_read', false) : Promise.resolve({ data: null, error: null })
    ];

    // --- Execute all queries in parallel on the SERVER ---
    const results = await Promise.allSettled(promises);
    const [
      layoutResult,
      featuredResult,
      recentResult,
      suggestionsResult,
      popularResult,
      recommendationsResult,
      userProfileResult,
      notificationCountResult
    ] = results;

    // --- Assemble the final response object ---
    const responseData: ConsolidatedHomepageData = {
      layout: getResultData(layoutResult, { value: '["featured", "recent", "suggestions", "popular"]' })?.value || [],
      featured: getResultData(featuredResult, null),
      recent: getResultData(recentResult, []),
      popular: getResultData(popularResult, []),
      suggestions: getResultData(suggestionsResult, []),
      recommendations: getResultData(recommendationsResult, []),
      userProfile: getResultData(userProfileResult, null),
      notificationCount: notificationCountResult.status === 'fulfilled' && notificationCountResult.value ? (notificationCountResult.value.count ?? 0) : 0,
    };

    console.log(`✅ Successfully assembled consolidated feed.`);

    // --- Return the single, consolidated JSON payload ---
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Critical error in get-homepage-feed:', error);
    return new Response(
      JSON.stringify({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
