
// ABOUTME: Centralized rate limiting utilities for Edge Functions with comprehensive error handling

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// Rate limiting storage (in-memory for Edge Functions)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(
  supabase: any,
  functionName: string,
  userId: string,
  maxRequests: number = 30,
  windowMs: number = 60 * 1000
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = `${functionName}:${userId}`;
  const userLimit = rateLimitStore.get(key);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  if (userLimit.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: userLimit.resetTime };
  }
  
  // Increment count
  userLimit.count++;
  return { allowed: true, remaining: maxRequests - userLimit.count, resetTime: userLimit.resetTime };
}

export function rateLimitHeaders(rateLimit: RateLimitResult) {
  return {
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
  };
}
