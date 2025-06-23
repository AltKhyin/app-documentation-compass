
// ABOUTME: Shared API helpers for Edge Functions including authentication, CORS, and response formatting

import { corsHeaders } from './cors.ts';

// Helper for handling CORS preflight requests
export function handleCorsPreflightRequest() {
  return new Response(null, { headers: corsHeaders });
}

// Helper for authenticating users manually
export async function authenticateUser(supabase: any, authHeader: string | null) {
  if (!authHeader) {
    throw new Error('UNAUTHORIZED: Authorization header is required');
  }

  const { data: { user }, error } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (error || !user) {
    throw new Error('UNAUTHORIZED: Invalid authentication token');
  }

  return user;
}

// Helper for creating standardized success responses
export function createSuccessResponse(data: any, additionalHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders
    }
  });
}

// Helper for sending success responses (alias for backward compatibility)
export function sendSuccess(data: any, additionalHeaders: Record<string, string> = {}) {
  return createSuccessResponse(data, additionalHeaders);
}

// Helper for creating standardized error responses
export function createErrorResponse(error: any, statusCode: number = 500) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = error.code || 'INTERNAL_ERROR';

  console.error('API Error:', { errorMessage, errorCode, statusCode });

  return new Response(JSON.stringify({
    error: {
      message: errorMessage,
      code: errorCode
    }
  }), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Helper for sending error responses with specific codes
export function sendError(code: string, message: string, statusCode: number = 500) {
  return new Response(JSON.stringify({
    error: {
      message,
      code
    }
  }), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Rate limit error class
export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}
