
// ABOUTME: Acervo data Edge Function using simplified working pattern

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

    // Get user for access level filtering (optional for this endpoint)
    let userId = 'anonymous';
    let userSubscriptionTier = 'free';
    
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        if (user) {
          userId = user.id;
          userSubscriptionTier = user.user_metadata?.subscription_tier || 'free';
        }
      } catch (authError) {
        console.warn('Auth verification failed, continuing as anonymous:', authError);
      }
    }

    console.log(`Starting Acervo data fetch for user: ${userId}`);

    // Fetch published reviews with RLS applied through access_level filtering
    const reviewsQuery = supabase
      .from('Reviews')
      .select(`
        review_id:id,
        title,
        description,
        cover_image_url,
        published_at,
        view_count,
        access_level
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Apply access level filtering based on user subscription
    if (userId === 'anonymous') {
      reviewsQuery.eq('access_level', 'public');
    } else if (userSubscriptionTier === 'free') {
      reviewsQuery.in('access_level', ['public', 'free_users_only']);
    }
    // Paying users see all content (no additional filter needed)

    const { data: reviews, error: reviewsError } = await reviewsQuery;

    if (reviewsError) {
      console.error('Reviews fetch error:', reviewsError);
      throw new Error(`Failed to fetch reviews: ${reviewsError.message}`);
    }

    // Fetch all tags with their hierarchy
    const { data: tags, error: tagsError } = await supabase
      .from('Tags')
      .select('id, tag_name, parent_id, created_at')
      .order('tag_name');

    if (tagsError) {
      console.error('Tags fetch error:', tagsError);
      throw new Error(`Failed to fetch tags: ${tagsError.message}`);
    }

    // For each review, fetch its tags and build the tags_json structure
    const reviewsWithTags = [];
    
    for (const review of reviews || []) {
      // Fetch tags for this review
      const { data: reviewTags } = await supabase
        .from('ReviewTags')
        .select(`
          Tags!inner(
            id,
            tag_name,
            parent_id
          )
        `)
        .eq('review_id', review.review_id);

      // Build tags_json structure: { categoria: [subtags] }
      const tagsJson: { [categoria: string]: string[] } = {};
      
      if (reviewTags) {
        reviewTags.forEach((rt: any) => {
          const tag = rt.Tags;
          if (tag.parent_id === null) {
            // This is a parent category
            if (!tagsJson[tag.tag_name]) {
              tagsJson[tag.tag_name] = [];
            }
          } else {
            // This is a subtag, find its parent
            const parentTag = tags?.find(t => t.id === tag.parent_id);
            if (parentTag) {
              if (!tagsJson[parentTag.tag_name]) {
                tagsJson[parentTag.tag_name] = [];
              }
              tagsJson[parentTag.tag_name].push(tag.tag_name);
            }
          }
        });
      }

      reviewsWithTags.push({
        ...review,
        tags_json: tagsJson
      });
    }

    console.log(`Fetched ${reviewsWithTags.length} reviews and ${tags?.length || 0} tags`);

    const response = {
      reviews: reviewsWithTags,
      tags: tags || []
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Acervo data fetch error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = errorMessage.includes('authentication') ? 401 :
                      errorMessage.includes('permissions') ? 403 : 500;

    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Acervo data fetch failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  }
});
