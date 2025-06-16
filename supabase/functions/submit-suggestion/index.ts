
// ABOUTME: Edge Function to handle new topic suggestions with rate limiting and validation.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// --- CORS Headers - MANDATORY FOR ALL EDGE FUNCTIONS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Rate limiting storage (in-memory for now, could be moved to Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 5 // 5 submissions per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now()
  const userLimit = rateLimitMap.get(userId)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new rate limit entry
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  userLimit.count++
  return true
}

interface SubmissionRequest {
  title: string;
  description?: string;
}

// Main server logic
serve(async (req: Request) => {
  // --- Handle CORS preflight requests ---
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' } }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase: SupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --- Get the authenticated user ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: { message: 'Authentication required', code: 'UNAUTHORIZED' } }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: { message: 'Invalid authentication', code: 'UNAUTHORIZED' } }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Rate limiting check ---
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ 
          error: { 
            message: 'Rate limit exceeded. Maximum 5 suggestions per hour.', 
            code: 'RATE_LIMIT_EXCEEDED' 
          } 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Parse and validate request body ---
    const body: SubmissionRequest = await req.json();
    
    if (!body.title || typeof body.title !== 'string') {
      return new Response(
        JSON.stringify({ error: { message: 'Title is required', code: 'VALIDATION_ERROR' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const title = body.title.trim();
    if (title.length < 5 || title.length > 200) {
      return new Response(
        JSON.stringify({ 
          error: { 
            message: 'Title must be between 5 and 200 characters', 
            code: 'VALIDATION_ERROR' 
          } 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const description = body.description?.trim() || null;
    if (description && description.length > 1000) {
      return new Response(
        JSON.stringify({ 
          error: { 
            message: 'Description must be less than 1000 characters', 
            code: 'VALIDATION_ERROR' 
          } 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Insert new suggestion ---
    const { data: suggestion, error: insertError } = await supabase
      .from('Suggestions')
      .insert({
        title,
        description,
        submitted_by: user.id,
        status: 'pending',
        upvotes: 0
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error inserting suggestion:', insertError);
      return new Response(
        JSON.stringify({ error: { message: 'Failed to submit suggestion', code: 'DATABASE_ERROR' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ New suggestion submitted by user ${user.id}: "${title}"`);

    return new Response(
      JSON.stringify({ 
        data: suggestion,
        message: 'Suggestion submitted successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Critical error in submit-suggestion:', error);
    return new Response(
      JSON.stringify({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
