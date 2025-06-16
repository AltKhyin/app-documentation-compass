
# **README-BÍBLIA.md** — Documento de Estado Vivo do Repositório EVIDENS

**Versão:** 2.1.0  
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

#### **🆕 Sistema Acervo (NEW)**
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

- ❌ **Community Module:** Posts, comentários, interações sociais
- ❌ **Profile Pages:** Páginas detalhadas de perfil de usuário
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
├── Tags (hierarquia categoria/subtag) ✅ NEW
├── ReviewTags (junction table) ✅ NEW
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
useAcervoDataQuery() ✅ NEW

// Mutations (WRITE)
useCastVoteMutation() ✅ 
useSubmitSuggestionMutation() ✅
useLoginMutation() ✅
useSignupMutation() ✅
```

---

## **5. DEBUGGING E TROUBLESHOOTING**

### **Edge Functions Logs**
- **cast-suggestion-vote:** Monitorar rate limiting e vote validation
- **get-homepage-feed:** Verificar performance e data completeness
- **submit-suggestion:** Validar input sanitization
- **get-acervo-data:** Monitorar queries parallel e tag processing

### **Common Issues Resolved**
1. **"useAppData must be used within AppDataProvider"** → Fixed App.tsx structure
2. **"You have not voted on this suggestion"** → Fixed optimistic update race condition
3. **Suggestions não aparecem na homepage** → Fixed RPC join query
4. **300 status em embedded joins** → Fixed duplicate foreign key
5. **Foreign key violation em ReviewTags** → Fixed sample data insertion order

### **Known Issues**
- **Mobile Bottom Navigation:** Pode precisar de refinamento UX
- **Recommendation Algorithm:** Stub implementation apenas
- **Review Detail Navigation:** Placeholder onClick handlers

---

## **6. PRÓXIMOS PASSOS RECOMENDADOS**

### **Prioridade Alta**
1. **Review Detail Page:** Implementar visualização completa de articles (Blueprint 05)
2. **Navigation Integration:** Links funcionais entre Homepage → Acervo → Review Detail
3. **Real-time Updates:** Implementar para votes e notifications

### **Prioridade Média**
1. **Timer Backend:** Implementar countdown real para "Próxima Edição"
2. **Search Interface:** Busca básica por Reviews
3. **User Profiles:** Páginas de perfil expandidas

### **Prioridade Baixa**
1. **Community Module:** Sistema social completo
2. **Advanced Analytics:** Dashboard de métricas
3. **AI Integration:** Chat assistente para recommendations

---

## **7. COMANDOS DE DESENVOLVIMENTO ESSENCIAIS**

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

**CHANGELOG v2.1.0:**
- ➕ **MILESTONE 4 COMPLETE:** Acervo page fully implemented
- ➕ Added complete database schema for Tags and ReviewTags
- ➕ Implemented get-acervo-data Edge Function with parallel queries
- ➕ Created full responsive Acervo UI with masonry grid
- ➕ Implemented client-side sorting (reorder, not filter) per Blueprint
- ➕ Added mobile adaptation with bottom sheet modal
- ➕ Proper RLS policies for Reviews table tier-based access
- ➕ Sample data for immediate testing and demonstration
- 🔧 Fixed foreign key constraints in sample data insertion
- 📝 Updated navigation with Acervo integration

**NOTA:** Este documento é atualizado automaticamente a cada mudança significativa no codebase.
