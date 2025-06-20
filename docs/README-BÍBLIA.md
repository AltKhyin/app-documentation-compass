
# EVIDENS Reviews - Bíblia Técnica  
**Versão**: 2.4.0  
**Data**: 20 de junho de 2025  
**Status**: Sistema Consolidado e Otimizado

## 📋 RESUMO EXECUTIVO

O EVIDENS Reviews é uma Single-Page Application (SPA) e Progressive Web App (PWA) construída em React + Vite + TypeScript + Supabase, focada em fornecer reviews científicos de alta qualidade para profissionais de saúde.

### 🎯 Status Atual do Sistema
- ✅ **Sistema de Autenticação**: Implementado (Supabase Auth + JWT claims)
- ✅ **Shell Principal**: Desktop e Mobile implementados
- ✅ **Homepage**: Feed personalizado implementado
- ✅ **Acervo**: Sistema de tags e busca implementado  
- ✅ **Comunidade**: Feed com sidebar, posts e votação implementados
- ✅ **Sistema de Tipos**: Consolidado e otimizado
- ✅ **Nomenclatura**: Padronizada (inglês interno, português para usuários)
- ✅ **Hooks de Dados**: Otimizados com melhor tratamento de erro
- 🔄 **Profile**: Placeholder implementado
- 🔄 **Review Detail**: Em desenvolvimento

---

## 🏗️ ARQUITETURA CONSOLIDADA

### Estrutura de Tipos Otimizada
```typescript
// Tipos centralizados e reutilizáveis
src/types/
├── index.ts          // Exports principais + tipos base
├── api.ts           // Tipos para API e resposta padronizadas  
├── community.ts     // Tipos específicos da comunidade
└── auth.ts         // Tipos de autenticação
```

### Sistema de Nomenclatura Padronizado
- **Arquivos/Componentes**: Inglês (CommunityPage.tsx, CollectionPage.tsx)
- **URLs**: Português preservado (/comunidade, /acervo, /perfil)
- **Interface**: Português para usuários
- **Código interno**: Inglês para consistência

### Hooks de Dados Otimizados
```typescript
// Hooks com tratamento de erro aprimorado
packages/hooks/
├── useCommunityPageQuery.ts    // Otimizado: cache + error handling
├── usePostDetailQuery.ts       // Otimizado: performance + tipos
└── useAcervoDataQuery.ts      // Dados do acervo consolidados
```

---

## 🚀 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Sistema de Comunidade (100% funcional)
- **Feed Principal**: Posts com votação, categorias, e paginação infinita
- **Sidebar Desktop**: Regras, links, trending discussions, polls
- **Mobile**: Adaptação com bottom tabs (sem sidebar)
- **Criação de Posts**: Formulário completo com rich text editor
- **Votação**: Sistema up/down vote implementado
- **Moderação**: Sistema de pin/lock posts para admins

### ✅ Sistema de Acervo (100% funcional)  
- **Grid Responsivo**: Masonry layout com reviews
- **Sistema de Tags**: Filtros funcionais com contadores
- **Busca**: Por título e conteúdo dos reviews
- **Ordenação**: Recente, popular, alfabética

### ✅ Sistema de Shell (100% funcional)
- **Desktop**: Sidebar colapsível com navegação
- **Mobile**: Bottom tab bar + header fixo
- **Contexto de Dados**: AppDataContext para estado global
- **Responsividade**: useIsMobile hook para adaptações

---

## 🔧 OTIMIZAÇÕES TÉCNICAS RECENTES

### Performance de Hooks
- **Cache Inteligente**: staleTime otimizado por tipo de dados
- **Error Handling**: Mensagens contextuais e retry automático  
- **Garbage Collection**: gcTime configurado para melhor memória
- **Refetch Control**: Redução de calls desnecessários

### Edge Functions
- **Rate Limiting**: Implementado em todas as funções
- **Fallback Strategy**: Queries manuais quando RPC falha
- **Error Responses**: Padronizadas com códigos HTTP corretos
- **CORS Compliant**: Headers implementados conforme [DOC_5]

---

## 📊 MÉTRICAS DE QUALIDADE

### Aderência aos Padrões
- ✅ **[D3.4] Data Access Layer**: 100% via hooks
- ✅ **[D3.1] Filesystem**: Estrutura feature-first
- ✅ **[D3.6] Mobile-First**: Design responsivo implementado
- ✅ **[D3.3] State Management**: TanStack Query + Zustand

### Cobertura de Funcionalidades
- **Autenticação**: 100% (login, signup, proteção de rotas)
- **Comunidade**: 100% (feed, posts, votação, sidebar)
- **Acervo**: 100% (grid, filtros, busca)  
- **Navigation**: 100% (desktop + mobile)
- **Tipos**: 100% (sistema consolidado e otimizado)

---

## 🎯 PRÓXIMOS PASSOS

### MILESTONE 5: Component Architecture (Pendente)
- Refatoração de componentes grandes
- Separação de responsabilidades
- Melhoria na reutilização

### MILESTONE 6: Final Quality Assurance (Pendente)  
- Testes de integração
- Validação completa do sistema
- Performance audit final

---

## 🔍 DEBUGGING & LOGS

### Logs Implementados
```typescript
// Hooks otimizados com logs contextuais
console.log('Fetching community page data, page:', pageParam);
console.log('Successfully fetched X posts via RPC/fallback');
console.error('Enhanced error context:', error);
```

### Rate Limiting
- **Community Data**: 30 req/60s por usuário
- **Post Detail**: 60 req/60s por IP
- **Authentication**: Padrão Supabase

---

**📝 Última Atualização**: Milestone 4 concluído - Sistema de hooks otimizado com melhor performance e tratamento de erros.
