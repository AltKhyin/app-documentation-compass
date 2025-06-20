
// ABOUTME: Centralized rate limiting utility for all edge functions.

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export async function checkRateLimit(
  supabase: SupabaseClient,
  identifier: string,
  limit: number,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - (windowSeconds * 1000));

  try {
    // Clean old entries using the correct column name 'key'
    await supabase
      .from('rate_limit_log')
      .delete()
      .lt('created_at', windowStart.toISOString());

    // Count current requests in window using 'key' column
    const { count, error } = await supabase
      .from('rate_limit_log')
      .select('*', { count: 'exact' })
      .eq('key', identifier)
      .gte('created_at', windowStart.toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      // Allow request on error to avoid blocking legitimate traffic
      return {
        allowed: true,
        limit,
        remaining: limit - 1,
        resetTime: new Date(now.getTime() + (windowSeconds * 1000))
      };
    }

    const currentCount = count || 0;
    const remaining = Math.max(0, limit - currentCount - 1);

    if (currentCount >= limit) {
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetTime: new Date(now.getTime() + (windowSeconds * 1000)),
        retryAfter: windowSeconds
      };
    }

    // Log this request using the correct column structure
    await supabase
      .from('rate_limit_log')
      .insert({
        key: identifier,
        timestamp: Math.floor(now.getTime() / 1000),
        created_at: now.toISOString()
      });

    return {
      allowed: true,
      limit,
      remaining,
      resetTime: new Date(now.getTime() + (windowSeconds * 1000))
    };

  } catch (error) {
    console.error('Rate limiting error:', error);
    // Allow request on error
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetTime: new Date(now.getTime() + (windowSeconds * 1000))
    };
  }
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime.getTime() / 1000).toString(),
  };

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}
