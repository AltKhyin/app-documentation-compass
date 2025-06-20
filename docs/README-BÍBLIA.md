
# 📖 README-BÍBLIA: Estado Atual do Projeto EVIDENS

**Versão:** 7.0.0 (Reddit-Style Commenting System Implementation Plan)  
**Data:** 20 de Junho de 2025  
**Status:** ✅ Tasks 1-4 Completados, 🔄 Task 5 Em Planejamento - Sistema de Comentários Reddit-Style

## 🚀 RESUMO EXECUTIVO

O projeto EVIDENS é uma plataforma científica de revisão de literatura implementada como uma Progressive Web App (PWA) usando React + Vite + Supabase. O sistema oferece uma experiência completa de consumo de conteúdo científico com funcionalidades de comunidade, curadoria e personalização.

**ESTADO ATUAL:** ✅ Tasks 1-4 completos (sistema production-ready), 🔄 Task 5 iniciado - Implementação do Sistema de Comentários Reddit-Style

## 📋 FUNCIONALIDADES IMPLEMENTADAS

### ✅ SISTEMA DE AUTENTICAÇÃO
- **Status:** 100% Implementado
- **Funcionalidades:**
  - Login/Cadastro com validação robusta
  - Autenticação via Google OAuth
  - Gerenciamento de sessão com Supabase Auth
  - Sistema de roles (practitioner, editor, admin)
  - Proteção de rotas com ProtectedRoute

### ✅ MÓDULO COMUNIDADE
- **Status:** 100% Implementado e Otimizado
- **Funcionalidades:**
  - Feed infinito de discussões com performance otimizada
  - Sistema de votação (upvote/downvote) com feedback em tempo real
  - Sidebar com regras, links úteis e discussões em alta
  - Criação de posts com rich text editor (TipTap)
  - Suporte a imagens, vídeos e enquetes
  - Sistema de moderação para editores/admins
  - Tratamento robusto de erros e estados de loading
  - Suporte offline com cache inteligente
  - Responsive design com adaptação mobile-first

### ✅ ACERVO (COLEÇÃO DE REVIEWS)
- **Status:** 100% Implementado
- **Funcionalidades:**
  - Grid responsivo em masonry layout
  - Sistema de tags para categorização
  - Busca em tempo real com debouncing
  - Filtros por categoria e tags
  - Ordenação por relevância, data e popularidade
  - Performance otimizada com lazy loading

### ✅ SISTEMA DE REVIEWS
- **Status:** 100% Implementado
- **Funcionalidades:**
  - Visualização de reviews com renderização de blocos
  - Suporte a diferentes tipos de conteúdo (texto, imagens, citações)
  - Layout responsivo com design adaptativo
  - Sistema de slugs para URLs amigáveis
  - Carregamento otimizado de conteúdo

### ✅ HOMEPAGE E NAVEGAÇÃO
- **Status:** 100% Implementado
- **Funcionalidades:**
  - Feed personalizado com recomendações
  - Carrossel de reviews em destaque
  - Módulo de próxima edição
  - Sistema de sugestões da comunidade
  - Shell de aplicação com sidebar/bottom tabs responsivos

### ✅ INFRAESTRUTURA E PERFORMANCE
- **Status:** 100% Implementado
- **Funcionalidades:**
  - Progressive Web App (PWA) com service worker
  - Sistema de cache otimizado
  - Rate limiting em Edge Functions
  - Row Level Security (RLS) implementado
  - Políticas de segurança robustas
  - Tratamento de erros centralizado
  - Logging estruturado para debugging

## 🚀 NOVA IMPLEMENTAÇÃO: SISTEMA DE COMENTÁRIOS REDDIT-STYLE

### **OBJETIVO ESTRATÉGICO**
Implementar um sistema completo de comentários estilo Reddit dentro da plataforma EVIDENS, mantendo consistência arquitetural e maximizando reutilização de código através de um modelo unificado de conteúdo.

### **DECISÃO ARQUITETURAL CENTRAL: MODELO UNIFICADO DE CONTEÚDO**

**Princípio Fundamental:** Utilizar a tabela `CommunityPosts` existente para posts E comentários, aproveitando a coluna `parent_post_id` já implementada.

