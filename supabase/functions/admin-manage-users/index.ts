
// ABOUTME: User management Edge Function using standardized 7-step pattern

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCorsPrelight } from '../_shared/cors.ts';
import { checkAdminRateLimit } from '../_shared/rate-limit.ts';
import { authenticateRequest, requireRole } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  // STEP 1: Handle CORS preflight
  const corsResponse = handleCorsPrelight(req);
  if (corsResponse) return corsResponse;

  try {
    // STEP 2: Rate limiting (admin-specific)
    const rateLimitResult = await checkAdminRateLimit(req);
    if (!rateLimitResult.success) {
      return new Response(JSON.stringify({ 
        error: rateLimitResult.error || 'Rate limit exceeded',
        details: 'Too many admin requests'
      }), {
        status: 429,
        headers: { ...corsHeaders, ...rateLimitResult.headers, 'Content-Type': 'application/json' },
      });
    }

    // STEP 3: Authentication
    const authResult = await authenticateRequest(req);
    if (!authResult.success) {
      return new Response(JSON.stringify({ 
        error: authResult.error || 'Authentication failed',
        details: 'Invalid or missing authentication'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 4: Authorization (admin role required for user management)
    const roleCheck = requireRole(authResult.user, ['admin']);
    if (!roleCheck.success) {
      return new Response(JSON.stringify({ 
        error: roleCheck.error || 'Insufficient permissions',
        details: 'Admin role required for user management'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 5: Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // STEP 6: Business Logic - Handle different HTTP methods
    if (req.method === 'GET') {
      // Handle GET request - fetch users list
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const search = url.searchParams.get('search') || '';
      const role = url.searchParams.get('role') || '';

      console.log('Fetching users:', { page, limit, search, role });

      // Build query
      let query = supabase
        .from('Practitioners')
        .select(`
          id,
          full_name,
          avatar_url,
          role,
          subscription_tier,
          profession_flair,
          display_hover_card,
          contribution_score,
          created_at
        `);

      // Apply filters
      if (search) {
        query = query.or(`full_name.ilike.%${search}%`);
      }

      if (role && role !== 'all') {
        query = query.eq('role', role);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: users, error: usersError } = await query;

      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw new Error(`Database error: ${usersError.message}`);
      }

      // Get total count
      let countQuery = supabase
        .from('Practitioners')
        .select('id', { count: 'exact', head: true });

      if (search) {
        countQuery = countQuery.or(`full_name.ilike.%${search}%`);
      }

      if (role && role !== 'all') {
        countQuery = countQuery.eq('role', role);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Error getting user count:', countError);
        throw new Error(`Count error: ${countError.message}`);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      const response = {
        users: users || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      };

      // STEP 7: Return success response
      return new Response(JSON.stringify(response), {
        headers: { 
          ...corsHeaders, 
          ...rateLimitResult.headers,
          'Content-Type': 'application/json' 
        },
      });

    } else if (req.method === 'POST') {
      // Handle POST request - update user role/subscription and profile data
      const body = await req.json();
      const { 
        userId, 
        role: newRole, 
        subscriptionTier,
        full_name,
        profession_flair,
        display_hover_card
      } = body;

      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log('Updating user:', { 
        userId, 
        newRole, 
        subscriptionTier,
        full_name,
        profession_flair,
        display_hover_card
      });

      // Update user in Practitioners table
      const updateData: any = {};
      if (newRole !== undefined) updateData.role = newRole;
      if (subscriptionTier !== undefined) updateData.subscription_tier = subscriptionTier;
      if (full_name !== undefined) updateData.full_name = full_name;
      if (profession_flair !== undefined) updateData.profession_flair = profession_flair;
      if (display_hover_card !== undefined) updateData.display_hover_card = display_hover_card;

      const { data: updatedUser, error: updateError } = await supabase
        .from('Practitioners')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw new Error(`Update error: ${updateError.message}`);
      }

      // If role was updated, also update auth.users metadata
      if (newRole) {
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          userId,
          {
            app_metadata: {
              role: newRole,
              subscription_tier: subscriptionTier || updatedUser.subscription_tier,
            },
          }
        );

        if (authUpdateError) {
          console.error('Error updating auth metadata:', authUpdateError);
          // Don't throw here, as the main update succeeded
        }
      }

      // STEP 7: Return success response
      return new Response(JSON.stringify({
        success: true,
        user: updatedUser,
        message: 'User updated successfully',
      }), {
        headers: { 
          ...corsHeaders, 
          ...rateLimitResult.headers,
          'Content-Type': 'application/json' 
        },
      });

    } else {
      throw new Error('Method not allowed');
    }

  } catch (error) {
    console.error('User management error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const statusCode = errorMessage.includes('authentication') ? 401 :
                      errorMessage.includes('permissions') ? 403 :
                      errorMessage.includes('Method not allowed') ? 405 : 500;

    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'User management operation failed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  }
});
