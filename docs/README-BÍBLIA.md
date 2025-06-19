
# EVIDENS - The Brazilian Evidence-Based Medicine Platform
**Versão: 2.0.0** | **Data: 19 de Junho de 2025** | **Status: 🟡 Community Enhancement - Critical Path Implementation**

## 📋 RESUMO EXECUTIVO

O EVIDENS é uma plataforma de medicina baseada em evidências que conecta profissionais da saúde brasileiros através de Reviews científicos curados e uma comunidade ativa de discussão.

### 🎯 Status Atual do Projeto
- ✅ **Autenticação & Perfis**: Sistema completo com RLS
- ✅ **Homepage**: Layout responsivo com carrosséis funcionais  
- ✅ **Acervo**: Sistema de busca, filtros e tags implementado
- ✅ **Review Detail**: Renderização de conteúdo estruturado v2.0
- ✅ **Community Core**: Feed, sidebar, voting, e save functionality completos
- ✅ **Database Foundation**: SavedPosts e multimedia support schema
- ✅ **Backend Services**: Save/unsave posts, individual post pages
- ✅ **UI Integration**: Save buttons e gestão de posts salvos
- 🔴 **CRITICAL ISSUE**: RPC function `create_post_and_auto_vote` não encontrada
- 🟡 **Community Multimedia**: **PRÓXIMA FASE** - Aguardando correção de RPC
- ⏳ **Editor**: Aguardando conclusão do Community
- ⏳ **Admin Panel**: Próxima fase

## 🚨 CRITICAL ISSUES IDENTIFIED

### 🔴 Priority 1: RPC Function Missing
**Issue:** Edge Function `create-community-post` failing with error:
```
Could not find the function public.create_post_and_auto_vote(p_author_id, p_category, p_content, p_title) in the schema cache
```

**Impact:** Users cannot create new community posts
**Status:** BLOCKING - Must be resolved before multimedia implementation

### 🔴 Priority 2: Storage Infrastructure Missing
**Issue:** No Supabase Storage buckets configured for multimedia content
**Impact:** Cannot implement image/video uploads
**Status:** BLOCKING - Required for multimedia posts

## 🏗️ ARQUITETURA ATUAL

### Frontend (React + Vite)
```
src/
├── components/
│   ├── auth/                    # ✅ Autenticação completa
│   ├── shell/                   # ✅ Navigation + responsive
│   ├── homepage/                # ✅ Carrosséis funcionais
│   ├── acervo/                  # ✅ Search + filters
│   ├── review-detail/           # ✅ Structured content v2.0
│   └── community/               # ✅ Core functionality + ❌ Post creation broken
│       ├── CommunityFeedWithSidebar.tsx    # ✅ Layout principal
│       ├── PostCard.tsx                    # ✅ Cards com save button
│       ├── PostDetailCard.tsx              # ✅ Visualização detalhada
│       ├── VoteButtons.tsx                 # ✅ Sistema de votação
│       ├── PostActionBar.tsx               # ✅ Save/share functionality
│       ├── CommunitySidebar.tsx            # ✅ Com quick actions
│       ├── TiptapEditor.tsx                # 🟡 Needs selection formatting
│       ├── CreatePostForm.tsx              # 🔴 BROKEN - RPC errors
│       └── sidebar/                        # ✅ Módulos da sidebar
├── pages/
│   ├── community/
│   │   ├── ComunidadePage.tsx             # ✅ Main feed
│   │   ├── CommunityPostPage.tsx          # ✅ Single post view
│   │   └── SubmitPage.tsx                 # 🔴 BROKEN - Cannot create posts
│   └── SavedPostsPage.tsx                 # ✅ Gestão de posts salvos
└── packages/hooks/
    ├── useCommunityPageQuery.ts           # ✅ Consolidated data
    ├── useSavePostMutation.ts             # ✅ Save/unsave posts
    ├── useSavedPostsQuery.ts              # ✅ Fetch saved posts
    ├── usePostDetailQuery.ts              # ✅ Single post data
    ├── useCreateCommunityPostMutation.ts  # 🔴 BROKEN - RPC errors
    └── [PENDING] useCreateMediaPostMutation.ts # ⏳ Multimedia posts
```

