
# **README-BÍBLIA.md**

**Versão:** 3.0.0  
**Data:** 19 de junho de 2025  
**Status:** ✅ **Community Module Production-Ready Checkpoint**

---

## **📋 ESTADO ATUAL DO REPOSITÓRIO (2 min read)**

Este documento fornece um resumo completo e atual do estado implementado da plataforma EVIDENS — um Progressive Web App (PWA) para sistema editorial científico desenvolvido em React + Supabase.

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
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth com RLS policies
- **API:** Auto-generated + Edge Functions para lógica complexa
- **Storage:** Supabase Storage para imagens

### **Deployment**
- **Hosting:** Lovable (staging)
- **Database:** Supabase Cloud
- **CDN:** Automatic via Lovable
- **PWA:** Ready for production deployment

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
  - RLS policies ativas para todos os recursos
  - 4 níveis de usuário: `practitioner`, `editor`, `admin`, `super_admin`
  - JWT custom claims para autorização adequada

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
  - Sistema de votação em sugestões funcionais
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
  - Rate limiting implementado (20 req/min)
  - Access control para diferentes subscription tiers
  - View count tracking automático
  - Error handling robusto para 404/403/500
  - Loading states com skeleton components
  - Header com informações do autor e data
  - Navigation breadcrumb funcional

### **👥 7. Community Module - Scientific Reddit**
- **Status:** ✅ **Production-Ready Checkpoint**
- **✅ NOVO:** Implementação completa seguindo Blueprint 06
- **Core Features:**
  - ✅ **CommunityFeed** com infinite scroll, filtering e sorting
  - ✅ **PostCard** com sistema de votação e indicadores de moderação
  - ✅ **VoteButtons** com optimistic updates e feedback visual
  - ✅ **CreatePostDialog** com validação de form e categorias
  - ✅ **CommunitySidebar** com 6 módulos funcionais
  - ✅ **Mobile Integration** via CommunityFeedWithSidebar
- **Advanced Sidebar Modules:**
  - ✅ **RulesModule**: Regras expansíveis da comunidade
  - ✅ **FeaturedPollModule**: Enquetes interativas com votação
  - ✅ **TrendingDiscussionsModule**: Algoritmo de trending baseado em engagement
  - ✅ **RecentActivityModule**: Estatísticas em tempo real
  - ✅ **LinksModule**: Links úteis configuráveis
- **Moderation System:**
  - ✅ **Post Actions**: Pin, lock, flair, hide posts
  - ✅ **Admin Controls**: Restricted to editor/admin roles
  - ✅ **Moderation Log**: Complete action tracking
  - ✅ **RLS Enforcement**: Role-based permissions

### **🎨 8. Sistema Visual**
- **Status:** ✅ **Production-Ready**
- **Funcionalidades:**
  - Dark/Light theme com design tokens e theme switcher no user menu
  - Typography: Inter (sans) + Source Serif 4 (serif)
  - Scrollbars discretos e theme-aware
  - Mobile typography: 16px min, line-height 1.7
  - Touch-friendly spacing e interactions
  - PWA branding consistente em todos os tamanhos

---

## **📊 DADOS & API**

### **Edge Functions Implementadas**
- ✅ `get-homepage-feed`: Consolidação de dados da homepage
- ✅ `get-acervo-data`: Dados reais do PostgreSQL com tags e reviews
- ✅ `get-review-by-slug`: Fetch individual de reviews com RLS
- ✅ `get-community-feed`: Feed de posts da comunidade com pagination
- ✅ `get-community-sidebar-data`: Dados completos da sidebar com polls e trending
- ✅ `get-trending-discussions`: Algoritmo de trending baseado em engagement
- ✅ `create-community-post`: Criação de posts com auto-upvote
- ✅ `cast-community-vote`: Sistema de votação em posts
- ✅ `cast-poll-vote`: Sistema de votação em enquetes
- ✅ `moderate-community-post`: Actions administrativas (pin, lock, flair)
- ✅ `submit-suggestion`: Envio de sugestões para próxima edição
- ✅ `cast-suggestion-vote`: Sistema de votação em sugestões
- ✅ Rate limiting implementado em todas as functions

