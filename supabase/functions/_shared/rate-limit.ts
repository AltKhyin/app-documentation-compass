
// ABOUTME: Centralized rate limiting utility for all Edge Functions with configurable limits.

export interface RateLimitConfig {
  requests: number;
  window: number; // seconds
  identifier?: string; // custom identifier, defaults to user ID
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'get-homepage-feed': { requests: 60, window: 60 }, // 1 req/sec per user
  'get-acervo-data': { requests: 30, window: 60 }, // 30 req/min per user
  'get-community-feed': { requests: 30, window: 60 }, // 30 req/min per user
  'get-community-sidebar-data': { requests: 20, window: 60 }, // 20 req/min per user
  'submit-suggestion': { requests: 5, window: 300 }, // 5 req/5min per user
  'cast-suggestion-vote': { requests: 10, window: 60 }, // 10 votes/min per user
  'cast-community-vote': { requests: 20, window: 60 }, // 20 votes/min per user
  'cast-poll-vote': { requests: 20, window: 60 }, // 20 votes/min per user
  'cast-vote': { requests: 20, window: 60 }, // 20 votes/min per user (legacy)
  'create-community-post': { requests: 5, window: 300 }, // 5 posts/5min per user
  'moderate-community-post': { requests: 10, window: 60 }, // 10 actions/min per moderator
  'get-personalized-recommendations': { requests: 10, window: 60 }, // 10 req/min per user
};

export async function checkRateLimit(
  supabase: any,
  functionName: string,
  userId: string,
  customRequests?: number,
  customWindow?: number
): Promise<{ allowed: boolean; remaining?: number; resetTime?: number }> {
  const config = RATE_LIMITS[functionName];
  
  // Use custom limits if provided, otherwise fall back to config
  const requests = customRequests ?? config?.requests;
  const window = customWindow ?? config?.window;
  
  if (!requests || !window) {
    // No rate limit configured, allow request
    return { allowed: true };
  }

  const identifier = userId;
  const key = `${functionName}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - window;

  try {
    // Check current request count in the time window
    const { data: requests: requestHistory, error } = await supabase
      .from('rate_limit_log')
      .select('timestamp')
      .eq('key', key)
      .gte('timestamp', windowStart);

    if (error) {
      console.error('Rate limit check error:', error);
      // On error, allow request (fail open)
      return { allowed: true };
    }

    const currentCount = requestHistory?.length || 0;
    
    if (currentCount >= requests) {
      const oldestRequest = Math.min(...requestHistory.map(r => r.timestamp));
      const resetTime = oldestRequest + window;
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime 
      };
    }

    // Log this request
    await supabase
      .from('rate_limit_log')
      .insert({ key, timestamp: now });

    // Clean up old entries (optional, for performance)
    await supabase
      .from('rate_limit_log')
      .delete()
      .eq('key', key)
      .lt('timestamp', windowStart);

    return { 
      allowed: true, 
      remaining: requests - currentCount - 1 
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow request (fail open)
    return { allowed: true };
  }
}

export function rateLimitHeaders(result: { allowed: boolean; remaining?: number; resetTime?: number }) {
  const headers: Record<string, string> = {};
  
  if (result.remaining !== undefined) {
    headers['X-RateLimit-Remaining'] = result.remaining.toString();
  }
  
  if (result.resetTime !== undefined) {
    headers['X-RateLimit-Reset'] = result.resetTime.toString();
  }
  
  return headers;
}