### Backend (Supabase)
```
Database Schema:
├── CommunityPosts                         # ✅ Enhanced with multimedia fields
│   ├── [existing fields...]
│   ├── image_url (TEXT)                   # ✅ Schema ready
│   ├── video_url (TEXT)                   # ✅ Schema ready
│   └── poll_data (JSONB)                  # ✅ Schema ready
├── SavedPosts                             # ✅ Fully implemented
│   ├── id (UUID, PK)
│   ├── practitioner_id (UUID, FK)
│   ├── post_id (INTEGER, FK)
│   └── created_at (TIMESTAMPTZ)

Edge Functions:
├── get-community-page-data/               # ✅ Consolidated feed
├── save-post/                             # ✅ Save/unsave functionality
├── get-saved-posts/                       # ✅ Fetch saved posts with pagination
├── get-community-post-detail/             # ✅ Individual post data
├── create-community-post/                 # 🔴 BROKEN - Missing RPC function
└── cast-post-vote/                        # ✅ Voting functionality

Missing Database Functions:
├── create_post_and_auto_vote              # 🔴 CRITICAL - Not implemented
├── Storage Buckets                        # 🔴 CRITICAL - Not configured
└── Media upload policies                  # 🔴 CRITICAL - Not implemented
```

## 🚀 IMPLEMENTATION PLAN v2.0 - CRITICAL PATH PRIORITIZATION

### 📊 PROGRESS TRACKING
**Overall Progress:** 66.7% → Target: 100%
**Current Phase:** Critical Path Resolution
**Next Release:** v2.1.0 (Functional Community Posts)

---

## 🔥 MILESTONE 1: CRITICAL SYSTEM REPAIRS
**Objective:** Restore basic community post creation functionality
**Priority:** P0 - BLOCKING
**Target Completion:** Immediate

### 1.1 Database RPC Function Implementation
**Objective:** Create missing `create_post_and_auto_vote` database function

**Files to Create/Modify:**
- New SQL migration for RPC function
- `supabase/functions/create-community-post/index.ts` (update to match RPC signature)

**Technical Specification:**
1. Create transactional RPC function `create_post_and_auto_vote` with parameters:
   - `p_author_id UUID`
   - `p_title TEXT`
   - `p_content TEXT`
   - `p_category TEXT`
   - `p_post_type TEXT DEFAULT 'text'`
2. Function must perform atomic transaction:
   - INSERT into `CommunityPosts` with `upvotes = 1`
   - INSERT into `CommunityPost_Votes` for auto-upvote
   - UPDATE `Practitioners.contribution_score` +1
   - RETURN complete post object with author data
3. Add proper error handling and constraints validation
4. Update Edge Function to use correct RPC signature

**Governing Directives:** [DAL.1], [DAL.2], [SEC.1], [D3.5]

**Verification Criteria:**
- [ ] RPC function executes without errors
- [ ] Post creation form submits successfully
- [ ] Auto-upvote is applied correctly
- [ ] Contribution score increments
- [ ] Post appears in community feed immediately

### 1.2 Edge Function Synchronization
**Objective:** Update `create-community-post` Edge Function to match database RPC

**Files to Modify:**
- `supabase/functions/create-community-post/index.ts`

**Technical Specification:**
1. Update RPC call to use correct function name and parameters
2. Add comprehensive error logging for debugging
3. Implement proper response formatting
4. Add input validation for all post types
5. Update rate limiting configuration

**Governing Directives:** [D3.5], [P1.2]

**Verification Criteria:**
- [ ] Edge Function logs show successful RPC calls
- [ ] Error responses are properly formatted
- [ ] Rate limiting functions correctly
- [ ] All post categories work

---

## 📦 MILESTONE 2: STORAGE INFRASTRUCTURE SETUP
**Objective:** Configure Supabase Storage for multimedia content
**Priority:** P1 - HIGH
**Dependencies:** Milestone 1 complete

### 2.1 Storage Bucket Configuration
**Objective:** Create and configure storage buckets for community media

**Files to Create/Modify:**
- New SQL migration for storage buckets and policies
- Storage bucket policies for RLS

**Technical Specification:**
1. Create storage bucket `community-media` with public access
2. Implement RLS policies for secure file uploads:
   - Users can upload files they own
   - All users can read public files
   - File size limits: 10MB for images, 100MB for videos
3. Create file naming convention: `posts/{post_id}/{timestamp}_{filename}`
4. Configure automatic cleanup policies for abandoned uploads

**Governing Directives:** [SEC.1], [SEC.2], [D3.5]

**Verification Criteria:**
- [ ] Storage bucket accessible via Supabase dashboard
- [ ] Upload policies work for authenticated users
- [ ] File size limits enforced
- [ ] Naming convention applied correctly

### 2.2 Media Upload Utilities
**Objective:** Create reusable utilities for file uploads

**Files to Create:**
- `src/lib/uploadUtils.ts` (client-side upload helpers)
- `src/hooks/useFileUpload.ts` (upload hook with progress)

