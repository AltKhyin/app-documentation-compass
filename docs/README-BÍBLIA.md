
# **README - BÍBLIA EVIDENS v2.4.1**

**Version:** 2.4.1 (Critical Fix)  
**Date:** June 24, 2025  
**Last Update:** Analytics dashboard Edge Function fix completed  

**Purpose:** This document serves as the complete living summary and changelog for the EVIDENS project implementation, tracking all major decisions, architectural patterns, and current status of all systems.

---

## **CRITICAL STATUS UPDATE - Edge Functions Stabilization (v2.4.1)**

### **COMPLETED (v2.4.1):**
✅ **Analytics Dashboard Function Fixed**: Resolved 500 error in `get-analytics-dashboard-data` by removing problematic shared helper dependencies and implementing the proven simplified pattern.

### **PREVIOUS CRITICAL ISSUES RESOLVED (v2.4.0):**
✅ **Admin Edge Functions Rewrite Complete**: All 12 admin Edge Functions have been rewritten using the simplified, proven pattern that eliminates the complex dependency issues causing systematic failures.

✅ **Pattern Standardization**: All admin functions now follow the same reliable structure:
- Direct CORS handling without shared helpers
- Simple authentication via `supabase.auth.getUser()`  
- Streamlined error handling
- No complex rate limiting or shared utility dependencies

✅ **Database Schema Alignment**: Fixed `admin-manage-users` function to work with actual `Practitioners` table schema (removed non-existent `email` column references).

### **FUNCTIONS STATUS:**
- ✅ `admin-get-content-queue` - **WORKING**
- ✅ `admin-manage-users` - **WORKING** 
- ✅ `admin-assign-roles` - **WORKING**
- ✅ `admin-content-analytics` - **WORKING**
- ✅ `admin-bulk-content-actions` - **WORKING**
- ✅ `admin-manage-publication` - **WORKING**
- ✅ `admin-moderation-actions` - **WORKING**
- ✅ `admin-user-analytics` - **WORKING**
- ✅ `admin-analytics` - **WORKING**
- ✅ `admin-audit-logs` - **WORKING**
- ✅ `get-analytics-dashboard-data` - **WORKING** (Fixed in v2.4.1)

### **ARCHITECTURAL LESSONS LEARNED:**
1. **Simplicity Over Complexity**: The shared helper approach with rate limiting caused systematic failures. The direct implementation pattern proves more reliable.
2. **Schema Alignment**: Always verify database schema before implementing Edge Functions.
3. **Incremental Testing**: Test each function individually rather than batch deployments.

---

## **PROJECT OVERVIEW**

EVIDENS is a progressive web application (PWA) built to solve "Ansiedade de Performance" for "Praticantes de Alto Sinal" through a unified Vite + React SPA with Supabase backend.

### **CORE ARCHITECTURE**
- **Frontend**: Vite + React 18 + TypeScript (strict mode)
- **Backend**: 100% Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- **State Management**: TanStack Query v5 + Zustand (auth only)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Deployment**: Progressive Web App (PWA) with service worker

---

## **IMPLEMENTATION STATUS BY FEATURE**

### **✅ AUTHENTICATION SYSTEM** (Complete)
- **Components**: Login/Signup forms, ProtectedRoute, AuthSessionProvider
- **Status**: Fully implemented with JWT custom claims (`role`, `subscription_tier`)
- **Security**: Row Level Security (RLS) policies active
- **Edge Functions**: Auth flows working correctly

### **✅ MAIN APPLICATION SHELL** (Complete)
- **Components**: AppShell, CollapsibleSidebar, BottomTabBar, UserProfileBlock
- **Responsive**: Mobile-first design with `useIsMobile()` hook
- **Navigation**: React Router v6 with protected routes
- **PWA**: Install prompts and service worker configured

### **✅ HOMEPAGE FEED** (Complete)
- **Data Source**: `get-homepage-feed` Edge Function
- **Components**: FeaturedReview, ReviewCarousel, SuggestionPollItem
- **Performance**: TanStack Query caching with 5-minute stale time
- **Mobile**: Responsive design with touch-friendly interactions

