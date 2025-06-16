
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
- **Status**: 100% Complete - **AGGRESSIVELY OPTIMIZED** (v2.3.0)
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

#### 🆕 Voting System (Próxima Edição) 
- **Status**: 100% Complete - **NEW IN v2.3.0**
- **Implementation**:
  - Complete suggestion submission and voting backend
  - Rate-limited Edge Functions: `submit-suggestion` (5/hour), `cast-vote` (60/min)
  - Database: `Suggestion_Votes` table with RLS policies and triggers
  - Frontend: TanStack Query mutations with optimistic updates
  - Error handling: Comprehensive error states and user feedback
- **Components**: NextEditionModule, SuggestionPollItem with full voting integration
- **Security**: JWT authentication, RLS policies, input validation, rate limiting
- **Edge Functions**: `supabase/functions/submit-suggestion/`, `supabase/functions/cast-vote/`
- **Hooks**: `packages/hooks/useSuggestionMutations.ts`

#### Data Architecture (ENFORCED v2.3.0)
- **Status**: 100% Complete - **ENHANCED**
- **Pattern**: SINGLE consolidated data fetching following [DOC_6] guidelines
- **Implementation**: 
  - Single `AppDataContext` provides ALL app data (user profile + notifications + homepage)
  - `useConsolidatedHomepageFeedQuery` is the ONLY data fetching hook allowed
  - **NEW**: `useSuggestionMutations` for voting operations with proper cache invalidation
  - **ELIMINATED**: All legacy wrapper hooks and direct API calls
  - **SHELL COMPONENTS**: Now directly consume AppDataContext (no individual hooks)
- **Benefits**: Eliminated redundant API calls, improved performance, better caching
- **Location**: `src/contexts/AppDataContext.tsx`, `packages/hooks/`

### 🔄 CURRENT ARCHITECTURE DECISIONS

#### API Strategy (ENHANCED v2.3.0)
- **Edge Functions**: Complex business logic, consolidated data fetching, user operations
- **Auto-generated API**: Simple CRUD with RLS policies (NOT used for homepage/user data)
- **Rate Limiting**: Implemented on ALL Edge Functions with appropriate limits
- **Data Consolidation**: MANDATORY single source for all related data
- **NEW**: Mutation operations properly integrated with query cache invalidation
- **STRICT POLICY**: No individual API calls allowed for homepage, user, or notification data

#### State Management
- **Global Auth**: Zustand store (`src/store/auth.ts`) - auth state ONLY
- **Server State**: TanStack Query with SINGLE consolidated hook + mutation hooks
- **App Data**: React Context for ALL app data (user profile + notifications + homepage)
- **UI State**: Local useState/useReducer
- **NEW**: Optimistic updates for voting operations

#### Database Schema (ENHANCED v2.3.0)
- **Tables**: Practitioners, Reviews, Suggestions, **NEW: Suggestion_Votes**, Notifications, SiteSettings, OnboardingQuestions/Answers
- **Security**: RLS policies on all tables including new voting tables
- **Functions**: `get_my_claim()`, `handle_new_user()` trigger, **NEW: vote counting triggers**
- **Constraints**: Unique voting constraint, proper foreign key relationships
- **Status**: Schema complete for current features + voting system

### 📁 KEY DIRECTORY STRUCTURE
```
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── shell/             # App shell navigation (USES AppDataContext DIRECTLY)
│   │   ├── homepage/          # Homepage modules (NOW includes voting)
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts (CRITICAL: AppDataContext)
│   ├── hooks/                 # Custom React hooks (NO data fetching hooks)
│   ├── pages/                 # Route components
│   └── store/                 # Zustand stores (auth only)
├── packages/
│   └── hooks/                 # Shared data-fetching hooks (consolidated + mutations)
├── supabase/
│   └── functions/            # Edge Functions (homepage, suggestions, voting)
└── docs/                     # Documentation & blueprints
```

### 🔧 TECHNICAL IMPLEMENTATION NOTES

