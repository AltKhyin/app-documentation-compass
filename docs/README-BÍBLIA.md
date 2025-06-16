
# **README-BÍBLIA.md** — Documento de Estado Vivo do Repositório EVIDENS

**Versão:** 2.2.0  
**Data:** 16 de junho de 2025  
**Propósito:** Fornece um resumo completo de 2 minutos do estado atual implementado do repositório para qualquer desenvolvedor AI ou humano.

---

## **1. VISÃO GERAL DO PROJETO**

**EVIDENS** é uma plataforma de conhecimento médico baseada em evidências que permite aos profissionais de saúde acessar, contribuir e colaborar com conteúdo científico de alta qualidade.

### **Arquitetura Tecnológica**
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Edge Functions + RLS + Auth)
- **Estado do Cliente:** TanStack Query v5 + Zustand (global state)
- **Deploy:** Lovable (staging) com possibilidade de domínio customizado

---

## **2. ESTADO ATUAL DA IMPLEMENTAÇÃO**

### **✅ Funcionalidades Completamente Implementadas**

#### **🆕 Foundation Architecture (NEW)**
- ✅ **Unified Navigation System:** Configuração centralizada em `src/config/navigation.ts`
- ✅ **Complete Route Coverage:** Todas as rotas de navegação implementadas
- ✅ **Mobile/Desktop Navigation Consistency:** NavItem unificado para ambas plataformas
- ✅ **Placeholder Pages:** ComunidadePage, PerfilPage, ConfiguracoesPage implementadas
- ✅ **Navigation State Management:** Consistent active state handling

#### **Sistema de Autenticação**
- ✅ Login/Signup com email e senha
- ✅ Autenticação via Google (OAuth)
- ✅ Session management via Supabase Auth
- ✅ RLS policies para controle de acesso
- ✅ Custom claims (role, subscription_tier) via trigger `handle_new_user`

#### **Homepage Feed System**
- ✅ **Edge Function:** `get-homepage-feed` - API única consolidada
- ✅ **Database RPC:** `get_homepage_suggestions()` - busca sugestões com status de voto
- ✅ **Hook:** `useConsolidatedHomepageFeedQuery` - TanStack Query com cache agressivo
- ✅ **Componentes:** FeaturedReview, ReviewCarousel, NextEditionModule
- ✅ **Layout dinâmico:** Configurável via `SiteSettings.homepage_layout`

#### **Sistema de Votação em Sugestões**
- ✅ **Edge Function:** `cast-suggestion-vote` - Rate limited (10 votos/min por usuário)
- ✅ **Hook:** `useCastVoteMutation` - Optimistic updates com TanStack Query
- ✅ **Componente:** `SuggestionPollItem` - Interface de votação simplificada
- ✅ **Trigger:** `update_suggestion_vote_count()` - Atualização automática de contadores
- ✅ **RLS:** Políticas completas para `Suggestion_Votes`

#### **Sistema de Submissão de Sugestões**
- ✅ **Edge Function:** `submit-suggestion`
- ✅ **Hook:** `useSubmitSuggestionMutation`
- ✅ **Interface:** Formulário integrado no NextEditionModule

#### **App Shell**
- ✅ **Responsive Design:** Mobile-first com adaptações para desktop
- ✅ **Navigation:** Header + Sidebar colapsível + Bottom tabs (mobile)
- ✅ **User Profile Block:** Avatar, nome, role, contribution score
- ✅ **Notification Bell:** Contador em tempo real
- ✅ **Context Providers:** Auth + AppData integration

#### **Sistema Acervo**
- ✅ **Database Schema:** Tables `Tags`, `ReviewTags` com hierarquia categoria/subtag
- ✅ **Edge Function:** `get-acervo-data` - API consolidada para reviews + tags
- ✅ **Hook:** `useAcervoDataQuery` - TanStack Query com cache agressivo
- ✅ **Frontend Components:**
  - ✅ `AcervoPage` - Página principal responsiva
  - ✅ `TagsPanel` - Filtros horizontais (desktop)
  - ✅ `MobileTagsModal` - Bottom sheet para mobile
  - ✅ `MasonryGrid` - Layout em colunas CSS
  - ✅ `ReviewCard` - Cards individuais dos reviews
  - ✅ `ClientSideSorter` - Reordenação por relevância (não filtro)
- ✅ **UX Core:** Sistema de reordenação, não filtragem (conforme Blueprint)
- ✅ **Mobile Adaptation:** Bottom sheet + 2-column grid
- ✅ **RLS Policies:** Controle de acesso tier-based para Reviews
- ✅ **Sample Data:** Reviews e tags de teste para demonstração

---

### **🔄 Em Desenvolvimento Ativo**

#### **Sistema de Reviews**
- 🔄 **Review Detail Page:** Visualização individual de reviews (Blueprint 05)
- 🔄 **Editor:** Blueprint completo, implementação pendente

#### **Sistema de Recomendações**
- 🔄 **Edge Function:** `get-personalized-recommendations` (stub)
- 🔄 **Algoritmo:** Lógica de ML/AI pendente

---

### **❌ Não Implementado (Prioridades Futuras)**

