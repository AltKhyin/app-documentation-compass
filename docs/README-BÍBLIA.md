
# README-BÍBLIA.md
**Version:** 2.3.1  
**Last Updated:** June 16, 2025  
**Purpose:** Living state document providing complete context of the EVIDENS repository

## PROJECT OVERVIEW
EVIDENS is a medical evidence review platform with Main (user-facing) and Admin applications built on React/Vite with Supabase backend.

## CURRENT IMPLEMENTATION STATUS

### ✅ COMPLETED FEATURES

#### Authentication System
- **Status**: 100% Complete
- **Implementation**: Full Supabase Auth integration with JWT custom claims
- **Components**: LoginForm, SignupForm, AuthSessionProvider, ProtectedRoute
- **Security**: RLS policies, role-based access control
- **Location**: `src/components/auth/`, `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`

#### Main Application Shell
- **Status**: 100% Complete
- **Implementation**: Responsive shell with collapsible sidebar (desktop) and bottom tabs (mobile)
- **Components**: AppShell, DesktopShell, MobileShell, CollapsibleSidebar, BottomTabBar
- **Features**: Navigation, user profile display, notification bell
- **Data**: Uses consolidated AppDataContext for user profile and notifications
- **Location**: `src/components/shell/`

#### Homepage Feed System
- **Status**: 100% Complete - **AGGRESSIVELY OPTIMIZED** (v2.2.1)
- **Implementation**: 
  - **ENFORCED**: Single consolidated API call architecture - NO EXCEPTIONS
  - Single `get-homepage-feed` Edge Function returns ALL data (homepage + user + notifications)
  - Rate limited (100 req/min), graceful error handling, CORS enabled
  - **API Calls**: Reduced from 14+ to 1 call per page load (TARGET ACHIEVED)
  - **POLICY**: All individual API calls to Reviews, Practitioners, Notifications ELIMINATED
- **Components**: FeaturedReview, ReviewCarousel, NextEditionModule, SuggestionPollItem
- **Data Flow**: `useConsolidatedHomepageFeedQuery` → `AppDataContext` → ALL components
- **Edge Function**: `supabase/functions/get-homepage-feed/index.ts` (351 lines - needs refactoring)
- **Location**: `src/pages/Index.tsx`, `src/components/homepage/`, `packages/hooks/useHomepageFeedQuery.ts`

#### Suggestion Voting System
- **Status**: 100% Complete - **FULLY FUNCTIONAL & OPTIMIZED** (v2.3.1)
- **Implementation**:
  - Complete suggestion submission and voting functionality with user state tracking
  - **OPTIMIZED**: Single comprehensive RLS policy replacing multiple conflicting policies
  - **PERFORMANCE**: Added database indexes on all foreign keys per Supabase Security Advisor
  - Rate-limited Edge Functions (100 req/min) with enhanced error handling
  - TanStack Query mutations with optimistic updates and proper rollback
  - Real-time vote count updates via optimized database triggers
  - **USER EXPERIENCE**: Tracks individual user vote status for immediate feedback
- **Components**: NextEditionModule (functional), SuggestionPollItem (functional with state sync)
- **API**: `cast-suggestion-vote` Edge Function with user vote status, enhanced `submit-suggestion` validation
- **Data Hooks**: `useSubmitSuggestionMutation`, `useCastVoteMutation` (fixed import paths)
- **Security**: Consolidated RLS policy, user authentication required, vote conflict prevention
- **Performance**: Database function marked `SECURITY DEFINER`, comprehensive indexing
- **Location**: `supabase/functions/cast-suggestion-vote/`, `packages/hooks/`, `src/components/homepage/`

#### Data Architecture (ENFORCED v2.2.1)
- **Status**: 100% Complete - **AGGRESSIVELY ENFORCED**
- **Pattern**: SINGLE consolidated data fetching following [DOC_6] guidelines
- **Implementation**: 
  - Single `AppDataContext` provides ALL app data (user profile + notifications + homepage)
  - `useConsolidatedHomepageFeedQuery` is the ONLY data fetching hook allowed
  - **ELIMINATED**: All legacy wrapper hooks and direct API calls
  - **SHELL COMPONENTS**: Now directly consume AppDataContext (no individual hooks)
- **Benefits**: Eliminated redundant API calls, improved performance, better caching
- **Location**: `src/contexts/AppDataContext.tsx`, `packages/hooks/`

