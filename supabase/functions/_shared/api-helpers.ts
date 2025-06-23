
// ABOUTME: Standardized API helpers following [DOC_5] mandatory 7-step Edge Function pattern

import { corsHeaders } from './cors.ts';

// Standardized error responses
export function createErrorResponse(error: Error, status: number = 500): Response {
  console.error('Edge Function Error:', error);
  
  // Parse error types for standardized responses
  let errorCode = 'INTERNAL_ERROR';
  let errorMessage = error.message || 'Internal server error';
  
  if (error.message.includes('VALIDATION_FAILED')) {
    status = 400;
    errorCode = 'VALIDATION_FAILED';
    errorMessage = error.message.replace('VALIDATION_FAILED: ', '');
  } else if (error.message.includes('UNAUTHORIZED')) {
    status = 401;
    errorCode = 'UNAUTHORIZED';
    errorMessage = error.message.replace('UNAUTHORIZED: ', '');
  } else if (error.message.includes('FORBIDDEN')) {
    status = 403;
    errorCode = 'FORBIDDEN';
    errorMessage = error.message.replace('FORBIDDEN: ', '');
  } else if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
    status = 429;
    errorCode = 'RATE_LIMIT_EXCEEDED';
    errorMessage = 'Rate limit exceeded. Please try again later.';
  }

  return new Response(JSON.stringify({
    error: {
      message: errorMessage,
      code: errorCode
    }
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Standardized success responses
export function createSuccessResponse(data: any, additionalHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders
    }
  });
}

// CORS preflight handler
export function handleCorsPreflightRequest(): Response {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Authentication helper
export async function authenticateUser(supabase: any, authHeader: string | null) {
  if (!authHeader) {
    throw new Error('UNAUTHORIZED: Authentication required');
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );
  
  if (authError || !user) {
    throw new Error('UNAUTHORIZED: Invalid authentication');
  }

  return user;
}

// Rate limit error (standardized)
export const RateLimitError = new Error('RATE_LIMIT_EXCEEDED: Rate limit exceeded');

// Input validation helper
export function validateRequiredFields(body: any, requiredFields: string[]) {
  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`VALIDATION_FAILED: ${field} is required`);
    }
  }
}
