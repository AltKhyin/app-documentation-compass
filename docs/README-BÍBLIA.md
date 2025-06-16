
# **README-BÍBLIA.md** — Documento de Estado Vivo do Repositório EVIDENS

**Versão:** 3.0.0  
**Data:** 16 de junho de 2025  
**Propósito:** Fornece um resumo completo de 2 minutos do estado atual implementado do repositório para qualquer desenvolvedor AI ou humano.

---

## **1. VISÃO GERAL DO PROJETO**

**EVIDENS** é uma plataforma de conhecimento médico baseada em evidências que permite aos profissionais de saúde acessar, contribuir e colaborar com conteúdo científico de alta qualidade.

### **Arquitetura Tecnológica (Vite-First)**
- **Frontend:** Vite + React 18 + TypeScript + TailwindCSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Edge Functions + RLS + Auth)
- **Estado do Cliente:** TanStack Query v5 + Zustand (global state)
- **Deployment:** Lovable platform com possível domínio customizado futuro

### **Decisões Arquiteturais Estratégicas**
- ✅ **Single-Page Application (SPA):** Prioriza desenvolvimento rápido e UX interativa
- ✅ **Client-Side Rendering:** Otimizado para interfaces dinâmicas e data-driven
- ⚠️ **Trade-off SEO:** Limitação conhecida para indexação de search engines
- ✅ **Unified Codebase:** Admin features via protected routes, não apps separados

---

## **2. ESTADO ATUAL DA IMPLEMENTAÇÃO**

### **✅ PHASE 1 COMPLETE: Foundation Stabilization**

#### **🆕 Unified Navigation System (COMPLETE)**
- ✅ **Centralized Configuration:** `src/config/navigation.ts` como single source of truth
- ✅ **Complete Route Coverage:** Todas as rotas implementadas com placeholders funcionais
- ✅ **Desktop/Mobile Consistency:** NavItem unificado para ambas plataformas
- ✅ **Zero Navigation Errors:** Eliminados todos os 404s de navegação
- ✅ **Active State Management:** Handling consistente de rotas ativas

#### **🆕 Documentation Realignment (COMPLETE)**
- ✅ **Architecture Docs Updated:** [DOC_2] reflete reality Vite + React
- ✅ **Monorepo Archive:** [DOC_9] arquivado com notice claro
- ✅ **Strategic Trade-offs:** SEO limitations documentadas explicitamente
- ✅ **README-BÍBLIA Sync:** Documento alinhado com implementação real

#### **Sistema de Autenticação (STABLE)**
- ✅ Login/Signup com email e senha
- ✅ Autenticação via Google (OAuth)
- ✅ Session management via Supabase Auth
- ✅ RLS policies para controle de acesso
- ✅ Custom claims (role, subscription_tier) via trigger `handle_new_user`

#### **Homepage Feed System (STABLE)**
- ✅ **Edge Function:** `get-homepage-feed` - API única consolidada
- ✅ **Database RPC:** `get_homepage_suggestions()` - busca sugestões com status de voto
- ✅ **Hook:** `useConsolidatedHomepageFeedQuery` - TanStack Query com cache agressivo
- ✅ **Componentes:** FeaturedReview, ReviewCarousel, NextEditionModule
- ✅ **Layout dinâmico:** Configurável via `SiteSettings.homepage_layout`

#### **Sistema de Votação em Sugestões (STABLE)**
- ✅ **Edge Function:** `cast-suggestion-vote` - Rate limited (10 votos/min por usuário)
- ✅ **Hook:** `useCastVoteMutation` - Optimistic updates com TanStack Query
- ✅ **Componente:** `SuggestionPollItem` - Interface de votação simplificada
- ✅ **Trigger:** `update_suggestion_vote_count()` - Atualização automática de contadores
- ✅ **RLS:** Políticas completas para `Suggestion_Votes`

#### **Sistema de Submissão de Sugestões (STABLE)**
- ✅ **Edge Function:** `submit-suggestion`
- ✅ **Hook:** `useSubmitSuggestionMutation`
- ✅ **Interface:** Formulário integrado no NextEditionModule

#### **App Shell (STABLE)**
- ✅ **Responsive Design:** Mobile-first com adaptações para desktop
- ✅ **Navigation:** Header + Sidebar colapsível + Bottom tabs (mobile)
- ✅ **User Profile Block:** Avatar, nome, role, contribution score
- ✅ **Notification Bell:** Contador em tempo real
- ✅ **Context Providers:** Auth + AppData integration