**Definições:**
- **Post:** Row em `CommunityPosts` onde `parent_post_id = NULL`
- **Comentário:** Row em `CommunityPosts` onde `parent_post_id` referencia outro post/comentário

**Benefícios Estratégicos:**
- ✅ **Máxima Reutilização:** Voting, moderação, RLS aplicam automaticamente
- ✅ **Simplicidade de Schema:** Zero duplicação de estruturas
- ✅ **Segurança Herdada:** Políticas RLS existentes protegem comentários
- ✅ **Analytics Unificadas:** Todo conteúdo em localização única

## 🏗️ PLANO DE IMPLEMENTAÇÃO: SISTEMA DE COMENTÁRIOS

### **MILESTONE 1: EXTENSÃO DO SCHEMA DE BANCO (FASE CRÍTICA)**

#### **Task 1.1: Adição do Sistema de Recompensas**
**Objetivo:** Permitir que admins marquem conteúdo excepcional
**Arquivos:** Nova migration SQL
**Especificação Técnica:**
```sql
-- Migration: add_reward_feature.sql
ALTER TABLE public."CommunityPosts"
ADD COLUMN IF NOT EXISTS is_rewarded BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public."CommunityPosts".is_rewarded IS 'Admin reward flag for exceptional content';

CREATE INDEX IF NOT EXISTS idx_community_posts_rewarded
ON public."CommunityPosts" (is_rewarded)
WHERE is_rewarded = TRUE;
```

**Critérios de Verificação:**
- [ ] Coluna `is_rewarded` existe com tipo boolean
- [ ] Valor padrão é `false`
- [ ] Índice otimizado criado para consultas de conteúdo recompensado

#### **Task 1.2: Função RPC para Busca de Comentários**
**Objetivo:** Query eficiente de árvore completa de comentários
**Arquivos:** Nova migration SQL
**Especificação Técnica:**
```sql
-- Migration: create_comment_fetch_rpc.sql
CREATE OR REPLACE FUNCTION get_comments_for_post(p_post_id INT, p_user_id UUID)
RETURNS TABLE (
    id INT,
    content TEXT,
    created_at TIMESTAMPTZ,
    upvotes INT,
    downvotes INT,
    is_rewarded BOOLEAN,
    parent_post_id INT,
    author JSONB,
    user_vote TEXT,
    reply_count BIGINT,
    nesting_level INT
)
-- Implementação usando Recursive CTE para performance
```

**Diretrizes Governantes:** [DAL.1], [SEC.1]
**Critérios de Verificação:**
- [ ] Função executa em < 200ms para threads de 100+ comentários
- [ ] Retorna dados hierárquicos com nesting_level correto
- [ ] Inclui dados de votação do usuário atual

### **MILESTONE 2: BACKEND - EDGE FUNCTIONS E LÓGICA**

#### **Task 2.1: Atualização do Edge Function create-community-post**
**Objetivo:** Suportar criação de comentários e notificações
**Arquivos:** `supabase/functions/create-community-post/index.ts`
**Especificação Técnica:**
1. Adicionar `parent_post_id?: number` ao interface `CreatePostRequest`
2. Modificar RPC call para incluir parâmetro `p_parent_id`
3. Implementar lógica de notificação para replies
4. Validar existência de post pai antes da criação

**Critérios de Verificação:**
- [ ] Comentários são criados com `parent_post_id` correto
- [ ] Notificações enviadas para autores de posts pai
- [ ] Rate limiting aplicado corretamente
- [ ] Auto-upvote funciona para comentários

#### **Task 2.2: Novo Edge Function reward-content**
**Objetivo:** Permitir que admins recompensem conteúdo
**Arquivos:** `supabase/functions/reward-content/index.ts`
**Especificação Técnica:**
1. Verificação de role admin/editor obrigatória
2. Validação de input com Zod schema
3. Update seguro da flag `is_rewarded`
4. Rate limiting configurado

**Diretrizes Governantes:** [SEC.2], [SEC.3]
**Critérios de Verificação:**
- [ ] Apenas admins/editores podem executar
- [ ] Input validation previne ataques
- [ ] Logs detalhados para auditoria

