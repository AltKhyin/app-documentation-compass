
// ABOUTME: Acervo data Edge Function using simplified pattern proven to work in production

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

    console.log('Fetching acervo data...');

    // Fetch published reviews with author info and tags
    const { data: reviews, error: reviewsError } = await supabase
      .from('Reviews')
      .select(`
        review_id,
        title,
        description,
        cover_image_url,
        published_at,
        view_count,
        structured_content,
        Practitioners!author_id(
          full_name,
          avatar_url
        ),
        ReviewTags(
          Tags(
            id,
            tag_name,
            parent_id
          )
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      throw new Error(`Failed to fetch reviews: ${reviewsError.message}`);
    }

    // Fetch all tags for filtering
    const { data: tags, error: tagsError } = await supabase
      .from('Tags')
      .select('id, tag_name, parent_id, created_at')
      .order('tag_name');

    if (tagsError) {
      console.error('Error fetching tags:', tagsError);
      throw new Error(`Failed to fetch tags: ${tagsError.message}`);
    }

    // Transform reviews data to include structured tags
    const transformedReviews = (reviews || []).map((review: any) => {
      // Extract tags from the structured_content if available
      let tags_json = {};
      if (review.structured_content?.tags) {
        tags_json = review.structured_content.tags;
      }

      return {
        review_id: review.review_id,
        title: review.title,
        description: review.description,
        cover_image_url: review.cover_image_url,
        published_at: review.published_at,
        view_count: review.view_count || 0,
        author: review.Practitioners,
        tags_json
      };
    });

    const result = {
      reviews: transformedReviews,
      tags: tags || []
    };

    console.log('Acervo data response:', {
      reviewsCount: result.reviews.length,
      tagsCount: result.tags.length
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Acervo data fetch error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';

    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Acervo data fetch failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
