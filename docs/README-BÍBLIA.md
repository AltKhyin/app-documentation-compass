
# **README-BÍBLIA.md** — Documento de Estado Vivo do Repositório EVIDENS

**Versão:** 2.0.3  
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

---

### **🔄 Em Desenvolvimento Ativo**

#### **Sistema de Reviews**
- 🔄 **Database:** Schema completo, mas RLS policies incompletas
- 🔄 **Editor:** Blueprint completo, implementação pendente
- 🔄 **Visualização:** Componentes básicos existem, falta integração

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
- ✅ **Data Consolidation:** Single API call para homepage
- ✅ **Optimistic Updates:** Votação instantânea sem lag
- ✅ **Rate Limiting:** Edge Functions protegidas

### **Fixes Críticos Implementados**
- ✅ **Duplicate Foreign Key:** Removido `fk_suggestions_submitted_by` 
- ✅ **RPC Permissions:** `GRANT EXECUTE` para `get_homepage_suggestions`
- ✅ **Typo Fix:** `Practioners` → `Practitioners` em get-homepage-feed
- ✅ **State Management:** Optimistic updates sem race conditions
- ✅ **Column Name:** `submitted_by` correction em submit-suggestion

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

### **Common Issues Resolved**
1. **"useAppData must be used within AppDataProvider"** → Fixed App.tsx structure
2. **"You have not voted on this suggestion"** → Fixed optimistic update race condition
3. **Suggestions não aparecem na homepage** → Fixed RPC join query
4. **300 status em embedded joins** → Fixed duplicate foreign key

### **Known Issues**
- **Reviews RLS Policy:** Não implementa corretamente acesso tier-based
- **Mobile Bottom Navigation:** Pode precisar de refinamento UX
- **Recommendation Algorithm:** Stub implementation apenas

---

## **6. PRÓXIMOS PASSOS RECOMENDADOS**

### **Prioridade Alta**
1. **Review Detail Page:** Implementar visualização completa de articles
2. **Reviews RLS:** Corrigir políticas de acesso baseadas em subscription_tier
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

**CHANGELOG v2.0.3:**
- ➕ Implemented optimistic updates for voting system
- ➕ Restructured NextEditionModule layout with timer/countdown UI
- ➕ Added avatar display in suggestion items
- ➕ Standardized typography across module
- 🔧 Fixed voting lag with instant UI feedback
- 📝 Updated documentation to reflect optimistic update patterns

**NOTA:** Este documento é atualizado automaticamente a cada mudança significativa no codebase.