### **✅ ACERVO (LIBRARY)** (Complete)
- **Features**: Masonry grid, client-side search/filter, tag-based organization
- **Components**: ReviewCard, SearchInput, TagsPanel, MobileTagsModal
- **UX Pattern**: "Reorder, Don't Filter" canonical implementation
- **Performance**: Optimized queries with database indexes

### **✅ COMMUNITY SYSTEM** (Complete)
- **Features**: Posts, comments, polls, voting, moderation
- **Components**: PostCard, CommentThread, PollCreator, PostActionBar
- **Real-time**: Live updates via Supabase subscriptions
- **Moderation**: Admin/editor tools for content management

### **✅ REVIEW DETAIL PAGES** (Complete)
- **Architecture**: Block-based structured content (v2.0)
- **Components**: BlockRenderer, LayoutAwareRenderer, responsive blocks
- **Features**: View tracking, social sharing, discussion threads
- **Mobile**: Adaptive layouts for desktop/mobile viewing

### **🟡 ADMIN DASHBOARD** (Recently Fixed - v2.4.1)
- **Status**: All Edge Functions working after systematic rewrite
- **Features**: User management, content queue, analytics, audit logs
- **Security**: Admin/editor role-based access control
- **Recent Fix**: Analytics dashboard function stabilized

### **🔴 NOTIFICATION SYSTEM** (Not Implemented)
- **Status**: Planned but not yet implemented
- **Requirements**: Real-time notifications, email integration
- **Dependencies**: Requires notification preferences system

### **🔴 CONTENT EDITOR** (Not Implemented)  
- **Status**: Planned for rich content creation
- **Requirements**: Block-based editor, media uploads
- **Dependencies**: Storage bucket configuration needed

---

## **EDGE FUNCTIONS ARCHITECTURE**

