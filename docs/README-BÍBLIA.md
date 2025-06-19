
# **README-BÍBLIA.md**

**Versão:** 5.0.0  
**Data:** 19 de junho de 2025  
**Status:** ✅ **Community v2.0 Overhaul - Implementation in Progress**

---

## **📋 ESTADO ATUAL DO REPOSITÓRIO (2 min read)**

Este documento fornece um resumo completo e atual do estado implementado da plataforma EVIDENS — um Progressive Web App (PWA) para sistema editorial científico desenvolvido em React + Supabase, agora com **Community v2.0 Overhaul** em andamento, implementando recursos avançados de comunidade.

---

## **🏗️ ARQUITETURA & STACK TECNOLÓGICO**

### **Frontend**
- **Framework:** React 18.3.1 + TypeScript + Vite
- **UI Library:** shadcn/ui + Tailwind CSS + Lucide React
- **Estado:** Zustand para auth + TanStack Query para server state
- **Roteamento:** React Router DOM 6.26.2
- **Charts:** Recharts 2.12.7
- **PWA:** Service Worker + Web App Manifest + Install Prompts

### **Backend**
- **Database:** Supabase PostgreSQL com **otimizações v2.0**
- **Auth:** Supabase Auth com RLS policies e **role-based access control centralizado**
- **API:** Auto-generated + **Edge Functions otimizadas** para lógica complexa
- **Storage:** Supabase Storage para imagens
- **Rate Limiting:** **Sistema centralizado** com cleanup automático

### **Deployment**
- **Hosting:** Lovable (staging)
- **Database:** Supabase Cloud com **funções RPC v2.0**
- **CDN:** Automatic via Lovable
- **PWA:** Ready for production deployment

---

## **🚀 COMMUNITY v2.0 OVERHAUL - IMPLEMENTATION PLAN**

### **📋 Implementation Status: MILESTONE 1-2 COMPLETE**

**Plan Overview:**
The Community v2.0 Overhaul transforms the existing functional community page into a sophisticated, visually compelling experience matching modern community platform standards.

### **Milestone 1: Backend Foundation Enhancement** ✅ **COMPLETE**
**Duration:** 2-3 days  
**Status:** ✅ Implemented

#### **Task 1.1: Database Schema Evolution** ✅
- **Status:** ✅ Complete - New Communities table created with metadata support
- **Implementation:** Enhanced database schema with:
  - New `Communities` table for community metadata (banner, avatar, description)
  - Enhanced `CommunityPosts` table with `post_type`, `structured_content`, `community_id`
  - Performance indexes for new columns
  - RLS policies for proper access control
  - Default community record inserted

#### **Task 1.2: Centralized Post Action RPC** ✅
- **Status:** ✅ Complete - Unified post action system implemented
- **Implementation:** 
  - Created `handle_post_action` RPC function
  - Supports delete, pin, unpin, lock, unlock actions
  - Permission checking using existing `is_editor()` function
  - Standardized error handling and responses

### **Milestone 2: Data Access Layer & UI Foundation** ✅ **COMPLETE**
**Duration:** 3-4 days  
**Status:** ✅ Implemented

#### **Task 2.1: Enhanced Data Hooks** ✅
- **Status:** ✅ Complete - New mutation hooks implemented
- **Implementation:**
  - `usePostActionMutation` hook for centralized post actions
  - Enhanced `useCreateCommunityPostMutation` with post type support
  - Updated `useCommunitySidebarQuery` with community metadata
  - Proper TypeScript typing and cache invalidation

#### **Task 2.2: Community Header Component** ✅
- **Status:** ✅ Complete - Branded header with banner support
- **Implementation:**
  - `CommunityHeader.tsx` with banner image and gradient overlay
  - Community avatar and metadata display
  - `CommunityActionRow` with search and create post button
  - Mobile-optimized responsive layout

#### **Task 2.3: Post Action Menu System** ✅
- **Status:** ✅ Complete - Contextual action menus implemented
- **Implementation:**
  - `PostActionMenu.tsx` with permission-based visibility
  - `PostActionBar.tsx` for post interactions
  - Integration with post action hooks
  - Mobile touch targets and accessibility

### **Milestone 3: Core UI Integration & Visual Overhaul** ✅ **COMPLETE**
**Duration:** 4-5 days  
**Status:** ✅ Implemented

#### **Task 3.1: ComunidadePage Layout Refactor** ✅
- **Status:** ✅ Complete - Enhanced page layout with new header
- **Implementation:**
  - Integrated `CommunityHeader` component
  - Layered background styling (bg-background, bg-surface)
  - Community metadata fetching and display
  - Maintained mobile responsiveness

