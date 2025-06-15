
# EVIDENS - README BÍBLIA 
*A Living State Document*

**Version:** 1.1  
**Last Updated:** June 15, 2025  
**Project Status:** Milestone 3 (Homepage Backend) - COMPLETED

---

## 🎯 **Current Project State** *(2-minute context for any developer)*

EVIDENS is a medical content platform with a React/Supabase architecture. **The application shell and homepage backend are now complete and functional.**

### **✅ What's Implemented & Working**

**1. Application Foundation (Milestones 1-2)**
- ✅ **Authentication System**: Supabase Auth with JWT custom claims, login/signup flows
- ✅ **Application Shell**: Responsive desktop/mobile navigation with collapsible sidebar and bottom tabs
- ✅ **User Management**: Practitioners table with role-based access (practitioner/author/editor/admin)
- ✅ **Notifications System**: Bell icon, notification count queries, basic infrastructure

**2. Database Schema (Milestone 3)**
- ✅ **Content Tables**: Reviews, Tags, ReviewTags, CommunityPosts, Suggestions, Analytics_Events
- ✅ **Row Level Security**: Comprehensive RLS policies for all tables following DOC_4 specifications
- ✅ **Site Settings**: Homepage layout configuration, featured review management
- ✅ **Analytics Infrastructure**: Event tracking and summary tables for reporting

**3. Homepage Backend (Milestone 3 - COMPLETED)**
- ✅ **Edge Functions**: 
  - `get-personalized-recommendations`: Tag-based similarity algorithm for personalized content
  - `get-homepage-feed`: Consolidated API returning all homepage data in single request
- ✅ **Data Access Layer**: `useHomepageFeedQuery` hook implementing TanStack Query patterns
- ✅ **Algorithms Implemented**:
  - Time-decaying popularity scoring: `(views_last_7_days * 3) + (views_last_30_days * 1) + (total_comments * 5) + (total_upvotes * 2)`
  - Personalized recommendations based on user's tag interaction history

### **🚧 What's Next (Immediate Priorities)**

**Frontend Implementation Needed:**
1. **Homepage UI Components**: FeaturedReview, ReviewCarousel, NextEditionModule, ReviewCard, SuggestionPollItem
2. **Data Integration**: Connect homepage components to `useHomepageFeedQuery` hook
3. **Mobile Adaptation**: Implement responsive transformations per DOC_8

---

## 🏗️ **Technical Architecture**

### **Frontend Stack**
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI components
- **State Management**: TanStack Query (server state) + Zustand (global client state)
- **Routing**: React Router DOM v6

### **Backend Stack** 
- **Database**: PostgreSQL (Supabase-managed)
- **Authentication**: Supabase Auth with JWT custom claims
- **API Layer**: Supabase auto-generated REST + custom Edge Functions
- **File Storage**: Supabase Storage (configured but not yet used)

### **Data Flow Pattern**
```
UI Components → useQuery/useMutation Hooks → Supabase Client → Database/Edge Functions
```
**RULE**: UI components NEVER call supabase client directly (per DOC_6)

---

## 📁 **Project Structure**

```
src/
├── components/
│   ├── auth/          # Login, signup, session management
│   ├── shell/         # AppShell, sidebars, navigation
│   └── ui/            # Shadcn/UI base components
├── hooks/             # Custom React hooks
├── integrations/
│   └── supabase/      # Supabase client and types
├── pages/             # Route components
└── store/             # Zustand global state

packages/
└── hooks/             # Shared TanStack Query hooks
   └── useHomepageFeedQuery.ts

supabase/
├── functions/         # Edge Functions
│   ├── get-homepage-feed/
│   └── get-personalized-recommendations/
└── migrations/        # Database schema and policies
```

---

## 🔐 **Security & Access Control**

### **User Roles & Permissions**
- **Anonymous**: Public content only
- **Practitioner** (free): Public + free-tier content 
- **Practitioner** (paying): All published content
- **Author**: Can create/edit own reviews
- **Editor**: Can manage any content
- **Admin**: Full system access

