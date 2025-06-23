
// ABOUTME: Centralized CORS configuration for all Edge Functions following DOC_5 specifications

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

export const handleCorsPreflightRequest = () => {
  return new Response(null, { 
    headers: corsHeaders,
    status: 200 
  });
};
