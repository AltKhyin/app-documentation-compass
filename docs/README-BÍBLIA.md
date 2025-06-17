
# **README-BÍBLIA.md**

**Versão:** 2.1.2  
**Data:** 17 de junho de 2025  
**Status:** ✅ Implementação Principal Completa — Mobile Otimizado

---

## **📋 ESTADO ATUAL DO REPOSITÓRIO (2 min read)**

Este documento fornece um resumo completo e atual do estado implementado da plataforma EVIDENS — um sistema editorial científico desenvolvido em React + Supabase.

---

## **🏗️ ARQUITETURA & STACK TECNOLÓGICO**

### **Frontend**
- **Framework:** React 18.3.1 + TypeScript + Vite
- **UI Library:** shadcn/ui + Tailwind CSS + Lucide React
- **Estado:** Zustand para auth + TanStack Query para server state
- **Roteamento:** React Router DOM 6.26.2
- **Charts:** Recharts 2.12.7

### **Backend**
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth com RLS policies
- **API:** Auto-generated + Edge Functions para lógica complexa
- **Storage:** Supabase Storage para imagens

### **Deployment**
- **Hosting:** Lovable (staging)
- **Database:** Supabase Cloud
- **CDN:** Automatic via Lovable

---

## **✅ MÓDULOS IMPLEMENTADOS & FUNCIONAIS**

### **🔐 1. Sistema de Autenticação**
- **Status:** ✅ **Implementado e funcional**
- **Funcionalidades:**
  - Login/signup com email + senha
  - OAuth com Google (configurado)
  - Proteção de rotas com `ProtectedRoute`
  - RLS policies ativas para todos os recursos
  - 4 níveis de usuário: `practitioner`, `editor`, `admin`, `super_admin`

### **📱 2. Application Shell**
- **Status:** ✅ **Mobile-First Implementado**
- **Funcionalidades Desktop:**
  - Sidebar colapsível com navegação persistente
  - Layout two-column responsivo
  - User profile block com avatar e logout
  - Notification bell com badge count
- **Funcionalidades Mobile:**
  - Bottom tab bar navigation (sempre visível)
  - Single-column layout otimizado
  - Header com logo centralizado e notification bell
  - Touch targets ≥ 44×44px
  - Discrete scrollbars theme-aware

### **🏠 3. Homepage**
- **Status:** ✅ **Mobile-Optimized Implementado**
- **Funcionalidades:**
  - Feed consolidado via Edge Function `get-homepage-feed`
  - FeaturedReview hero section (mobile: altura reduzida, padding otimizado)
  - ReviewCarousel horizontal (mobile: ~1.5 cards visíveis, scroll hints)
  - NextEditionModule com progressive disclosure (mobile: top 3 sugestões + "Ver todas")
  - Sistema de votação em sugestões funcionais
  - Performance otimizada: dados consolidados em 1 request

### **📚 4. Acervo**
- **Status:** ✅ **Mobile-Compliant Implementado**
- **Funcionalidades:**
  - Grid responsivo: desktop (masonry), mobile (2 colunas)
  - Sistema de tags hierárquicos funcionais
  - Filtros desktop: painel horizontal
  - Filtros mobile: bottom sheet modal (90% viewport height)
  - Client-side sorting e filtering
  - Cards com min-tap-area ≥ 160×160px no mobile

### **🎨 5. Sistema Visual**
- **Status:** ✅ **Design System Implementado**
- **Funcionalidades:**
  - Dark/Light theme com design tokens
  - Typography: Inter (sans) + Source Serif 4 (serif)
  - Scrollbars discretos e theme-aware
  - Mobile typography: 16px min, line-height 1.7
  - Touch-friendly spacing e interactions

---

## **🔄 MÓDULOS EM DESENVOLVIMENTO**

### **👥 6. Community (Placeholder)**
- **Status:** 🚧 **Estrutura criada, implementação pendente**
- **Pendente:** Feed de posts, widgets laterais mobile, sistema de votação

### **👤 7. Profile System**
- **Status:** 🚧 **Estrutura criada, implementação pendente**
- **Pendente:** Profile pages, long-press interactions mobile, swipeable tabs