- ❌ **Community Module:** Posts, comentários, interações sociais (placeholder criado)
- ❌ **Profile Pages:** Páginas detalhadas de perfil de usuário (placeholder criado)
- ❌ **Advanced Search:** Busca inteligente por conteúdo
- ❌ **Analytics Dashboard:** Métricas de engajamento e performance
- ❌ **Admin Panel:** Interface de moderação e gestão

---

## **3. ARQUITETURA DE DADOS E PERFORMANCE**

### **Database Schema (PostgreSQL)**
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

### **Performance Optimizations**
- ✅ **Indexes:** Foreign keys otimizados
- ✅ **Query Caching:** TanStack Query com 5min stale time
- ✅ **Data Consolidation:** Single API calls para homepage e acervo
- ✅ **Optimistic Updates:** Votação instantânea sem lag
- ✅ **Rate Limiting:** Edge Functions protegidas
- ✅ **Client-side Sorting:** Acervo reordenação sem server round-trips

### **Fixes Críticos Implementados**
- ✅ **Navigation Unification:** Configuração centralizada elimina inconsistências
- ✅ **Route Coverage:** Todos os links de navegação agora funcionais
- ✅ **Component Architecture:** NavItem unificado para desktop e mobile
- ✅ **Duplicate Foreign Key:** Removido `fk_suggestions_submitted_by` 
- ✅ **RPC Permissions:** `GRANT EXECUTE` para `get_homepage_suggestions`
- ✅ **Typo Fix:** `Practioners` → `Practitioners` em get-homepage-feed
- ✅ **State Management:** Optimistic updates sem race conditions
- ✅ **Column Name:** `submitted_by` correction em submit-suggestion
- ✅ **Reviews RLS:** Políticas completas tier-based implementadas
- ✅ **Sample Data Fix:** Correção de foreign key constraints

---

## **4. ESTRATÉGIA DE DATA FETCHING**

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

### **Directory Structure**
```
/src/
├── components/
│   ├── shell/           # App layout components
│   ├── homepage/        # Homepage-specific components
│   ├── acervo/          # Acervo-specific components
│   ├── auth/            # Authentication components
│   └── ui/              # Reusable UI components
├── config/              # 🆕 Centralized configuration
│   └── navigation.ts    # 🆕 Navigation routes definition
├── contexts/            # React Context providers
├── hooks/               # Custom hooks and mutations
├── pages/               # Top-level route components
├── store/               # Zustand global state
└── lib/                 # Utilities and Supabase client
```

### **Navigation Architecture**
- ✅ **Centralized Config:** Single source of truth em `src/config/navigation.ts`
- ✅ **Unified Components:** NavItem funciona para desktop e mobile
- ✅ **Consistent State:** Active route handling padronizado
- ✅ **Complete Coverage:** Todas as rotas implementadas com placeholders

---

## **6. DEBUGGING E TROUBLESHOOTING**

### **Edge Functions Logs**
- **cast-suggestion-vote:** Monitorar rate limiting e vote validation
- **get-homepage-feed:** Verificar performance e data completeness
- **submit-suggestion:** Validar input sanitization
- **get-acervo-data:** Monitorar queries parallel e tag processing

### **Common Issues Resolved**
1. **Navigation 404 errors** → Fixed with centralized navigation config
2. **Mobile/Desktop nav inconsistency** → Fixed with unified NavItem component
3. **"useAppData must be used within AppDataProvider"** → Fixed App.tsx structure
4. **"You have not voted on this suggestion"** → Fixed optimistic update race condition
5. **Suggestions não aparecem na homepage** → Fixed RPC join query
6. **300 status em embedded joins** → Fixed duplicate foreign key
7. **Foreign key violation em ReviewTags** → Fixed sample data insertion order

### **Known Issues**
- **Review Detail Navigation:** Placeholder onClick handlers
- **Recommendation Algorithm:** Stub implementation apenas

---

## **7. PRÓXIMOS PASSOS RECOMENDADOS**

### **Prioridade Alta**
1. **Review Detail Page:** Implementar visualização completa de articles (Blueprint 05)
2. **Community Module:** Implementar sistema de posts e comentários (Blueprint 06)
3. **Profile Enhancement:** Expandir páginas de perfil (Blueprint 07)

### **Prioridade Média**
1. **Real-time Updates:** Implementar para votes e notifications
2. **Search Interface:** Busca básica por Reviews
3. **Timer Backend:** Implementar countdown real para "Próxima Edição"

### **Prioridade Baixa**
1. **Advanced Analytics:** Dashboard de métricas
2. **AI Integration:** Chat assistente para recommendations
3. **Editor Implementation:** Visual Composition Engine (Blueprint 08a)

---

## **8. COMANDOS DE DESENVOLVIMENTO ESSENCIAIS**

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

**CHANGELOG v2.2.0:**
- ➕ **PHASE 1 COMPLETE:** Foundation Stabilization implemented
- ➕ Created centralized navigation configuration system
- ➕ Added complete placeholder pages for all navigation routes
- ➕ Unified NavItem component for desktop and mobile consistency
- ➕ Eliminated all navigation 404 errors
- ➕ Enhanced App.tsx with complete route definitions
- ➕ Improved navigation state management consistency
- 🔧 Fixed mobile/desktop navigation inconsistencies
- 📝 Updated documentation to reflect current Vite + React architecture

**NOTA:** Este documento é atualizado automaticamente a cada mudança significativa no codebase.