### **TanStack Query Hooks**
- ✅ `useCommunityFeedQuery`: Feed infinito com filtering
- ✅ `useCommunitySidebarQuery`: Dados consolidados da sidebar
- ✅ `useCreateCommunityPostMutation`: Criação de posts
- ✅ `useCastCommunityVoteMutation`: Votação em posts
- ✅ `useCastPollVoteMutation`: Votação em enquetes
- ✅ `useModerateCommunityPostMutation`: Actions administrativas
- ✅ Invalidação automática de cache para consistência

### **Database Performance**
- ✅ **Community Tables**: CommunityPosts, CommunityPost_Votes, CommunityModerationActions
- ✅ **Poll System**: Polls, PollOptions, PollVotes com aggregation triggers
- ✅ **Statistics**: CommunityStats com auto-update triggers
- ✅ **Indexes otimiz.**ados: Composite indexes para filtering eficiente
- ✅ **Vote Aggregation**: Automatic triggers para upvotes/downvotes
- ✅ **Stats Tracking**: Real-time community statistics

### **RLS Policies**
- ✅ **CommunityPosts**: Public read + authenticated write + author edit
- ✅ **CommunityPost_Votes**: Public read + user-scoped write/update/delete
- ✅ **CommunityModerationActions**: Public read + editor/admin write
- ✅ **CommunityStats**: Public read + admin write
- ✅ **Polls & PollVotes**: Public read + authenticated participation
- ✅ **Enhanced Security**: JWT custom claims enforcement

### **Database Schema Evolution**
- ✅ **Moderation Fields**: is_pinned, is_locked, flair_text, flair_color
- ✅ **Action Tracking**: Complete moderation audit trail
- ✅ **Statistics Engine**: Automated community metrics
- ✅ **Poll Integration**: Featured polls with expiration
- ✅ **Performance Indexes**: Dedicated indexes for all query patterns

---

## **📱 PWA & MOBILE COMPLIANCE**

### **PWA Core Features**
- ✅ **Service Worker:** Cache estratégico + funcionalidade offline completa
- ✅ **Web App Manifest:** Configuração completa com ícones, shortcuts, theme
- ✅ **Install Prompts:** Suporte nativo Chrome/Edge + instruções iOS Safari
- ✅ **Offline Capability:** Cache de recursos críticos + fallback navigation
- ✅ **Push Notifications:** Infraestrutura completa implementada
- ✅ **Background Sync:** Preparado para sincronização offline

### **Mobile Compliance Status**
- ✅ **RULE 1:** Single-column layout implementado
- ✅ **RULE 2:** Bottom tab bar navigation persistente
- ✅ **RULE 3:** Homepage stacking vertical implementado
- ✅ **RULE 4:** Carousels mostram ~1.5 cards com scroll hints
- ✅ **RULE 5:** Progressive disclosure no NextEditionModule
- ✅ **RULE 6:** Grid Acervo: 2 colunas, min-tap-area ≥ 160×160px
- ✅ **RULE 7:** Tag filtering via bottom sheet modal (90% viewport)
- ✅ **RULE 8:** Typography: 16px min, line-height 1.7, padding ≥ 16px
- ✅ **Community Mobile:** Sidebar modules como pinned cards
- ✅ **Touch Optimization:** Vote buttons com feedback tátil

---

## **⚡ PERFORMANCE & QUALIDADE**

### **Community Module Performance**
- ✅ **Infinite Scroll:** Pagination otimizada com TanStack Query
- ✅ **Real-time Updates:** Vote changes com optimistic updates
- ✅ **Cache Strategy:** Intelligent invalidation patterns
- ✅ **Mobile Performance:** Touch-friendly interactions
- ✅ **Rate Limiting:** Abuse protection em todas as APIs
- ✅ **Trending Algorithm:** Engagement-based scoring
- ✅ **Statistics Engine:** Auto-updating community metrics

