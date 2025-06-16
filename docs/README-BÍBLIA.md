
# README-BÍBLIA.md
**Version:** 2.1.0  
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
- **Status**: 100% Complete - **RECENTLY OPTIMIZED**
- **Implementation**: 
  - **NEW**: Consolidated single API call architecture (v2.1.0)
  - Single `get-homepage-feed` Edge Function returns ALL data (homepage + user + notifications)
  - Rate limited (100 req/min), graceful error handling, CORS enabled
  - **API Calls Reduced**: From 14+ calls to 2-3 calls per page load
- **Components**: FeaturedReview, ReviewCarousel, NextEditionModule, SuggestionPollItem
- **Data Flow**: `useConsolidatedHomepageFeedQuery` → `AppDataContext` → Shell components
- **Edge Function**: `supabase/functions/get-homepage-feed/index.ts` (290 lines - needs refactoring)
- **Location**: `src/pages/Index.tsx`, `src/components/homepage/`, `packages/hooks/useHomepageFeedQuery.ts`

#### Data Architecture (OPTIMIZED v2.1.0)
- **Status**: 100% Complete - **RECENTLY OPTIMIZED**
- **Pattern**: Consolidated data fetching following [DOC_6] guidelines
- **Implementation**: 
  - Single `AppDataContext` provides user profile + notification data
  - `useConsolidatedHomepageFeedQuery` replaces multiple individual queries
  - Legacy hooks maintained for backward compatibility
- **Benefits**: Eliminated redundant API calls, improved performance, better caching
- **Location**: `src/contexts/AppDataContext.tsx`, `packages/hooks/`

### 🔄 CURRENT ARCHITECTURE DECISIONS

#### API Strategy (Updated v2.1.0)
- **Edge Functions**: Complex business logic, consolidated data fetching
- **Auto-generated API**: Simple CRUD with RLS policies
- **Rate Limiting**: Implemented on all Edge Functions (100 req/min)
- **Data Consolidation**: Single source for related data to minimize API calls

#### State Management
- **Global Auth**: Zustand store (`src/store/auth.ts`)
- **Server State**: TanStack Query with consolidated hooks
- **App Data**: React Context for user profile + notifications
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
│   ├── contexts/              # React contexts (NEW: AppDataContext)
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Route components
│   └── store/                 # Zustand stores
├── packages/
│   └── hooks/                 # Shared data-fetching hooks (UPDATED)
├── supabase/
│   └── functions/            # Edge Functions
└── docs/                     # Documentation & blueprints
```

### 🔧 TECHNICAL IMPLEMENTATION NOTES

#### Performance Optimizations (NEW v2.1.0)
- **API Call Reduction**: From 14+ to 2-3 calls per page load
- **Consolidated Queries**: Single Edge Function for related data
- **Smart Caching**: TanStack Query with 5min staleTime, 15min gcTime
- **Rate Limiting**: 100 requests/minute on Edge Functions

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
   - `get-homepage-feed` Edge Function (290 lines - needs splitting)
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
- **API Overload**: Resolved via consolidated data fetching (v2.1.0)
- **Cache Invalidation**: Handled by TanStack Query patterns

#### Edge Function Status
- `get-homepage-feed`: ✅ Active, Rate Limited, Needs Refactoring
- `get-personalized-recommendations`: ⚠️ Has schema errors (ReviewTags missing)

#### Database Health
- All required tables exist and have proper RLS policies
- Analytics_Events table missing (affects recommendations)
- Foreign key relationships need validation

---

**Recent Changes (v2.1.0):**
- Implemented consolidated data fetching architecture
- Reduced API calls from 14+ to 2-3 per page load
- Added AppDataContext for global app data
- Maintained backward compatibility with legacy hooks
- Added comprehensive rate limiting
- Improved error handling and logging

This document reflects the current state as of June 16, 2025, post API optimization.
