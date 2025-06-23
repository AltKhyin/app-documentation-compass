
# **EVIDENS - Bíblia de Implementação**

**Versão:** 9.0.0  
**Data:** 23 de junho de 2025  
**Status:** 🔄 MANAGEMENT SYSTEM DEVELOPMENT

---

## **📋 CONTROLE DE VERSÃO**

### **9.0.0 - Management System Implementation Plan** *(23/06/2025)*
**MAJOR MILESTONE:**
- **STRATEGIC INITIATIVE:** Complete Management Platform Implementation Plan
- **ARCHITECTURAL EXPANSION:** Admin system with publication workflows, user management, and analytics
- **SECURITY ENHANCEMENT:** Role-based access control with editor/admin permissions
- **PERFORMANCE OPTIMIZATION:** Rate-limited Edge Functions with comprehensive error handling

**Implementation Plan Overview:**
- ✅ **Strategic Analysis Complete:** Modular management system approach selected
- 🔄 **Phase 1:** Database schema extensions for publication workflow
- 🔄 **Phase 2:** Core Edge Functions with rate limiting and security
- 🔄 **Phase 3:** Admin route protection and navigation
- 🔄 **Phase 4:** Content publication engine with TanStack Query hooks
- 🔄 **Phase 5:** Enhanced management modules (users, tags, layouts)
- 🔄 **Phase 6:** Analytics dashboard and performance optimization

### **8.3.0 - Navigation Unification & Homepage Responsiveness** *(21/06/2025)*
**BREAKING CHANGES:**
- **ARCHITECTURAL:** Unified navigation system eliminates duplicate mobile/desktop navigation arrays
- **STANDARDIZATION:** Homepage now uses consistent container patterns for proper responsiveness

**Core Changes:**
- ✅ **Navigation Unification:** Single source of truth in `src/config/navigation.ts` with context-aware filtering
- ✅ **Homepage Responsiveness:** Standardized container patterns (`container mx-auto px-4 py-6`)
- ✅ **Mobile Navigation Consistency:** Core navigation items synchronized between mobile/desktop
- ✅ **Admin Items Segregation:** Admin navigation items remain desktop-only for ergonomic reasons
- ✅ **Legacy Support:** Deprecated functions maintained temporarily for backward compatibility

---

## **🎯 ESTADO ATUAL DA APLICAÇÃO**

### **✅ FEATURES IMPLEMENTADAS**

#### **🏠 Homepage**
- ✅ **Layout Responsivo:** Container padronizado com adaptação completa para todos os tamanhos de tela
- ✅ **Feed Consolidado:** Query única otimizada para todos os módulos da homepage
- ✅ **Review em Destaque:** Componente hero com review principal
- ✅ **Carrosséis:** Reviews recentes, populares e recomendações personalizadas
- ✅ **Próxima Edição:** Sistema de sugestões com votação integrada

#### **📚 Acervo**
- ✅ **Grid Masonry:** Layout dinâmico e responsivo para reviews
- ✅ **Sistema de Tags:** Filtros hierárquicos com painel lateral (desktop) e modal (mobile)
- ✅ **Busca Avançada:** Input de busca com filtros em tempo real
- ✅ **Ordenação:** Múltiplos critérios de ordenação (data, popularidade, etc.)

#### **👥 Comunidade**
- ✅ **Feed Principal:** Lista de posts com paginação infinita
- ✅ **Criação de Posts:** Editor rich-text com suporte a imagens, vídeos e enquetes
- ✅ **Sistema de Votação:** Upvote/downvote com feedback em tempo real
- ✅ **Comentários:** Sistema completo de comentários aninhados
- ✅ **Moderação:** Ferramentas de moderação para admins
- ✅ **Sidebar Contextual:** Regras, links úteis, discussões em alta (desktop only)

#### **🔐 Autenticação**
- ✅ **Sistema JWT:** Autenticação baseada em tokens com claims customizados
- ✅ **OAuth Google:** Login social integrado
- ✅ **Controle de Acesso:** RLS policies para segurança granular
- ✅ **Gestão de Sessão:** Persistência de sessão e logout automático

