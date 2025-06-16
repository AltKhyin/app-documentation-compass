
# **[DOC_2] System Architecture**

**Version:** 3.0 (Vite-First Update)  
**Date:** June 16, 2025  
**Purpose:** This document defines the canonical system architecture for the EVIDENS platform, optimized for the Vite + React development environment.

---

## **1.0 Architecture Overview**

### **1.1 Core Technology Stack**

**Frontend Application:**
- **Framework:** Vite + React 18 (Single-Page Application)
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui components
- **State Management:** TanStack Query v5 + Zustand
- **Routing:** React Router v6
- **Build Tool:** Vite

**Backend Services:**
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth with JWT custom claims
- **API Layer:** Supabase auto-generated APIs + Edge Functions
- **File Storage:** Supabase Storage
- **Real-time:** Supabase Realtime (WebSocket)

### **1.2 Application Architecture**

The EVIDENS platform is implemented as a unified, client-side rendered (CSR) application. This single application serves:

1. **Public Interface:** Homepage, Acervo (review collection), community features
2. **Authenticated Experience:** User profiles, personalized feeds, contribution features  
3. **Administrative Interface:** Content management and moderation (via protected routes)

### **1.3 Architectural Trade-offs**

The selection of a Vite + React Single-Page Application (SPA) architecture prioritizes:

**Advantages:**
- Rapid development iteration
- Highly interactive user experience
- Seamless client-side routing
- Optimized for dynamic, data-driven interfaces
- Strong development tooling and hot-reload capabilities

**Strategic Trade-offs:**
- **Search Engine Optimization (SEO):** As a Client-Side Rendered application, content is generated in the user's browser. This makes it challenging for search engine crawlers to index public content effectively, limiting organic discovery via search engines like Google. This is a known and accepted constraint of the current architecture.
- **Initial Load Time:** All application code is loaded on first visit, though this is mitigated by Vite's code-splitting capabilities.

---

## **2.0 Frontend Application Structure**

### **2.1 Directory Organization**

The application follows a feature-first organization pattern within the `src/` directory:

```
/src/
├── components/
│   ├── shell/          # App layout (AppShell, Sidebar, Header)
│   ├── homepage/       # Homepage-specific components
│   ├── acervo/         # Acervo-specific components
│   ├── auth/           # Authentication components
│   └── ui/             # Reusable UI components (buttons, cards, etc.)
├── config/             # Application configuration (navigation, constants)
├── contexts/           # React Context providers
├── hooks/              # Custom hooks and TanStack Query hooks
├── pages/              # Top-level route components
├── store/              # Zustand global state stores
├── lib/                # Utility functions and Supabase client
└── types/              # Shared TypeScript interfaces
```

### **2.2 Component Architecture Principles**

1. **Atomic Design:** UI components are organized from atomic (Button) to complex (ReviewCarousel)
2. **Feature Isolation:** Feature-specific components are co-located with their logic
3. **Shared UI Library:** Common components are centralized in `components/ui/`
4. **Responsive Design:** All components implement mobile-first, adaptive designs

### **2.3 State Management Strategy**

**Local State:** `useState` and `useReducer` for component-specific state
**Server State:** TanStack Query for all API interactions and caching
**Global State:** Zustand for authentication state and app-wide configuration
**Form State:** React Hook Form for complex form interactions

---

## **3.0 Backend Architecture**

### **3.1 Supabase Services Integration**

**Database Layer:**
- PostgreSQL with Row Level Security (RLS) policies
- Auto-generated REST APIs with real-time subscriptions
- Custom database functions for complex business logic

**Authentication:**
- JWT-based authentication with custom claims
- Role-based access control (practitioner, moderator, admin)
- OAuth providers (Google) + email/password

**Edge Functions:**
- Server-side business logic for complex operations
- Rate limiting and input validation
- Integration with external services

### **3.2 Data Fetching Architecture**

All data fetching follows the patterns defined in [DOC_6]_DATA_FETCHING_STRATEGY.md:

**Golden Rules:**
1. UI components NEVER call Supabase client directly
2. All data access is encapsulated in custom hooks
3. Mutations invalidate relevant queries for consistency

**Hook Patterns:**
```typescript
// Queries (READ operations)
useConsolidatedHomepageFeedQuery()
useAcervoDataQuery()
useUserProfileQuery()

// Mutations (WRITE operations)  
useCastVoteMutation()
useSubmitSuggestionMutation()
useUpdateProfileMutation()
```

---

## **4.0 Security Architecture**

### **4.1 Authentication & Authorization**

**JWT Custom Claims:** User roles and subscription tiers are embedded in JWT tokens via database triggers
**Row Level Security:** All database access is controlled via RLS policies
**Route Protection:** Sensitive routes use `ProtectedRoute` component with role checking
**API Rate Limiting:** All Edge Functions implement rate limiting

### **4.2 Data Access Patterns**

**Public Data:** Available to anonymous users (published reviews, public profiles)
**User Data:** Accessible only to the authenticated user (personal settings, private data)
**Tier-based Access:** Premium content restricted by subscription tier
**Admin Data:** Administrative functions restricted to admin role

---

## **5.0 Performance & Scalability**

### **5.1 Client-Side Optimizations**

**Code Splitting:** Vite automatically splits code by routes and components
**Query Caching:** TanStack Query provides aggressive caching with 5-minute stale time
**Optimistic Updates:** User interactions update immediately with server synchronization
**Image Optimization:** Responsive images with proper sizing and lazy loading

### **5.2 Database Optimizations**

**Indexing:** Critical foreign keys and query patterns are indexed
**Query Optimization:** Database functions minimize round-trips
**Connection Pooling:** Managed by Supabase infrastructure
**Realtime Subscriptions:** Used sparingly for critical real-time features

---

## **6.0 Future Extensibility**

### **6.1 Protected Route Admin Features**

The current architecture supports future admin functionality through:
- Role-based route protection (`/admin/*` routes)
- Enhanced `ProtectedRoute` component with role checking
- Shared component library for consistent admin UI

### **6.2 Migration Considerations**

Should future requirements necessitate:
- **Server-Side Rendering:** The component architecture is compatible with Next.js migration
- **Multi-app Structure:** Components can be extracted to shared packages
- **API Gateway:** Edge Functions can be migrated to dedicated backend services

---

*End of [DOC_2] System Architecture*
