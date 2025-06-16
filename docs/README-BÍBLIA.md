
# EVIDENS - README BÍBLIA 
*A Living State Document*

**Version:** 1.2  
**Last Updated:** June 16, 2025  
**Project Status:** Milestone 3 (Homepage Complete) - COMPLETED ✅

---

## 🎯 **Current Project State** *(2-minute context for any developer)*

EVIDENS is a medical content platform with a React/Supabase architecture. **The homepage is now fully functional with complete backend integration and all UI components implemented.**

### **✅ What's Implemented & Working**

**1. Application Foundation (Milestones 1-2)**
- ✅ **Authentication System**: Supabase Auth with JWT custom claims, login/signup flows
- ✅ **Application Shell**: Responsive desktop/mobile navigation with collapsible sidebar and bottom tabs
- ✅ **User Management**: Practitioners table with role-based access (practitioner/author/editor/admin)
- ✅ **Notifications System**: Bell icon, notification count queries, basic infrastructure

**2. Database Schema (Milestone 3)**
- ✅ **Content Tables**: Reviews, Tags, ReviewTags, CommunityPosts, Suggestions, Analytics_Events, SiteSettings
- ✅ **Row Level Security**: Comprehensive RLS policies for all tables following DOC_4 specifications
- ✅ **Site Settings**: Homepage layout configuration, featured review management
- ✅ **Analytics Infrastructure**: Event tracking and summary tables for reporting
- ✅ **Mock Data**: Essential sample data for immediate functionality testing

**3. Homepage Implementation (Milestone 3 - COMPLETED ✅)**
- ✅ **Edge Functions**: 
  - `get-personalized-recommendations`: Tag-based similarity algorithm for personalized content
  - `get-homepage-feed`: Production-ready API with rate limiting (100 req/60s), error resilience, graceful fallbacks
- ✅ **Data Access Layer**: `useHomepageFeedQuery` hook implementing TanStack Query patterns
- ✅ **UI Components**: Complete implementation of all homepage modules:
  - `FeaturedReview`: Hero section with cover image overlay and CTA
  - `ReviewCarousel`: Horizontal scrolling lists with desktop/mobile adaptation
  - `NextEditionModule`: Suggestion submission and voting interface
  - `SuggestionPollItem`: Interactive voting components with optimistic updates
  - `ReviewCard`: Consistent card design with view counts and metadata
- ✅ **Algorithms Implemented**:
  - Time-decaying popularity scoring: Simplified algorithm for current schema
  - Personalized recommendations based on user's tag interaction history
- ✅ **Error Handling**: Comprehensive error boundaries, graceful degradation, fallback states
- ✅ **Performance**: Rate limiting, caching strategies, optimized queries
- ✅ **CORS Compliance**: Production-ready CORS handling in all Edge Functions

### **🚧 What's Next (Immediate Priorities)**

**Review Detail Pages & Content Creation:**
1. **Review Detail Implementation**: Individual review pages with structured content rendering
2. **Visual Composition Engine**: Admin interface for content creation (per Blueprint 08a)
3. **Community Features**: Post creation, commenting, voting systems
4. **User Profile Management**: Profile editing, preferences, subscription management

---

## 🏗️ **Technical Architecture**

### **Frontend Stack**
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI components
- **State Management**: TanStack Query (server state) + Zustand (global client state)
- **Routing**: React Router DOM v6

### **Backend Stack** 
- **Database**: PostgreSQL (Supabase-managed) with complete schema
- **Authentication**: Supabase Auth with JWT custom claims
- **API Layer**: Supabase auto-generated REST + custom Edge Functions with rate limiting
- **File Storage**: Supabase Storage (configured, ready for use)

### **Data Flow Pattern**
```
UI Components → useQuery/useMutation Hooks → Supabase Client → Database/Edge Functions
```
**RULE**: UI components NEVER call supabase client directly (per DOC_6)

### **Performance & Reliability**
- **Rate Limiting**: 100 requests per 60 seconds on homepage feed
- **Error Resilience**: Graceful degradation with fallback data
- **Caching**: 5-minute stale time, 15-minute cache retention
- **Monitoring**: Comprehensive logging in all Edge Functions

---

## 📁 **Project Structure**

```
src/
├── components/
│   ├── auth/          # Login, signup, session management
│   ├── homepage/      # Complete homepage module system
│   │   ├── FeaturedReview.tsx     # Hero section component
│   │   ├── ReviewCarousel.tsx     # Horizontal scrolling lists
│   │   ├── ReviewCard.tsx         # Individual review cards
│   │   ├── NextEditionModule.tsx  # Suggestion system
│   │   └── SuggestionPollItem.tsx # Voting interface
│   ├── shell/         # AppShell, sidebars, navigation
│   └── ui/            # Shadcn/UI base components
├── hooks/             # Custom React hooks
├── integrations/
│   └── supabase/      # Supabase client and types
├── pages/             # Route components
│   └── Index.tsx      # Complete homepage implementation
└── store/             # Zustand global state

packages/
└── hooks/             # Shared TanStack Query hooks
   └── useHomepageFeedQuery.ts  # Production-ready data fetching

supabase/
├── functions/         # Edge Functions with rate limiting
│   ├── get-homepage-feed/          # Complete homepage API
│   └── get-personalized-recommendations/
└── migrations/        # Complete database schema and policies
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

### **Rate Limiting & Security**
- Homepage feed: 100 requests per 60 seconds per client IP
- CORS properly configured for production
- All Edge Functions include comprehensive error handling

---

## 🔌 **API Endpoints**

### **Auto-Generated (Supabase REST)**
- `GET /rest/v1/Reviews` - List reviews (RLS-filtered)
- `GET /rest/v1/Practitioners` - User profiles  
- `GET /rest/v1/Notifications` - User notifications
- `GET /rest/v1/Suggestions` - Topic suggestions with voting
- *All CRUD operations follow this pattern*

### **Custom Edge Functions**
- `POST /functions/v1/get-homepage-feed` - Complete homepage data with rate limiting
- `POST /functions/v1/get-personalized-recommendations` - User-specific content recommendations

**Rate Limiting**: Production-ready with 100 req/60s on homepage feed

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
- Progressive disclosure: Optimistic updates and loading states

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

### **Rate Limiting**
- Homepage feed: 100 requests per 60 seconds per client IP
- Graceful degradation when limits exceeded
- Monitoring and logging for abuse detection

---

## 🐛 **Known Issues & Limitations**

### **Current Technical Debt**
- [ ] No file upload/storage integration yet
- [ ] Analytics events not yet being generated by frontend
- [ ] Suggestion/voting mutations not yet connected to backend
- [ ] Community posts integration pending (for enhanced popularity scoring)

### **Completed Milestones** ✅
- [x] Application shell and navigation
- [x] Authentication system with JWT claims
- [x] Complete database schema with RLS
- [x] Homepage backend with rate limiting
- [x] Homepage frontend with all components
- [x] Error handling and graceful degradation
- [x] CORS compliance for production

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

*This document is automatically updated with every significant codebase change. Last verification: Homepage completion - June 16, 2025.*
