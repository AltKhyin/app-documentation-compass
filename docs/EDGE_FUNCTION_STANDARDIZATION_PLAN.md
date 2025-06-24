
# Edge Function Standardization Implementation Plan

**Version:** 1.0  
**Date:** June 24, 2025  
**Purpose:** Track the systematic standardization of all Edge Functions to the mandatory 7-step pattern defined in [DOC_5] Section 1.5

---

## IMPLEMENTATION STATUS TRACKER

### Phase 1: Shared Utilities Foundation ✅ COMPLETED
- [x] **cors.ts**: Standardized CORS handling
- [x] **auth.ts**: Centralized authentication and authorization
- [x] **rate-limit.ts**: Proper Deno Request handling with database fallback

### Phase 2: Critical Admin Functions 🔄 IN PROGRESS
- [ ] **admin-analytics/index.ts**: Analytics dashboard (PRIORITY 1)
- [ ] **get-analytics-dashboard-data/index.ts**: Dashboard data fetching
- [ ] **admin-manage-users/index.ts**: User management operations

### Phase 3: Core Application Functions ⏳ PENDING
- [ ] **get-homepage-feed/index.ts**: Homepage data
- [ ] **get-community-page-data/index.ts**: Community feed
- [ ] **get-acervo-data/index.ts**: Acervo filtering
- [ ] **create-community-post/index.ts**: Post creation
- [ ] **cast-vote/index.ts**: Voting system

### Phase 4: Verification & Testing ⏳ PENDING
- [ ] Function deployment verification
- [ ] End-to-end testing of admin dashboard
- [ ] Performance optimization review

---

## THE CANONICAL 7-STEP PATTERN

Every Edge Function MUST implement this exact structure:

```typescript
// STEP 1: CORS Preflight Handling
const corsResponse = handleCorsPrelight(req);
if (corsResponse) return corsResponse;

try {
  // STEP 2: Rate Limiting
  const rateLimitResult = await checkRateLimit(req);
  if (!rateLimitResult.success) return rateLimitError(rateLimitResult);

  // STEP 3: Authentication
  const authResult = await authenticateRequest(req);
  if (!authResult.success) return authError(authResult);

  // STEP 4: Authorization
  const roleCheck = requireRole(authResult.user, ['required', 'roles']);
  if (!roleCheck.success) return authorizationError(roleCheck);

  // STEP 5: Client Creation
  const supabase = createClient(/* service role config */);

  // STEP 6: Business Logic
  // Function-specific implementation

  // STEP 7: Structured Response
  return successResponse(result, rateLimitHeaders);

} catch (error) {
  return errorResponse(error);
}
```

---

## CRITICAL FIXES IMPLEMENTED

### 1. Rate Limiting Architecture
- **Problem**: `req.headers.get is not a function` errors
- **Solution**: Proper Deno Request object handling in rate-limit.ts
- **Status**: ✅ FIXED

### 2. CORS Handling
- **Problem**: Inconsistent CORS preflight responses
- **Solution**: Standardized handleCorsPrelight utility
- **Status**: ✅ FIXED

### 3. Authentication Flow
- **Problem**: Mixed authentication patterns causing failures
- **Solution**: Centralized authenticateRequest and requireRole functions
- **Status**: ✅ FIXED

---

## NEXT IMMEDIATE ACTIONS

1. **PRIORITY 1**: Fix admin-analytics function (user currently on /admin/analytics)
2. **PRIORITY 2**: Standardize get-analytics-dashboard-data
3. **PRIORITY 3**: Apply pattern to remaining functions

---

## COMPLIANCE CHECKLIST

For each function, verify:
- [ ] Uses handleCorsPrelight() for CORS
- [ ] Implements proper rate limiting
- [ ] Uses authenticateRequest() for auth
- [ ] Uses requireRole() for authorization
- [ ] Returns structured responses
- [ ] Has proper error handling
- [ ] Follows [D3.5] Security directives

---

**Last Updated**: June 24, 2025  
**Progress**: Phase 1 Complete, Phase 2 In Progress  
**Next Review**: After Phase 2 completion
