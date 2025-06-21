
# **EVIDENS - Bíblia de Implementação**

**Versão:** 8.3.0  
**Data:** 21 de junho de 2025  
**Status:** 🟢 ACTIVE DEVELOPMENT

---

## **📋 CONTROLE DE VERSÃO**

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

**Technical Details:**
- `getNavigationItems(context, userRole)` - New unified function for navigation filtering
- `showOnMobile`/`showOnDesktop` flags for context-specific visibility
- Eliminated maintenance overhead from duplicate navigation structures
- Homepage container changed from `max-w-7xl mx-auto p-6` to `container mx-auto px-4 py-6`

### **8.2.0 - Shell Simplification** *(21/06/2025)*
**ARCHITECTURAL DECISION:**
- ✅ **Header Removal:** Eliminated problematic header component and all related complexity
- ✅ **PWA Simplification:** Removed header-based PWA install button, kept popup-only approach
- ✅ **Notification Cleanup:** Removed notification bell and related infrastructure (to be reimplemented later)
- ✅ **Layout Fixes:** Resolved page overflow and non-fixed header positioning issues

### **8.1.0 - Layout Architecture Fix** *(21/06/2025)*
**CRITICAL FIX:**
- ✅ **Shell Restructuring:** Fixed double scrollbar and floating header issues
- ✅ **Scroll Hierarchy:** Established proper scroll boundaries in `DesktopShell` and `MobileShell`
- ✅ **Layout Consistency:** Separated fixed navigation from scrollable content areas

### **8.0.0 - Community Stabilization** *(20/06/2025)*
**MAJOR MILESTONE:**
- ✅ **Community Feature:** Full community feed with posts, voting, comments, and moderation
- ✅ **PWA Integration:** Progressive Web App capabilities with installation prompts
- ✅ **Mobile Optimization:** Complete mobile-first responsive design implementation
- ✅ **Error Boundaries:** Comprehensive error handling and recovery systems

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

### **Phase 1: Foundation Completion**
1. **Notification System:** Implementar sistema completo de notificações
2. **Profile Enhancement:** Melhorar páginas de perfil e configurações
3. **Search Optimization:** Implementar busca global avançada

### **Phase 2: Content Management**
4. **Review Editor:** Sistema completo de criação/edição de reviews
5. **Content Moderation:** Ferramentas avançadas de moderação
6. **Analytics Dashboard:** Métricas e insights para admins

### **Phase 3: Advanced Features**
7. **Real-time Features:** Chat, notificações push, colaboração em tempo real
8. **Advanced PWA:** Offline sync, background tasks, deep linking
9. **Performance Optimization:** Bundle optimization, CDN, caching strategies

---

## **📋 DECISÕES ARQUITETURAIS IMPORTANTES**

### **Navigation Unification (v8.3.0)**
**Decisão:** Unified navigation system with single source of truth
**Reasoning:** Eliminates maintenance overhead and ensures consistency
**Implementation:** `getNavigationItems(context, userRole)` with flag-based filtering
**Impact:** Simplified codebase, reduced complexity, better maintainability

### **Header Removal (v8.2.0)**
**Decisão:** Remove header component entirely
**Reasoning:** Eliminates scroll conflicts and layout complexity
**Trade-off:** PWA install moved to popup-only (temporary)
**Impact:** Cleaner layout, better mobile experience, simplified architecture

### **Shell Architecture (v8.1.0)**
**Decisão:** Separate fixed navigation from scrollable content
**Reasoning:** Prevents double scrollbars and layout issues
**Implementation:** Fixed sidebar/bottom-nav + scrollable main content
**Impact:** Better UX, consistent behavior across all pages

---

## **🚫 DEPRECATED FEATURES**

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
- **[DOC_8]** - Mobile Adaptation (Responsive design rules)
- **[Blueprint_02]** - Main App Shell (Navigation structure)
- **Development Protocols** - Type safety and data fetching patterns

---

**Última atualização:** 21 de junho de 2025  
**Próxima revisão:** A ser definida conforme desenvolvimento