#### **Task 3.2: Enhanced PostCard Component** ✅
- **Status:** ✅ Complete - Advanced post card with actions
- **Implementation:**
  - Integrated `PostActionMenu` and `PostActionBar`
  - Conditional content rendering for different post types
  - Enhanced visual styling and accessibility
  - Moderation indicators (pinned, locked status)

#### **Task 3.3: Corrected Activity Labels** ✅
- **Status:** ✅ Complete - Fixed misleading metric labels
- **Implementation:**
  - Updated `RecentActivityModule` with accurate labels
  - "Online agora" → "Autores ativos"
  - "Membros ativos" → "Contribuições nas últimas 24h"
  - Backend stats function updated for accuracy

### **Milestone 4: Rich Post Editor Implementation** ✅ **COMPLETE**
**Duration:** 5-6 days  
**Status:** ✅ Implemented

#### **Task 4.1: Dedicated Post Creation Route** ✅
- **Status:** ✅ Complete - New /community/submit page created
- **Implementation:**
  - New route `/community/submit` with proper protection
  - `SubmitPage.tsx` component with app shell integration
  - Updated navigation in existing components
  - Removed old dialog-based creation

#### **Task 4.2: Enhanced Post Creation Form** ✅
- **Status:** ✅ Complete - Tabbed form with rich content support
- **Implementation:**
  - `CreatePostForm.tsx` with tabbed interface
  - Support for text, image, link, and poll post types
  - Form validation and proper error handling
  - Integration with enhanced mutation hooks

### **Milestone 5: Final Polish & Cleanup** 🟡 **PENDING**
**Duration:** 2-3 days  
**Status:** 🟡 Ready for Implementation

#### **Task 5.1: UI/UX Refinements** 🟡
- **Status:** 🟡 Pending - Visual consistency improvements needed
- **Requirements:**
  - Enhance visual consistency across components
  - Optimize loading states and transitions
  - Final accessibility audit and improvements

#### **Task 5.2: Code Cleanup & Optimization** 🟡
- **Status:** 🟡 Pending - Legacy code removal needed
- **Requirements:**
  - Remove obsolete components and unused imports
  - Performance optimization and bundle analysis
  - Documentation updates and final testing

---

## **✅ MÓDULOS IMPLEMENTADOS & FUNCIONAIS**

### **📱 1. Progressive Web App (PWA)**
- **Status:** ✅ **Production-Ready**
- **Funcionalidades:**
  - Service Worker com cache estratégico e funcionalidade offline
  - Web App Manifest otimizado com ícones em múltiplas resoluções
  - Prompt de instalação inteligente para Android (Chrome) e iOS (Safari)
  - Meta tags completas para iOS, Android, e Windows
  - Componente PWAProvider para gerenciamento de estado global
  - Botão de instalação integrado no header
  - Suporte completo a notificações push
  - Background sync para funcionalidade offline
  - Shortcuts de app para navegação rápida

### **🔐 2. Sistema de Autenticação**
- **Status:** ✅ **Production-Ready**
- **Funcionalidades:**
  - Login/signup com email + senha
  - OAuth com Google (configurado)
  - Proteção de rotas com `ProtectedRoute`
  - **RLS policies ativas** para todos os recursos
  - **4 níveis de usuário:** `practitioner`, `moderator`, `editor`, `admin`
  - **JWT custom claims** para autorização adequada
  - **✅ NOVO:** **Funções centralizadas de role checking** (`is_editor`, `is_admin`, `can_moderate`)

### **📱 3. Application Shell**
- **Status:** ✅ **Production-Ready**
- **Funcionalidades Desktop:**
  - Sidebar colapsível com navegação persistente
  - Layout two-column responsivo
  - User profile block com avatar, logout e theme switcher
  - Notification bell com PWA install button
- **Funcionalidades Mobile:**
  - Bottom tab bar navigation (sempre visível)
  - Single-column layout otimizado
  - Header com logo centralizado, PWA install e notification bell
  - Touch targets ≥ 44×44px
  - Discrete scrollbars theme-aware

### **🏠 4. Homepage**
- **Status:** ✅ **Production-Ready**
- **Funcionalidades:**
  - Feed consolidado via Edge Function `get-homepage-feed`
  - FeaturedReview hero section (mobile: altura reduzida, padding otimizado)
  - ReviewCarousel horizontal (mobile: ~1.5 cards visíveis, scroll hints)
  - NextEditionModule com progressive disclosure (mobile: top 3 sugestões + "Ver todas")
  - **Sistema de votação otimizado** com triggers incrementais
  - Performance otimizada: dados consolidados em 1 request
  - Links funcionais para páginas de review detail

