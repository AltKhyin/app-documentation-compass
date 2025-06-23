
// ABOUTME: Shared API response helpers for consistent Edge Function responses

import { corsHeaders } from './cors.ts';

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

export function createErrorResponse(error: any, additionalHeaders: Record<string, string> = {}) {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  const errorCode = determineErrorCode(errorMessage);
  const statusCode = determineStatusCode(errorMessage);

  console.error('API Error:', {
    errorMessage,
    errorCode,
    statusCode
  });

  return new Response(JSON.stringify({
    error: {
      message: errorMessage,
      code: errorCode
    }
  }), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...additionalHeaders
    }
  });
}

function determineErrorCode(message: string): string {
  if (message.includes('UNAUTHORIZED')) return 'UNAUTHORIZED';
  if (message.includes('FORBIDDEN')) return 'FORBIDDEN';
  if (message.includes('Rate limit')) return 'RATE_LIMIT_EXCEEDED';
  if (message.includes('Invalid') || message.includes('required')) return 'VALIDATION_FAILED';
  return 'INTERNAL_ERROR';
}

function determineStatusCode(message: string): number {
  if (message.includes('UNAUTHORIZED')) return 401;
  if (message.includes('FORBIDDEN')) return 403;
  if (message.includes('Rate limit')) return 429;
  if (message.includes('Invalid') || message.includes('required')) return 400;
  return 500;
}

// Legacy function names for backward compatibility
export const sendSuccess = createSuccessResponse;
export const sendError = (code: string, message: string, status: number) => 
  createErrorResponse(new Error(`${code}: ${message}`));
