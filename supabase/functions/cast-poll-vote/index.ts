
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PollVoteRequest {
  poll_id: number;
  option_id: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: { message: 'Invalid authentication', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check rate limit (5 poll votes per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'cast-poll-vote', user.id, 5, 60);
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: { message: 'Rate limit exceeded', code: 'RATE_LIMIT_EXCEEDED' }
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...rateLimitHeaders(rateLimitResult)
        }
      });
    }

    const { poll_id, option_id }: PollVoteRequest = await req.json();

    console.log('Processing poll vote:', { poll_id, option_id, user_id: user.id });

    // Validate poll and option exist
    const { data: pollOption, error: optionError } = await supabase
      .from('PollOptions')
      .select('id, poll_id')
      .eq('id', option_id)
      .eq('poll_id', poll_id)
      .single();

    if (optionError || !pollOption) {
      return new Response(JSON.stringify({
        error: { message: 'Poll option not found', code: 'NOT_FOUND' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check if poll is still active
    const { data: poll, error: pollError } = await supabase
      .from('Polls')
      .select('expires_at')
      .eq('id', poll_id)
      .single();

    if (pollError || !poll) {
      return new Response(JSON.stringify({
        error: { message: 'Poll not found', code: 'NOT_FOUND' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return new Response(JSON.stringify({
        error: { message: 'Poll has expired', code: 'POLL_EXPIRED' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Upsert vote (insert or update)
    const { error: upsertError } = await supabase
      .from('PollVotes')
      .upsert({
        poll_id,
        option_id,
        practitioner_id: user.id
      }, {
        onConflict: 'poll_id,practitioner_id'
      });

    if (upsertError) {
      console.error('Failed to cast poll vote:', upsertError);
      return new Response(JSON.stringify({
        error: { message: 'Failed to cast poll vote', code: 'UPSERT_FAILED' }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log('Poll vote processed successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Poll vote processed successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...rateLimitHeaders(rateLimitResult)
      }
    });

  } catch (error) {
    console.error('Poll vote error:', error);
    
    return new Response(JSON.stringify({
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
