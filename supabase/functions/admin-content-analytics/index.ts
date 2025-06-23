
// ABOUTME: Advanced content analytics Edge Function for comprehensive content performance insights

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';
import { createSuccessResponse, createErrorResponse, authenticateUser } from '../_shared/api-helpers.ts';
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts';

interface ContentAnalyticsQuery {
  type: 'performance' | 'trends' | 'authors' | 'categories' | 'workflow' | 'comprehensive';
  contentType: 'reviews' | 'community_posts' | 'all';
  startDate?: string;
  endDate?: string;
  granularity?: 'daily' | 'weekly' | 'monthly';
}

Deno.serve(async (req) => {
  // STEP 1: CORS Preflight Handling (MANDATORY FIRST)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // STEP 2: Manual Authentication (requires verify_jwt = false in config.toml)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const user = await authenticateUser(supabase, req.headers.get('Authorization'));
    
    // Verify admin/editor role for content analytics
    const { data: hasRole, error: roleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'admin' 
      });
    
    const { data: hasEditorRole, error: editorRoleError } = await supabase
      .rpc('user_has_role', { 
        p_user_id: user.id, 
        p_role_name: 'editor' 
      });

    if (roleError || editorRoleError || (!hasRole && !hasEditorRole)) {
      throw new Error('FORBIDDEN: Content analytics requires admin or editor role');
    }

    // STEP 3: Rate Limiting Implementation
    const rateLimitResult = await checkRateLimit(supabase, 'admin-content-analytics', user.id);
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

    // STEP 4: Input Parsing & Validation
    const url = new URL(req.url);
    const query: ContentAnalyticsQuery = {
      type: (url.searchParams.get('type') as any) || 'comprehensive',
      contentType: (url.searchParams.get('content_type') as any) || 'all',
      startDate: url.searchParams.get('start_date') || undefined,
      endDate: url.searchParams.get('end_date') || undefined,
      granularity: (url.searchParams.get('granularity') as any) || 'daily'
    };

    console.log('Content analytics request:', query);

    // STEP 5: Core Business Logic Execution
    let result;

    switch (query.type) {
      case 'performance':
        result = await getContentPerformanceAnalytics(supabase, query);
        break;
      
      case 'trends':
        result = await getContentTrendsAnalytics(supabase, query);
        break;
      
      case 'authors':
        result = await getAuthorAnalytics(supabase, query);
        break;
      
      case 'categories':
        result = await getCategoryAnalytics(supabase, query);
        break;
      
      case 'workflow':
        result = await getWorkflowAnalytics(supabase, query);
        break;
      
      case 'comprehensive':
        result = await getComprehensiveContentAnalytics(supabase, query);
        break;
      
      default:
        throw new Error(`Invalid analytics type: ${query.type}`);
    }

    // STEP 6: Standardized Success Response
    return createSuccessResponse(result, rateLimitHeaders(rateLimitResult));

  } catch (error) {
    // STEP 7: Centralized Error Handling
    console.error('Content analytics error:', error);
    return createErrorResponse(error);
  }
});

// Content performance analytics
async function getContentPerformanceAnalytics(supabase: any, query: ContentAnalyticsQuery) {
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  let result: any = { type: 'performance', timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() } };

  if (query.contentType === 'reviews' || query.contentType === 'all') {
    const { data: reviews, error: reviewsError } = await supabase
      .from('Reviews')
      .select('id, title, view_count, status, created_at, published_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (reviewsError) {
      throw new Error(`Failed to fetch reviews: ${reviewsError.message}`);
    }

    result.reviews = {
      total: reviews.length,
      published: reviews.filter(r => r.status === 'published').length,
      totalViews: reviews.reduce((sum, r) => sum + (r.view_count || 0), 0),
      avgViews: reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.view_count || 0), 0) / reviews.length : 0,
      topPerforming: reviews
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 10)
    };
  }

  if (query.contentType === 'community_posts' || query.contentType === 'all') {
    const { data: posts, error: postsError } = await supabase
      .from('CommunityPosts')
      .select('id, title, upvotes, downvotes, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (postsError) {
      throw new Error(`Failed to fetch community posts: ${postsError.message}`);
    }

    result.communityPosts = {
      total: posts.length,
      totalUpvotes: posts.reduce((sum, p) => sum + (p.upvotes || 0), 0),
      totalDownvotes: posts.reduce((sum, p) => sum + (p.downvotes || 0), 0),
      avgEngagement: posts.length > 0 ? posts.reduce((sum, p) => sum + (p.upvotes || 0) + (p.downvotes || 0), 0) / posts.length : 0,
      topPerforming: posts
        .sort((a, b) => ((b.upvotes || 0) + (b.downvotes || 0)) - ((a.upvotes || 0) + (a.downvotes || 0)))
        .slice(0, 10)
    };
  }

  return result;
}

// Content trends analytics
async function getContentTrendsAnalytics(supabase: any, query: ContentAnalyticsQuery) {
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  let result: any = { 
    type: 'trends', 
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    granularity: query.granularity 
  };

  if (query.contentType === 'reviews' || query.contentType === 'all') {
    const { data: reviews, error } = await supabase
      .from('Reviews')
      .select('created_at, published_at, status')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch reviews for trends: ${error.message}`);
    }

    result.reviewTrends = {
      creationTrend: groupByTimeGranularity(reviews, query.granularity || 'daily'),
      publicationTrend: groupByTimeGranularity(
        reviews.filter(r => r.published_at).map(r => ({ created_at: r.published_at })), 
        query.granularity || 'daily'
      )
    };
  }

  if (query.contentType === 'community_posts' || query.contentType === 'all') {
    const { data: posts, error } = await supabase
      .from('CommunityPosts')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch community posts for trends: ${error.message}`);
    }

    result.communityPostTrends = {
      creationTrend: groupByTimeGranularity(posts, query.granularity || 'daily')
    };
  }

  return result;
}