**Technical Specification:**
1. Implement file validation (type, size, dimensions)
2. Create upload progress tracking
3. Add image compression for web optimization
4. Implement upload cancellation
5. Add retry logic for failed uploads

**Governing Directives:** [D3.1], [D3.2], [AD.1]

**Verification Criteria:**
- [ ] File validation works for all supported formats
- [ ] Upload progress displays correctly
- [ ] Compression reduces file sizes appropriately
- [ ] Cancellation stops uploads immediately

---

## 🖼️ MILESTONE 3: IMAGE POST IMPLEMENTATION
**Objective:** Enable image posts with upload and display functionality
**Priority:** P1 - HIGH  
**Dependencies:** Milestones 1 & 2 complete

### 3.1 Enhanced Post Creation Form
**Objective:** Add image upload capability to `CreatePostForm`

**Files to Modify:**
- `src/components/community/CreatePostForm.tsx`
- `src/packages/hooks/useCreateCommunityPostMutation.ts`

**Technical Specification:**
1. Add post type selection (text, image, video, poll)
2. Implement image upload component with preview
3. Add drag-and-drop functionality
4. Integrate with storage upload utilities
5. Update mutation hook to handle image URLs
6. Add proper loading states and error handling

**Governing Directives:** [D3.2], [AD.1], [AD.4]

**Verification Criteria:**
- [ ] Post type selection works correctly
- [ ] Image upload shows progress
- [ ] Preview displays uploaded images
- [ ] Form validation prevents invalid submissions
- [ ] Image posts display correctly in feed

### 3.2 Image Post Display Enhancement
**Objective:** Update post display components for image content

**Files to Modify:**
- `src/components/community/PostCard.tsx`
- `src/components/community/PostDetailCard.tsx`

**Technical Specification:**
1. Add image display with responsive sizing
2. Implement lightbox functionality for full-size viewing
3. Add lazy loading for performance
4. Include alt text and accessibility features
5. Add image loading error handling

**Governing Directives:** [AD.1], [AD.2], [D3.6]

**Verification Criteria:**
- [ ] Images display with correct aspect ratios
- [ ] Lightbox opens on image click
- [ ] Lazy loading improves page performance
- [ ] Screen readers can access image content
- [ ] Error states display gracefully

---

## 🎥 MILESTONE 4: ENHANCED MULTIMEDIA FEATURES  
**Objective:** Complete multimedia ecosystem with videos and polls
**Priority:** P2 - MEDIUM
**Dependencies:** Milestone 3 complete

### 4.1 Video Post Implementation
**Objective:** Enable video uploads and playback

**Files to Create/Modify:**
- `src/components/community/VideoPlayer.tsx` (new component)
- Update `CreatePostForm.tsx` for video uploads
- Update display components for video content

**Technical Specification:**
1. Create custom video player component
2. Add video upload with compression
3. Implement thumbnail generation
4. Add playback controls and progress tracking
5. Mobile-optimized video playback

**Governing Directives:** [AD.1], [AD.4], [D3.6]

**Verification Criteria:**
- [ ] Video uploads complete successfully
- [ ] Thumbnails generate automatically
- [ ] Video player works on all devices
- [ ] Playback controls function properly

### 4.2 Poll Creation System
**Objective:** Enable interactive poll posts

**Files to Create:**
- `src/components/community/PollCreator.tsx`
- `src/components/community/PollDisplay.tsx`
- `src/hooks/usePollVoting.ts`

**Technical Specification:**
1. Create poll creation interface with multiple options
2. Implement poll voting with real-time updates
3. Add poll expiration functionality
4. Create poll results visualization
5. Prevent duplicate voting

**Governing Directives:** [D3.3], [DAL.1], [SEC.1]

**Verification Criteria:**
- [ ] Polls create with multiple options
- [ ] Voting updates in real-time
- [ ] Expired polls prevent new votes
- [ ] Results display accurately

### 4.3 Rich Text Editor Enhancement
**Objective:** Improve `TiptapEditor` with formatting options

**Files to Modify:**
- `src/components/community/TiptapEditor.tsx`

**Technical Specification:**
1. Add text selection formatting (bold, italic, links)
2. Implement markdown shortcuts
3. Add mentions and hashtag support
4. Include emoji picker
5. Add paste handling for rich content

**Governing Directives:** [D3.2], [AD.1]

**Verification Criteria:**
- [ ] Text formatting applies correctly
- [ ] Markdown shortcuts work
- [ ] Mentions link to user profiles
- [ ] Emoji picker integrates smoothly

---

