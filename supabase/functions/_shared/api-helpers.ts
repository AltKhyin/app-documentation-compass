// ABOUTME: Centralized error handling and API utilities for consistent Edge Function responses.

// A custom error class that includes a machine-readable code
export class ApiError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

// Pre-defined errors for common cases
export const UnauthorizedError = new ApiError('Authentication required', 'UNAUTHORIZED', 401);
export const ForbiddenError = new ApiError('Insufficient permissions', 'FORBIDDEN', 403);
export const RateLimitError = new ApiError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429);
export const ValidationError = (message: string) => new ApiError(message, 'VALIDATION_FAILED', 400);
export const NotFoundError = new ApiError('Resource not found', 'NOT_FOUND', 404);

// CORS headers for all API responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// A function to turn any error into a standardized JSON response
export function createErrorResponse(error: any, additionalHeaders: Record<string, string> = {}) {
  // If it's already one of our custom API errors, use its properties
  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({ error: { message: error.message, code: error.code } }),
      { 
        status: error.status, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...additionalHeaders
        } 
      }
    );
  }

  // Otherwise, treat it as a generic internal server error
  console.error('Unhandled Internal Error:', error);
  return new Response(
    JSON.stringify({ error: { message: 'Internal Server Error', code: 'INTERNAL_ERROR' } }),
    { 
      status: 500, 
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...additionalHeaders
      } 
    }
  );
}

// Utility function to handle CORS preflight requests
export function handleCorsPreflightRequest() {
  return new Response(null, { headers: corsHeaders });
}

// Utility function to create successful JSON responses
export function createSuccessResponse(data: any, additionalHeaders: Record<string, string> = {}) {
  return new Response(
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...additionalHeaders
      }
    }
  );
}

// Utility function to validate required fields in request body
export function validateRequiredFields(body: any, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => !body[field]);
  if (missingFields.length > 0) {
    throw ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }
}

// Utility function to get authenticated user from request
export async function authenticateUser(supabase: any, authHeader: string | null) {
  if (!authHeader) {
    throw UnauthorizedError;
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (authError || !user) {
    throw UnauthorizedError;
  }

  return user;
}
