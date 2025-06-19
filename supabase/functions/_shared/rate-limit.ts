
// ABOUTME: Shared rate limiting utility for edge functions using database-based tracking.

interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetTime?: number;
}

export async function rateLimit(
  supabase: any,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    const now = Math.floor(Date.now() /  1000);
    const windowStart = now - windowSeconds;
    
    // Clean old entries
    await supabase
      .from('rate_limit_log')
      .delete()
      .lt('timestamp', windowStart);
    
    // Count current requests in window
    const { count, error: countError } = await supabase
      .from('rate_limit_log')
      .select('*', { count: 'exact' })
      .eq('key', key)
      .gte('timestamp', windowStart);
    
    if (countError) {
      console.error('Rate limit count error:', countError);
      // Allow request if we can't check rate limit
      return { allowed: true };
    }
    
    if ((count || 0) >= limit) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: windowStart + windowSeconds
      };
    }
    
    // Log this request
    const { error: insertError } = await supabase
      .from('rate_limit_log')
      .insert({
        key: key,
        timestamp: now
      });
    
    if (insertError) {
      console.error('Rate limit log error:', insertError);
    }
    
    return { 
      allowed: true, 
      remaining: limit - (count || 0) - 1,
      resetTime: windowStart + windowSeconds
    };
    
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Allow request if rate limiting fails
    return { allowed: true };
  }
}