### **📚 5. Acervo**
- **Status:** ✅ **Production-Ready**
- **Funcionalidades:**
  - Backend real implementado com PostgreSQL queries
  - Performance otimizada com indexes dedicados
  - RLS enforcement completo para access tiers
  - Grid responsivo: desktop (masonry), mobile (2 colunas)
  - Sistema de tags hierárquicos funcionais
  - Filtros desktop: painel horizontal
  - Filtros mobile: bottom sheet modal (90% viewport height)
  - Client-side sorting e filtering
  - Cards com min-tap-area ≥ 160×160px no mobile
  - Links funcionais para páginas de review detail

### **📖 6. Review Detail Pages**
- **Status:** ✅ **Production-Ready**
- **Funcionalidades:**
  - Edge Function `get-review-by-slug` com RLS enforcement
  - Hook `useReviewDetailQuery` seguindo Data Access Layer
  - Página `/reviews/:slug` com navegação funcional
  - **Rate limiting centralizado** implementado
  - Access control para diferentes subscription tiers
  - View count tracking automático
  - **Error handling padronizado** para 404/403/500
  - Loading states com skeleton components
  - Header com informações do autor e data
  - Navigation breadcrumb funcional

### **👥 7. Community Module - v2.0 Enhanced Scientific Reddit**
- **Status:** ✅ **v2.0 Enhanced - 80% Complete** ⭐
- **✅ NEW v2.0 FEATURES:**
  - ✅ **Branded Community Header** com banner, avatar e metadata
  - ✅ **Rich Post Creation** com página dedicada `/community/submit`
  - ✅ **Enhanced Post Types** suporte para text, image, link, poll
  - ✅ **Advanced Moderation** sistema centralizado de ações
  - ✅ **Permission-Based Actions** menus contextuais baseados em roles
  - ✅ **Layered Visual Design** background styling profissional
- **Core Features Maintained:**
  - ✅ **CommunityFeed** com **RPC otimizada** (`get_community_feed_with_details`)
  - ✅ **PostCard** com sistema de votação e indicadores de moderação
  - ✅ **VoteButtons** com **triggers incrementais** e optimistic updates
  - ✅ **CommunitySidebar** com 6 módulos funcionais
  - ✅ **Mobile Integration** via CommunityFeedWithSidebar
- **Advanced Sidebar Modules:**
  - ✅ **RulesModule**: Regras expansíveis da comunidade
  - ✅ **FeaturedPollModule**: Enquetes interativas com votação
  - ✅ **TrendingDiscussionsModule**: Algoritmo de trending baseado em engagement
  - ✅ **RecentActivityModule**: Estatísticas em tempo real **com labels corretos**
  - ✅ **LinksModule**: Links úteis configuráveis

### **🎨 8. Sistema Visual**
- **Status:** ✅ **Production-Ready + v2.0 Enhanced**
- **Funcionalidades:**
  - Dark/Light theme com design tokens e theme switcher no user menu
  - Typography: Inter (sans) + Source Serif 4 (serif)
  - Scrollbars discretos e theme-aware
  - Mobile typography: 16px min, line-height 1.7
  - Touch-friendly spacing e interactions
  - PWA branding consistente em todos os tamanhos
  - **✅ NEW:** Layered background system (bg-background/bg-surface)
  - **✅ NEW:** Enhanced visual hierarchy e spacing

---

## **🚀 OTIMIZAÇÕES DE PERFORMANCE - v2.0 ENHANCED**

### **⚡ Database Performance Excellence**
- **✅ ELIMINAÇÃO DE N+1 QUERIES:** RPC `get_community_feed_with_details` substitui 20+ queries por 1
- **✅ OPERAÇÕES TRANSACIONAIS:** RPC `create_post_and_auto_vote` garante consistência de dados
- **✅ TRIGGERS INCREMENTAIS:** Vote counting otimizado com atualizações atômicas
- **✅ ÍNDICES OTIMIZADOS:** Performance indexes para todos os query patterns
- **✅ NEW:** Enhanced schema com Communities table e post types
- **✅ NEW:** Centralized post actions via `handle_post_action` RPC

### **🛡️ Security & Error Handling - v2.0 Hardened**
- **✅ CENTRALIZED ERROR HANDLING:** Classe `ApiError` com responses padronizados
- **✅ ROLE-BASED ACCESS CONTROL:** Funções RPC centralizadas (`is_editor`, `is_admin`)
- **✅ STANDARDIZED API RESPONSES:** Consistent error codes e message structure
- **✅ RATE LIMITING CENTRALIZADO:** Sistema unificado com cleanup automático
- **✅ NEW:** Enhanced RLS policies para Communities table
- **✅ NEW:** Permission-based UI components com security checks

### **📊 Enhanced Edge Functions & Data Layer**
- **✅ OPTIMIZED:** 11 Edge Functions com performance patterns
- **✅ NEW:** Enhanced data hooks com post type support
- **✅ NEW:** Community metadata integration
- **✅ MAINTAINABILITY:** Código centralizado e reutilizável

---

## **📊 DADOS & API - v2.0 ENHANCED**

