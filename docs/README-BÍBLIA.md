
# **README-BÍBLIA.md**
**The Living State Document for EVIDENS Platform**

---

**Version:** 3.2.0  
**Last Updated:** June 16, 2025  
**Purpose:** This document provides a complete, 2-minute context summary of the current implemented state of the EVIDENS repository for any AI or human developer.

---

## **🎯 Project Status: Phase 4 Complete - Operationally Excellent**

### **Current Implementation State**
- ✅ **Phase 1: Foundation Stabilization** - Navigation unified, all routes working
- ✅ **Phase 2: Documentation Realignment** - Architecture adapted for Vite + React
- ✅ **Phase 3: Structural Optimization** - Directory reorganized, types centralized, role-based access implemented
- ✅ **Phase 4: Operational Excellence** - Rate limiting implemented, theme provider optimized, navigation fully centralized

**Development Phase:** Production-ready foundation with comprehensive infrastructure

---

## **🏗️ Current Architecture Overview**

### **Technology Stack**
- **Frontend:** Vite + React 18 + TypeScript (Single-Page Application)
- **Styling:** TailwindCSS + shadcn/ui components
- **State Management:** TanStack Query v5 + Zustand
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Theme Management:** Custom Vite-optimized theme provider
- **Deployment:** Lovable Platform

### **Strategic Trade-offs**
- **SEO Limitation:** Client-side rendering limits search engine indexing of public content
- **Development Speed:** Rapid iteration and interactive user experience prioritized
- **Unified Codebase:** Single application serves both public and admin features via protected routes
- **Theme Compatibility:** Custom theme provider ensures Vite environment stability

---

## **📁 Directory Structure (Post-Phase 4)**

```
/src/
├── components/
│   ├── auth/           # Authentication components (ProtectedRoute, LoginForm)
│   ├── homepage/       # Homepage-specific components (FeaturedReview, ReviewCarousel)
│   ├── acervo/         # Acervo-specific components (ReviewCard, TagsPanel)
│   ├── shell/          # App layout (AppShell, Sidebar, Header)
│   ├── theme/          # ✅ NEW: Custom theme provider for Vite compatibility
│   └── ui/             # Reusable shadcn/ui components
├── config/             # ✅ ENHANCED: Centralized configuration (navigation.ts with role filtering)
├── contexts/           # React Context providers (AppDataContext)
├── hooks/              # Custom hooks and utilities
├── pages/              # Top-level route components
├── store/              # Zustand global state stores
├── types/              # Centralized TypeScript interfaces
├── lib/                # Utility functions and Supabase client
└── integrations/       # Supabase types and client setup

/supabase/
├── functions/
│   ├── _shared/        # ✅ NEW: Shared utilities (rate-limit.ts)
│   └── [various]/      # ✅ ENHANCED: All functions now have standardized rate limiting
└── migrations/         # ✅ NEW: rate_limit_log table for comprehensive API protection
```

---

## **🔐 Authentication & Authorization**

### **Current Implementation**
- **Authentication:** Supabase Auth with JWT custom claims
- **Session Management:** Zustand store (`useAuthStore`)
- **Route Protection:** Enhanced `ProtectedRoute` component with role-based access
- **Roles:** `practitioner` (default) | `moderator` | `admin` | `editor`

### **Role-Based Access Control**
- **Hierarchy:** admin > moderator = editor > practitioner
- **Protected Routes:** `/unauthorized` page for access denials
- **Navigation Filtering:** Both desktop and mobile navigation automatically filter based on user role
- **Future Admin Routes:** Infrastructure ready for `/editor/*` routes

---

## **📊 Data Architecture**

### **Data Fetching Strategy**
- **Pattern:** TanStack Query hooks encapsulating all Supabase calls
- **Homepage:** Consolidated Edge Function (`get-homepage-feed`)
- **Acervo:** Dedicated Edge Function (`get-acervo-data`)
- **Global Data:** AppDataProvider for sidebar user profile only
- **Rate Limiting:** All Edge Functions protected with configurable rate limits

### **Key Hooks**
- `useConsolidatedHomepageFeedQuery()` - Homepage data
- `useAcervoDataQuery()` - Acervo content and filters
- `useCastVoteMutation()` - Suggestion voting
- `useSubmitSuggestionMutation()` - New suggestion submission

### **API Security**
- **Rate Limiting:** Comprehensive protection across all endpoints
  - Homepage: 60 requests/minute per user
  - Acervo: 30 requests/minute per user
  - Suggestions: 5 submissions/5 minutes per user
  - Voting: 10-20 votes/minute per user
- **Error Handling:** Standardized error responses across all functions
- **RLS Policies:** Complete Row Level Security implementation

---

## **🎨 UI Components & Navigation**