// Author analytics
async function getAuthorAnalytics(supabase: any, query: ContentAnalyticsQuery) {
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  let result: any = { type: 'authors', timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() } };

  if (query.contentType === 'reviews' || query.contentType === 'all') {
    const { data: reviewStats, error } = await supabase
      .from('Reviews')
      .select(`
        author_id,
        view_count,
        status,
        Practitioners!inner(full_name)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch review author stats: ${error.message}`);
    }

    // Group by author
    const authorStats: { [key: string]: any } = {};
    reviewStats.forEach(review => {
      const authorId = review.author_id;
      if (!authorStats[authorId]) {
        authorStats[authorId] = {
          authorId,
          authorName: review.Practitioners?.full_name,
          totalReviews: 0,
          publishedReviews: 0,
          totalViews: 0
        };
      }
      authorStats[authorId].totalReviews++;
      if (review.status === 'published') {
        authorStats[authorId].publishedReviews++;
      }
      authorStats[authorId].totalViews += review.view_count || 0;
    });

    result.reviewAuthors = Object.values(authorStats)
      .sort((a: any, b: any) => b.totalViews - a.totalViews)
      .slice(0, 20);
  }

  return result;
}

// Category analytics
async function getCategoryAnalytics(supabase: any, query: ContentAnalyticsQuery) {
  let result: any = { type: 'categories' };

  if (query.contentType === 'community_posts' || query.contentType === 'all') {
    const { data: categoryStats, error } = await supabase
      .from('CommunityPosts')
      .select('category, upvotes, downvotes')
      .not('category', 'is', null);

    if (error) {
      throw new Error(`Failed to fetch category stats: ${error.message}`);
    }

    // Group by category
    const categoryAnalytics: { [key: string]: any } = {};
    categoryStats.forEach(post => {
      const category = post.category;
      if (!categoryAnalytics[category]) {
        categoryAnalytics[category] = {
          category,
          totalPosts: 0,
          totalUpvotes: 0,
          totalDownvotes: 0,
          avgEngagement: 0
        };
      }
      categoryAnalytics[category].totalPosts++;
      categoryAnalytics[category].totalUpvotes += post.upvotes || 0;
      categoryAnalytics[category].totalDownvotes += post.downvotes || 0;
    });

    // Calculate average engagement
    Object.values(categoryAnalytics).forEach((cat: any) => {
      cat.avgEngagement = cat.totalPosts > 0 ? (cat.totalUpvotes + cat.totalDownvotes) / cat.totalPosts : 0;
    });

    result.categories = Object.values(categoryAnalytics)
      .sort((a: any, b: any) => b.avgEngagement - a.avgEngagement);
  }

  return result;
}

// Workflow analytics
async function getWorkflowAnalytics(supabase: any, query: ContentAnalyticsQuery) {
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Get publication history data
  const { data: publicationHistory, error } = await supabase
    .from('Publication_History')
    .select('action, created_at, review_id')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    throw new Error(`Failed to fetch publication history: ${error.message}`);
  }

  // Get review status distribution
  const { data: reviewStatusStats, error: statusError } = await supabase
    .from('Reviews')
    .select('review_status')
    .not('review_status', 'is', null);

  if (statusError) {
    throw new Error(`Failed to fetch review status stats: ${statusError.message}`);
  }

  // Group workflow actions
  const workflowActions = groupBy(publicationHistory, 'action');
  const statusDistribution = groupBy(reviewStatusStats, 'review_status');

  return {
    type: 'workflow',
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    workflowActions,
    statusDistribution,
    totalWorkflowEvents: publicationHistory.length,
    avgProcessingTime: calculateAvgProcessingTime(publicationHistory)
  };
}

// Comprehensive content analytics
async function getComprehensiveContentAnalytics(supabase: any, query: ContentAnalyticsQuery) {
  const [performance, trends, authors, categories, workflow] = await Promise.all([
    getContentPerformanceAnalytics(supabase, query),
    getContentTrendsAnalytics(supabase, query),
    getAuthorAnalytics(supabase, query),
    getCategoryAnalytics(supabase, query),
    getWorkflowAnalytics(supabase, query)
  ]);

  return {
    type: 'comprehensive',
    generatedAt: new Date().toISOString(),
    performance,
    trends,
    authors,
    categories,
    workflow
  };
}

// Helper functions
function groupByTimeGranularity(data: any[], granularity: string) {
  const grouped: { [key: string]: number } = {};
  
  data.forEach(item => {
    const date = new Date(item.created_at);
    let key: string;
    
    switch (granularity) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    grouped[key] = (grouped[key] || 0) + 1;
  });
  
  return grouped;
}

function groupBy(array: any[], key: string) {
  return array.reduce((acc, item) => {
    const group = item[key];
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
}

function calculateAvgProcessingTime(history: any[]) {
  // This is a simplified calculation
  // In a real implementation, you'd track time between status changes
  return 0; // Placeholder
}
