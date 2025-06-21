
# EVIDENS - README BÍBLIA
**Versão:** 8.0.0  
**Data:** 21 de Junho de 2025  
**Status:** FASE 2 INICIADA - REDDIT-STYLE UI TRANSFORMATION ⚡

---

## 🎯 FASE 2: REDDIT-STYLE VISUAL TRANSFORMATION

### **PRIORIDADE CRÍTICA - IMPLEMENTAÇÃO IMEDIATA** 🚨
**Duração:** 2 semanas | **Status:** 🔄 EM EXECUÇÃO

#### **CATEGORIA A: ESTRUTURA FUNDAMENTAL** ✅ 
- [ ] **A1. Comment Threading System Overhaul** - CRÍTICO
  - [ ] A1.1: Integrar linhas de threading visuais com botões expand/collapse
  - [ ] A1.2: Implementar estado de árvore de comentários unificado
  - [ ] A1.3: Criar componente CommentTreeNode com hierarquia visual
  - [ ] A1.4: Adicionar indicadores de profundidade de comentário
  - [ ] A1.5: Implementar transições suaves de expand/collapse

- [ ] **A2. Post Structure Unification** - CRÍTICO  
  - [ ] A2.1: Criar BasePost component unificado
  - [ ] A2.2: Padronizar header layout (Avatar + Nome + Tempo top-left)
  - [ ] A2.3: Unificar estrutura entre PostCard e PostDetailCard
  - [ ] A2.4: Implementar variant system (feed | detail)
  - [ ] A2.5: Consolidar multimedia content display

- [ ] **A3. Vote System Horizontal Transformation** - CRÍTICO
  - [ ] A3.1: Converter vote buttons de vertical para horizontal
  - [ ] A3.2: Padronizar entre posts e comentários
  - [ ] A3.3: Implementar hover states Reddit-style
  - [ ] A3.4: Otimizar para touch targets mobile (≥44px)
  - [ ] A3.5: Unificar componentes VoteButtons

#### **CATEGORIA B: VISUAL DE-BOXING** 🎨
- [ ] **B1. Post Container De-boxing** - ALTO
  - [ ] B1.1: Remover Card wrappers de posts
  - [ ] B1.2: Implementar separadores horizontais entre posts
  - [ ] B1.3: Aplicar hover states sutis (bg-surface/20)
  - [ ] B1.4: Padronizar spacing Reddit-style (16px horizontal, 12px vertical)
  - [ ] B1.5: Remover shadows e borders de posts

- [ ] **B2. Sidebar Visual Overhaul** - ALTO
  - [ ] B2.1: De-boxing complete dos módulos da sidebar
  - [ ] B2.2: Implementar hierarquia visual clara sem peso excessivo
  - [ ] B2.3: Padronizar espaçamento entre módulos
  - [ ] B2.4: Aplicar Reddit-style header para cada módulo
  - [ ] B2.5: Otimizar contrast ratios para legibilidade

- [ ] **B3. Comment Visual Refinement** - ALTO
  - [ ] B3.1: Aplicar de-boxing aos containers de comentários
  - [ ] B3.2: Implementar linhas de threading visual
  - [ ] B3.3: Padronizar action buttons bottom-row
  - [ ] B3.4: Otimizar indentação para hierarquia clara
  - [ ] B3.5: Aplicar hover states consistentes

#### **CATEGORIA C: INPUT & INTERACTION DESIGN** 🎛️
- [ ] **C1. Comment Input Redesign** - MÉDIO
  - [ ] C1.1: Implementar design minimalista Reddit-style
  - [ ] C1.2: Melhorar hierarquia visual do input
  - [ ] C1.3: Padronizar button placement e styling
  - [ ] C1.4: Adicionar placeholder text contextual
  - [ ] C1.5: Implementar auto-focus e keyboard navigation

- [ ] **C2. Interactive States Standardization** - MÉDIO
  - [ ] C2.1: Padronizar hover effects (150ms ease-out)
  - [ ] C2.2: Implementar active states para vote buttons
  - [ ] C2.3: Aplicar disabled states consistentes
  - [ ] C2.4: Otimizar loading states visuais
  - [ ] C2.5: Implementar error states padronizados