### **Navigation System**
- **Centralized Configuration:** Single source of truth in `src/config/navigation.ts`
- **Role-Based Filtering:** Automatic navigation item filtering based on user permissions
- **Desktop:** Collapsible sidebar with full navigation + admin section separator
- **Mobile:** Bottom tab bar with 4 primary routes (matches desktop exactly)
- **Responsive:** Automatic shell switching via `useIsMobile()`

### **Theme Management**
- **Custom Provider:** Vite-optimized theme system replacing next-themes
- **Features:** Dark/light/system themes with localStorage persistence
- **Performance:** No compatibility issues with Vite environment
- **Accessibility:** Proper theme switching with system preference detection

### **Component Architecture**
- **Shell:** `AppShell` → `DesktopShell` | `MobileShell`
- **Layout:** Consistent header, sidebar, and main content areas
- **UI Library:** shadcn/ui components with custom adaptations
- **Type Safety:** All interfaces centralized in `src/types/index.ts`

---

## **🚀 Current Pages & Features**

### **Implemented Pages**
- **Homepage (`/`):** Featured review, carousels, suggestions polling
- **Acervo (`/acervo`):** Review collection with filtering and search
- **Comunidade (`/comunidade`):** Community features placeholder
- **Perfil (`/perfil`):** User profile management placeholder
- **Configurações (`/configuracoes`):** Settings page placeholder

### **Authentication Pages**
- **Login (`/login`):** Supabase Auth integration
- **Signup (`/signup`):** User registration with profile creation
- **Unauthorized (`/unauthorized`):** Role-based access denial page

---

## **🔮 Future Implementation Ready**

### **Editor Infrastructure (Blueprint 08a_VITE)**
- **Route Structure:** `/editor` dashboard, `/editor/:reviewId` composition
- **Technology Compatibility:** React Flow, dnd-kit, Tiptap all Vite-compatible
- **Access Control:** Role-based protection already implemented with admin navigation section
- **Database Extensions:** Schema ready for editor state and versioning

### **Upcoming Features**
- Visual Composition Engine (Phase 5)
- Real-time collaboration preparation
- Advanced content management tools
- Analytics and moderation features

---

## **⚡ Performance & Optimization**

### **Current Optimizations**
- **Code Splitting:** Vite automatic route-based splitting
- **Query Caching:** TanStack Query with 5-minute stale time
- **Mobile Adaptation:** Responsive design with shell switching
- **Type Safety:** Centralized TypeScript interfaces
- **Theme Performance:** Custom provider optimized for Vite

### **Data Efficiency**
- **Homepage:** Single consolidated API call
- **Caching Strategy:** Intelligent query invalidation
- **Optimistic Updates:** Immediate UI feedback for user actions
- **Rate Limiting:** Prevents API abuse and ensures fair usage

### **Security Measures**
- **Comprehensive Rate Limiting:** All endpoints protected with appropriate limits
- **Automated Cleanup:** Rate limit logs automatically cleaned up
- **Fail-Safe Design:** Rate limiting fails open to prevent service disruption
- **Role-Based Navigation:** Automatic filtering prevents unauthorized access attempts

---

## **📋 Development Guidelines**

### **Code Standards**
- **File Headers:** `// ABOUTME:` describing component purpose
- **Naming:** PascalCase components, camelCase functions, snake_case database
- **Data Fetching:** All API calls via custom TanStack Query hooks
- **State Management:** Local (useState) → Feature (useReducer) → Global (Zustand)

### **Architecture Rules**
- **Golden Rule:** UI components NEVER call Supabase directly
- **Minimal Diffs:** Preserve functionality, change only what's necessary
- **Type Safety:** All interfaces centralized in `src/types/index.ts`
- **Security:** RLS policies + rate limiting enforce all access control
- **Navigation:** All navigation changes go through centralized configuration

---

## **🐛 Known Issues & Constraints**

### **Current Limitations**
- **SEO:** Limited search engine visibility for public content
- **Initial Load:** All application code loaded on first visit
- **Development Environment:** Optimized for Lovable platform constraints

### **Technical Debt**
- None significant - codebase recently restructured and fully optimized

---

## **📚 Key Documentation**

### **Core Documents**
- `[DOC_2]_SYSTEM_ARCHITECTURE.md` - Vite-first architecture
- `[DOC_6]_DATA_FETCHING_STRATEGY.md` - TanStack Query patterns
- `[Blueprint] 08a_EDITOR_BLUEPRINT_VITE.md` - Editor implementation strategy
- `[DOC_5]_API_CONTRACT.md` - Rate limiting and error handling standards

### **Archived Documents**
- `[DOC_9]_MONOREPO_ARCHITECTURE.md` - Future migration reference

---

**✅ All phases of the architectural realignment and operational optimization complete. Foundation stable, documentation accurate, structure optimized, and comprehensive security measures implemented for scalable feature development.**

*This document reflects the true, current state of the EVIDENS platform as of Phase 4 completion.*
