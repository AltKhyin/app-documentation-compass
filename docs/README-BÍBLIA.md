
# README-BÍBLIA.md
*Version: 1.0*  
*Date: June 15, 2025*  
*Purpose: Living state document providing 2-minute complete context summary of EVIDENS repository for any AI or human developer*

## 🏗️ CURRENT PROJECT STATE OVERVIEW

### **Architecture Foundation**
- **Platform**: Supabase-native backend with dual Next.js frontend applications
- **Database**: PostgreSQL with Row Level Security (RLS) as primary authorization mechanism
- **Authentication**: Supabase Auth with JWT custom claims (`role`, `subscription_tier`)
- **Data Fetching**: TanStack Query v5 with custom hooks pattern (no direct supabase-js calls in UI)
- **Styling**: Tailwind CSS + shadcn/ui components + token-based design system

### **Current Implementation Status**

#### ✅ COMPLETED FEATURES
1. **Application Shell & Navigation** (Milestone 2: COMPLETE)
   - Responsive navigation system with desktop sidebar and mobile bottom tabs
   - Collapsible desktop sidebar with tooltip support
   - Header with notification bell and user profile integration
   - Complete AppShell with DesktopShell and MobileShell components
   - Navigation items: Início (/), Acervo (/acervo), Comunidade (/comunidade), Perfil (/perfil)

2. **Authentication System** (Milestone 1: COMPLETE)
   - Supabase Auth integration with Google OAuth
   - Split-screen auth layout (LoginForm + SignupForm)
   - Protected route wrapper (ProtectedRoute)
   - Auth session provider with Zustand state management
   - JWT custom claims trigger (`handle_new_user`) writing to `raw_app_meta_data`

3. **Database Foundation** (Milestone 1: COMPLETE)
   - `Practitioners` table with user profiles linked to auth.users
   - `Notifications` table with practitioner relationships
   - `OnboardingQuestions` and `OnboardingAnswers` tables
   - Complete RLS policies for user data access
   - Helper function `get_my_claim()` for JWT claims extraction

4. **UI Component System**
   - Complete shadcn/ui integration (40+ components)
   - Custom shell components (NavItem, CollapsibleSidebar, BottomTabBar, etc.)
   - UserProfileBlock with avatar and profile display
   - NotificationBell with unread count
   - Responsive design following mobile-first approach

#### 🚧 IN PROGRESS / NEXT MILESTONES
1. **Milestone 3: Homepage Backend & Data Layer** (READY TO START)
   - Need: Complete database schema for content (Reviews, Tags, CommunityPosts, etc.)
   - Need: `get-homepage-feed` and `get-personalized-recommendations` Edge Functions
   - Need: `useHomepageFeedQuery` hook in packages/hooks structure

2. **Milestone 4: Homepage Frontend** (WAITING)
   - Depends on Milestone 3 completion
   - FeaturedReview, ReviewCarousel, NextEditionModule components

3. **Future Milestones** (PLANNED)
   - Review Detail pages with Visual Composition Engine content
   - Community discussion system
   - User profile management
   - Admin dashboard with Visual Composition Engine

#### ❌ NOT YET IMPLEMENTED
- Content management tables (Reviews, Tags, CommunityPosts, Suggestions)
- Edge Functions for business logic
- Visual Composition Engine (VCE) for content creation
- Analytics and reporting system
- File storage integration
- Real-time features

### **Current Database Schema**
```sql
-- EXISTING TABLES (Milestone 1 complete):
Tables: Practitioners, Notifications, OnboardingQuestions, OnboardingAnswers

-- MISSING TABLES (Milestone 3 required):
Tables: Reviews, Tags, ReviewTags, CommunityPosts, CommunityPostVotes, 
        SiteSettings, Suggestions, SuggestionVotes, Polls, PollOptions, 
        PollVotes, Reports, Analytics_Events, Summary_* tables
```

### **Current File Structure**
```
/docs/                          # Complete architectural documentation
/src/components/shell/          # Complete navigation system
/src/components/ui/             # Complete shadcn/ui components  
/src/components/auth/           # Complete authentication system
/src/hooks/queries/             # Basic query hooks (user profile, notifications)
/src/hooks/mutations/           # Basic mutation hooks (login, signup)
/src/integrations/supabase/     # Supabase client and types
/supabase/migrations/           # 2 migrations: initial schema + user identity
```

### **Critical Dependencies & Configuration**
- **Supabase Project**: qjoxiowuiiupbvqlssgk.supabase.co
- **Key Environment**: Anon key configured in client
- **Custom Claims Trigger**: `handle_new_user` function critical for RLS
- **Required for Homepage**: Content schema migration + Edge Functions

### **Development Standards**
- File headers: `// ABOUTME: [description]` for all .ts/.tsx files
- Component naming: PascalCase, functions: camelCase, DB columns: snake_case
- Data access: MUST use custom useQuery/useMutation hooks, NEVER direct supabase calls in UI
- Security: RLS policies as firewall, JWT custom claims for user tier access

### **Next Immediate Actions Required**
1. Create content schema migration (Reviews, Tags, CommunityPosts, etc.)
2. Implement get-homepage-feed Edge Function with parallel queries
3. Implement get-personalized-recommendations Edge Function 
4. Create useHomepageFeedQuery hook in packages/hooks structure
5. Update this README-BÍBLIA.md after each milestone completion

---
*This document MUST be updated after every code modification to reflect current state*