#### **CATEGORIA D: MULTIMEDIA & CONTENT** 📸
- [ ] **D1. Content Display Implementation** - MÉDIO
  - [ ] D1.1: Implementar image display em posts (feed + detail)
  - [ ] D1.2: Adicionar video content rendering
  - [ ] D1.3: Implementar poll display system
  - [ ] D1.4: Criar preview logic para feed vs detail
  - [ ] D1.5: Aplicar lazy loading para multimedia

- [ ] **D2. Content Hierarchy Optimization** - MÉDIO
  - [ ] D2.1: Implementar title mandatory system
  - [ ] D2.2: Padronizar text preview vs full content
  - [ ] D2.3: Otimizar content spacing e typography
  - [ ] D2.4: Implementar content truncation inteligente
  - [ ] D2.5: Aplicar responsive content scaling

#### **CATEGORIA E: MOBILE OPTIMIZATION** 📱
- [ ] **E1. Mobile Comment Threading** - MÉDIO
  - [ ] E1.1: Otimizar indentação para telas pequenas
  - [ ] E1.2: Implementar touch-friendly thread toggle
  - [ ] E1.3: Ajustar line thickness para mobile
  - [ ] E1.4: Padronizar touch targets (≥44px)
  - [ ] E1.5: Implementar swipe gestures para collapse

- [ ] **E2. Mobile Sidebar Integration** - MÉDIO  
  - [ ] E2.1: Implementar horizontal scroll para sidebar content
  - [ ] E2.2: Criar snap-scroll para módulos
  - [ ] E2.3: Aplicar featured content prioritization
  - [ ] E2.4: Implementar drawer alternativo para rules/links
  - [ ] E2.5: Otimizar sidebar spacing para mobile

---

## 🛠️ TOKENS CSS NECESSÁRIOS

### **Novos Tokens para Reddit-Style UI:**
```css
:root {
  /* Hierarchy Enhancement */
  --text-tertiary: 0 0% 48%;      /* Metadata menos importante */
  --surface-hover: 0 0% 8%;       /* Hover backgrounds sutis */
  --border-strong: 0 0% 20%;      /* Separadores enfatizados */
  --comment-thread: 0 0% 16%;     /* Linhas de threading */
  --action-hover: 0 0% 12%;       /* Estados hover de ações */
  
  /* Reddit Spacing System */
  --spacing-reddit-xs: 0.5rem;    /* 8px */
  --spacing-reddit-sm: 0.75rem;   /* 12px */
  --spacing-reddit-md: 1rem;      /* 16px */
  --spacing-reddit-lg: 1.5rem;    /* 24px */
}
```

### **Classes Utility Necessárias:**
```css
/* Post De-boxing */
.reddit-post-item {
  @apply bg-transparent border-0 shadow-none rounded-none;
  @apply border-b border-border last:border-b-0;
  @apply px-4 py-3 hover:bg-surface/20 transition-colors;
}

/* Comment Threading */
.reddit-comment-thread {
  @apply relative;
}

.reddit-thread-line {
  @apply absolute left-0 top-0 bottom-0 w-0.5 bg-comment-thread;
  @apply hover:bg-border transition-colors duration-150;
}

.reddit-thread-toggle {
  @apply absolute w-4 h-4 bg-background border border-border rounded-sm;
  @apply hover:bg-surface-muted hover:border-border-hover transition-all;
  @apply flex items-center justify-center cursor-pointer z-10;
}

/* Vote Buttons Horizontal */
.reddit-vote-buttons {
  @apply flex flex-row items-center gap-2;
}

.reddit-vote-button {
  @apply w-6 h-6 p-1 rounded hover:bg-action-hover transition-colors;
  @apply border-0 shadow-none bg-transparent;
}

/* Sidebar De-boxing */
.reddit-sidebar-module {
  @apply bg-transparent border-0 shadow-none mb-6;
}

.reddit-sidebar-header {
  @apply text-sm font-semibold text-foreground mb-3;
  @apply border-b border-border/30 pb-2;
}
```

---

## 📊 MÉTRICAS DE PROGRESSO

### **Fase 1 - COMPLETADA ✅**
- ✅ Dual-scroll issue resolved
- ✅ Basic post navigation fixed  
- ✅ Shell layout standardization
- ✅ Error handling improvements

### **Fase 2 - EM EXECUÇÃO 🔄**
**Progresso Atual:** 0% iniciado
**Meta Fase 2:** 85% Reddit-style transformation complete