## 🧪 MILESTONE 5: COMPREHENSIVE TESTING & QUALITY ASSURANCE
**Objective:** Ensure system reliability and performance optimization
**Priority:** P2 - MEDIUM
**Dependencies:** All previous milestones complete

### 5.1 Automated Testing Implementation
**Objective:** Create comprehensive test suite

**Files to Create:**
- `src/components/community/__tests__/` (test directory)
- Test files for all major components and hooks
- Integration tests for multimedia workflows

**Technical Specification:**
1. Unit tests for all new components
2. Integration tests for post creation workflows
3. E2E tests for critical user journeys
4. Performance tests for media loading
5. Accessibility compliance testing

**Governing Directives:** [D3.1], [P1.3]

**Verification Criteria:**
- [ ] All tests pass consistently
- [ ] Coverage exceeds 80% for new code
- [ ] Performance benchmarks met
- [ ] Accessibility standards achieved

### 5.2 Performance Optimization
**Objective:** Optimize system performance for production

**Files to Modify:**
- Various components for performance improvements
- Database query optimizations
- Caching strategies

**Technical Specification:**
1. Implement image lazy loading and compression
2. Add database query optimization
3. Configure CDN for media delivery
4. Implement client-side caching strategies
5. Add performance monitoring

**Governing Directives:** [AD.1], [D3.6]

**Verification Criteria:**
- [ ] Page load times under 2 seconds
- [ ] Image loading optimized
- [ ] Database queries efficient
- [ ] Mobile performance excellent

### 5.3 Documentation & Cleanup
**Objective:** Complete project documentation and remove technical debt

**Files to Create/Modify:**
- Updated component documentation
- API documentation updates
- Code cleanup and refactoring

**Technical Specification:**
1. Document all new components and hooks
2. Update API contract documentation
3. Remove deprecated code and comments
4. Standardize naming conventions
5. Update deployment guides

**Governing Directives:** [P1.3], [D3.1]

**Verification Criteria:**
- [ ] All components documented
- [ ] API documentation current
- [ ] No deprecated code remains
- [ ] Deployment guide accurate

---

## 📊 IMPLEMENTATION METRICS & SUCCESS CRITERIA

### 📈 Progress Tracking
```
Milestone 1 (Critical Repairs): 0% → 16.7% (Target: Day 1)
Milestone 2 (Storage Setup): 16.7% → 33.4% (Target: Day 3)
Milestone 3 (Image Posts): 33.4% → 66.7% (Target: Week 1)
Milestone 4 (Enhanced Features): 66.7% → 83.4% (Target: Week 2)
Milestone 5 (Testing & QA): 83.4% → 100% (Target: Week 3)
```

### 🎯 Success Metrics
**Technical KPIs:**
- Post creation success rate: >99%
- Media upload success rate: >95%
- Page load time: <2 seconds
- Mobile compatibility: 100%
- Test coverage: >80%

**User Experience KPIs:**
- Post creation completion rate: >90%
- User engagement with multimedia posts: +50%
- Error rate reduction: >80%
- User satisfaction score: >4.5/5

---

## 🚨 RISK ASSESSMENT & MITIGATION STRATEGIES

### 🔴 High-Risk Areas

#### **Risk 1: Database Migration Failures**
**Probability:** Medium | **Impact:** High
**Mitigation:**
- Test migrations on staging environment first
- Create rollback scripts for all changes
- Backup database before major migrations
- Implement gradual rollout strategy

#### **Risk 2: Storage Cost Overruns**
**Probability:** Medium | **Impact:** Medium
**Mitigation:**
- Implement strict file size limits
- Add automatic compression for all uploads
- Create storage cleanup policies
- Monitor usage with alerts

#### **Risk 3: Mobile Performance Issues**
**Probability:** High | **Impact:** Medium
**Mitigation:**
- Implement aggressive lazy loading
- Use responsive image sizing
- Add progressive web app features
- Test on actual mobile devices

### 🟡 Medium-Risk Areas

#### **Risk 4: Cross-Browser Compatibility**
**Probability:** Low | **Impact:** Medium
**Mitigation:**
- Test on all major browsers
- Use progressive enhancement approach
- Implement feature detection
- Provide fallbacks for unsupported features

#### **Risk 5: Content Moderation Challenges**
**Probability:** Medium | **Impact:** Low
**Mitigation:**
- Implement automated content scanning
- Create clear community guidelines
- Add user reporting mechanisms
- Train moderation team

---

## 🧹 CLEANUP & DEPRECATION TASKS

### Files to Remove:
- Any temporary debugging components
- Unused import statements
- Commented-out code blocks
- Development-only configurations