### **✅ Enhanced Database Schema**
- ✅ **Communities Table**: Metadata para comunidades (banner, avatar, descrição)
- ✅ **Enhanced CommunityPosts**: Suporte para post_type e structured_content
- ✅ **Performance Indexes**: Otimizações para novos campos
- ✅ **Centralized Actions**: RPC `handle_post_action` para moderação
- ✅ **Data Integrity**: CHECK constraints e validation

### **✅ Enhanced TanStack Query Hooks**
- ✅ `usePostActionMutation`: Ações centralizadas de posts
- ✅ `useCreateCommunityPostMutation`: Criação com suporte a tipos
- ✅ `useCommunitySidebarQuery`: Dados com community metadata
- ✅ **Enhanced Error Handling**: Responses padronizados
- ✅ **Cache Strategy**: Invalidação inteligente

---

## **📱 PWA & MOBILE COMPLIANCE - MAINTAINED**

### **PWA Core Features**
- ✅ All existing PWA functionality maintained
- ✅ **NEW:** Enhanced community experience em PWA context
- ✅ **NEW:** Mobile-optimized post creation flow

---

## **⚡ PERFORMANCE & QUALIDADE - v2.0 ENHANCED**

### **🚀 Community v2.0 Performance Achievements**
- ✅ **Schema Optimization**: Structured content support sem performance impact
- ✅ **UI Performance**: Layered backgrounds com GPU acceleration
- ✅ **Data Efficiency**: Community metadata em single query
- ✅ **Mobile Performance**: Enhanced responsive design
- ✅ **Cache Strategy**: Intelligent invalidation para community updates

### **🛡️ Code Quality - v2.0 Standards**
- ✅ **Component Architecture**: Modular community components
- ✅ **Type Safety**: Full TypeScript coverage para new features
- ✅ **Security Implementation**: Permission-based UI components
- ✅ **Error Boundaries**: Comprehensive error handling
- ✅ **Mobile-First**: Responsive design patterns maintained

---

## **🔧 CONFIGURAÇÃO & DEPLOY - v2.0 READY**

### **Environment Variables**
```bash
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxx

# OAuth
VITE_GOOGLE_CLIENT_ID=xxx.googleusercontent.com
```

### **✅ Enhanced Database Configuration**
- ✅ **Communities Table**: Configurado com default community
- ✅ **Enhanced RLS**: Policies para novos recursos
- ✅ **Performance Indexes**: Otimizações implementadas
- ✅ **Data Migration**: Schema evolution sem breaking changes

---

## **📋 PRÓXIMOS PASSOS - FINAL PHASE**

### **Milestone 5: Final Polish & Cleanup** 🟡
1. **UI/UX Refinements:** Visual consistency e loading states
2. **Code Cleanup:** Remoção de componentes obsoletos
3. **Performance Audit:** Bundle optimization e accessibility
4. **Documentation Update:** Final documentation sync

### **Future Enhancements (Post v2.0)**
1. **Rich Text Editor:** Tiptap integration para posts
2. **Image Upload:** Media support para posts
3. **Poll System:** Interactive polls com voting
4. **Advanced Moderation:** Comprehensive mod tools

---

## **📞 PONTOS DE CONTATO TÉCNICO - v2.0**

### **Community v2.0 Components**
- **Enhanced Pages:** `src/pages/ComunidadePage.tsx`, `src/pages/community/SubmitPage.tsx`
- **New Components:** `src/components/community/CommunityHeader.tsx`, `CreatePostForm.tsx`
- **Action System:** `PostActionMenu.tsx`, `PostActionBar.tsx`
- **Enhanced Hooks:** `packages/hooks/usePostActionMutation.ts`

### **✅ Enhanced Data Layer**
- **Database Schema:** Communities table + enhanced CommunityPosts
- **RPC Functions:** `handle_post_action` para moderação centralizada
- **Enhanced Hooks:** Community metadata integration
- **Performance:** Maintained optimization patterns

---

**🎯 RESUMO EXECUTIVO:** A plataforma EVIDENS Community v2.0 Overhaul está **80% implementada** com significativas melhorias visuais, funcionais e arquiteturais. Os Milestones 1-4 foram completados com sucesso, implementando header branded, sistema de criação avançado, ações centralizadas de moderação e interface visual aprimorada. Restam apenas refinamentos finais e cleanup para conclusão completa.

**🏆 COMMUNITY v2.0 CHECKPOINT:** ✅ **Major Features Implemented - Final Polish Pending**

**⚡ v2.0 ACHIEVEMENTS:**
- **100% schema enhancement** com suporte a rich content
- **Enhanced UI/UX** com branded header e layered design
- **Advanced post creation** com página dedicada e tipos de conteúdo
- **Centralized moderation** com permission-based actions
- **Maintained performance** com todas as otimizações existentes
