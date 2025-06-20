
# 📚 EVIDENS - Bíblia do Desenvolvimento

**Versão:** 3.2.1  
**Data:** 20 de junho de 2025  
**Status:** Em desenvolvimento ativo

> **IMPORTANTE**: Este documento é a fonte única da verdade para o estado atual do projeto EVIDENS. Todas as funcionalidades listadas aqui foram implementadas e testadas.

---

## 🎯 **RESUMO EXECUTIVO**

O **EVIDENS** é uma plataforma científica focada em democratizar o acesso ao conhecimento médico baseado em evidências. A aplicação combina **Reviews estruturados** com uma **Comunidade científica ativa**, proporcionando um ambiente completo para profissionais da saúde.

### **Arquitetura Atual**
- **Frontend**: React 18 + TypeScript + Vite (SPA/PWA)
- **Backend**: 100% Supabase (Database + Auth + Edge Functions)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query v5 + Zustand (seletivo)
- **Deployment**: Lovable Cloud

---

## 🏗️ **MÓDULOS IMPLEMENTADOS**

### **1. 🏠 Homepage** ✅ **COMPLETO**
**Responsável**: `src/pages/Index.tsx`

#### **Funcionalidades Ativas:**
- ✅ Feed principal com carousel de Reviews em destaque
- ✅ Módulo "Próxima Edição" com enquete interativa
- ✅ Sistema de recomendações personalizadas
- ✅ PWA com instalação automática
- ✅ Adaptação completa para mobile

#### **Componentes Core:**
- `ReviewCarousel` - Carrossel responsivo principal
- `NextEditionModule` - Votação para próximo Review
- `PWAInstallPrompt` - Instalação Progressive Web App

#### **Edge Functions:**
- `get-homepage-feed` - Dados consolidados da homepage
- `get-personalized-recommendations` - IA de recomendação

---

### **2. 📚 Acervo (Biblioteca)** ✅ **COMPLETO**
**Responsável**: `src/pages/CollectionPage.tsx`

#### **Funcionalidades Ativas:**
- ✅ Grid masonry responsivo para Reviews
- ✅ Sistema de filtros por tags avançado
- ✅ Busca em tempo real (título + conteúdo)
- ✅ Ordenação inteligente (Recentes, Populares, Alfabética)
- ✅ Modal de tags para mobile
- ✅ Performance otimizada com indexação

#### **Componentes Core:**
- `MasonryGrid` - Layout responsivo dos cards
- `TagsPanel` - Filtros laterais (desktop)
- `MobileTagsModal` - Filtros mobile
- `SearchInput` - Busca em tempo real
- `ClientSideSorter` - Ordenação local

#### **Edge Functions:**
- `get-acervo-data` - Dados otimizados com cache

---

### **3. 📖 Review Detail** ✅ **COMPLETO**
**Responsável**: `src/pages/ReviewDetailPage.tsx`

#### **Funcionalidades Ativas:**
- ✅ Renderização de conteúdo estruturado v2.0
- ✅ Layout responsivo (desktop/mobile)
- ✅ Sistema de blocos modulares
- ✅ Navegação por slugs amigáveis
- ✅ Meta tags dinâmicas para SEO

#### **Componentes Core:**
- `LayoutAwareRenderer` - Engine de renderização
- `BlockRenderer` - Processador de blocos
- `TextBlock`, `ImageBlock`, `HeadingBlock` - Blocos específicos

#### **Edge Functions:**
- `get-review-by-slug` - Busca otimizada por slug

---

### **4. 👥 Comunidade** ✅ **COMPLETO E OTIMIZADO**
**Responsável**: `src/pages/CommunityPage.tsx`

#### **Funcionalidades Ativas:**
- ✅ Feed infinito de discussões
- ✅ Sistema de votação (upvote/downvote)
- ✅ Posts salvos com sincronização
- ✅ Categorização automática
- ✅ Editor rico (Tiptap) para posts
- ✅ Upload de imagens e vídeos
- ✅ Sistema de enquetes integradas
- ✅ Moderação avançada (pin/lock posts)
- ✅ Sidebar informativa (desktop only)
- ✅ **Sistema robusto de error handling**
- ✅ **Estados de loading progressivos**
- ✅ **Fallbacks para conexão offline**
- ✅ **Auto-retry inteligente**

#### **Componentes Core:**
- `CommunityFeedWithSidebar` - Layout principal dois-colunas
- `PostCard` - Card individual de post
- `PostDetailCard` - Visualização detalhada
- `VoteButtons` - Sistema de votação
- `CommunitySidebar` - Barra lateral (regras, links, trending)
- `CommunityErrorBoundary` - **Boundary robusto com contexto**
- `CommunityLoadingState` - **Estados de loading padronizados**
- `NetworkAwareFallback` - **Fallback consciente de rede**

#### **Páginas Específicas:**
- `/comunidade` - Feed principal
- `/comunidade/[postId]` - Detalhes do post
- `/comunidade/criar` - Criação de posts
- `/comunidade/salvos` - Posts salvos

#### **Edge Functions:**
- `get-community-page-data` - **Feed otimizado com fallbacks**
- `get-community-post-detail` - **Detalhes com CORS e auth fixados**
- `create-community-post` - Criação transacional
- `cast-community-vote` - Votação atômica
- `save-post` - Sistema de salvamento
- `get-saved-posts` - Listagem paginada

#### **Melhorias Implementadas (v3.2.1):**
- ✅ **Error Boundary categorizado** - Diferentes tratamentos por tipo de erro
- ✅ **Loading states progressivos** - Skeleton states detalhados
- ✅ **Network awareness** - Detecção de offline/online
- ✅ **Auto-retry exponential backoff** - Retry inteligente com delays
- ✅ **CORS fixado** - Suporte a POST e GET requests
- ✅ **Rate limiting robusto** - 60 req/min com headers adequados