#### **🏗️ Arquitetura**
- ✅ **Shell Unificado:** Sistema de navegação consistente mobile/desktop
- ✅ **Navegação Padronizada:** Fonte única de verdade para itens de navegação
- ✅ **Layout Responsivo:** Adaptação perfeita para todos os dispositivos
- ✅ **PWA Completo:** Instalação, offline, notificações push
- ✅ **Error Boundaries:** Sistema robusto de recuperação de erros

---

## **🚀 MANAGEMENT SYSTEM - PLANO DE IMPLEMENTAÇÃO COMPLETO**

### **📊 Visão Geral Estratégica**

**Objetivo Principal:** Criar uma plataforma administrativa completa que permita gestão de conteúdo, usuários, tags, layouts e analytics com controle de acesso baseado em roles.

**Arquitetura Escolhida:** Sistema Modular de Gestão
- Baseado na arquitetura desacoplada existente (DOC_2)
- Segue estrutura feature-first (M2.4) 
- Implementa data fetching granular (DOC_6)
- Mantém princípios de simplicidade através de modularidade

---

### **Phase 1: Foundation & Database (Week 1)**

#### **Milestone 1.1: Database Schema Implementation**
**Objetivo:** Implementar extensões do workflow de publicação no banco de dados

**Arquivos a Modificar:**
- `supabase/migrations/20250623001000_add_publication_workflow.sql`

**Especificação Técnica:**
1. **Adicionar campos de workflow à tabela Reviews:**
   ```sql
   ALTER TABLE "Reviews" ADD COLUMN IF NOT EXISTS "review_status" TEXT DEFAULT 'draft' 
   CHECK (review_status IN ('draft', 'under_review', 'scheduled', 'published', 'archived'));
   ALTER TABLE "Reviews" ADD COLUMN IF NOT EXISTS "reviewer_id" UUID REFERENCES "Practitioners"(id);
   ALTER TABLE "Reviews" ADD COLUMN IF NOT EXISTS "scheduled_publish_at" TIMESTAMPTZ;
   ALTER TABLE "Reviews" ADD COLUMN IF NOT EXISTS "publication_notes" TEXT;
   ALTER TABLE "Reviews" ADD COLUMN IF NOT EXISTS "review_requested_at" TIMESTAMPTZ;
   ALTER TABLE "Reviews" ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMPTZ;
   ```

