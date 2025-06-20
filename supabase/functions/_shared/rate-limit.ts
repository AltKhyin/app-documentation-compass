
// ABOUTME: Centralized rate limiting utility for all edge functions with consistent exports.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check rate limit for a given key and user
 * @param supabase - Supabase client instance
 * @param key - Rate limit key (e.g., 'create-post:user-id')
 * @param limit - Maximum requests allowed
 * @param windowSeconds - Time window in seconds
 * @returns Promise<RateLimitResult>
 */
export async function checkRateLimit(
  supabase: any,
  key: string,
  limit: number,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - windowSeconds;

  try {
    // Clean up old entries
    await supabase
      .from('rate_limit_log')
      .delete()
      .lt('created_at', new Date((now - windowSeconds) * 1000).toISOString());

    // Count recent requests
    const { data: recentRequests, error } = await supabase
      .from('rate_limit_log')
      .select('*')
      .eq('key', key)
      .gte('created_at', new Date(windowStart * 1000).toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      // Allow request on error to prevent blocking users
      return { allowed: true, remaining: limit, resetTime: now + windowSeconds };
    }

    const requestCount = recentRequests?.length || 0;

    if (requestCount >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: now + windowSeconds
      };
    }

    // Log this request
    await supabase
      .from('rate_limit_log')
      .insert({
        key,
        created_at: new Date().toISOString()
      });

    return {
      allowed: true,
      remaining: limit - requestCount - 1,
      resetTime: now + windowSeconds
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Allow request on error
    return { allowed: true, remaining: limit, resetTime: now + windowSeconds };
  }
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use checkRateLimit instead
 */
export const rateLimit = checkRateLimit;

/**
 * Generate rate limit headers for HTTP responses
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
  };
}
