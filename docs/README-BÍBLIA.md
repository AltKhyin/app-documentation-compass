
# 📖 README-BÍBLIA: Estado Atual do Projeto EVIDENS

**Versão:** 5.0.0 (Hardening Architecture)  
**Data:** 20 de Junho de 2025  
**Status:** Transição Arquitetural em Andamento

## 🚀 RESUMO EXECUTIVO

O projeto EVIDENS é uma plataforma científica de revisão de literatura implementada como uma Progressive Web App (PWA) usando React + Vite + Supabase. O sistema oferece uma experiência completa de consumo de conteúdo científico com funcionalidades de comunidade, curadoria e personalização.

**ESTADO ATUAL:** O projeto está entrando em uma fase crítica de hardening arquitetural para transição de funcional para production-ready, seguindo o plano detalhado no `docs/CODEBASE_AUDIT_REPORT.md`.

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

## 🏗️ PLANO DE HARDENING ARQUITETURAL (FASE ATUAL)

### **OBJETIVO ESTRATÉGICO**
Transformar o EVIDENS de um sistema funcional para um sistema production-ready através de três melhorias arquiteturais críticas, seguindo rigorosamente o plano definido no `docs/CODEBASE_AUDIT_REPORT.md`.

### **TASK 1: DECOUPLING DA CAMADA DE DADOS (PRIORIDADE MÁXIMA)**
**Status:** 🟡 Planejado
**Objetivo:** Eliminar o gargalo de performance causado pelo fetch global de dados em todas as páginas protegidas.

#### **Parte A: Escopo do Homepage Data Provider**
- **Arquivo Alvo:** `src/components/routes/ProtectedAppRoute.tsx`
- **Ação:** Remover `AppDataProvider` do wrapping global
- **Resultado:** ProtectedAppRoute será responsável apenas por autenticação/autorização

#### **Parte B: Relocalização do Provider**
- **Arquivo Alvo:** `src/router/AppRouter.tsx`
- **Ação:** Aplicar `AppDataProvider` apenas à rota do Index
- **Resultado:** `useConsolidatedHomepageFeedQuery` executará apenas na homepage

#### **Parte C: Componentes Shell Auto-Suficientes**
- **Arquivo Alvo:** `packages/hooks/useUserProfileQuery.ts`
- **Ação:** Criar hook TanStack Query focado para perfil do usuário
- **Especificação Técnica:**
  ```typescript
  export const useUserProfileQuery = () => {
    const userId = useAuthStore((state) => state.user?.id);
    return useQuery({
      queryKey: ['user-profile', userId],
      queryFn: () => fetchUserProfile(userId),
      enabled: !!userId,
      staleTime: 1000 * 60 * 15, // 15 minutes
    });
  };
  ```

- **Arquivo Alvo:** `src/components/shell/UserProfileBlock.tsx`
- **Ação:** Refatorar para usar `useUserProfileQuery` independente
- **Resultado:** Componente shell independente com estados próprios de loading

#### **Critérios de Verificação Task 1:**
- [ ] Homepage carrega normalmente com todos os dados
- [ ] Outras páginas (/comunidade, /acervo) carregam instantaneamente o shell
- [ ] UserProfileBlock mostra skeleton independente antes de carregar
- [ ] Network tab não mostra chamada para get-homepage-feed em páginas não-homepage

### **TASK 2: SISTEMA DE ERROR BOUNDARIES HIERÁRQUICO (PRIORIDADE ALTA)**
**Status:** 🟡 Planejado
**Objetivo:** Criar sistema de "rede de segurança" em camadas para prevenir crashes completos da aplicação.

#### **Parte A: Aprimoramento do ErrorBoundary Genérico**
- **Arquivo Alvo:** `src/components/ErrorBoundary.tsx`
- **Ação:** Melhorar UI de fallback com ações de recuperação
- **Especificação Técnica:**
  - Botão de reload da página
  - Informações de debug apenas em desenvolvimento
  - Design consistente com o sistema visual

#### **Parte B: Implementação de Tier 1 & 2**
- **Tier 1 (Root Boundary):** 
  - **Arquivo:** `src/App.tsx`
  - **Escopo:** Wrapping completo da aplicação
  - **Função:** Rede de segurança final

- **Tier 2 (Page Content Boundary):**
  - **Arquivo:** `src/components/shell/AppShell.tsx`
  - **Escopo:** Conteúdo das páginas (Outlet)
  - **Função:** Isolar crashes de página do shell de navegação

#### **Critérios de Verificação Task 2:**
- [ ] Erro em página mantém shell de navegação funcional
- [ ] Erro no shell mostra fallback de aplicação completa
- [ ] Botão de reload funciona corretamente
- [ ] Informações de debug aparecem apenas em desenvolvimento

### **TASK 3: MIGRAÇÃO PARA TYPESCRIPT STRICT (PRIORIDADE MÉDIA)**
**Status:** 🟡 Planejado
**Objetivo:** Eliminar classes inteiras de bugs potenciais através de type safety rigoroso.