#### Performance Optimizations (ENHANCED v2.3.0)
- **API Call Reduction**: From 14+ to 1 call per page load (TARGET ACHIEVED)
- **Consolidated Queries**: SINGLE Edge Function for ALL related data
- **Smart Caching**: TanStack Query with 5min staleTime, 15min gcTime
- **Rate Limiting**: Comprehensive limits across all endpoints (100/min homepage, 5/hour suggestions, 60/min votes)
- **NEW**: Optimistic updates for immediate UI feedback
- **POLICY ENFORCEMENT**: Zero tolerance for individual API calls

#### Error Handling (ENHANCED v2.3.0)
- **Graceful Degradation**: Homepage works with partial data failures
- **User Feedback**: Clear error states with retry mechanisms
- **Logging**: Comprehensive console logging for debugging
- **NEW**: Specific error handling for rate limits, validation, authentication
- **NEW**: Optimistic update rollback on failures

#### Security (ENHANCED v2.3.0)
- **RLS First**: All data access through Row Level Security
- **JWT Claims**: Custom role and subscription_tier in tokens
- **Rate Limiting**: Protection against API abuse on ALL endpoints
- **CORS**: Proper handling in all Edge Functions
- **NEW**: Voting system security with unique constraints and proper validation
- **NEW**: Input sanitization and length validation

### 🚧 NEXT DEVELOPMENT PRIORITIES

1. **Core Features Implementation**:
   - Review Detail Page (`/reviews/[id]`)
   - Acervo (Library) Page with search and filtering
   - Community Features (per Blueprint 06)
   - User Profile Management (`/perfil`)

2. **Advanced Voting Features**:
   - Admin moderation capabilities for suggestions
   - Voting history and analytics
   - Integration with notification system

3. **Performance & Monitoring**:
   - Analytics implementation
   - Performance monitoring
   - API usage analytics

### 🔍 DEBUGGING INFORMATION

#### Common Issues
- **Auth Limbo**: Cleared via auth state cleanup on login/logout
- **API Overload**: RESOLVED via aggressive consolidated data fetching (v2.2.1)
- **Cache Invalidation**: Handled by TanStack Query patterns
- **NEW**: Optimistic update rollbacks handle voting failures gracefully

#### Edge Function Status
- `get-homepage-feed`: ✅ Active, Rate Limited (100/min), Handles ALL app data, Needs Refactoring
- `get-personalized-recommendations`: ⚠️ Has schema errors (ReviewTags missing)
- `submit-suggestion`: ✅ Active, Rate Limited (5/hour), Full validation and error handling
- `cast-vote`: ✅ Active, Rate Limited (60/min), Supports vote/retract operations

#### Database Health
- All required tables exist and have proper RLS policies
- **NEW**: Suggestion_Votes table with proper constraints and triggers
- **NEW**: Vote counting triggers maintain data consistency automatically
- Analytics_Events table missing (affects recommendations)
- Foreign key relationships validated and working

### 🚨 CRITICAL API CALL POLICY (v2.3.0)

**ZERO TOLERANCE POLICY**: No individual API calls allowed for:
- User profile data (`/rest/v1/Practitioners`)
- Notification counts (`/rest/v1/Notifications`)
- Homepage content (`/rest/v1/Reviews`, `/rest/v1/Suggestions`, `/rest/v1/SiteSettings`)

**ENFORCEMENT**: All components MUST use `AppDataContext` directly - NO wrapper hooks allowed

**SHELL COMPONENTS**: UserProfileBlock and NotificationBell directly consume AppDataContext

**NEW OPERATIONS**: Voting and suggestion submission use dedicated mutation hooks with proper cache invalidation

**MONITORING**: Any individual API calls detected are considered bugs and must be eliminated immediately

---

**Recent Changes (v2.3.0):**
- IMPLEMENTED complete voting system for "Próxima Edição" with backend and frontend
- ADDED comprehensive rate limiting across all Edge Functions
- CREATED mutation hooks following established data fetching patterns
- IMPLEMENTED optimistic updates with proper error handling and rollbacks
- MAINTAINED strict API consolidation policy while adding new functionality
- UPDATED database schema with voting tables, RLS policies, and triggers

This document reflects the current state as of June 16, 2025, with complete voting system implementation while maintaining the aggressive API consolidation architecture.
