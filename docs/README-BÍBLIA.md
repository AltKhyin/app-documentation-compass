
# **README-BÍBLIA.md**
**The Living State Document for EVIDENS Platform**

---

**Version:** 3.1.0  
**Last Updated:** June 16, 2025  
**Purpose:** This document provides a complete, 2-minute context summary of the current implemented state of the EVIDENS repository for any AI or human developer.

---

## **🎯 Project Status: Phase 3 Complete - Structurally Optimized**

### **Current Implementation State**
- ✅ **Phase 1: Foundation Stabilization** - Navigation unified, all routes working
- ✅ **Phase 2: Documentation Realignment** - Architecture adapted for Vite + React
- ✅ **Phase 3: Structural Optimization** - Directory reorganized, types centralized, role-based access implemented

**Development Phase:** Ready for feature implementation with solid foundation

---

## **🏗️ Current Architecture Overview**

### **Technology Stack**
- **Frontend:** Vite + React 18 + TypeScript (Single-Page Application)
- **Styling:** TailwindCSS + shadcn/ui components
- **State Management:** TanStack Query v5 + Zustand
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Deployment:** Lovable Platform

### **Strategic Trade-offs**
- **SEO Limitation:** Client-side rendering limits search engine indexing of public content
- **Development Speed:** Rapid iteration and interactive user experience prioritized
- **Unified Codebase:** Single application serves both public and admin features via protected routes

---

## **📁 Directory Structure (Post-Phase 3)**

```
/src/
├── components/
│   ├── auth/           # Authentication components (ProtectedRoute, LoginForm)
│   ├── homepage/       # Homepage-specific components (FeaturedReview, ReviewCarousel)
│   ├── acervo/         # Acervo-specific components (ReviewCard, TagsPanel)
│   ├── shell/          # App layout (AppShell, Sidebar, Header)
│   └── ui/             # Reusable shadcn/ui components
├── config/             # Centralized configuration (navigation.ts)
├── contexts/           # React Context providers (AppDataContext)
├── hooks/              # Custom hooks and utilities
├── pages/              # Top-level route components
├── store/              # Zustand global state stores
├── types/              # ✅ NEW: Centralized TypeScript interfaces
├── lib/                # Utility functions and Supabase client
└── integrations/       # Supabase types and client setup
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
- **Future Admin Routes:** Infrastructure ready for `/editor/*` routes

---

## **📊 Data Architecture**

### **Data Fetching Strategy**
- **Pattern:** TanStack Query hooks encapsulating all Supabase calls
- **Homepage:** Consolidated Edge Function (`get-homepage-feed`)
- **Acervo:** Dedicated Edge Function (`get-acervo-data`)
- **Global Data:** AppDataProvider for sidebar user profile only

### **Key Hooks**
- `useConsolidatedHomepageFeedQuery()` - Homepage data
- `useAcervoDataQuery()` - Acervo content and filters
- `useCastVoteMutation()` - Suggestion voting
- `useSubmitSuggestionMutation()` - New suggestion submission

---

## **🎨 UI Components & Navigation**

### **Navigation System**
- **Desktop:** Collapsible sidebar with full navigation
- **Mobile:** Bottom tab bar with 4 primary routes
- **Configuration:** Centralized in `src/config/navigation.ts`
- **Responsive:** Automatic shell switching via `useIsMobile()`

### **Component Architecture**
- **Shell:** `AppShell` → `DesktopShell` | `MobileShell`
- **Layout:** Consistent header, sidebar, and main content areas
- **UI Library:** shadcn/ui components with custom adaptations

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
- **Access Control:** Role-based protection already implemented
- **Database Extensions:** Schema ready for editor state and versioning

### **Upcoming Features**
- Visual Composition Engine (Phase 4)
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

### **Data Efficiency**
- **Homepage:** Single consolidated API call
- **Caching Strategy:** Intelligent query invalidation
- **Optimistic Updates:** Immediate UI feedback for user actions

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
- **Security:** RLS policies enforce all database access control

---

## **🐛 Known Issues & Constraints**

### **Current Limitations**
- **SEO:** Limited search engine visibility for public content
- **Initial Load:** All application code loaded on first visit
- **Development Environment:** Optimized for Lovable platform constraints

### **Technical Debt**
- None significant - codebase recently restructured and optimized

---

## **📚 Key Documentation**

### **Core Documents**
- `[DOC_2]_SYSTEM_ARCHITECTURE.md` - Vite-first architecture
- `[DOC_6]_DATA_FETCHING_STRATEGY.md` - TanStack Query patterns
- `[Blueprint] 08a_EDITOR_BLUEPRINT_VITE.md` - Editor implementation strategy

### **Archived Documents**
- `[DOC_9]_MONOREPO_ARCHITECTURE.md` - Future migration reference

---

**✅ All phases of the architectural realignment complete. Foundation stable, documentation accurate, structure optimized for scalable feature development.**

*This document reflects the true, current state of the EVIDENS platform as of Phase 3 completion.*