### **Authentication Flow**
1. User signs up/logs in via Supabase Auth
2. `handle_new_user` trigger creates Practitioners record
3. JWT includes custom claims: `role`, `subscription_tier`
4. RLS policies enforce access control using `get_my_claim()` helper

---

## 🔌 **API Endpoints**

### **Auto-Generated (Supabase REST)**
- `GET /rest/v1/Reviews` - List reviews (RLS-filtered)
- `GET /rest/v1/Practitioners` - User profiles  
- `GET /rest/v1/Notifications` - User notifications
- *All CRUD operations follow this pattern*

### **Custom Edge Functions**
- `POST /functions/v1/get-homepage-feed` - Complete homepage data
- `POST /functions/v1/get-personalized-recommendations` - User-specific content recommendations

**Rate Limiting**: Currently none implemented - needs review for production

---

## 🎨 **UI Design System**

**Core Theme**: Medical professionalism with clean, accessible design
- **Font**: System font stack optimized for readability
- **Colors**: Neutral palette with blue accent (medical trust)
- **Components**: Built on Shadcn/UI for consistency
- **Responsive**: Mobile-first with specific tablet/desktop enhancements

**Mobile Adaptations** (per DOC_8):
- Navigation: Bottom tab bar on mobile, collapsible sidebar on desktop
- Carousels: Swipeable with 1.5 cards visible on mobile
- Progressive disclosure: "Ver todas" links for expanded content

---

## 🚀 **Development Workflow**

### **Starting Development**
```bash
# Install dependencies
npm install

# Start local development
npm run dev

# Start Supabase (if needed)
npx supabase start
```

### **Database Changes**
1. Create migration: `npx supabase migration new description`
2. Write SQL in migration file
3. Apply: `npx supabase db push`
4. Update types: `npx supabase gen types typescript --local > src/integrations/supabase/types.ts`

### **Deployment**
- **Frontend**: Auto-deployed via Lovable
- **Edge Functions**: Auto-deployed with code changes
- **Database**: Migrations applied via Supabase dashboard

---

## 📊 **Performance Considerations**

### **Caching Strategy**
- **Homepage Data**: 5-minute stale time, 15-minute cache time
- **User Profile**: Long-lived cache with optimistic updates
- **Review Content**: CDN-cached with strategic invalidation

### **Database Optimization**
- Indexes on frequently queried columns (created_at, published_at, author_id)
- RLS policies optimized to avoid sequential scans
- Analytics events use bulk inserts for performance

---

## 🐛 **Known Issues & Limitations**

### **Current Technical Debt**
- [ ] No rate limiting on Edge Functions
- [ ] Analytics events not yet being generated by frontend
- [ ] No file upload/storage integration yet
- [ ] Mobile UI components not yet implemented

### **Missing Features** *(Planned for future milestones)*
- Content creation interface (Visual Composition Engine)
- Community features (posts, comments, voting)
- User profile management
- Advanced search and filtering
- Admin dashboard
- Email notifications

---

## 📚 **Key Documentation References**

**For Architecture Decisions:**
- `[DOC_2]_SYSTEM_ARCHITECTURE.md` - Overall technical blueprint
- `[DOC_6]_DATA_FETCHING_STRATEGY.md` - Required TanStack Query patterns

**For Implementation:**
- `docs/blueprints/03_HOMEPAGE_BLUEPRINT.md` - Complete homepage specification
- `[DOC_4]_ROW_LEVEL_SECURITY.md` - Security policies
- `[DOC_8]_MOBILE_ADAPTATION.md` - Responsive design rules

**For Database:**
- `[DOC_3]_DATABASE_SCHEMA.md` - Complete schema definitions
- `supabase/migrations/` - Applied database changes

---

*This document is automatically updated with every significant codebase change. Last verification: Milestone 3 completion.*
