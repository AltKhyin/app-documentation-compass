
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AcervoReview {
  review_id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  published_at: string;
  tags_json: { [categoria: string]: string[] };
}

interface AcervoTag {
  id: number;
  tag_name: string;
  parent_id: number | null;
}

interface AcervoResponse {
  reviews: AcervoReview[];
  tags: AcervoTag[];
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

    // Get user ID for rate limiting
    const authHeader = req.headers.get('Authorization');
    let userId = 'anonymous';
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        userId = user.id;
      }
    }

    // Check rate limit (30 requests per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'get-acervo-data', userId);
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

    console.log('Starting Acervo data fetch for user:', userId);

    // Execute parallel queries for optimal performance
    const [reviewsResult, tagsResult] = await Promise.all([
      // Query 1: Fetch all published reviews with their tags
      supabase
        .from('Reviews')
        .select(`
          id,
          title,
          description,
          cover_image_url,
          published_at,
          ReviewTags!inner(
            Tags!inner(
              id,
              tag_name,
              parent_id
            )
          )
        `)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false }),

      // Query 2: Fetch complete tag hierarchy
      supabase
        .from('Tags')
        .select('id, tag_name, parent_id')
        .order('tag_name', { ascending: true })
    ]);

    if (reviewsResult.error) {
      console.error('Reviews query error:', reviewsResult.error);
      throw new Error(`Failed to fetch reviews: ${reviewsResult.error.message}`);
    }

    if (tagsResult.error) {
      console.error('Tags query error:', tagsResult.error);
      throw new Error(`Failed to fetch tags: ${tagsResult.error.message}`);
    }

    console.log(`Fetched ${reviewsResult.data?.length || 0} reviews and ${tagsResult.data?.length || 0} tags`);

    // Transform reviews data to match frontend expectations
    const transformedReviews: AcervoReview[] = (reviewsResult.data || []).map(review => {
      // Build tags_json object with parent-child hierarchy
      const tagsJson: { [categoria: string]: string[] } = {};
      
      if (review.ReviewTags && Array.isArray(review.ReviewTags)) {
        review.ReviewTags.forEach((reviewTag: any) => {
          if (reviewTag.Tags) {
            const tag = reviewTag.Tags;
            
            if (tag.parent_id === null) {
              // This is a parent tag (categoria)
              if (!tagsJson[tag.tag_name]) {
                tagsJson[tag.tag_name] = [];
              }
            } else {
              // This is a child tag (subtag) - find its parent
              const parentTag = tagsResult.data?.find(t => t.id === tag.parent_id);
              if (parentTag) {
                if (!tagsJson[parentTag.tag_name]) {
                  tagsJson[parentTag.tag_name] = [];
                }
                if (!tagsJson[parentTag.tag_name].includes(tag.tag_name)) {
                  tagsJson[parentTag.tag_name].push(tag.tag_name);
                }
              }
            }
          }
        });
      }

      return {
        review_id: review.id,
        title: review.title,
        description: review.description,
        cover_image_url: review.cover_image_url,
        published_at: review.published_at,
        tags_json: tagsJson
      };
    });

    // Transform tags data to match frontend expectations
    const transformedTags: AcervoTag[] = (tagsResult.data || []).map(tag => ({
      id: tag.id,
      tag_name: tag.tag_name,
      parent_id: tag.parent_id
    }));

    const response: AcervoResponse = {
      reviews: transformedReviews,
      tags: transformedTags
    };

    console.log('Acervo data transformation complete. Returning response.');

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Acervo data fetch error:', error);
    
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
