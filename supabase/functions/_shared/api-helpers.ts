
// ABOUTME: Standardized API helpers for Edge Functions with authentication and response formatting

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from './cors.ts';

export function createSuccessResponse(data: any, additionalHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders,
    },
  });
}

export function createErrorResponse(error: any, additionalHeaders: Record<string, string> = {}): Response {
  console.error('Edge Function Error:', error);
  
  const errorMessage = error?.message || 'An unexpected error occurred';
  const errorCode = error?.code || 'INTERNAL_SERVER_ERROR';
  
  let status = 500;
  if (errorMessage.includes('UNAUTHORIZED')) status = 401;
  else if (errorMessage.includes('FORBIDDEN')) status = 403;
  else if (errorMessage.includes('VALIDATION_FAILED')) status = 400;
  else if (errorMessage.includes('RATE_LIMIT_EXCEEDED')) status = 429;

  return new Response(JSON.stringify({
    error: {
      message: errorMessage,
      code: errorCode
    }
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders,
    },
  });
}

export async function authenticateUser(supabase: any, authHeader: string | null) {
  if (!authHeader) {
    throw new Error('UNAUTHORIZED: Authorization header is required');
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    throw new Error('UNAUTHORIZED: Invalid authentication token');
  }

  return user;
}
