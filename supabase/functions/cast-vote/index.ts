
// ABOUTME: Edge Function to handle voting on suggestions with rate limiting and proper error handling.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// --- CORS Headers - MANDATORY FOR ALL EDGE FUNCTIONS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
}

// Rate limiting storage (in-memory for now, could be moved to Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 60 // 60 votes per minute
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds

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

interface VoteRequest {
  suggestion_id: number;
}

// Main server logic
serve(async (req: Request) => {
  // --- Handle CORS preflight requests ---
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!['POST', 'DELETE'].includes(req.method)) {
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
            message: 'Rate limit exceeded. Maximum 60 votes per minute.', 
            code: 'RATE_LIMIT_EXCEEDED' 
          } 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Parse and validate request body ---
    const body: VoteRequest = await req.json();
    
    if (!body.suggestion_id || typeof body.suggestion_id !== 'number') {
      return new Response(
        JSON.stringify({ error: { message: 'Valid suggestion_id is required', code: 'VALIDATION_ERROR' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Verify suggestion exists ---
    const { data: suggestion, error: suggestionError } = await supabase
      .from('Suggestions')
      .select('id, title')
      .eq('id', body.suggestion_id)
      .single();

    if (suggestionError || !suggestion) {
      return new Response(
        JSON.stringify({ error: { message: 'Suggestion not found', code: 'NOT_FOUND' } }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST') {
      // --- Cast vote (INSERT) ---
      const { data: vote, error: voteError } = await supabase
        .from('Suggestion_Votes')
        .insert({
          suggestion_id: body.suggestion_id,
          practitioner_id: user.id
        })
        .select('*')
        .single();

      if (voteError) {
        // Check if it's a unique constraint violation (user already voted)
        if (voteError.code === '23505') {
          return new Response(
            JSON.stringify({ 
              error: { 
                message: 'You have already voted on this suggestion', 
                code: 'ALREADY_VOTED' 
              } 
            }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.error('Error inserting vote:', voteError);
        return new Response(
          JSON.stringify({ error: { message: 'Failed to cast vote', code: 'DATABASE_ERROR' } }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`✅ Vote cast by user ${user.id} on suggestion ${body.suggestion_id}`);

      return new Response(
        JSON.stringify({ 
          data: vote,
          message: 'Vote cast successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (req.method === 'DELETE') {
      // --- Retract vote (DELETE) ---
      const { data: deletedVote, error: deleteError } = await supabase
        .from('Suggestion_Votes')
        .delete()
        .eq('suggestion_id', body.suggestion_id)
        .eq('practitioner_id', user.id)
        .select('*')
        .single();

      if (deleteError) {
        console.error('Error deleting vote:', deleteError);
        return new Response(
          JSON.stringify({ error: { message: 'Failed to retract vote', code: 'DATABASE_ERROR' } }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!deletedVote) {
        return new Response(
          JSON.stringify({ 
            error: { 
              message: 'No vote found to retract', 
              code: 'NOT_FOUND' 
            } 
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`✅ Vote retracted by user ${user.id} on suggestion ${body.suggestion_id}`);

      return new Response(
        JSON.stringify({ 
          data: deletedVote,
          message: 'Vote retracted successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Critical error in cast-vote:', error);
    return new Response(
      JSON.stringify({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
