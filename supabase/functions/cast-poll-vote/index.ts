
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { checkRateLimit, rateLimitHeaders } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CastPollVotePayload {
  poll_id: number;
  option_id: number;
}

interface PollVoteResponse {
  success: boolean;
  message: string;
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

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: { message: 'Invalid authentication', code: 'UNAUTHORIZED' }
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Check rate limit (10 votes per 60 seconds)
    const rateLimitResult = await checkRateLimit(supabase, 'cast-poll-vote', user.id, 10, 60);
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

    // Parse request body
    const payload: CastPollVotePayload = await req.json();
    const { poll_id, option_id } = payload;

    if (!poll_id || !option_id) {
      return new Response(JSON.stringify({
        error: { message: 'Missing poll_id or option_id', code: 'BAD_REQUEST' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    console.log(`Casting poll vote: user=${user.id}, poll=${poll_id}, option=${option_id}`);

    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from('Polls')
      .select('id, expires_at')
      .eq('id', poll_id)
      .maybeSingle();

    if (pollError || !poll) {
      return new Response(JSON.stringify({
        error: { message: 'Poll not found', code: 'NOT_FOUND' }
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return new Response(JSON.stringify({
        error: { message: 'Poll has expired', code: 'POLL_EXPIRED' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Check if option exists for this poll
    const { data: option, error: optionError } = await supabase
      .from('PollOptions')
      .select('id')
      .eq('id', option_id)
      .eq('poll_id', poll_id)
      .maybeSingle();

    if (optionError || !option) {
      return new Response(JSON.stringify({
        error: { message: 'Poll option not found', code: 'NOT_FOUND' }
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Check if user has already voted on this poll
    const { data: existingVote } = await supabase
      .from('PollVotes')
      .select('id, option_id')
      .eq('poll_id', poll_id)
      .eq('practitioner_id', user.id)
      .maybeSingle();

    if (existingVote) {
      if (existingVote.option_id === option_id) {
        // Same vote - do nothing
        return new Response(JSON.stringify({
          success: true,
          message: 'Vote already cast for this option'
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...rateLimitHeaders(rateLimitResult)
          }
        });
      } else {
        // Update existing vote
        const { error: updateError } = await supabase
          .from('PollVotes')
          .update({ option_id: option_id })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error('Poll vote update error:', updateError);
          return new Response(JSON.stringify({
            error: { message: 'Failed to update vote', code: 'UPDATE_FAILED' }
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        console.log('Poll vote updated successfully');
        return new Response(JSON.stringify({
          success: true,
          message: 'Vote updated successfully'
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...rateLimitHeaders(rateLimitResult)
          }
        });
      }
    } else {
      // Cast new vote
      const { error: insertError } = await supabase
        .from('PollVotes')
        .insert({
          poll_id: poll_id,
          option_id: option_id,
          practitioner_id: user.id
        });

      if (insertError) {
        console.error('Poll vote insert error:', insertError);
        return new Response(JSON.stringify({
          error: { message: 'Failed to cast vote', code: 'INSERT_FAILED' }
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      console.log('Poll vote cast successfully');
      return new Response(JSON.stringify({
        success: true,
        message: 'Vote cast successfully'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
          ...rateLimitHeaders(rateLimitResult)
        }
      });
    }

  } catch (error) {
    console.error('Poll vote casting error:', error);
    
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