### **📝 8. Review Detail Pages**
- **Status:** 🚧 **Estrutura criada, LayoutAwareRenderer pendente**
- **Pendente:** Mobile layout rendering, comments system, performance optimization

---

## **📊 DADOS & API**

### **Edge Functions Implementadas**
- ✅ `get-homepage-feed`: Consolidação de dados da homepage
- ✅ `get-acervo-data`: Dados do acervo com tags e reviews
- ✅ `submit-suggestion`: Envio de sugestões para próxima edição
- ✅ `cast-suggestion-vote`: Sistema de votação
- ✅ Rate limiting implementado em todas as functions

### **RLS Policies**
- ✅ **Practitioners:** Users só acessam próprios dados
- ✅ **Reviews:** Content público + draft protection
- ✅ **Suggestions:** Public read + authenticated write
- ✅ **Notifications:** User-scoped access

### **Database Schema**
- ✅ **Core tables:** Practitioners, Reviews, Tags, Suggestions, Notifications
- ✅ **Relationships:** Foreign keys e indexes otimizados
- ✅ **Custom functions:** `get_my_claim()`, `handle_new_user` trigger

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
- 🔄 **RULE 9:** Comments lazy-loading (pendente - Review Detail)
- 🔄 **RULE 10:** LayoutAwareRenderer mobile (pendente - Review Detail)

---

## **⚡ PERFORMANCE & QUALIDADE**

### **Métricas Implementadas**
- ✅ **Data Fetching:** TanStack Query com caching otimizado
- ✅ **Bundle Size:** Tree-shaking com imports específicos
- ✅ **Rendering:** Skeleton loaders para CLS < 0.1
- ✅ **Mobile Performance:** Touch targets, smooth scrolling
- ✅ **Accessibility:** Screen reader compatibility, keyboard navigation

### **Testing & Validation**
- ✅ **Responsive Design:** Testado em breakpoints principais
- ✅ **Cross-browser:** Chrome, Safari, Firefox compatibility
- ✅ **Mobile Devices:** iOS Safari, Chrome Mobile validation
- ✅ **Authentication Flow:** Login/logout/protection completos

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

### **Deploy Status**
- ✅ **Staging:** Lovable auto-deploy ativo
- ✅ **Database:** Supabase production ready
- ✅ **Edge Functions:** Deployed e funcionais

---

## **📋 PRÓXIMOS PASSOS**

### **Prioridade Alta**
1. **Review Detail Pages:** Implementar LayoutAwareRenderer mobile
2. **Community Module:** Criar feed e widgets mobile
3. **Profile System:** Adicionar long-press e swipeable tabs

### **Prioridade Média**
1. **Performance Monitoring:** Implementar Core Web Vitals tracking
2. **Advanced Features:** Search, advanced filtering
3. **Analytics:** User behavior tracking

### **Prioridade Baixa**
1. **Admin Panel:** Management interface
2. **Editor Tools:** Content creation/editing
3. **Advanced Auth:** Password reset, email verification

---

## **📞 PONTOS DE CONTATO TÉCNICO**

### **Arquivos Críticos**
- **Shell:** `src/components/shell/AppShell.tsx`
- **Data Fetching:** `packages/hooks/use*Query.ts`
- **Mobile Detection:** `src/hooks/use-mobile.tsx`
- **Routing:** `src/App.tsx`
- **Themes:** `src/components/theme/CustomThemeProvider.tsx`

### **Documentação Técnica**
- **Blueprints:** `/docs/blueprints/` - Especificações por módulo
- **Architecture:** `/docs/[DOC_X]/` - Decisions e constraints
- **Mobile Guide:** `/docs/[DOC_8]_MOBILE_ADAPTATION.md`

---

**🎯 RESUMO EXECUTIVO:** A plataforma EVIDENS está com sua implementação principal completa e mobile-optimized, incluindo autenticação robusta, homepage dinâmica, acervo funcional, e shell adaptativo. Os módulos core estão prontos para produção, com próximas fases focadas em Review Detail pages e Community features.