### **Code Quality & Architecture**
- ✅ **Data Access Layer:** All hooks follow [DAL.1-4] golden rules
- ✅ **Component Architecture:** Modular sidebar system
- ✅ **State Management:** TanStack Query + optimistic updates
- ✅ **Security Implementation:** RLS + JWT custom claims
- ✅ **Error Boundaries:** Robust error handling
- ✅ **Type Safety:** Full TypeScript coverage
- ✅ **Mobile-First:** Responsive design patterns

### **Testing & Validation**
- ✅ **Community Features:** Post creation, voting, moderation testados
- ✅ **Admin Functions:** Pin, lock, flair actions funcionais
- ✅ **Mobile Experience:** Touch interactions e layout responsivo
- ✅ **Authentication Flow:** Role-based permissions verificados
- ✅ **Performance:** Infinite scroll e caching otimizados
- ✅ **Real-time Features:** Vote updates e statistics funcionais

---

## **🔧 CONFIGURAÇÃO & DEPLOY**

### **Environment Variables**
```bash
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxx

# OAuth
VITE_GOOGLE_CLIENT_ID=xxx.googleusercontent.com
```

### **Admin Configuration**
- ✅ **Admin Users:** Configured via database migration
- ✅ **Moderation Tools:** Available to editor/admin roles
- ✅ **Community Management:** Full CRUD operations
- ✅ **Statistics Dashboard:** Real-time community metrics

### **Deploy Status**
- ✅ **Staging:** Lovable auto-deploy ativo
- ✅ **Database:** Supabase production ready
- ✅ **Edge Functions:** 11 functions deployed e funcionais
- ✅ **PWA Ready:** Production deployment ready
- ✅ **Community Module:** Production-ready checkpoint reached

---

## **📋 PRÓXIMOS PASSOS**

### **Phase 3: Advanced Features**
1. **Threaded Discussions:** Sistema de replies aninhados para discussões
2. **Real-time Notifications:** Live updates para activity feeds
3. **Advanced Search:** Full-text search em posts e comentários
4. **User Profiles:** Sistema de perfis expandido

### **Phase 4: Analytics & Optimization**
1. **Community Analytics:** Engagement metrics e user behavior
2. **Performance Monitoring:** Real-time metrics e alerting
3. **A/B Testing:** Feature flag system para experiments

### **Phase 5: Content Creation**
1. **LayoutAwareRenderer:** Sistema de rendering mobile-first para reviews
2. **Content Editor:** MVP do editor para admins
3. **Media Management:** Upload e gerenciamento de imagens

---

## **📞 PONTOS DE CONTATO TÉCNICO**

### **Community Module - Production Ready**
- **Main Feed:** `src/components/community/CommunityFeed.tsx`
- **Sidebar System:** `src/components/community/CommunitySidebar.tsx`
- **Post Management:** `src/components/community/PostCard.tsx`, `CreatePostDialog.tsx`
- **Voting System:** `src/components/community/VoteButtons.tsx`
- **Moderation:** `src/components/community/moderation/` (admin tools)

### **Data Layer - Complete**
- **Hooks:** `packages/hooks/use*CommunityMutation.ts`
- **Backend APIs:** `supabase/functions/*community*/`
- **Database:** Enhanced schema with moderation and statistics
- **RLS Policies:** Complete security implementation

### **Documentation Técnica**
- **Blueprints:** `/docs/blueprints/06_COMMUNITY_BLUEPRINT.md`
- **Architecture:** `/docs/[DOC_X]/` - Decisions e constraints
- **Mobile Guide:** `/docs/[DOC_8]_MOBILE_ADAPTATION.md`

---

**🎯 RESUMO EXECUTIVO:** A plataforma EVIDENS agora possui um módulo de comunidade científica completo e production-ready, implementando todas as funcionalidades de um fórum moderno com votação, moderação, enquetes, trending discussions e estatísticas em tempo real. O sistema segue rigorosamente todas as especificações dos blueprints e diretrizes de arquitetura, estando pronto para uso em produção.

**🏆 COMMUNITY MODULE CHECKPOINT:** ✅ Production-Ready - 100% Implementation Complete