#### Visual System (REFINED v3.1)
- **Status**: 100% Complete - **REFINED COLOR PALETTE** (v2.3.0)
- **Implementation**: Updated dark theme with precise reference colors
- **Color Tokens**: #121212, #1a1a1a, #212121, #2a2a2a, #2d2d2d, #484848
- **Documentation**: Fully updated [DOC_7]_VISUAL_SYSTEM.md v3.1
- **Components**: All components use refined token system
- **Location**: `src/index.css`, `docs/[DOC_7]_VISUAL_SYSTEM.md`

#### Database Performance & Security (NEW v2.3.1)
- **Status**: 100% Complete - **SUPABASE SECURITY ADVISOR COMPLIANT**
- **Implementation**:
  - **RESOLVED**: Multiple permissive policies issue on Suggestion_Votes table
  - **OPTIMIZED**: Added performance indexes on all foreign key columns
  - **ENHANCED**: Security definer functions for better RLS performance
  - **ELIMINATED**: Supabase Security Advisor warnings and performance alerts
- **Tables**: Comprehensive indexing on Notifications, Reviews, Suggestions, Suggestion_Votes
- **Functions**: Optimized `update_suggestion_vote_count()` with security definer
- **Location**: Database migration `20250616091754`, all affected tables

### 🔄 CURRENT ARCHITECTURE DECISIONS

#### API Strategy (ENFORCED v2.2.1)
- **Edge Functions**: Complex business logic, consolidated data fetching
- **Auto-generated API**: Simple CRUD with RLS policies (NOT used for homepage/user data)
- **Rate Limiting**: Implemented on all Edge Functions (100 req/min)
- **Data Consolidation**: MANDATORY single source for all related data
- **STRICT POLICY**: No individual API calls allowed for homepage, user, or notification data

#### State Management
- **Global Auth**: Zustand store (`src/store/auth.ts`) - auth state ONLY
- **Server State**: TanStack Query with SINGLE consolidated hook
- **App Data**: React Context for ALL app data (user profile + notifications + homepage)
- **UI State**: Local useState/useReducer with optimistic updates

#### Database Schema & Performance (OPTIMIZED v2.3.1)
- **Tables**: Practitioners, Reviews, Suggestions, Notifications, SiteSettings, OnboardingQuestions/Answers, Suggestion_Votes
- **Security**: Single comprehensive RLS policies (COMPLETE & OPTIMIZED)
- **Performance**: Comprehensive foreign key indexing per Supabase Security Advisor
- **Functions**: `get_my_claim()`, `handle_new_user()` trigger, optimized `update_suggestion_vote_count()` (security definer)
- **Triggers**: Automatic vote count updates on Suggestion_Votes table (optimized)
- **Status**: Schema complete and performance-optimized for current features

### 📁 KEY DIRECTORY STRUCTURE
```
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── shell/             # App shell navigation (USES AppDataContext DIRECTLY)
│   │   ├── homepage/          # Homepage modules (FULLY FUNCTIONAL voting system)
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts (CRITICAL: AppDataContext)
│   ├── hooks/                 # Custom React hooks (NO data fetching hooks)
│   ├── pages/                 # Route components
│   └── store/                 # Zustand stores (auth only)
├── packages/
│   └── hooks/                 # Shared data-fetching hooks (CONSOLIDATED + optimized voting hooks)
├── supabase/
│   └── functions/            # Edge Functions (INCLUDING optimized cast-suggestion-vote)
└── docs/                     # Documentation & blueprints
```

### 🔧 TECHNICAL IMPLEMENTATION NOTES

#### Performance Optimizations (ENHANCED v2.3.1)
- **API Call Reduction**: From 14+ to 1 call per page load (TARGET ACHIEVED)
- **Consolidated Queries**: SINGLE Edge Function for ALL related data
- **Smart Caching**: TanStack Query with 5min staleTime, 15min gcTime
- **Rate Limiting**: 100 requests/minute on Edge Functions
- **POLICY ENFORCEMENT**: Zero tolerance for individual API calls
- **Optimistic Updates**: Immediate UI feedback for voting actions with proper rollback
- **DATABASE PERFORMANCE**: Comprehensive indexing eliminates Supabase Security Advisor warnings
- **RLS OPTIMIZATION**: Single comprehensive policies replace multiple conflicting ones