### Code to Refactor:
- Long component files (>200 lines)
- Duplicate logic across components
- Hardcoded configuration values
- Inconsistent naming conventions

---

## 📋 DISCOVERED TECHNICAL DEBT

### Issues Found But Not in Scope:
1. `PostCard.tsx` is 215 lines - needs refactoring
2. `SavedPostsPage.tsx` is 320 lines - needs component extraction
3. `types/index.ts` is 292 lines - needs module splitting
4. Missing error boundaries for community components
5. No offline support for PWA functionality
6. Limited internationalization support
7. Missing analytics tracking for user interactions

### Recommendations for Future Sprints:
- Component size refactoring sprint
- Internationalization implementation
- Analytics integration
- Offline functionality enhancement
- Performance monitoring setup

---

## 🔄 VERSION HISTORY

### v2.0.0 (19/06/2025) - Critical Path Implementation Plan
- **MAJOR REVISION**: Complete reassessment of implementation strategy
- **IDENTIFIED**: Critical RPC function missing blocking post creation
- **PRIORITIZED**: System stability over feature enhancement
- **RESTRUCTURED**: Implementation plan into critical path methodology
- **ADDED**: Comprehensive risk assessment and mitigation strategies
- **IMPROVED**: Technical specifications with verification criteria
- **ENHANCED**: Progress tracking with measurable KPIs

### v1.4.4 (19/06/2025) - UI Integration Complete  
- **MILESTONE 4 CONCLUÍDO**: UI Integration implemented successfully
- **PROGRESS**: 66.7% complete (4/6 milestones)

---

## 📊 **CURRENT IMPLEMENTATION STATUS (v2.0.0)**

**📊 CRITICAL PATH PROGRESS: 0% of v2.0 Plan Complete**

#### 🔴 **BLOCKING ISSUES (MUST RESOLVE FIRST)**

**❌ Critical Issue 1: Missing Database RPC Function**
- **Problem**: `create_post_and_auto_vote` function not found in database
- **Impact**: Users cannot create any community posts
- **Status**: BLOCKING ALL COMMUNITY FUNCTIONALITY
- **Required Action**: Implement RPC function in Milestone 1

**❌ Critical Issue 2: Storage Infrastructure Missing**
- **Problem**: No Supabase Storage buckets configured
- **Impact**: Cannot implement multimedia posts
- **Status**: BLOCKING MULTIMEDIA FEATURES
- **Required Action**: Configure storage in Milestone 2

#### ✅ **COMPLETED FOUNDATION (v1.4.4)**

**✅ Database Schema (READY)**
- [x] `CommunityPosts` table with multimedia support fields
- [x] `SavedPosts` table with proper RLS policies
- [x] All necessary indexes and constraints implemented

**✅ Core UI Components (READY)**
- [x] `PostCard` with save/unsave functionality
- [x] `SavedPostsPage` with search and bulk actions
- [x] `CommunitySidebar` with quick actions
- [x] Navigation and routing fully implemented

**✅ Backend Services (PARTIAL - BROKEN)**
- [x] `save-post` Edge Function (working)
- [x] `get-saved-posts` Edge Function (working)
- [x] `get-community-post-detail` Edge Function (working)
- [x] `get-community-page-data` Edge Function (working)
- ❌ `create-community-post` Edge Function (broken - missing RPC)

#### 🔄 **NEXT IMMEDIATE ACTIONS**

**🎯 Priority 1: Fix Post Creation (Milestone 1)**
1. Create missing `create_post_and_auto_vote` database function
2. Update `create-community-post` Edge Function to use correct RPC
3. Test post creation workflow end-to-end
4. Verify auto-voting and contribution scoring

**🎯 Priority 2: Storage Setup (Milestone 2)**
1. Configure Supabase Storage bucket for community media
2. Implement upload policies and file size limits
3. Create upload utility functions and hooks
4. Test file upload and retrieval workflows

**🎯 Priority 3: Feature Implementation (Milestones 3-4)**
1. Enhance `CreatePostForm` with image upload capability
2. Update display components for multimedia content
3. Implement video and poll functionality
4. Add rich text editor enhancements

---

**🎯 Next Critical Milestone**: Milestone 1 - Critical System Repairs  
**📅 Target Completion**: Immediate (Day 1)  
**🚀 Success Metric**: Users can create text posts successfully

---

*Last Updated: June 19, 2025 - v2.0.0*  
*Implementation Phase: Critical Path Resolution*  
*Overall Progress: 0% of v2.0 plan | 66.7% of original foundation*

