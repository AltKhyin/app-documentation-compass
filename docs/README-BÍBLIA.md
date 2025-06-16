
# README-BÍBLIA.md
**Version:** 2.2.0  
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
- **Status**: 100% Complete - **AGGRESSIVELY OPTIMIZED** (v2.2.0)
- **Implementation**: 
  - **ENFORCED**: Single consolidated API call architecture - NO EXCEPTIONS
  - Single `get-homepage-feed` Edge Function returns ALL data (homepage + user + notifications)
  - Rate limited (100 req/min), graceful error handling, CORS enabled
  - **API Calls**: Reduced from 14+ to 1-2 calls per page load (TARGET ACHIEVED)
  - **POLICY**: All individual API calls to Reviews, Practitioners, Notifications ELIMINATED
- **Components**: FeaturedReview, ReviewCarousel, NextEditionModule, SuggestionPollItem
- **Data Flow**: `useConsolidatedHomepageFeedQuery` → `AppDataContext` → Shell components
- **Edge Function**: `supabase/functions/get-homepage-feed/index.ts` (351 lines - needs refactoring)
- **Location**: `src/pages/Index.tsx`, `src/components/homepage/`, `packages/hooks/useHomepageFeedQuery.ts`

#### Data Architecture (ENFORCED v2.2.0)
- **Status**: 100% Complete - **AGGRESSIVELY ENFORCED**
- **Pattern**: SINGLE consolidated data fetching following [DOC_6] guidelines
- **Implementation**: 
  - Single `AppDataContext` provides ALL app data (user profile + notifications + homepage)
  - `useConsolidatedHomepageFeedQuery` is the ONLY data fetching hook allowed
  - Legacy hooks exist only as deprecated wrappers pointing to consolidated data
  - **ELIMINATED**: All direct API calls to individual endpoints
- **Benefits**: Eliminated redundant API calls, improved performance, better caching
- **Location**: `src/contexts/AppDataContext.tsx`, `packages/hooks/`

### 🔄 CURRENT ARCHITECTURE DECISIONS

#### API Strategy (ENFORCED v2.2.0)
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
- **Tables**: Practitioners, Reviews, Suggestions, Notifications, SiteSettings, OnboardingQuestions/Answers
- **Security**: RLS policies on all tables
- **Functions**: `get_my_claim()`, `handle_new_user()` trigger
- **Status**: Schema complete for current features

### 📁 KEY DIRECTORY STRUCTURE
```
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── shell/             # App shell navigation
│   │   ├── homepage/          # Homepage modules
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts (CRITICAL: AppDataContext)
│   ├── hooks/                 # Custom React hooks (mostly deprecated wrappers)
│   ├── pages/                 # Route components
│   └── store/                 # Zustand stores (auth only)
├── packages/
│   └── hooks/                 # Shared data-fetching hooks (SINGLE consolidated hook)
├── supabase/
│   └── functions/            # Edge Functions
└── docs/                     # Documentation & blueprints
```

### 🔧 TECHNICAL IMPLEMENTATION NOTES

#### Performance Optimizations (ENFORCED v2.2.0)
- **API Call Reduction**: From 14+ to 1-2 calls per page load (TARGET ACHIEVED)
- **Consolidated Queries**: SINGLE Edge Function for ALL related data
- **Smart Caching**: TanStack Query with 5min staleTime, 15min gcTime
- **Rate Limiting**: 100 requests/minute on Edge Functions
- **POLICY ENFORCEMENT**: Zero tolerance for individual API calls

#### Error Handling
- **Graceful Degradation**: Homepage works with partial data failures
- **User Feedback**: Clear error states with retry mechanisms
- **Logging**: Comprehensive console logging for debugging

#### Security
- **RLS First**: All data access through Row Level Security
- **JWT Claims**: Custom role and subscription_tier in tokens
- **Rate Limiting**: Protection against API abuse
- **CORS**: Proper handling in all Edge Functions

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
- **API Overload**: RESOLVED via aggressive consolidated data fetching (v2.2.0)
- **Cache Invalidation**: Handled by TanStack Query patterns

#### Edge Function Status
- `get-homepage-feed`: ✅ Active, Rate Limited, Handles ALL app data, Needs Refactoring
- `get-personalized-recommendations`: ⚠️ Has schema errors (ReviewTags missing)

#### Database Health
- All required tables exist and have proper RLS policies
- Analytics_Events table missing (affects recommendations)
- Foreign key relationships need validation

### 🚨 CRITICAL API CALL POLICY (v2.2.0)

**ZERO TOLERANCE POLICY**: No individual API calls allowed for:
- User profile data (`/rest/v1/Practitioners`)
- Notification counts (`/rest/v1/Notifications`)
- Homepage content (`/rest/v1/Reviews`, `/rest/v1/Suggestions`, `/rest/v1/SiteSettings`)

**ENFORCEMENT**: All components MUST use `AppDataContext` and `useConsolidatedHomepageFeedQuery`

**MONITORING**: Any individual API calls detected are considered bugs and must be eliminated immediately

---

**Recent Changes (v2.2.0):**
- AGGRESSIVELY enforced single consolidated API call policy
- Eliminated all individual API calls to Reviews, Practitioners, Notifications
- Updated auth store to not fetch practitioner data
- Enhanced caching and error handling in consolidated hook
- Added strict policy documentation and monitoring guidelines

This document reflects the current state as of June 16, 2025, post aggressive API consolidation enforcement.