#### **Por Categoria:**
- 🚨 **Estrutura Fundamental:** 0/15 tasks (0%)
- 🎨 **Visual De-boxing:** 0/15 tasks (0%) 
- 🎛️ **Input & Interaction:** 0/10 tasks (0%)
- 📸 **Multimedia & Content:** 0/10 tasks (0%)
- 📱 **Mobile Optimization:** 0/10 tasks (0%)

**Total Tasks:** 0/60 completed (0%)

---

## 🎯 PRÓXIMAS AÇÕES IMEDIATAS

### **Sprint 1 (Próximos 3 dias):**
1. **A1. Comment Threading System** - Implementação completa
2. **A3. Vote System Horizontal** - Transformação total
3. **B1. Post Container De-boxing** - Visual overhaul

### **Sprint 2 (Dias 4-7):**
1. **A2. Post Structure Unification** - Consolidação completa
2. **B2. Sidebar Visual Overhaul** - Reddit-style implementation
3. **C1. Comment Input Redesign** - UX improvement

### **Sprint 3 (Dias 8-14):**
1. **D1. Content Display** - Multimedia implementation
2. **E1. Mobile Optimization** - Responsive refinement
3. **Polish & Testing** - Quality assurance

---

## 🔧 ARQUITETURA TÉCNICA

### **Componentes Novos Necessários:**
```typescript
// Threading System
- CommentTreeNode.tsx
- ThreadToggle.tsx  
- CommentThreadLines.tsx

// Unified Post System
- BasePost.tsx
- PostHeader.tsx
- PostContent.tsx
- PostActions.tsx

// Sidebar Modules
- SidebarModule.tsx
- SidebarHeader.tsx
- SidebarContent.tsx

// Input System
- MinimalCommentInput.tsx
- InputActions.tsx
```

### **Hooks Novos Necessários:**
```typescript
// State Management
- useCommentTree.ts
- usePostInteractions.ts
- useSidebarState.ts

// UI Logic
- useThreadToggle.ts
- useVoteSystem.ts
- useContentDisplay.ts
```

---

## 📝 CHANGELOG TÉCNICO

### v8.0.0 (21 Jun 2025) - PHASE 2 KICKOFF
**INICIADO:**
- 📋 Comprehensive missing features task list created
- 🎯 Reddit-style transformation roadmap established
- 🛠️ Technical architecture for new components defined
- 📊 Progress tracking system implemented
- 🔧 CSS token system for Reddit-style UI outlined

**PLANEJADO:**
- 🎨 Comment threading visual system overhaul
- 🔄 Vote button horizontal transformation
- 📦 Post structure unification implementation
- 🎭 Visual de-boxing across all components
- 📱 Mobile optimization refinements

**ARCHITECTURE PREPARED:**
- 🏗️ Component hierarchy for unified post system
- 🎛️ State management for comment threading
- 🎨 CSS utility system for Reddit-style UI
- 📐 Spacing and interaction standards
- 🔧 Technical debt consolidation plan

---

## 🚀 ESTIMATIVAS TÉCNICAS

### **Effort Distribution:**
- **Comment Threading:** 8 horas (complexidade alta)
- **Post Unification:** 6 horas (refactoring extenso)
- **Vote System:** 4 horas (transformation straightforward)
- **Visual De-boxing:** 6 horas (CSS-heavy)
- **Mobile Optimization:** 4 horas (responsive tweaks)
- **Input Redesign:** 3 horas (component focused)

**Total Estimado:** 31 horas de desenvolvimento
**Timeline:** 2 semanas (15-20 horas/semana)

---

**Status Atual:** 🔄 FASE 2 INICIADA - REDDIT-STYLE TRANSFORMATION  
**Última Atualização:** 21 de Junho de 2025, 20:15  
**Responsável:** Sistema de Arquitetura EVIDENS v8.0  
**Próxima Revisão:** Daily progress tracking  
**Meta de Conclusão Fase 2:** 5 de Julho de 2025

---

*Este documento representa o roadmap completo da transformação Reddit-style para as páginas da comunidade EVIDENS. Todos os 60 tasks identificados são baseados em análise rigorosa do gap atual versus implementação ideal conforme Community_visual_style.md e Blueprint 06.*