2. **Criar tabela Publication_History:**
   ```sql
   CREATE TABLE IF NOT EXISTS "Publication_History" (
     "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     "review_id" INT NOT NULL REFERENCES "Reviews"(id) ON DELETE CASCADE,
     "action" TEXT NOT NULL CHECK (action IN ('created', 'submitted_for_review', 'approved', 'rejected', 'scheduled', 'published', 'unpublished', 'archived')),
     "performed_by" UUID NOT NULL REFERENCES "Practitioners"(id),
     "notes" TEXT,
     "metadata" JSONB DEFAULT '{}'::jsonb,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

3. **Criar índices de performance:**
   ```sql
   CREATE INDEX IF NOT EXISTS "idx_reviews_review_status" ON "Reviews"("review_status");
   CREATE INDEX IF NOT EXISTS "idx_reviews_reviewer_id" ON "Reviews"("reviewer_id");
   CREATE INDEX IF NOT EXISTS "idx_reviews_scheduled_publish" ON "Reviews"("scheduled_publish_at") 
     WHERE "scheduled_publish_at" IS NOT NULL;
   CREATE INDEX IF NOT EXISTS "idx_publication_history_review_id" ON "Publication_History"("review_id");
   ```

**Diretrizes Aplicáveis:** [SEC.1], [DAL.4]

**Critérios de Verificação:**
- [ ] Migration aplica sem erros
- [ ] Todos os índices criados com sucesso
- [ ] Políticas RLS ativas e funcionais
- [ ] Novas colunas têm defaults apropriados

#### **Milestone 1.2: Core Edge Functions**
**Objetivo:** Criar Edge Functions essenciais para workflow de publicação

**Arquivos a Criar:**
- `supabase/functions/admin-get-content-queue/index.ts`
- `supabase/functions/admin-manage-publication/index.ts`
- `supabase/config.toml` (atualizar)

**Especificação Técnica:**

1. **admin-get-content-queue:**
   - Buscar fila de conteúdo paginada com filtros
   - Suporte para filtro por status (draft, under_review, scheduled, published)
   - Incluir informações de autor e revisor
   - Retornar estatísticas resumidas
   - Rate limit: 30 requests/60 seconds

2. **admin-manage-publication:**
   - Executar ações do workflow de publicação
   - Gerenciar transições de estado com validação
   - Logar todas as ações em Publication_History
   - Suporte para agendamento e operações em lote
   - Rate limit: 20 requests/60 seconds

**Diretrizes Aplicáveis:** [SEC.3], [P1.5] (7-step pattern), [D3.5]

**Critérios de Verificação:**
- [ ] Functions seguem padrão de 7 passos obrigatório
- [ ] Rate limiting implementado corretamente
- [ ] Verificação de role (admin/editor) funcional
- [ ] Validação de transição de estado robusta
- [ ] Logging automático de ações funcionando

---

### **Phase 2: Content Publication Engine (Week 2)**

#### **Milestone 2.1: TanStack Query Hooks**
**Objetivo:** Criar hooks de data fetching para gestão de conteúdo

**Arquivos a Criar:**
- `packages/hooks/useContentQueueQuery.ts`
- `packages/hooks/usePublicationActionMutation.ts`
- `packages/hooks/useBulkOperationMutation.ts`

**Especificação Técnica:**
1. **useContentQueueQuery:**
   ```typescript
   export const useContentQueueQuery = (params: ContentQueueParams) => {
     return useInfiniteQuery({
       queryKey: ['admin', 'content-queue', params],
       queryFn: ({ pageParam = 1 }) => fetchContentQueue({ ...params, page: pageParam }),
       initialPageParam: 1,
       getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
     });
   };
   ```

2. **usePublicationActionMutation:**
   ```typescript
   export const usePublicationActionMutation = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: (action: PublicationAction) => executePublicationAction(action),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['admin', 'content-queue'] });
         queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
       },
     });
   };
   ```

**Diretrizes Aplicáveis:** [DAL.1], [DAL.2], [DAL.3], [DAL.4]

**Critérios de Verificação:**
- [ ] Hooks seguem padrão TanStack Query v5
- [ ] Invalidação de cache apropriada
- [ ] Error handling implementado
- [ ] TypeScript types definidos corretamente

#### **Milestone 2.2: Content Queue Interface**
**Objetivo:** Construir interface principal de gestão de conteúdo

**Arquivos a Criar:**
- `src/components/admin/ContentManagement/ContentQueue.tsx`
- `src/components/admin/ContentManagement/ReviewCard.tsx`
- `src/components/admin/ContentManagement/WorkflowActions.tsx`
- `src/components/admin/ContentManagement/FilterPanel.tsx`

**Especificação Técnica:**
1. **ContentQueue Features:**
   - Scroll infinito com paginação
   - Filtros por status (All, Draft, Under Review, Scheduled, Published)
   - Busca por título/autor
   - Seleção múltipla e operações em lote
   - Updates em tempo real via subscriptions

2. **ReviewCard Features:**
   - Metadata da review (título, autor, status, datas)
   - Botões de ação rápida (Approve, Reject, Schedule)
   - Badge de status com código de cores
   - Resumo do histórico de publicação

**Diretrizes Aplicáveis:** [D3.2], [AD.1], [AD.2]

**Critérios de Verificação:**
- [ ] Interface responsiva mobile-first
- [ ] Infinite scroll funcionando corretamente
- [ ] Operações em lote com tracking de progresso
- [ ] Real-time updates refletindo na UI
- [ ] Error handling para todos os cenários

---

### **Phase 3: Enhanced Management Modules (Week 3)**

#### **Milestone 3.1: Enhanced User Management**
**Objetivo:** Estender gestão de usuários com features avançadas

**Arquivos a Criar:**
- `src/components/admin/UserManagement/UserDirectory.tsx`
- `src/components/admin/UserManagement/UserCard.tsx`
- `src/components/admin/UserManagement/BulkUserActions.tsx`
- `src/components/admin/UserManagement/UserAnalytics.tsx`
- `supabase/functions/admin-manage-users/index.ts`
- `supabase/functions/admin-get-user-analytics/index.ts`

**Especificação Técnica:**
1. **Enhanced Features:**
   - Busca e filtros avançados
   - Mudanças de role em lote e gestão de assinaturas
   - Analytics de atividade de usuários
   - Funcionalidade de exportação de dados de usuários

2. **Edge Functions:**
   - Rate limit: 20 requests/60 seconds (admin-manage-users)
   - Rate limit: 10 requests/60 seconds (admin-get-user-analytics)

**Diretrizes Aplicáveis:** [SEC.1], [SEC.2], [D3.1]

#### **Milestone 3.2: Enhanced Tag Management**
**Objetivo:** Estender gestão de tags com ferramentas de hierarquia avançadas

**Arquivos a Criar:**
- `src/components/admin/TagManagement/TagHierarchy.tsx`
- `src/components/admin/TagManagement/DraggableTagTree.tsx`
- `src/components/admin/TagManagement/TagAnalytics.tsx`
- `src/components/admin/TagManagement/TagCleanup.tsx`

**Especificação Técnica:**
1. **Enhanced Features:**
   - Editor de hierarquia multi-nível drag-and-drop
   - Analytics de uso de tags e relatórios
   - Detecção e limpeza de tags órfãs
   - Merge de tags e operações em lote

**Diretrizes Aplicáveis:** [D3.1.3], [D3.2]

#### **Milestone 3.3: Enhanced Layout Management**
**Objetivo:** Estender gestão de layout com editor visual

**Arquivos a Criar:**
- `src/components/admin/LayoutManagement/LayoutEditor.tsx`
- `src/components/admin/LayoutManagement/DraggableSection.tsx`
- `src/components/admin/LayoutManagement/LayoutTemplates.tsx`
- `src/components/admin/LayoutManagement/ABTestManager.tsx`

**Especificação Técnica:**
1. **Enhanced Features:**
   - Editor de layout visual drag-and-drop
   - Variantes de layout mobile/desktop
   - Templates e presets de layout
   - Framework de testes A/B

**Diretrizes Aplicáveis:** [AD.1], [AD.3], [D3.2]

---

### **Phase 4: Analytics & Final Polish (Week 4)**

#### **Milestone 4.1: Analytics Dashboard**
**Objetivo:** Criar analytics e relatórios abrangentes

**Arquivos a Criar:**
- `src/components/admin/Analytics/OverviewDashboard.tsx`
- `src/components/admin/Analytics/ContentAnalytics.tsx`
- `src/components/admin/Analytics/UserEngagement.tsx`
- `src/components/admin/Analytics/PublicationFunnel.tsx`
- `src/components/admin/Analytics/MetricCard.tsx`
- `src/components/admin/Analytics/TrendChart.tsx`
- `supabase/functions/admin-get-analytics/index.ts`
- `supabase/functions/admin-export-data/index.ts`

**Especificação Técnica:**
1. **Analytics Features:**
   - Métricas do workflow de publicação
   - Tracking de performance de conteúdo
   - Analytics de engajamento de usuários
   - Funcionalidade de exportação para relatórios

2. **Edge Functions:**
   - Rate limit: 5 requests/60 seconds (admin-get-analytics)
   - Rate limit: 2 requests/300 seconds (admin-export-data)

**Diretrizes Aplicáveis:** [D3.8], [LINT.1]

#### **Milestone 4.2: Performance Optimization**
**Objetivo:** Otimizar performance para uso em produção

**Tarefas de Otimização:**
1. **Implementar virtualização para listas grandes**
2. **Adicionar React.memo a todos os componentes**
3. **Otimizar queries do banco com índices apropriados**
4. **Adicionar loading states e skeleton components**
5. **Implementar error boundaries para isolamento de módulos**

**Diretrizes Aplicáveis:** [D3.2.3], [TEST.1], [TEST.2]

#### **Milestone 4.3: Real-time Features**
**Objetivo:** Adicionar updates em tempo real para trabalho colaborativo admin

**Arquivos a Criar:**
- `src/hooks/useContentQueueSubscription.ts`
- `src/hooks/useNotificationSubscription.ts`

**Especificação Técnica:**
1. **Real-time Features:**
   - Updates ao vivo da fila de conteúdo
   - Sistema de notificação para ações de workflow
   - Indicadores de atividade de usuário em tempo real
   - Prevenção de conflitos de edição colaborativa

**Diretrizes Aplicáveis:** [D3.3], [D3.4]

---

### **Phase 5: Admin Route Foundation**

#### **Milestone 5.1: Admin Route Protection**
**Objetivo:** Criar estrutura básica de roteamento admin

**Arquivos a Criar:**
- `src/components/routes/AdminProtectedRoute.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/components/admin/AdminNavigation.tsx`

**Arquivos a Modificar:**
- `src/router/AppRouter.tsx` - Adicionar rotas admin

**Especificação Técnica:**
1. **AdminProtectedRoute Implementation:**
   ```typescript
   interface AdminProtectedRouteProps {
     children: React.ReactNode;
     requiredRoles: string[];
   }

   export const AdminProtectedRoute = ({ children, requiredRoles }: AdminProtectedRouteProps) => {
     const { user } = useAuthStore();
     const userRole = user?.app_metadata?.role;
     
     if (!userRole || !requiredRoles.includes(userRole)) {
       return <Navigate to="/unauthorized" replace />;
     }
     
     return <>{children}</>;
   };
   ```

2. **Route Structure:**
   ```typescript
   // Adicionar ao AppRouter.tsx
   <Route path="/admin" element={
     <AdminProtectedRoute requiredRoles={['admin', 'editor']}>
       <AdminLayout />
     </AdminProtectedRoute>
   }>
     <Route index element={<AdminDashboard />} />
     <Route path="content" element={<ContentManagement />} />
     <Route path="users" element={<UserManagement />} />
     <Route path="tags" element={<TagManagement />} />
     <Route path="layout" element={<LayoutManagement />} />
     <Route path="analytics" element={<Analytics />} />
   </Route>
   ```

**Diretrizes Aplicáveis:** [SEC.1], [SEC.2], [D3.2.1]

**Critérios de Verificação:**
- [ ] Rotas admin acessíveis apenas para roles admin/editor
- [ ] Navegação funciona entre módulos admin
- [ ] Elementos de UI baseados em role aparecem corretamente
- [ ] Usuários não autorizados são redirecionados apropriadamente

---

## **🔧 ARQUITETURA TÉCNICA**

### **Frontend Stack**
- **Framework:** Vite + React 18 + TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **Roteamento:** React Router v6
- **Estado:** TanStack Query + Zustand
- **PWA:** Service Workers + Manifest

### **Backend Stack**
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth + JWT
- **API:** Edge Functions + Auto-generated APIs
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime

### **Padrões Arquiteturais**
- **Data Fetching:** Hook-based abstraction layer
- **State Management:** Server state (TanStack) + Global state (Zustand)
- **Component Structure:** Atomic design com feature-first organization
- **Navigation:** Unified system com context-aware filtering
- **Responsiveness:** Mobile-first com breakpoints padronizados

---

## **📊 MÉTRICAS DE QUALIDADE**

### **Performance**
- ✅ **Bundle Size:** Otimizado via code splitting automático
- ✅ **Lazy Loading:** Componentes e rotas carregados sob demanda
- ✅ **Cache Strategy:** TanStack Query com 5min stale time
- ✅ **Image Optimization:** Lazy loading e responsive images

### **Security**
- ✅ **RLS Policies:** Row Level Security em todas as tabelas
- ✅ **JWT Claims:** Roles e subscription tiers no token
- ✅ **Rate Limiting:** Proteção em todas as Edge Functions
- ✅ **Input Validation:** Validação client/server com Zod

### **UX/Acessibilidade**
- ✅ **Mobile-First:** Interface otimizada para touch
- ✅ **Keyboard Navigation:** Suporte completo para navegação por teclado
- ✅ **Error Recovery:** Mensagens claras e ações de recuperação
- ✅ **Loading States:** Skeleton loaders e indicadores de progresso

---

## **🎯 PRÓXIMOS PASSOS PRIORITÁRIOS**

### **Phase 1: Management System Foundation (CURRENT)**
1. **Database Schema Extensions:** Implement publication workflow tables and RLS policies
2. **Core Edge Functions:** Create admin-get-content-queue and admin-manage-publication functions
3. **Admin Route Protection:** Set up role-based route protection and admin layout

### **Phase 2: Content Management Engine**
4. **TanStack Query Hooks:** Implement data fetching hooks for admin operations
5. **Content Queue Interface:** Build main content management interface with filters and actions
6. **Publication Workflow:** Complete review and approval workflow with scheduling

### **Phase 3: Enhanced Management Modules**
7. **User Management:** Advanced user directory with analytics and bulk operations
8. **Tag Management:** Hierarchical tag editor with drag-and-drop functionality
9. **Layout Management:** Visual layout editor with templates and A/B testing

### **Phase 4: Analytics & Optimization**
10. **Analytics Dashboard:** Comprehensive metrics and reporting system
11. **Performance Optimization:** Virtualization, memoization, and loading optimizations
12. **Real-time Features:** Live updates and collaborative admin features

---

## **📋 DECISÕES ARQUITETURAIS IMPORTANTES**

### **Management System Architecture (v9.0.0)**
**Decisão:** Modular Management System with feature-first organization
**Reasoning:** Aligns with existing decoupled architecture, enables independent development and testing
**Implementation:** Individual admin modules with dedicated routes, hooks, and components
**Impact:** Better maintainability, clearer separation of concerns, easier scalability

### **Publication Workflow Design**
**Decisão:** Database-driven workflow with Publication_History audit trail
**Reasoning:** Ensures data consistency, provides audit capabilities, supports complex workflows
**Implementation:** Extended Reviews table with workflow states and separate history table
**Impact:** Robust content management, full audit trail, scalable approval processes

### **Role-Based Access Control**
**Decisão:** JWT claims-based authorization with RLS policy enforcement
**Reasoning:** Leverages existing auth system, provides database-level security
**Implementation:** Role checks in components and RLS policies in database
**Impact:** Secure admin access, consistent authorization, defense in depth

---

## **🚫 DEPRECATED FEATURES**

### **Removed in v9.0.0:**
- Salvos page functionality - Will be integrated into user menu system
- Direct admin navigation in mobile - Admin features remain desktop-only for ergonomics

### **Removed in v8.3.0:**
- `mobileNavigationItems` array - Use `getNavigationItems('mobile')` instead
- `adminNavigationItems` array - Use `getNavigationItems('desktop')` instead
- `getVisibleNavigationItems()` - Use `getNavigationItems()` instead

### **Removed in v8.2.0:**
- `Header.tsx` component
- `NotificationBell.tsx` component  
- `PWAInstallButton.tsx` component
- Header-based PWA installation

---

## **📚 REFERÊNCIAS TÉCNICAS**

- **[DOC_2]** - System Architecture (Architectural principles)
- **[DOC_4]** - Row Level Security (Database security policies)
- **[DOC_5]** - API Contract (Edge Functions specifications)
- **[DOC_6]** - Data Fetching Strategy (TanStack Query patterns)
- **[DOC_8]** - Mobile Adaptation (Responsive design rules)
- **[Blueprint_02]** - Main App Shell (Navigation structure)
- **[Blueprint_08b]** - Management Blueprints (Admin system specifications)
- **Development Protocols** - Type safety and data fetching patterns

---

**Última atualização:** 23 de junho de 2025  
**Próxima revisão:** Após implementação da Phase 1 (Database + Edge Functions)

