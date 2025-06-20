
# EVIDENS BÍBLIA - Documentação Viva do Projeto
**Versão:** 2.5.3  
**Última Atualização:** 20 de junho de 2025

## 🏗️ ARQUITETURA IMPLEMENTADA

### Frontend (React + Vite + TypeScript)
- **Shell da Aplicação:** Implementado com navegação adaptativa (mobile + desktop)
- **Sistema de Autenticação:** OAuth com Google + Supabase Auth
- **Sistema de Temas:** Dark/Light mode com persistência
- **PWA:** Configurado para instalação mobile

### Backend (Supabase)
- **Database:** PostgreSQL com RLS policies
- **Edge Functions:** 12 funções implementadas
- **Auth:** JWT com custom claims para roles
- **Storage:** Configurado (não utilizado ainda)

---

## 📱 MÓDULOS IMPLEMENTADOS

### 1. HOMEPAGE (/)
**Status:** ✅ COMPLETO  
**Componentes:** 7 componentes  
**Features:** Feed personalizado, carrossel de reviews, sugestões  
**Mobile:** 100% adaptado  

### 2. ACERVO (/acervo)
**Status:** ✅ COMPLETO  
**Componentes:** 6 componentes  
**Features:** Busca, filtros, masonry grid, tags  
**Mobile:** 100% adaptado  

### 3. COMUNIDADE (/comunidade)
**Status:** ✅ COMPLETO + ENHANCED  
**Componentes:** 15+ componentes  
**Features:** Posts, votação, moderação, sidebar  
**Mobile:** 100% adaptado  
**Enhanced:** Sistema de erro robusto, loading states progressivos, fallbacks offline

### 4. PERFIL (/perfil)
**Status:** 🟡 PLACEHOLDER  
**Componentes:** 1 componente básico  
**Features:** Blueprint 07 pendente  

### 5. REVIEW DETAIL (/acervo/:slug)
**Status:** ✅ COMPLETO  
**Componentes:** 4 componentes  
**Features:** Rendering engine v2.0  

### 6. SALVOS (/salvos)
**Status:** ✅ COMPLETO  
**Componentes:** 3 componentes  
**Features:** Posts salvos, paginação  

---

## 🔧 SISTEMA DE TIPOS CONSOLIDADO

### Tipos Principais (v2.5.3)
- **Community Types:** Otimizados e consolidados
- **API Types:** Padronizados e centralizados  
- **Global Types:** Melhores práticas implementadas
- **Error Handling:** Sistema robusto com categorização

### Naming Convention
- **Pages:** Inglês (CommunityPage.tsx, CollectionPage.tsx, ProfilePage.tsx)
- **Routes:** Português para usuário (/comunidade, /acervo, /perfil)
- **Components:** Inglês interno, labels em português
- **Types:** Inglês com interfaces claras

---

## 🛡️ ERROR HANDLING & ROBUSTNESS (NEW)

### Error Boundaries
- **CommunityErrorBoundary:** Enhanced com retry automático para erros de rede
- **ErrorFallback:** Componente genérico com categorização de erros
- **Network Awareness:** Detecção offline/online com fallbacks inteligentes

### Loading States
- **CommunityLoadingState:** Skeletons adaptativos e animações progressivas
- **Skeleton Variants:** feed, sidebar, post, minimal, page
- **Progressive Loading:** Carregamento incremental com timing otimizado

### Fallback Mechanisms
- **NetworkAwareFallback:** Cache-first com indicadores de status
- **Offline Support:** Conteúdo cached quando offline
- **Stale Data Detection:** Alertas para dados desatualizados

---

## 🗂️ ESTRUTURA DE ARQUIVOS

```
src/
├── components/
│   ├── ui/ (35 componentes shadcn/ui + ErrorFallback)
│   ├── community/ (15+ componentes + enhanced error handling)
│   ├── homepage/ (7 componentes)
│   ├── acervo/ (6 componentes)
│   └── auth/ (6 componentes)
├── pages/ (12 páginas - nomes em inglês)
├── hooks/ (5 hooks + useNetworkStatus)
├── types/ (3 arquivos de tipos consolidados)
├── config/ (navigation.ts padronizado)
└── packages/hooks/ (12 data-fetching hooks)
```

---

## 📊 EDGE FUNCTIONS IMPLEMENTADAS

1. **get-homepage-feed** - Feed personalizado da homepage
2. **get-acervo-data** - Dados do acervo com filtros
3. **get-community-page-data** - Dados consolidados da comunidade (otimizado)
4. **get-community-feed** - Feed da comunidade via RPC
5. **get-community-post-detail** - Detalhes de posts individuais
6. **create-community-post** - Criação de posts com auto-voto
7. **cast-community-vote** - Sistema de votação
8. **moderate-community-post** - Ações de moderação
9. **save-post / get-saved-posts** - Sistema de posts salvos
10. **submit-suggestion** - Envio de sugestões
11. **cast-suggestion-vote** - Votação em sugestões
12. **get-review-by-slug** - Review por slug

---

## 🚀 PERFORMANCE & OTIMIZAÇÕES

### TanStack Query
- **Caching Strategy:** Stale-time otimizado por contexto
- **Infinite Queries:** Implementado para feeds
- **Cache Invalidation:** Inteligente após mutações
- **Error Retry:** Configurado com backoff exponencial

### Network Optimization
- **Rate Limiting:** Implementado em todas as Edge Functions
- **Request Deduplication:** Via TanStack Query
- **Offline Resilience:** Cache-first com fallbacks
- **Progressive Enhancement:** Loading states adaptativos

### Mobile Performance
- **Lazy Loading:** Componentes sob demanda
- **Image Optimization:** Loading lazy em ReviewCards
- **Touch Optimization:** Gestos e interações mobile
- **PWA Caching:** Service Worker configurado

---

## 🎯 PRÓXIMOS MILESTONES

### PENDENTE - Perfil Completo (Blueprint 07)
- Sistema de perfil com atividades
- Hover cards para usuários
- Histórico de contribuições
- Configurações avançadas

### FUTURO - Admin Module
- Dashboard de moderação
- Analytics avançados
- Gestão de conteúdo
- Sistema de permissões

---

## 📈 MÉTRICAS ATUAIS

- **Componentes Totais:** 65+
- **Páginas Implementadas:** 12
- **Edge Functions:** 12
- **Hooks Personalizados:** 17
- **Cobertura Mobile:** 100%
- **Sistema de Tipos:** 100% TypeScript
- **Error Handling:** Sistema robusto implementado
- **Offline Support:** Implementado para módulo comunidade

**Status Geral:** 🟢 SISTEMA ESTÁVEL E ROBUSTO COM ENHANCED ERROR HANDLING