#### **Sistema Acervo (STABLE)**
- ✅ **Database Schema:** Tables `Tags`, `ReviewTags` com hierarquia categoria/subtag
- ✅ **Edge Function:** `get-acervo-data` - API consolidada para reviews + tags
- ✅ **Hook:** `useAcervoDataQuery` - TanStack Query com cache agressivo
- ✅ **Frontend Components:**
  - ✅ `AcervoPage` - Página principal responsiva
  - ✅ `TagsPanel` - Filtros horizontais (desktop)
  - ✅ `MobileTagsModal` - Bottom sheet para mobile
  - ✅ `MasonryGrid` - Layout em colunas CSS
  - ✅ `ReviewCard` - Cards individuais dos reviews
  - ✅ `ClientSideSorter` - Reordenação por relevância
- ✅ **UX Core:** Sistema de reordenação, não filtragem (conforme Blueprint)
- ✅ **Mobile Adaptation:** Bottom sheet + 2-column grid
- ✅ **RLS Policies:** Controle de acesso tier-based para Reviews

---

### **🔄 PHASE 2 COMPLETE: Documentation Realignment**

#### **Architectural Documentation (COMPLETE)**
- ✅ **[DOC_2] System Architecture:** Updated para Vite + React reality
- ✅ **[DOC_9] Monorepo Archive:** Archived com clear migration context
- ✅ **Trade-off Documentation:** SEO limitations explicitamente documentadas
- ✅ **Future Admin Strategy:** Protected routes strategy documentada

#### **Blueprint Adaptation (STABLE)**
- ✅ **Editor Strategy:** Confirmed feasibility within Vite via protected routes
- ✅ **Component Libraries:** React Flow, dnd-kit, Tiptap confirmed compatible
- ✅ **Security Model:** Role-based route protection strategy defined

---

### **📋 NEXT: PHASE 3 - Structural Optimization**

#### **Directory Reorganization (PENDING)**
- 🔄 **Feature-First Structure:** Reorganizar src/ para maximum maintainability
- 🔄 **Centralized Types:** Consolidar interfaces em src/types/
- 🔄 **Component Boundaries:** Clear separation entre UI e feature components

#### **Performance Optimizations (PENDING)**
- 🔄 **Code Splitting:** Implement route-based splitting
- 🔄 **Bundle Analysis:** Identify optimization opportunities
- 🔄 **Query Optimization:** Review and optimize data fetching patterns

---

### **❌ Não Implementado (Prioridades Futuras)**

- ❌ **Community Module:** Posts, comentários, interações sociais (placeholder estável)
- ❌ **Profile Pages:** Páginas detalhadas de perfil de usuário (placeholder estável)
- ❌ **Review Detail Pages:** Visualização individual completa de reviews
- ❌ **Advanced Search:** Busca inteligente por conteúdo
- ❌ **Analytics Dashboard:** Métricas de engajamento e performance
- ❌ **Admin Panel:** Interface de moderação via protected routes

---

## **3. ARQUITETURA DE DADOS E PERFORMANCE**

### **Database Schema (PostgreSQL via Supabase)**
```
Principais Tabelas:
├── Practitioners (usuários) ✅
├── Reviews (conteúdo principal) ✅ 
├── Tags (hierarquia categoria/subtag) ✅
├── ReviewTags (junction table) ✅
├── Suggestions (sugestões da comunidade) ✅
├── Suggestion_Votes (sistema de votação) ✅
├── Notifications (notificações) ✅
├── SiteSettings (configurações) ✅
└── OnboardingQuestions/Answers ✅

Database Functions (RPCs):
├── get_homepage_suggestions(p_user_id) ✅
├── update_suggestion_vote_count() ✅
└── handle_new_user() ✅
```

### **Vite + React Optimizations**
- ✅ **Development Speed:** Hot-reload e fast compilation
- ✅ **Query Caching:** TanStack Query com 5min stale time
- ✅ **Data Consolidation:** Single API calls para homepage e acervo
- ✅ **Optimistic Updates:** Votação instantânea sem lag
- ✅ **Rate Limiting:** Edge Functions protegidas
- ✅ **Client-side Reordering:** Acervo sem server round-trips

### **Critical Fixes Implemented**
- ✅ **Navigation Unification:** Configuração centralizada elimina inconsistências
- ✅ **Route Coverage:** Todos os links de navegação funcionais
- ✅ **Component Architecture:** NavItem unificado para desktop e mobile
- ✅ **Documentation Accuracy:** Architecture docs refletem reality
- ✅ **Strategic Clarity:** Trade-offs e constraints explicitamente documentados

---

## **4. ESTRATÉGIA DE DATA FETCHING (TanStack Query)**

### **Golden Rule Compliance**
✅ **RULE D1:** UI components NÃO chamam supabase-js diretamente
✅ **RULE D2:** Toda busca de dados é encapsulada em custom hooks
✅ **RULE D3:** Mutations invalidam queries relevantes via onSuccess