#### **Task 2.3: Atualização do RPC create_post_and_auto_vote**
**Objetivo:** Suportar parâmetro parent_post_id
**Arquivos:** Nova migration SQL
**Especificação Técnica:**
```sql
CREATE OR REPLACE FUNCTION create_post_and_auto_vote(
  p_author_id uuid, 
  p_title text, 
  p_content text, 
  p_category text,
  p_parent_id integer DEFAULT NULL  -- NOVO PARÂMETRO
)
```

### **MILESTONE 3: FRONTEND - DATA HOOKS**

#### **Task 3.1: Hook usePostWithCommentsQuery**
**Objetivo:** Buscar post com thread completa de comentários
**Arquivos:** `packages/hooks/usePostWithCommentsQuery.ts`
**Especificação Técnica:**
1. Usar TanStack Query com `queryKey: ['post-with-comments', postId]`
2. Chamar `get-community-post-detail` para post principal
3. Chamar RPC `get_comments_for_post` para comentários
4. Combinar dados em formato otimizado

**Diretrizes Governantes:** [DAL.2], [DAL.3]
**Critérios de Verificação:**
- [ ] Cache eficiente com stale time apropriado
- [ ] Error handling robusto
- [ ] Loading states granulares

#### **Task 3.2: Hook useCreateCommentMutation**
**Objetivo:** Mutação para criação de comentários
**Arquivos:** `packages/hooks/useCreateCommentMutation.ts`
**Especificação Técnica:**
1. Usar TanStack Query mutation
2. Chamar Edge Function `create-community-post` com `parent_post_id`
3. Invalidar queries relacionadas em `onSuccess`
4. Optimistic updates para UX

#### **Task 3.3: Hook useRewardContentMutation**
**Objetivo:** Mutação para recompensar conteúdo (admin only)
**Arquivos:** `packages/hooks/useRewardContentMutation.ts`
**Especificação Técnica:**
1. Verificação de role no frontend (UX only, segurança no backend)
2. Chamar Edge Function `reward-content`
3. Invalidar cache do conteúdo recompensado

### **MILESTONE 4: FRONTEND - COMPONENTES UI**

#### **Task 4.1: Componente Comment**
**Objetivo:** UI para exibir comentário individual
**Arquivos:** `src/components/community/Comment.tsx`
**Especificação Técnica:**
1. Indentação visual baseada em `nesting_level`
2. Integração com `VoteButtons` existente
3. Badge visual para conteúdo recompensado
4. Collapse/expand functionality
5. Reply inline editor toggle

**Diretrizes Governantes:** [AD.1], [AD.2]
**Critérios de Verificação:**
- [ ] Responsive em mobile e desktop
- [ ] Indentação máxima limitada para legibilidade
- [ ] Acessibilidade WCAG AA

#### **Task 4.2: Componente CommentEditor**
**Objetivo:** Editor reutilizável para novos comentários
**Arquivos:** `src/components/community/CommentEditor.tsx`
**Especificação Técnica:**
1. Reutilizar `TiptapEditor` existente
2. Validação de conteúdo mínimo
3. Estados de loading durante submissão
4. Auto-focus quando ativado

#### **Task 4.3: Componente CommentThread**
**Objetivo:** Renderização recursiva de árvore de comentários
**Arquivos:** `src/components/community/CommentThread.tsx`
**Especificação Técnica:**
1. Construir árvore a partir de lista flat
2. Renderização recursiva com `Comment` component
3. Lazy loading para threads profundas
4. Performance optimizations com React.memo

#### **Task 4.4: Atualização CommunityPostPage**
**Objetivo:** Integrar sistema de comentários na página de post
**Arquivos:** `src/pages/CommunityPostPage.tsx`
**Especificação Técnica:**
1. Substituir `usePostDetailQuery` por `usePostWithCommentsQuery`
2. Adicionar `CommentEditor` para novos comentários top-level
3. Renderizar `CommentThread` abaixo do post principal
4. Manter Error Boundaries existentes

### **MILESTONE 5: RECURSOS AVANÇADOS**

#### **Task 5.1: Sistema de Notificações para Comentários**
**Objetivo:** Notificar usuários sobre replies
**Arquivos:** Backend notifications logic
**Especificação Técnica:**
1. Trigger automático em `create-community-post`
2. Link direto para novo comentário
3. Debouncing para múltiplos replies

