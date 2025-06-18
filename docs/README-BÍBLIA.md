
# **README-BÍBLIA.md**

**Versão:** 2.3.0  
**Data:** 18 de junho de 2025  
**Status:** ✅ PWA Completo + Review Detail Foundation Implementado

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
- **Status:** ✅ **Implementado e Completo**
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
- **Status:** ✅ **Implementado e funcional**
- **Funcionalidades:**
  - Login/signup com email + senha
  - OAuth com Google (configurado)
  - Proteção de rotas com `ProtectedRoute`
  - RLS policies ativas para todos os recursos
  - 4 níveis de usuário: `practitioner`, `editor`, `admin`, `super_admin`

### **📱 3. Application Shell**
- **Status:** ✅ **Mobile-First PWA Implementado**
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
- **Status:** ✅ **Mobile-Optimized PWA Implementado**
- **Funcionalidades:**
  - Feed consolidado via Edge Function `get-homepage-feed`
  - FeaturedReview hero section (mobile: altura reduzida, padding otimizado)
  - ReviewCarousel horizontal (mobile: ~1.5 cards visíveis, scroll hints)
  - NextEditionModule com progressive disclosure (mobile: top 3 sugestões + "Ver todas")
  - Sistema de votação em sugestões funcionais
  - Performance otimizada: dados consolidados em 1 request
  - Links funcionais para páginas de review detail

### **📚 5. Acervo**
- **Status:** ✅ **Production-Ready Backend + Mobile-Compliant PWA**
- **Funcionalidades:**
  - ✅ **NOVO:** Backend real implementado com PostgreSQL queries
  - ✅ **NOVO:** Performance otimizada com indexes dedicados
  - ✅ **NOVO:** RLS enforcement completo para access tiers
  - Grid responsivo: desktop (masonry), mobile (2 colunas)
  - Sistema de tags hierárquicos funcionais
  - Filtros desktop: painel horizontal
  - Filtros mobile: bottom sheet modal (90% viewport height)
  - Client-side sorting e filtering
  - Cards com min-tap-area ≥ 160×160px no mobile
  - Links funcionais para páginas de review detail

### **📖 6. Review Detail Pages**
- **Status:** ✅ **Foundation Implementado + Routing Funcional**
- **Funcionalidades:**
  - ✅ **NOVO:** Edge Function `get-review-by-slug` com RLS enforcement
  - ✅ **NOVO:** Hook `useReviewDetailQuery` seguindo Data Access Layer
  - ✅ **NOVO:** Página `/reviews/:slug` com navegação funcional
  - ✅ **NOVO:** Rate limiting implementado (20 req/min)
  - ✅ **NOVO:** Access control para diferentes subscription tiers
  - ✅ **NOVO:** View count tracking automático
  - Error handling robusto para 404/403/500
  - Loading states com skeleton components
  - Header com informações do autor e data
  - Navigation breadcrumb funcional
  - Placeholders preparados para LayoutAwareRenderer e Comments

### **🎨 7. Sistema Visual**
- **Status:** ✅ **Design System PWA Implementado**
- **Funcionalidades:**
  - Dark/Light theme com design tokens e theme switcher no user menu
  - Typography: Inter (sans) + Source Serif 4 (serif)
  - Scrollbars discretos e theme-aware
  - Mobile typography: 16px min, line-height 1.7
  - Touch-friendly spacing e interactions
  - PWA branding consistente em todos os tamanhos

---

## **🔄 MÓDULOS EM DESENVOLVIMENTO**

### **📖 8. Review Detail - Advanced Features**
- **Status:** 🚧 **LayoutAwareRenderer pendente**
- **Próximo:** Mobile layout rendering, comments system, recommendations

### **👥 9. Community (Placeholder)**
- **Status:** 🚧 **Estrutura criada, implementação pendente**
- **Pendente:** Feed de posts, widgets laterais mobile, sistema de votação

### **👤 10. Profile System**
- **Status:** 🚧 **Estrutura criada, implementação pendente**
- **Pendente:** Profile pages, long-press interactions mobile, swipeable tabs

---

## **📊 DADOS & API**

