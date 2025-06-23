
// ABOUTME: Rate limiting utilities for Edge Functions with configurable limits and Redis-like functionality

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

// Simple in-memory rate limiting (for development - production should use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimitCheck(
  req: Request,
  functionName: string,
  limit: number = 30,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  const key = `${functionName}:${clientIP}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - windowSeconds;

  // Clean up old entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime < now) {
      rateLimitStore.delete(k);
    }
  }

  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < now) {
    // New window or expired
    const resetTime = now + windowSeconds;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
      limit
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
      limit
    };
  }

  current.count++;
  rateLimitStore.set(key, current);

  return {
    allowed: true,
    remaining: limit - current.count,
    resetTime: current.resetTime,
    limit
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
  };
}