#### Error Handling (ENHANCED v2.3.1)
- **Graceful Degradation**: Homepage works with partial data failures
- **User Feedback**: Clear error states with retry mechanisms
- **Optimistic Rollback**: Vote actions revert on error with original state restoration
- **Logging**: Comprehensive console logging for debugging
- **Vote Conflict Prevention**: Proper handling of duplicate/invalid vote attempts

#### Security (ENHANCED v2.3.1)
- **RLS First**: All data access through Row Level Security (optimized single policies)
- **JWT Claims**: Custom role and subscription_tier in tokens
- **Rate Limiting**: Protection against API abuse
- **CORS**: Proper handling in all Edge Functions
- **Vote Security**: Users can only vote once per suggestion with conflict detection
- **Security Definer**: Database functions optimized for performance and security

### 🚧 NEXT DEVELOPMENT PRIORITIES

1. **Refactor Large Files**: 
   - `get-homepage-feed` Edge Function (351 lines - needs splitting)
   - Consider breaking into smaller focused functions

2. **Missing Core Features**:
   - Review Detail Page (`/reviews/[id]`)
   - Acervo (Library) Page
   - Community Features
   - User Profile Management
   - Admin Panel

3. **Performance & Monitoring**:
   - Analytics implementation
   - Performance monitoring
   - API usage analytics

### 🔍 DEBUGGING INFORMATION

#### Common Issues (RESOLVED v2.3.1)
- **Auth Limbo**: Cleared via auth state cleanup on login/logout
- **API Overload**: RESOLVED via aggressive consolidated data fetching (v2.2.1)
- **Cache Invalidation**: Handled by TanStack Query patterns
- **Vote Conflicts**: RESOLVED - Prevented by optimistic updates with error rollback
- **Database Performance**: RESOLVED - Comprehensive indexing per Supabase Security Advisor
- **RLS Policy Conflicts**: RESOLVED - Single comprehensive policies replace multiple ones

#### Edge Function Status
- `get-homepage-feed`: ✅ Active, Rate Limited, Handles ALL app data, Needs Refactoring
- `cast-suggestion-vote`: ✅ Active, Rate Limited, FULLY FUNCTIONAL with user state tracking
- `submit-suggestion`: ✅ Active, Rate Limited, Enhanced validation
- `get-personalized-recommendations`: ⚠️ Has schema errors (ReviewTags missing)

#### Database Health (OPTIMIZED v2.3.1)
- All required tables exist and have optimized RLS policies (single comprehensive policies)
- Suggestion_Votes table FULLY SECURED and PERFORMANCE OPTIMIZED
- Vote count triggers functioning correctly with security definer optimization
- **NEW**: Comprehensive foreign key indexing eliminates performance warnings
- **RESOLVED**: All Supabase Security Advisor alerts addressed
- Foreign key relationships validated and properly indexed

### 🚨 CRITICAL API CALL POLICY (v2.2.1)

**ZERO TOLERANCE POLICY**: No individual API calls allowed for:
- User profile data (`/rest/v1/Practitioners`)
- Notification counts (`/rest/v1/Notifications`)
- Homepage content (`/rest/v1/Reviews`, `/rest/v1/Suggestions`, `/rest/v1/SiteSettings`)

**ENFORCEMENT**: All components MUST use `AppDataContext` directly - NO wrapper hooks allowed

**SHELL COMPONENTS**: UserProfileBlock and NotificationBell now directly consume AppDataContext

**MONITORING**: Any individual API calls detected are considered bugs and must be eliminated immediately

**EXCEPTION**: Voting system uses dedicated TanStack Query mutations for POST operations only

---

**Recent Changes (v2.3.1):**
- RESOLVED all Supabase Security Advisor alerts and performance warnings
- OPTIMIZED Suggestion_Votes table with single comprehensive RLS policy
- ADDED comprehensive foreign key indexing across all database tables
- ENHANCED vote casting Edge Function with user state tracking and conflict prevention
- FIXED import paths in voting mutation hooks for proper module resolution
- IMPROVED optimistic updates with proper state synchronization and error rollback
- MARKED database functions as SECURITY DEFINER for optimal RLS performance

This document reflects the current state as of June 16, 2025, with fully functional and optimized suggestion voting system that addresses all Supabase Security Advisor recommendations.