### **Edge Functions Implementadas**
- ✅ `get-homepage-feed`: Consolidação de dados da homepage
- ✅ `get-acervo-data`: **NOVO:** Dados reais do PostgreSQL com tags e reviews
- ✅ `get-review-by-slug`: **NOVO:** Fetch individual de reviews com RLS
- ✅ `submit-suggestion`: Envio de sugestões para próxima edição
- ✅ `cast-suggestion-vote`: Sistema de votação
- ✅ Rate limiting implementado em todas as functions

### **Database Performance**
- ✅ **NOVO:** Indexes otimizados para queries do Acervo
- ✅ **NOVO:** Parallel query execution (reviews + tags)
- ✅ **NOVO:** Composite indexes para filtering eficiente
- ✅ **NOVO:** RLS policy enforcement com performance tracking

### **RLS Policies**
- ✅ **Practitioners:** Users só acessam próprios dados
- ✅ **Reviews:** Content público + draft protection + access tier control
- ✅ **Suggestions:** Public read + authenticated write
- ✅ **Notifications:** User-scoped access

### **Database Schema**
- ✅ **Core tables:** Practitioners, Reviews, Tags, Suggestions, Notifications
- ✅ **Relationships:** Foreign keys e indexes otimizados
- ✅ **Custom functions:** `get_my_claim()`, `handle_new_user` trigger

---

## **📱 PWA COMPLIANCE STATUS**

### **PWA Core Features**
- ✅ **Service Worker:** Cache estratégico + funcionalidade offline completa
- ✅ **Web App Manifest:** Configuração completa com ícones, shortcuts, theme
- ✅ **Install Prompts:** Suporte nativo Chrome/Edge + instruções iOS Safari
- ✅ **Offline Capability:** Cache de recursos críticos + fallback navigation
- ✅ **Push Notifications:** Infraestrutura completa implementada
- ✅ **Background Sync:** Preparado para sincronização offline

### **Mobile Platform Support**
- ✅ **Android Chrome:** Prompt nativo + instalação via "Add to Home Screen"
- ✅ **iOS Safari:** Instruções visuais para "Adicionar à Tela de Início"
- ✅ **Windows Edge:** Support via browserconfig.xml + tiles
- ✅ **Cross-platform:** Meta tags otimizadas para todos os dispositivos

### **PWA Quality Standards**
- ✅ **Lighthouse PWA Score:** Ready for 100/100
- ✅ **Responsiveness:** Layout adaptativo em todos os breakpoints
- ✅ **Performance:** Service Worker + cache strategy otimizada
- ✅ **Accessibility:** Screen reader + keyboard navigation
- ✅ **SEO:** Meta tags completas + Open Graph + Twitter Cards

---

## **📱 MOBILE COMPLIANCE STATUS**

### **DOC_8 Requirements Implementation**
- ✅ **RULE 1:** Single-column layout implementado
- ✅ **RULE 2:** Bottom tab bar navigation persistente
- ✅ **RULE 3:** Homepage stacking vertical implementado
- ✅ **RULE 4:** Carousels mostram ~1.5 cards com scroll hints
- ✅ **RULE 5:** Progressive disclosure no NextEditionModule
- ✅ **RULE 6:** Grid Acervo: 2 colunas, min-tap-area ≥ 160×160px
- ✅ **RULE 7:** Tag filtering via bottom sheet modal (90% viewport)
- ✅ **RULE 8:** Typography: 16px min, line-height 1.7, padding ≥ 16px
- 🔄 **RULE 9:** Comments lazy-loading (base implementada - Review Detail)
- 🔄 **RULE 10:** LayoutAwareRenderer mobile (base implementada - Review Detail)

---

## **⚡ PERFORMANCE & QUALIDADE**

### **Métricas Implementadas**
- ✅ **Data Fetching:** TanStack Query com caching otimizado
- ✅ **Bundle Size:** Tree-shaking com imports específicos
- ✅ **Rendering:** Skeleton loaders para CLS < 0.1
- ✅ **Mobile Performance:** Touch targets, smooth scrolling
- ✅ **Accessibility:** Screen reader compatibility, keyboard navigation
- ✅ **PWA Performance:** Service Worker cache + offline capability
- ✅ **NOVO:** Database query optimization com dedicated indexes
- ✅ **NOVO:** Rate limiting para proteção contra abuse
- ✅ **NOVO:** View tracking automático para analytics