### **Hooks Pattern (TanStack Query)**
```typescript
// Queries (READ)
useConsolidatedHomepageFeedQuery() ✅
useAcervoDataQuery() ✅

// Mutations (WRITE)
useCastVoteMutation() ✅ 
useSubmitSuggestionMutation() ✅
useLoginMutation() ✅
useSignupMutation() ✅
```

---

## **5. CURRENT ARCHITECTURE (VITE + REACT)**

### **Directory Structure (Optimized)**
```
/src/
├── components/
│   ├── shell/           # App layout components
│   ├── homepage/        # Homepage-specific components
│   ├── acervo/          # Acervo-specific components
│   ├── auth/            # Authentication components
│   └── ui/              # Reusable UI components
├── config/              # ✅ Centralized configuration
│   └── navigation.ts    # ✅ Navigation routes definition
├── contexts/            # React Context providers
├── hooks/               # Custom hooks and mutations
├── pages/               # Top-level route components
├── store/               # Zustand global state
└── lib/                 # Utilities and Supabase client
```

### **Navigation Architecture (STABLE)**
- ✅ **Centralized Config:** Single source of truth em `src/config/navigation.ts`
- ✅ **Unified Components:** NavItem funciona para desktop e mobile
- ✅ **Consistent State:** Active route handling padronizado
- ✅ **Complete Coverage:** Todas as rotas implementadas com placeholders funcionais

---

## **6. STRATEGIC DECISIONS & CONSTRAINTS**

### **Architectural Choices**
- ✅ **Vite + React SPA:** Prioriza development speed e interactive UX
- ✅ **Client-Side Rendering:** Optimized para dynamic, data-driven interfaces
- ✅ **Unified Application:** Admin via protected routes, não separate apps
- ⚠️ **SEO Trade-off:** Limitação conhecida e aceita para search indexing

### **Development Environment**
- ✅ **Lovable Platform:** Optimized para rapid iteration e deployment
- ✅ **Single Codebase:** Maintainable dentro do environment constraints
- ✅ **Future Migration Ready:** Component architecture compatible com Next.js

---

## **7. DEBUGGING E TROUBLESHOOTING**

### **Edge Functions Logs**
- **cast-suggestion-vote:** Monitorar rate limiting e vote validation
- **get-homepage-feed:** Verificar performance e data completeness
- **submit-suggestion:** Validar input sanitization
- **get-acervo-data:** Monitorar queries parallel e tag processing

### **Resolved Issues (STABLE)**
1. ✅ **Navigation 404 errors** → Fixed with centralized navigation config
2. ✅ **Mobile/Desktop nav inconsistency** → Fixed with unified NavItem component
3. ✅ **Documentation conflicts** → Aligned with Vite + React reality
4. ✅ **Architecture clarity** → Strategic trade-offs explicitly documented

### **Known Constraints**
- ⚠️ **SEO Limitation:** Client-side rendering limits search indexing
- 🔄 **Review Detail Pages:** Placeholder implementations
- 🔄 **Advanced Features:** Community, analytics pending future phases

---

## **8. PRÓXIMOS PASSOS RECOMENDADOS**

### **Phase 3: Structural Optimization (READY)**
1. **Directory Reorganization:** Feature-first structure implementation
2. **Type Centralization:** Consolidate shared interfaces
3. **Component Boundaries:** Clear UI vs feature separation

### **Prioridade Alta (Post Phase 3)**
1. **Review Detail Pages:** Implementar visualização completa (Blueprint 05)
2. **Community Module:** Sistema de posts e comentários (Blueprint 06)
3. **Profile Enhancement:** Expandir páginas de perfil (Blueprint 07)

### **Prioridade Média**
1. **Performance Optimization:** Bundle analysis e code splitting
2. **Search Interface:** Busca básica por Reviews
3. **Real-time Features:** Notifications e updates

---

## **9. COMANDOS DE DESENVOLVIMENTO ESSENCIAIS**

```bash
# Desenvolvimento local
npm run dev

# Supabase local
supabase start
supabase db reset

# Deploy de Edge Functions
supabase functions deploy

# Logs em tempo real
supabase functions logs --follow
```

---

**CHANGELOG v3.0.0:**
- 🏗️ **PHASE 2 COMPLETE:** Documentation Realignment implemented
- ➕ Updated [DOC_2] System Architecture for Vite + React reality
- ➕ Archived [DOC_9] Monorepo Architecture with clear migration context
- ➕ Documented strategic trade-offs and SEO constraints explicitly
- ➕ Confirmed admin features feasibility via protected routes
- ✅ Foundation stabilization complete and stable
- 📝 Architecture documentation now accurately reflects implementation
- 🎯 Ready for Phase 3: Structural Optimization

**NOTA:** Este documento é atualizado automaticamente a cada mudança significativa no codebase e reflete com precisão o estado atual do projeto.
