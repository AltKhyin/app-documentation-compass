
# README-BÍBLIA.md
**Version:** 2.3.0  
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
- **Status**: 100% Complete - **NEWLY IMPLEMENTED** (v2.3.0)
- **Implementation**:
  - Complete suggestion submission and voting functionality
  - Secure RLS policies on `Suggestion_Votes` table
  - Rate-limited Edge Functions (100 req/min)
  - TanStack Query mutations with optimistic updates
  - Real-time vote count updates via database triggers
- **Components**: NextEditionModule (functional), SuggestionPollItem (functional)
- **API**: `cast-suggestion-vote` Edge Function, enhanced `submit-suggestion` validation
- **Data Hooks**: `useSubmitSuggestionMutation`, `useCastVoteMutation`
- **Security**: Full RLS implementation, user authentication required
- **Location**: `supabase/functions/cast-suggestion-vote/`, `packages/hooks/`

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
- **UI State**: Local useState/useReducer

#### Database Schema
- **Tables**: Practitioners, Reviews, Suggestions, Notifications, SiteSettings, OnboardingQuestions/Answers, Suggestion_Votes
- **Security**: RLS policies on all tables (COMPLETE)
- **Functions**: `get_my_claim()`, `handle_new_user()` trigger, `update_suggestion_vote_count()`
- **Triggers**: Automatic vote count updates on Suggestion_Votes table
- **Status**: Schema complete for current features

### 📁 KEY DIRECTORY STRUCTURE
```
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── shell/             # App shell navigation (USES AppDataContext DIRECTLY)
│   │   ├── homepage/          # Homepage modules (FUNCTIONAL voting system)
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts (CRITICAL: AppDataContext)
│   ├── hooks/                 # Custom React hooks (NO data fetching hooks)
│   ├── pages/                 # Route components
│   └── store/                 # Zustand stores (auth only)
├── packages/
│   └── hooks/                 # Shared data-fetching hooks (CONSOLIDATED + voting hooks)
├── supabase/
│   └── functions/            # Edge Functions (INCLUDING cast-suggestion-vote)
└── docs/                     # Documentation & blueprints
```

### 🔧 TECHNICAL IMPLEMENTATION NOTES

#### Performance Optimizations (ENFORCED v2.2.1)
- **API Call Reduction**: From 14+ to 1 call per page load (TARGET ACHIEVED)
- **Consolidated Queries**: SINGLE Edge Function for ALL related data
- **Smart Caching**: TanStack Query with 5min staleTime, 15min gcTime
- **Rate Limiting**: 100 requests/minute on Edge Functions
- **POLICY ENFORCEMENT**: Zero tolerance for individual API calls
- **Optimistic Updates**: Immediate UI feedback for voting actions

#### Error Handling
- **Graceful Degradation**: Homepage works with partial data failures
- **User Feedback**: Clear error states with retry mechanisms
- **Optimistic Rollback**: Vote actions revert on error
- **Logging**: Comprehensive console logging for debugging

#### Security
- **RLS First**: All data access through Row Level Security
- **JWT Claims**: Custom role and subscription_tier in tokens
- **Rate Limiting**: Protection against API abuse
- **CORS**: Proper handling in all Edge Functions
- **Vote Security**: Users can only vote once per suggestion

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

#### Common Issues
- **Auth Limbo**: Cleared via auth state cleanup on login/logout
- **API Overload**: RESOLVED via aggressive consolidated data fetching (v2.2.1)
- **Cache Invalidation**: Handled by TanStack Query patterns
- **Vote Conflicts**: Prevented by optimistic updates with error rollback

#### Edge Function Status
- `get-homepage-feed`: ✅ Active, Rate Limited, Handles ALL app data, Needs Refactoring
- `cast-suggestion-vote`: ✅ Active, Rate Limited, Full voting functionality
- `submit-suggestion`: ✅ Active, Rate Limited, Enhanced validation
- `get-personalized-recommendations`: ⚠️ Has schema errors (ReviewTags missing)

#### Database Health
- All required tables exist and have proper RLS policies
- Suggestion_Votes table fully secured with RLS
- Vote count triggers functioning correctly
- Analytics_Events table missing (affects recommendations)
- Foreign key relationships validated

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

**Recent Changes (v2.3.0):**
- IMPLEMENTED complete suggestion voting system with secure RLS policies
- CREATED cast-suggestion-vote Edge Function with rate limiting and proper error handling
- ADDED TanStack Query mutations (useSubmitSuggestionMutation, useCastVoteMutation)
- UPDATED homepage components to use functional voting system instead of TODO placeholders
- REFINED color token system in visual documentation with exact hex references
- ADDED optimistic updates for immediate user feedback in voting interactions

This document reflects the current state as of June 16, 2025, with fully functional suggestion voting system and refined visual design tokens.