### **PWA Lighthouse Metrics**
- ✅ **Performance:** Optimized loading + caching strategy
- ✅ **Accessibility:** WCAG compliant + screen reader support
- ✅ **Best Practices:** HTTPS + security headers + modern standards
- ✅ **SEO:** Complete meta tags + structured data ready
- ✅ **PWA:** Service Worker + Manifest + Install prompts

### **Testing & Validation**
- ✅ **Responsive Design:** Testado em breakpoints principais
- ✅ **Cross-browser:** Chrome, Safari, Firefox, Edge compatibility
- ✅ **Mobile Devices:** iOS Safari, Chrome Mobile validation
- ✅ **PWA Installation:** Android Chrome + iOS Safari flows testados
- ✅ **Authentication Flow:** Login/logout/protection completos
- ✅ **NOVO:** Review detail navigation end-to-end testado
- ✅ **NOVO:** Acervo real data loading testado

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

### **PWA Configuration Files**
- ✅ **manifest.json:** App metadata, ícones, shortcuts, theme colors
- ✅ **sw.js:** Service Worker com cache strategy + offline support
- ✅ **browserconfig.xml:** Windows tile configuration
- ✅ **Meta tags:** Complete iOS, Android, Windows support

### **Deploy Status**
- ✅ **Staging:** Lovable auto-deploy ativo
- ✅ **Database:** Supabase production ready
- ✅ **Edge Functions:** Deployed e funcionais
- ✅ **PWA Ready:** Production deployment ready
- ✅ **NOVO:** Performance indexes deployed

---

## **📋 PRÓXIMOS PASSOS**

### **Prioridade Alta - Phase II Completion**
1. **LayoutAwareRenderer:** Implementar sistema de rendering mobile-first
2. **Comments System:** Lazy-loading para páginas de review detail
3. **Content Creation:** MVP do editor para admins

### **Prioridade Média - Phase III Foundation**
1. **Community Module:** Criar feed e widgets mobile
2. **Recommendations:** Sistema de conteúdo relacionado
3. **Analytics Pipeline:** Core Web Vitals tracking

### **Prioridade Baixa - Phase IV/V**
1. **Admin Panel:** Management interface
2. **Advanced Features:** Search, advanced filtering
3. **Performance Monitoring:** Real-time metrics

---

## **📞 PONTOS DE CONTATO TÉCNICO**

### **Arquivos Críticos**
- **Shell:** `src/components/shell/AppShell.tsx`
- **PWA Core:** `src/components/pwa/PWAProvider.tsx`, `src/hooks/usePWA.tsx`
- **Service Worker:** `public/sw.js`
- **Manifest:** `public/manifest.json`
- **Data Fetching:** `packages/hooks/use*Query.ts`
- **Mobile Detection:** `src/hooks/use-mobile.tsx`
- **Routing:** `src/App.tsx`
- **Themes:** `src/components/theme/CustomThemeProvider.tsx`

### **PWA Específicos**
- **Install Prompts:** `src/components/pwa/PWAInstallPrompt.tsx`
- **Install Button:** `src/components/pwa/PWAInstallButton.tsx`
- **Lifecycle Management:** `src/components/pwa/PWAProvider.tsx`
- **Platform Detection:** `src/hooks/usePWA.tsx`

### **Review Detail System**
- **NOVO - Backend:** `supabase/functions/get-review-by-slug/`
- **NOVO - Data Hook:** `packages/hooks/useReviewDetailQuery.ts`
- **NOVO - Page Component:** `src/pages/ReviewDetailPage.tsx`
- **NOVO - Performance:** `supabase/migrations/*-acervo-performance-indexes.sql`

### **Documentação Técnica**
- **Blueprints:** `/docs/blueprints/` - Especificações por módulo
- **Architecture:** `/docs/[DOC_X]/` - Decisions e constraints
- **Mobile Guide:** `/docs/[DOC_8]_MOBILE_ADAPTATION.md`

---

**🎯 RESUMO EXECUTIVO:** A plataforma EVIDENS é agora um Progressive Web App completo e production-ready, com backend real implementado para o Acervo e foundation sólida para Review Detail pages. A implementação seguiu rigorosamente as especificações dos blueprints e diretrizes de performance, com próximas fases focadas em LayoutAwareRenderer e Community features.