---

### **5. 🔐 Autenticação** ✅ **COMPLETO**
**Responsável**: Sistema distribuído

#### **Funcionalidades Ativas:**
- ✅ Login/Signup com validação robusta
- ✅ Integração Google OAuth
- ✅ Gerenciamento de sessões
- ✅ Proteção de rotas por role
- ✅ Contexto de autenticação global

#### **Componentes Core:**
- `AuthSessionProvider` - Provedor de contexto
- `ProtectedRoute` - Proteção de rotas
- `LoginForm`, `SignupForm` - Formulários
- `SplitScreenAuthLayout` - Layout auth

---

### **6. 🏛️ App Shell** ✅ **COMPLETO**
**Responsável**: `src/components/shell/AppShell.tsx`

#### **Funcionalidades Ativas:**
- ✅ Shell adaptivo desktop/mobile
- ✅ Sidebar colapsível (desktop)
- ✅ Bottom tabs (mobile)
- ✅ Header responsivo com perfil
- ✅ Sistema de notificações

#### **Componentes Core:**
- `DesktopShell` - Layout desktop
- `MobileShell` - Layout mobile
- `CollapsibleSidebar` - Navegação lateral
- `BottomTabBar` - Tabs inferiores
- `NotificationBell` - Notificações

---

## 🛠️ **ARQUITETURA TÉCNICA**

### **Estrutura de Dados**
- **Banco**: PostgreSQL (Supabase)
- **Tabelas principais**: `Reviews`, `CommunityPosts`, `Practitioners`, `Tags`
- **RLS**: Políticas de segurança por tabela
- **Indexes**: Otimização para queries frequentes

### **Estado da Aplicação**
- **Server State**: TanStack Query v5 (cache, invalidation, retries)
- **Client State**: useState/useReducer (local), Zustand (global UI)
- **Persistence**: Supabase Real-time subscriptions

### **Padrões de Desenvolvimento**
- **Hooks personalizados**: `/packages/hooks/` (data) + `/src/hooks/` (UI)
- **Componentes**: Feature-first organization
- **Tipos**: Centralizados em `src/types/index.ts`
- **Styling**: Utility-first com Tailwind

---

## 📊 **MÉTRICAS DE QUALIDADE**

### **Performance**
- ✅ Code splitting automático (Vite)
- ✅ Lazy loading de componentes
- ✅ Cache inteligente (TanStack Query)
- ✅ Otimização de imagens
- ✅ PWA com service worker

### **Experiência do Usuário**
- ✅ Responsividade completa (mobile-first)
- ✅ Estados de loading informativos
- ✅ Error boundaries com recovery
- ✅ Offline fallbacks
- ✅ Feedback visual consistente

### **Segurança**
- ✅ Row Level Security (RLS) ativo
- ✅ Rate limiting em todas APIs
- ✅ Validação de entrada (Zod)
- ✅ CORS configurado adequadamente
- ✅ JWT com custom claims

---

## 🚀 **DEPLOY & INFRAESTRUTURA**

### **Ambientes**
- **Desenvolvimento**: Local (Vite + Supabase local)
- **Produção**: Lovable Cloud + Supabase Cloud

### **Monitoramento**
- ✅ Edge Function logs centralizados
- ✅ Error tracking via console
- ✅ Performance metrics (Core Web Vitals)
- ✅ Rate limit monitoring

---

## 📋 **PRÓXIMOS PASSOS**

### **Backlog Técnico**
1. Sistema de notificações push
2. Analytics avançados
3. Moderação automática (ML)
4. Cache distribuído (Redis)
5. Testes automatizados (E2E)

### **Funcionalidades Planejadas**
1. Comentários aninhados na comunidade
2. Sistema de reputação detalhado
3. Integração com referências externas
4. Mode offline completo
5. Internacionalização (i18n)

---

## 🔄 **CHANGELOG RECENTE**

### **v3.2.1 (20/06/2025)**
- 🔧 **HOTFIX**: Correção crítica do sistema de post details
- 🛡️ **Segurança**: CORS policy corrigida para Edge Functions
- 🔄 **Resilência**: Auto-retry inteligente implementado
- 📊 **Rate Limiting**: Headers apropriados adicionados
- 🎯 **Error Handling**: Categorização e fallbacks aprimorados

### **v3.2.0 (19/06/2025)**
- 🚀 **Feature**: Sistema robusto de error boundaries
- 🎨 **UX**: Loading states progressivos e informativos
- 🌐 **Conectividade**: Network awareness e offline fallbacks
- ⚡ **Performance**: Otimizações de cache e memória
- 📱 **Mobile**: Melhorias na adaptação mobile-first

### **v3.1.0 (18/06/2025)**
- 🏗️ **Arquitetura**: Consolidação do módulo comunidade
- 🔄 **Data Flow**: Hooks otimizados para performance
- 🎯 **Edge Functions**: Streamlining e error handling
- 📊 **Monitoramento**: Logs estruturados implementados

---

**📧 Contato Técnico**: Para questões sobre implementação, consulte os blueprints em `/docs/blueprints/`  
**🔗 Repositório**: Estrutura definida conforme `[DOC_2]_SYSTEM_ARCHITECTURE.md`  
**📱 PWA**: Disponível para instalação em dispositivos compatíveis

---
*Documento atualizado automaticamente a cada deploy • Última sincronização: 20/06/2025 01:28 UTC*