#### **Estratégia: "Boil the Ocean Slowly"**
1. **Habilitar strict mode** em `tsconfig.app.json`
2. **Catalogar todos os erros** em `typescript-errors.md`
3. **Fix bottom-up:**
   - `src/types/` primeiro
   - `packages/hooks/` segundo
   - Componentes e páginas por último

#### **Padrões de Correção Obrigatórios:**
- **Type Guards em vez de Non-Null Assertion:**
  ```typescript
  // ❌ ERRADO
  return <div>{data!.title}</div>;
  
  // ✅ CORRETO
  if (!data) return <p>No data available.</p>;
  return <div>{data.title}</div>;
  ```

- **Optional Chaining para Renderização Segura:**
  ```typescript
  return <div>{userProfile?.name}</div>
  ```

- **Tipos Explícitos para Parâmetros:**
  ```typescript
  // ❌ ERRADO
  const handleInputChange = (event) => { /* ... */ }
  
  // ✅ CORRETO
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => { /* ... */ }
  ```

#### **Critérios de Verificação Task 3:**
- [ ] `npm run build` executa sem erros TypeScript
- [ ] Nenhum uso de `any` em código novo
- [ ] Nenhum uso de non-null assertion (`!`) sem justificativa
- [ ] Todos os valores null/undefined tratados explicitamente

## 🔧 ARQUITETURA ATUAL (PRÉ-HARDENING)

### **Frontend (React + Vite)**
```
src/
├── components/           # Componentes organizados por feature
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── community/       # Módulo comunidade
│   ├── acervo/          # Módulo acervo
│   ├── auth/            # Sistema de autenticação
│   └── shell/           # Layout e navegação
├── pages/               # Páginas principais (nomes em inglês)
├── hooks/               # Hooks customizados
├── packages/hooks/      # Hooks de data-fetching
├── types/               # Definições TypeScript
└── integrations/        # Integração Supabase
```

### **Backend (Supabase)**
- **Edge Functions:** 12 funções implementadas
- **Database:** PostgreSQL com RLS
- **Storage:** Configurado para imagens/arquivos
- **Auth:** Sistema completo de autenticação

## 🔧 ARQUITETURA ALVO (PÓS-HARDENING)

### **Princípios da Nova Arquitetura**
1. **Decoupled Data Layer:** Cada componente/página responsável por seus próprios dados
2. **Instant Shell Rendering:** Shell renderiza imediatamente sem aguardar dados
3. **Granular Data Fetching:** Dados buscados no escopo mais específico possível
4. **Layered Error Boundaries:** Sistema hierárquico de tratamento de erros
5. **Strict Type Safety:** Zero tolerância para tipos implícitos ou unsafe

### **Fluxo de Dados Alvo**
```mermaid
graph TD
    subgraph "Browser"
        A[React Application] --> B(AppRouter);
        B --> C{Authenticated?};
        C -- Yes --> D[AppShell - Instant Render];
        C -- No --> LoginPage[LoginPage];

        D --> E[Page Outlet];

        subgraph "Page-Specific Content (Inside Outlet)"
            E --> P1(Homepage);
            E --> P2(CommunityPage);
            E --> P3(AcervoPage);
        end

        subgraph "Independent Shell Components (Inside AppShell)"
            D --> S1(UserProfileBlock);
            D --> S2(NotificationBell);
        end
    end

    subgraph "Backend (Supabase)"
        API(Edge Functions / RPCs)
        DB[(PostgreSQL Database)];
        Auth(Supabase Auth);
    end

    P1 -- Fetches Data --> F1(get-homepage-feed);
    P2 -- Fetches Data --> F2(get-community-page-data);
    P3 -- Fetches Data --> F3(get-acervo-data);

    S1 -- Fetches Data --> UQ(useUserProfileQuery);
    S2 -- Fetches Data --> NQ(useNotificationCountQuery);

    F1 --> API;
    F2 --> API;
    F3 --> API;

    UQ --> DB;
    NQ --> DB;

    API --> DB;
    A -- Checks Session --> Auth;

    style D fill:#cde4f9,stroke:#333,stroke-width:2px
    style P1 fill:#d5f0d5,stroke:#333
    style P2 fill:#d5f0d5,stroke:#333
    style P3 fill:#d5f0d5,stroke:#333
    style S1 fill:#fff2cc,stroke:#333
    style S2 fill:#fff2cc,stroke:#333
```

## 📊 MÉTRICAS DE QUALIDADE ATUAL

### **Aderência aos Padrões**
- ✅ Arquitetura feature-first implementada
- ✅ Componentes pequenos e focados (< 300 linhas)
- ✅ Hooks de data-fetching centralizados
- ✅ Tratamento de erros robusto
- ✅ Estados de loading padronizados
- ✅ Responsive design mobile-first

### **Performance**
- ✅ Infinite scroll otimizado
- ✅ Cache inteligente com TanStack Query
- ✅ Lazy loading de componentes
- ✅ Bundle splitting implementado
- ✅ Rate limiting em APIs

