
// ABOUTME: Edge Function for casting votes on suggestions with rate limiting and security.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CastVoteRequest {
  suggestion_id: number;
  action: 'upvote' | 'remove_vote';
}

interface CastVoteResponse {
  message: string;
  suggestion_id: number;
  action: string;
  new_vote_count: number;
  user_has_voted: boolean;
}

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 votes per minute per user

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: { message: 'No authorization header' } }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: { message: 'Unauthorized' } }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limiting
    if (!checkRateLimit(user.id)) {
      console.warn(`Rate limit exceeded for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: { message: 'Rate limit exceeded. Please try again later.' } }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { suggestion_id, action }: CastVoteRequest = await req.json();

    console.log(`User ${user.id} attempting to ${action} on suggestion ${suggestion_id}`);

    // Validate input
    if (!suggestion_id || !action || !['upvote', 'remove_vote'].includes(action)) {
      return new Response(
        JSON.stringify({ error: { message: 'Invalid request parameters' } }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if suggestion exists
    const { data: suggestion, error: suggestionError } = await supabase
      .from('Suggestions')
      .select('id, upvotes')
      .eq('id', suggestion_id)
      .single();

    if (suggestionError || !suggestion) {
      console.error('Suggestion lookup error:', suggestionError);
      return new Response(
        JSON.stringify({ error: { message: 'Suggestion not found' } }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user has already voted
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('Suggestion_Votes')
      .select('id')
      .eq('suggestion_id', suggestion_id)
      .eq('practitioner_id', user.id)
      .maybeSingle();

    if (voteCheckError) {
      console.error('Error checking existing vote:', voteCheckError);
      return new Response(
        JSON.stringify({ error: { message: 'Database error' } }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let result: Partial<CastVoteResponse>;
    let new_vote_count: number;
    let user_has_voted: boolean;

    if (action === 'upvote') {
      if (existingVote) {
        return new Response(
          JSON.stringify({ error: { message: 'You have already voted on this suggestion' } }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Insert new vote
      const { error: insertError } = await supabase
        .from('Suggestion_Votes')
        .insert({
          suggestion_id,
          practitioner_id: user.id
        });

      if (insertError) {
        console.error('Error inserting vote:', insertError);
        return new Response(
          JSON.stringify({ error: { message: 'Failed to cast vote' } }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      new_vote_count = suggestion.upvotes + 1;
      user_has_voted = true;
      result = { message: 'Vote cast successfully', suggestion_id, action: 'upvote' };

    } else if (action === 'remove_vote') {
      if (!existingVote) {
        return new Response(
          JSON.stringify({ error: { message: 'You have not voted on this suggestion' } }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Remove existing vote
      const { error: deleteError } = await supabase
        .from('Suggestion_Votes')
        .delete()
        .eq('id', existingVote.id);

      if (deleteError) {
        console.error('Error removing vote:', deleteError);
        return new Response(
          JSON.stringify({ error: { message: 'Failed to remove vote' } }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      new_vote_count = suggestion.upvotes - 1;
      user_has_voted = false;
      result = { message: 'Vote removed successfully', suggestion_id, action: 'remove_vote' };
    }

    console.log(`Vote ${action} successful for user ${user.id} on suggestion ${suggestion_id}. New count: ${new_vote_count}`);

    return new Response(
      JSON.stringify({
        ...result,
        new_vote_count,
        user_has_voted
      } as CastVoteResponse),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error in cast-suggestion-vote:', error);
    return new Response(
      JSON.stringify({ error: { message: 'Internal server error' } }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
