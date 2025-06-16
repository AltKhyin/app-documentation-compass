
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user ID from JWT for rate limiting
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('Authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(supabaseClient, 'get-acervo-data', user.id)
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          resetTime: rateLimitResult.resetTime 
        }),
        {
          headers: { 
            ...corsHeaders, 
            ...rateLimitHeaders(rateLimitResult),
            'Content-Type': 'application/json' 
          },
          status: 429,
        },
      )
    }

    console.log('Fetching acervo data...')

    // Fetch all published reviews with their tags in parallel
    const [reviewsResult, tagsResult] = await Promise.all([
      // Query 1: Fetch all published reviews with their associated tags
      supabaseClient
        .from('Reviews')
        .select(`
          id,
          title,
          description,
          cover_image_url,
          published_at,
          ReviewTags (
            Tags (
              id,
              tag_name,
              parent_id
            )
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false }),

      // Query 2: Fetch all tags to build the hierarchy
      supabaseClient
        .from('Tags')
        .select('id, tag_name, parent_id')
        .order('parent_id', { ascending: true })
        .order('tag_name', { ascending: true })
    ])

    if (reviewsResult.error) {
      console.error('Error fetching reviews:', reviewsResult.error)
      throw reviewsResult.error
    }

    if (tagsResult.error) {
      console.error('Error fetching tags:', tagsResult.error)
      throw tagsResult.error
    }

    // Process reviews to format tags_json as required by the frontend
    const processedReviews = reviewsResult.data.map((review: any) => {
      const tagsJson: { [categoria: string]: string[] } = {}
      
      // Group tags by parent (categoria)
      const reviewTags = review.ReviewTags || []
      
      reviewTags.forEach((reviewTag: any) => {
        const tag = reviewTag.Tags
        if (!tag) return

        if (tag.parent_id === null) {
          // This is a parent tag (categoria)
          if (!tagsJson[tag.tag_name]) {
            tagsJson[tag.tag_name] = []
          }
        } else {
          // This is a child tag (subtag), find its parent
          const parentTag = tagsResult.data.find((t: any) => t.id === tag.parent_id)
          if (parentTag) {
            if (!tagsJson[parentTag.tag_name]) {
              tagsJson[parentTag.tag_name] = []
            }
            tagsJson[parentTag.tag_name].push(tag.tag_name)
          }
        }
      })

      return {
        review_id: review.id,
        title: review.title,
        description: review.description,
        cover_image_url: review.cover_image_url,
        published_at: review.published_at,
        tags_json: tagsJson
      }
    })

    const response = {
      reviews: processedReviews,
      tags: tagsResult.data
    }

    console.log(`Successfully fetched ${processedReviews.length} reviews and ${tagsResult.data.length} tags`)

    return new Response(
      JSON.stringify(response),
      {
        headers: { 
          ...corsHeaders, 
          ...rateLimitHeaders(rateLimitResult),
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in get-acervo-data function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