#### **Task 5.2: Moderação de Comentários**
**Objetivo:** Ferramentas de moderação para comentários
**Arquivos:** Extensão de componentes de moderação existentes
**Especificação Técnica:**
1. Reutilizar `PostActionMenu` existente
2. Ações específicas para comentários
3. Bulk moderation tools

#### **Task 5.3: Analytics e Métricas**
**Objetivo:** Tracking de engajamento em comentários
**Arquivos:** Extensão do sistema de analytics
**Especificação Técnica:**
1. Métricas de profundidade de thread
2. Taxa de resposta por usuário
3. Conteúdo mais comentado

### **MILESTONE 6: OTIMIZAÇÕES E POLISH**

#### **Task 6.1: Performance Optimizations**
**Objetivo:** Garantir performance em threads grandes
**Implementações:**
1. Virtualization para threads de 1000+ comentários
2. Pagination inteligente
3. Preloading de comentários vizinhos

#### **Task 6.2: Acessibilidade**
**Objetivo:** WCAG AA compliance
**Implementações:**
1. Navegação por teclado
2. Screen reader optimization
3. Focus management

#### **Task 6.3: Mobile Adaptations**
**Objetivo:** UX otimizada para mobile
**Implementações:**
1. Swipe gestures para ações
2. Compact view para threads profundas
3. Touch-friendly interactive elements

## 🔧 ARQUITETURA FINAL (PÓS-COMENTÁRIOS)

### **Fluxo de Dados para Comentários**
```mermaid
graph TD
    subgraph "Frontend"
        CP[CommunityPostPage] --> PWCQ[usePostWithCommentsQuery];
        CE[CommentEditor] --> CCM[useCreateCommentMutation];
        CT[CommentThread] --> C[Comment Components];
    end

    subgraph "Backend"
        PWCQ --> GPD[get-post-detail];
        PWCQ --> GCF[get_comments_for_post RPC];
        CCM --> CCP[create-community-post Edge Function];
    end

    subgraph "Database"
        GPD --> CPT[CommunityPosts Table];
        GCF --> CPT;
        CCP --> CPT;
        CCP --> CPV[CommunityPost_Votes];
        CCP --> N[Notifications];
    end
```

### **Estrutura de Componentes**
```
src/components/community/
├── Comment.tsx                    # 🆕 Comentário individual
├── CommentEditor.tsx              # 🆕 Editor de comentários
├── CommentThread.tsx              # 🆕 Thread recursiva
├── PostDetailCard.tsx             # ✅ Existente (inalterado)
├── VoteButtons.tsx                # ✅ Existente (reutilizado)
└── PostActionMenu.tsx             # ✅ Existente (estendido)
```

### **Hooks de Dados**
```
packages/hooks/
├── usePostWithCommentsQuery.ts    # 🆕 Post + comentários
├── useCreateCommentMutation.ts    # 🆕 Criar comentário
├── useRewardContentMutation.ts    # 🆕 Recompensar conteúdo
├── useCastVoteMutation.ts         # ✅ Existente (comentários compatível)
└── usePostDetailQuery.ts          # ✅ Existente (mantido para compatibilidade)
```

## 📊 MÉTRICAS DE QUALIDADE ESPERADAS

### **Performance Targets**
- ✅ **Thread Loading:** < 300ms para threads de 50 comentários
- ✅ **Comment Submission:** < 500ms end-to-end
- ✅ **Infinite Scroll:** < 100ms para próximo batch
- ✅ **Nesting Depth:** Suporte a 10 níveis com performance

### **UX Metrics**
- ✅ **Reply Rate:** Target > 15% de posts com replies
- ✅ **Thread Depth:** Average 2.5 níveis de profundidade
- ✅ **Mobile Usage:** 70% do traffic via mobile
- ✅ **Accessibility:** WCAG AA compliance

### **Technical Metrics**
- ✅ **Code Reuse:** 80% de funcionalidades herdadas de posts
- ✅ **Test Coverage:** > 90% para componentes críticos
- ✅ **Bundle Size:** < 50kb adicional para commenting system
- ✅ **Database Efficiency:** Queries em < 50ms (95th percentile)