### **Segurança**
- ✅ Row Level Security (RLS) completo
- ✅ Validação de entrada em todas as APIs
- ✅ Sanitização de dados HTML
- ✅ Proteção contra ataques CORS
- ✅ Sistema de roles bem definido

### **Métricas Alvo Pós-Hardening**
- 🎯 **Performance:** Shell rendering < 100ms
- 🎯 **Type Safety:** 100% strict TypeScript compliance
- 🎯 **Reliability:** Zero crashes de aplicação completa
- 🎯 **Maintainability:** Imports consistentes em 100% dos arquivos

## 🔄 FLUXOS DE DADOS IMPLEMENTADOS

### **Fluxo de Autenticação**
1. Login/Cadastro → Supabase Auth
2. Criação de perfil → Tabela Practitioners
3. Atualização de JWT claims → Roles
4. Proteção de rotas → ProtectedRoute

### **Fluxo da Comunidade**
1. Carregamento de posts → get-community-page-data
2. Votação → cast-community-vote
3. Criação de posts → create-community-post
4. Moderação → moderate-community-post

### **Fluxo do Acervo**
1. Carregamento de reviews → get-acervo-data
2. Busca e filtros → Client-side optimization
3. Detalhes do review → get-review-by-slug

## 🎯 CRONOGRAMA DE EXECUÇÃO

### **Semana 1: Task 1 - Data Layer Decoupling**
- Dias 1-2: Remoção do AppDataProvider global
- Dias 3-4: Criação de hooks independentes para shell
- Dias 5-7: Testes e verificação de performance

### **Semana 2: Task 2 - Error Boundaries**
- Dias 1-3: Implementação do sistema hierárquico
- Dias 4-5: Testes de cenários de erro
- Dias 6-7: Refinamento e documentação

### **Semana 3-4: Task 3 - Strict TypeScript**
- Semana 3: Habilitação e catalogação de erros
- Semana 4: Correção sistemática bottom-up

## 🚨 RISCOS IDENTIFICADOS E MITIGAÇÕES

### **Risco 1: Breakage Durante Decoupling**
- **Mitigação:** Implementação incremental com testes em cada step
- **Rollback Plan:** Branch feature isolada para reversão rápida

### **Risco 2: TypeScript Migration Overwhelming**
- **Mitigação:** Estratégia "boil the ocean slowly" com priorização
- **Success Criteria:** Build passing em cada milestone

### **Risco 3: Performance Regression**
- **Mitigação:** Monitoramento contínuo de métricas de loading
- **Benchmarks:** Medição antes/depois de cada task

## 📝 NOTAS DE DESENVOLVIMENTO ATUALIZADAS

### **Padrões Estabelecidos**
- Nomes de arquivo em inglês (ex: CommunityPage.tsx)
- URLs preservadas em português (ex: /comunidade)
- Componentes organizados por feature
- Hooks centralizados em packages/hooks/
- Tratamento de erro padronizado
- **NOVO:** Import paths consistentes usando @ alias
- **NOVO:** Type safety rigorosa obrigatória

### **Convenções de Código Hardened**
- PascalCase para componentes e tipos
- camelCase para funções e variáveis
- snake_case para colunas de banco
- ABOUTME headers em todos os arquivos
- **NOVO:** Strict TypeScript compliance obrigatória
- **NOVO:** Type guards em vez de non-null assertions

### **Anti-Padrões a Evitar**
- ❌ Global data providers para dados específicos
- ❌ Uso de `any` type sem justificativa
- ❌ Non-null assertion (`!`) sem type guards
- ❌ Import paths relativos para recursos cross-module
- ❌ Componentes que não tratam próprios estados de erro

## 🔍 DEBUGGING E LOGS

### **Ferramentas Disponíveis**
- Console logs estruturados
- Error boundaries implementados
- Network monitoring
- Performance profiling
- **NOVO:** TypeScript strict mode error reporting

### **Resolução de Problemas**
- Verificar logs do Supabase
- Monitorar rate limits
- Validar RLS policies
- Checar estados de cache
- **NOVO:** Verificar type safety em builds

## 📈 ROADMAP PÓS-HARDENING

### **Recursos Planejados (Pós-Arquitetura)**
- Sistema de notificações push
- Analytics e métricas de usuário
- Sistema de assinatura premium
- Funcionalidades de export/import
- Sistema de moderação avançado

### **Otimizações Técnicas Futuras**
- Implementação de Service Worker avançado
- Otimização de bundle size
- Melhoria de acessibilidade (WCAG)
- Testes automatizados (Jest + Testing Library)

---

**Última Atualização:** Planeamento completo do hardening arquitetural baseado no Codebase Audit Report. Sistema entrando em fase de transformação para production-ready.

**Próxima Revisão:** Após conclusão de cada Task do plano de hardening.

**Status de Implementação:** 
- ✅ Documentação atualizada e plano definido
- 🟡 Task 1 (Data Decoupling) - Pendente execução
- 🟡 Task 2 (Error Boundaries) - Pendente execução  
- 🟡 Task 3 (Strict TypeScript) - Pendente execução
