// supabase/functions/get-homepage-feed/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to safely extract data from settled promises
const getResultData = (result: PromiseSettledResult<any>, fallback: any = null) => {
  if (result.status === 'fulfilled' && result.value && result.value.data !== undefined) {
    return result.value.data;
  }
  if (result.status === 'rejected') {
    console.error("A promise failed:", result.reason);
  }
  return fallback;
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase: SupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --- Robust User Identification ---
    const authHeader = req.headers.get('Authorization');
    let practitionerId: string | null = null;
    if (authHeader) {
      const userResponse = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (userResponse.data?.user) {
        practitionerId = userResponse.data.user.id;
      }
    }

    // --- Define all data queries ---
    const promises = [
      supabase.from('SiteSettings').select('value').eq('key', 'homepage_layout').single(),
      supabase.from('Reviews').select('id, title, description, cover_image_url, published_at, view_count').eq('status', 'published').order('published_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('Reviews').select('id, title, description, cover_image_url, published_at, view_count').eq('status', 'published').order('published_at', { ascending: false }).limit(10),
      // CORRECT: Call the robust RPC function to get suggestions
      supabase.rpc('get_homepage_suggestions', { p_user_id: practitionerId }),
      supabase.from('Reviews').select('id, title, description, cover_image_url, published_at, view_count').eq('status', 'published').order('view_count', { ascending: false }).limit(10),
      practitionerId ? supabase.functions.invoke('get-personalized-recommendations', { body: { practitionerId } }) : Promise.resolve({ data: [] }),
      practitionerId ? supabase.from('Practitioners').select('*').eq('id', practitionerId).single() : Promise.resolve({ data: null }),
      practitionerId ? supabase.from('Notifications').select('*', { count: 'exact', head: true }).eq('practitioner_id', practitionerId).eq('is_read', false) : Promise.resolve({ data: null, count: 0 })
    ];

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
    const responseData = {
      layout: getResultData(layoutResult)?.value ? JSON.parse(getResultData(layoutResult).value) : ["featured", "recent"],
      featured: getResultData(featuredResult, null),
      recent: getResultData(recentResult, []),
      popular: getResultData(popularResult, []),
      suggestions: getResultData(suggestionsResult, []),
      recommendations: getResultData(recommendationsResult, []),
      userProfile: getResultData(userProfileResult, null),
      notificationCount: (notificationCountResult.status === 'fulfilled' && notificationCountResult.value.count) ? notificationCountResult.value.count : 0,
    };

    return new Response(JSON.stringify(responseData), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Critical error in get-homepage-feed:', error);
    return new Response(JSON.stringify({ error: { message: 'Internal server error' } }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});