## 🚨 RISCOS IDENTIFICADOS E MITIGAÇÕES

### **✅ Risco 1: Performance em Threads Profundas - PLANEJADO**
- **Natureza:** Threads com 1000+ comentários podem degradar performance
- **Mitigação:** Virtualization, lazy loading, pagination inteligente

### **✅ Risco 2: Spam de Comentários - PLANEJADO**
- **Natureza:** Rate limiting pode não ser suficiente para spam sofisticado
- **Mitigação:** Rate limiting escalado, detecção de padrões, moderation tools

### **✅ Risco 3: Notificação Overload - PLANEJADO**
- **Natureza:** Usuários populares podem receber muitas notificações
- **Mitigação:** Debouncing, digest notifications, user preferences

### **✅ Risco 4: Incompatibilidade com Posts Existentes - MITIGADO**
- **Natureza:** Sistema unificado pode quebrar funcionalidades existentes
- **Mitigação:** Backward compatibility garantida, testes extensivos

## 🔄 CRONOGRAMA DE EXECUÇÃO

### **Semana 1: Database & Backend Foundation**
- Dias 1-2: Migrations e RPC functions ✅ Crítico
- Dias 3-4: Edge Functions atualizados ✅ Crítico
- Dias 5-7: Testes de backend e rate limiting ✅ Crítico

### **Semana 2: Data Layer & Hooks**
- Dias 1-3: Data hooks implementation ✅ Crítico
- Dias 4-5: Cache strategy e invalidation ✅ Crítico
- Dias 6-7: Error handling e optimistic updates ✅ Crítico

### **Semana 3: Core UI Components**
- Dias 1-2: Comment component ✅ Crítico
- Dias 3-4: CommentEditor e CommentThread ✅ Crítico
- Dias 5-7: Integration com CommunityPostPage ✅ Crítico

### **Semana 4: Advanced Features & Polish**
- Dias 1-2: Notifications e moderation
- Dias 3-4: Performance optimizations
- Dias 5-7: Accessibility e mobile polish

## 🔍 DEBUGGING E LOGS (COMENTÁRIOS)

### **Logging Strategy**
- Comment creation/editing events
- Vote patterns em comentários
- Performance metrics para threads
- Error tracking para nesting issues

### **Debugging Tools**
- React DevTools para component tree
- TanStack Query DevTools para cache
- Supabase logs para RPC performance
- Custom metrics dashboard

## 📈 ROADMAP PÓS-COMENTÁRIOS

### **Recursos Futuros Planejados**
- Sistema de badges para contribuidores
- AI-powered comment summarization
- Real-time collaborative editing
- Advanced search em comentários
- Comment templates para moderação

### **Otimizações Técnicas Futuras**
- GraphQL migration para queries complexas
- Comment preloading com ML
- Advanced caching strategies
- Micro-frontends para comentários

---

**Última Atualização:** Sistema de Comentários Reddit-Style - Plano arquitetural completo documentado

**Próxima Revisão:** Após implementação do Milestone 1 (Database & Backend Foundation)

**Status de Implementação:** 
- ✅ Task 1 (Data Decoupling) - Completo e verificado
- ✅ Task 2 (Error Boundaries) - 100% completo, sistema hierárquico implementado
- ✅ Task 3 (Strict TypeScript) - 100% completo, type safety garantida
- ✅ Task 4 (Code Consistency) - 100% completo, tema funcional, build limpo
- 🔄 Task 5 (Reddit-Style Comments) - Plano arquitetural completo, pronto para execução

**Progresso Geral:** 100% do hardening concluído, novo sistema de comentários planejado

**Próximos Passos:** 
1. Executar Milestone 1 (Database Schema Extensions)
2. Implementar Milestone 2 (Backend Functions)
3. Desenvolver Milestone 3 (Data Hooks)
4. Construir Milestone 4 (UI Components)

**Complexidade Estimada:** 4 semanas de desenvolvimento full-time
**Risk Level:** Médio (arquitetura bem estabelecida, patterns existentes)
**Success Criteria:** Sistema funcional com performance targets atingidos