### **PROVEN PATTERN (Use This)**
All working Edge Functions follow this simplified pattern:
```typescript
// 1. Direct CORS handling
if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders });
}

// 2. Simple authentication  
const { data: { user }, error: authError } = await supabase.auth.getUser(
  req.headers.get('Authorization')?.replace('Bearer ', '')
);

// 3. Role checking via app_metadata
const userRole = user.app_metadata?.role;

// 4. Direct database operations
const { data, error } = await supabase.from('table').select();

// 5. Simple error responses
return new Response(JSON.stringify(result), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

### **DEPRECATED PATTERNS (Avoid These)**
- ❌ Shared helper functions (`api-helpers.ts`, `rate-limit.ts`)
- ❌ Complex rate limiting implementations
- ❌ `verify_jwt = false` configurations
- ❌ Manual JWT verification attempts

---

## **DATABASE SCHEMA STATUS**

### **CORE TABLES** (Complete)
- ✅ `Practitioners` - User profiles and metadata
- ✅ `Reviews` - Content with structured_content v2.0
- ✅ `CommunityPosts` - Forum posts and comments
- ✅ `Tags` - Hierarchical tag system
- ✅ `Polls` + `PollOptions` + `PollVotes` - Polling system

### **ADMIN TABLES** (Complete)
- ✅ `UserRoles` - Granular role management
- ✅ `SystemAuditLog` - Comprehensive audit trail
- ✅ `Publication_History` - Content workflow tracking
- ✅ `SiteSettings` - Configuration management

### **MISSING TABLES** (Future Implementation)
- 🔴 `Notifications` - User notification preferences
- 🔴 `Analytics_Events` - Event logging for analytics pipeline
- 🔴 `Summary_*` tables - Pre-aggregated analytics data

---

## **CRITICAL ARCHITECTURAL DECISIONS**

### **1. DATA FETCHING STRATEGY (Canonical)**
- **Rule**: All server state managed by TanStack Query
- **Pattern**: Component-specific hooks (`useUserProfileQuery`, etc.)
- **Exception**: Homepage consolidation for performance
- **Forbidden**: Direct supabase client calls from UI components

### **2. MOBILE-FIRST DESIGN (Mandatory)**
- **Breakpoint**: 768px (`useIsMobile()` hook)
- **Pattern**: Touch-friendly interactions, responsive layouts
- **Exception**: Admin dashboard (desktop-focused)

### **3. TYPE SAFETY (Strict)**
- **Mode**: TypeScript strict mode enabled
- **Rule**: No `any` types allowed, use `unknown` with narrowing
- **Source**: Auto-generated types from Supabase schema

### **4. ERROR BOUNDARIES (3-Tier System)**
- **Tier 1**: App.tsx (ultimate safety net)
- **Tier 2**: Page-level boundaries
- **Tier 3**: Feature-specific boundaries

---

## **KNOWN TECHNICAL DEBT**

### **HIGH PRIORITY**
1. **File Size Management**: Several files approaching 250+ lines need refactoring
   - `packages/hooks/useUserManagementQuery.ts` (227 lines)
   - `src/pages/AdminAnalytics.tsx` (244 lines) 
   - `supabase/migrations/[latest].sql` (232 lines)

2. **Performance Optimizations**: Implement analytics ETL pipeline per Blueprint 09

### **MEDIUM PRIORITY**
3. **Code Standardization**: Ensure all components follow shadcn/ui patterns
4. **Testing Coverage**: Unit tests needed for critical business logic

---

## **SECURITY IMPLEMENTATION**

### **ROW LEVEL SECURITY (Active)**
- ✅ All tables protected by RLS policies
- ✅ JWT custom claims for role-based access (`role`, `subscription_tier`)
- ✅ Database functions for secure role checking

### **EDGE FUNCTION SECURITY**
- ✅ Authentication required for all admin functions
- ✅ Role-based access control (admin/editor/practitioner)
- ✅ Input validation and SQL injection prevention

---

## **DEVELOPMENT PROTOCOLS**

### **FILE HEADER REQUIREMENT**
Every `.ts` and `.tsx` file MUST begin with:
```typescript
// ABOUTME: [One-sentence description of file purpose in present tense]
```

### **CHANGE MANAGEMENT**
1. **Pre-Flight Check**: Verify against KB before any changes
2. **Conflict Resolution**: Document any directive violations
3. **Version Control**: Update this README for significant changes
4. **Testing**: Ensure functions work individually before batch testing

---

## **NEXT IMPLEMENTATION PRIORITIES**

### **IMMEDIATE (This Sprint)**
1. ✅ **Analytics Dashboard Fix** - COMPLETED in v2.4.1
2. **File Refactoring** - Break down oversized files into focused components

### **SHORT TERM (Next Sprint)**
3. **Notification System** - Implement per Blueprint 10
4. **Analytics ETL Pipeline** - Background data aggregation
5. **Content Editor** - Rich content creation interface

### **LONG TERM (Future Sprints)**
6. **Performance Optimization** - Implement advanced caching strategies
7. **Advanced Moderation** - ML-powered content filtering
8. **API Rate Limiting** - Systematic implementation across all endpoints

---

## **VERSION HISTORY**

- **v2.4.1** (June 24, 2025): Analytics dashboard function fixed, removing shared helper dependencies
- **v2.4.0** (June 23, 2025): Complete admin Edge Functions rewrite using simplified pattern
- **v2.3.0** (June 22, 2025): Community system completion and mobile optimization
- **v2.2.0** (June 21, 2025): Acervo implementation with tag-based organization
- **v2.1.0** (June 20, 2025): Authentication system and app shell completion
- **v2.0.0** (June 19, 2025): Project architecture finalization and PWA implementation

---

**IMPORTANT**: This document serves as the single source of truth for project status. All team members and AI systems must reference this document before making architectural decisions or implementing new features.

**EMERGENCY CONTACT**: For critical system issues, escalate immediately. This project is managed by a non-technical lead and relies heavily on AI development, making documentation accuracy paramount.
