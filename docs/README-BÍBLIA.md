
# 📖 README-BÍBLIA: Estado Atual do Projeto EVIDENS

**Versão:** 4.2.0  
**Data:** 20 de Junho de 2025  
**Status:** Produção Estável

## 🚀 RESUMO EXECUTIVO

O projeto EVIDENS é uma plataforma científica de revisão de literatura implementada como uma Progressive Web App (PWA) usando React + Vite + Supabase. O sistema oferece uma experiência completa de consumo de conteúdo científico com funcionalidades de comunidade, curadoria e personalização.

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

## 🏗️ ARQUITETURA ATUAL

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

## 🔧 TECNOLOGIAS E DEPENDÊNCIAS

### **Core Stack**
- **Frontend:** React 18.3.1 + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **State Management:** TanStack Query + Zustand
- **Routing:** React Router DOM 6.26.2

### **Bibliotecas Principais**
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Rich Text:** TipTap
- **Date Handling:** date-fns
- **File Upload:** React Dropzone

## 📊 MÉTRICAS DE QUALIDADE

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

## 🎯 PRÓXIMOS DESENVOLVIMENTOS

### **Recursos Planejados**
- Sistema de notificações push
- Analytics e métricas de usuário
- Sistema de assinatura premium
- Funcionalidades de export/import
- Sistema de moderação avançado

### **Otimizações Técnicas**
- Implementação de Service Worker avançado
- Otimização de bundle size
- Melhoria de acessibilidade (WCAG)
- Testes automatizados (Jest + Testing Library)

## 📝 NOTAS DE DESENVOLVIMENTO

### **Padrões Estabelecidos**
- Nomes de arquivo em inglês (ex: CommunityPage.tsx)
- URLs preservadas em português (ex: /comunidade)
- Componentes organizados por feature
- Hooks centralizados em packages/hooks/
- Tratamento de erro padronizado

### **Convenções de Código**
- PascalCase para componentes e tipos
- camelCase para funções e variáveis
- snake_case para colunas de banco
- ABOUTME headers em todos os arquivos

## 🔍 DEBUGGING E LOGS

### **Ferramentas Disponíveis**
- Console logs estruturados
- Error boundaries implementados
- Network monitoring
- Performance profiling

### **Resolução de Problemas**
- Verificar logs do Supabase
- Monitorar rate limits
- Validar RLS policies
- Checar estados de cache

---

**Última Atualização:** Implementação completa do sistema de tratamento de erros e estados de carregamento robustos. Sistema pronto para produção com alta disponibilidade e experiência de usuário otimizada.

**Próxima Revisão:** A ser definida com base nas métricas de uso em produção.
