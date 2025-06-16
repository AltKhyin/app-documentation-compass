
# README-BÍBLIA.md

**EVIDENS Universal Knowledge Base**  
Version: 2.0.2 - **Production Ready**  
Last Updated: June 16, 2025

---

## 🎯 **EVIDENS PROJECT OVERVIEW**

**EVIDENS** is a comprehensive, evidence-based medical knowledge platform that enables healthcare practitioners to access curated scientific reviews, participate in community discussions, and contribute to the next generation of medical evidence synthesis.

### **Current Implementation Status: ✅ COMPLETE & OPERATIONAL**

---

## 🏗️ **SYSTEM ARCHITECTURE**

### **Technology Stack**
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query + Zustand
- **Authentication**: Supabase Auth with JWT + RLS

### **Database Schema (Production Ready)**
```
├── Practitioners (Users/Profiles) ✅
├── Reviews (Medical Content) ✅
├── Suggestions (Next Edition Voting) ✅
├── Suggestion_Votes (Voting System) ✅
├── Notifications (User Alerts) ✅
├── OnboardingQuestions/Answers ✅
└── SiteSettings (Configuration) ✅
```

---

## 🚀 **IMPLEMENTED FEATURES**

### **🔐 Authentication System (✅ COMPLETE)**
- **Location**: `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`
- **Features**: Email/password auth, JWT tokens, RLS security
- **Security**: Row-level security policies for all tables
- **Status**: Production ready with proper error handling

### **🏠 Homepage (✅ COMPLETE)**
- **Location**: `src/pages/Index.tsx`
- **Architecture**: Single consolidated API call via `get-homepage-feed` Edge Function
- **Modules**:
  - Featured Review display ✅
  - Recent Reviews carousel ✅
  - Popular Reviews carousel ✅
  - Next Edition voting system ✅
- **Performance**: Optimized with single API call, TanStack Query caching
- **Status**: **OPERATIONAL** - All modules display correctly with proper data

### **🗳️ Suggestion Voting System (✅ COMPLETE & FIXED)**
- **Location**: `src/components/homepage/NextEditionModule.tsx`
- **Features**: 
  - Submit new topic suggestions ✅
  - Vote/unvote on existing suggestions ✅
  - Real-time vote count updates ✅
  - Simplified state management without race conditions ✅
- **Backend**: `cast-suggestion-vote` Edge Function with rate limiting (10 votes/minute)
- **Database**: Proper vote counting with triggers, optimized indexes
- **Status**: **FULLY OPERATIONAL** - Voting system completely fixed, race conditions eliminated

### **🛡️ Security & Performance (✅ OPTIMIZED)**
- **RLS Policies**: Comprehensive policies on all tables ✅
- **Database Optimization**: 
  - Foreign key indexes added ✅
  - Conflicting policies resolved ✅
  - Vote counting triggers optimized ✅
- **Edge Functions**: Rate limiting (10 req/min), proper error handling ✅
- **Status**: All Supabase Security Advisor alerts resolved

---

## 📊 **API ARCHITECTURE**

### **Edge Functions (Production)**
1. **`get-homepage-feed`** - Consolidated homepage data ✅
2. **`cast-suggestion-vote`** - Vote casting with rate limiting ✅
3. **`submit-suggestion`** - New suggestion submission ✅
4. **`get-personalized-recommendations`** - ML-based recommendations ✅

### **Data Fetching Strategy**
- **Single Source of Truth**: `useConsolidatedHomepageFeedQuery` hook
- **Caching**: TanStack Query with 5-minute stale time
- **Error Handling**: Retry logic with exponential backoff
- **Performance**: Parallel server-side queries in Edge Functions

---

## 🔧 **CRITICAL IMPLEMENTATION DETAILS**

### **Voting System Data Flow (FULLY FIXED)**
1. **Frontend**: `SuggestionPollItem` → `useCastVoteMutation` 
2. **Edge Function**: `cast-suggestion-vote` with validation and rate limiting
3. **Database**: `Suggestion_Votes` table with triggers for count updates
4. **State Management**: Simplified component state using suggestion props as single source of truth

### **Database Performance (OPTIMIZED)**
- **Indexes**: Added on all foreign keys for performance
- **Policies**: Consolidated RLS policies to eliminate conflicts
- **Triggers**: Optimized vote counting with `SECURITY DEFINER`

### **Security Model**
- **Authentication**: JWT with custom claims (role, subscription_tier)
- **Authorization**: RLS policies per table with `get_my_claim()` function
- **Rate Limiting**: 10 votes per minute per user on voting endpoints

---

## 🧪 **TESTING & VALIDATION**

### **Production Verification Checklist**
- ✅ Authentication flow works end-to-end
- ✅ Homepage loads with all modules
- ✅ **FIXED**: Suggestions display with practitioner names
- ✅ **FIXED**: Voting system works without race conditions
- ✅ **OPTIMIZED**: Database performance alerts resolved
- ✅ All Edge Functions respond correctly with rate limiting
- ✅ RLS policies enforce proper access control

---

## 🎯 **NEXT DEVELOPMENT PHASES**

### **Phase 1: Content Management (READY TO START)**
- Review creation/editing interface
- Content moderation tools
- Publishing workflow

### **Phase 2: Community Features (PLANNED)**
- Discussion forums
- User profiles with contribution tracking
- Advanced recommendation engine

### **Phase 3: Analytics & Insights (PLANNED)**
- Usage analytics dashboard
- Content performance metrics
- User engagement tracking

---

## 🔍 **DEBUGGING & TROUBLESHOOTING**

### **Issues Resolved in v2.0.2**
1. **Voting Race Conditions** - FIXED by simplifying state management in SuggestionPollItem
2. **State Synchronization** - RESOLVED by using suggestion props as single source of truth
3. **Rate Limiting** - ADDED to voting endpoints (10 votes/minute per user)
4. **Error Handling** - IMPROVED with proper toast notifications and logging

### **Monitoring Points**
- Edge Function logs in Supabase dashboard
- Database performance metrics
- User authentication success rates
- API response times via TanStack Query devtools
- Rate limiting violations in function logs

---

**📋 STATUS SUMMARY: EVIDENS v2.0.2 is production-ready with a fully functional homepage, authentication system, completely operational suggestion voting system with race condition fixes, and comprehensive rate limiting. The platform is now ready for content management development.**

---

*This document serves as the definitive source of truth for the current state of the EVIDENS platform. All developers must reference this document before making any architectural decisions.*
