
# EVIDENS: Plataforma de Reviews Científicos

**Versão**: 2.4.0  
**Última atualização**: 19 de Junho de 2025  
**Status**: Fase de Estabilização e Protocolos  

---

## 📊 RESUMO EXECUTIVO

### Status do Projeto
- **Arquitetura Base**: ✅ Completa
- **Funcionalidades Core**: 🟡 85% implementadas
- **Community Module**: 🔧 Em estabilização (Milestone System Consolidation)
- **Type Safety & Development Protocols**: 🚧 Em implementação ativa
- **Deploy Status**: 🔧 Estabilização em progresso

### Milestone Atual: COMMUNITY MODULE STABILIZATION PLAN
**Status Atual**: 🚧 Milestone 1/5 em execução - Type System Consolidation

**PLANO DE ESTABILIZAÇÃO v2.4.0** (19/06/2025):
- 🎯 **Objetivo**: Resolver 26 erros TypeScript críticos e estabelecer protocolos robustos
- 🔧 **Estratégia**: Consolidação de tipos + Protocolos de desenvolvimento 
- ⚡ **Escopo**: Community module + Development protocols framework

---

## 🎯 VISION & MISSION

### Problema Central
**"Ansiedade de Performance"** - Profissionais de alto desempenho enfrentam dificuldades para se manterem atualizados com evidências científicas de forma eficiente e aplicável.

### Solução
Plataforma que transforma literatura científica complexa em **insights acionáveis** através de:
- **Reviews estruturados** e digestíveis
- **Comunidade ativa** de discussão científica com suporte multimedia
- **Curadoria especializada** de conteúdo relevante

---

## 🏗️ ARQUITETURA DO SISTEMA

### Stack Tecnológico
- **Frontend**: React + Vite + TypeScript
- **UI/UX**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (100%)
- **Database**: PostgreSQL com RLS
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

### Estrutura de Pastas
```
src/
├── components/          # UI Components (Atomic Design)
│   ├── ui/             # Primitives (shadcn/ui)
│   ├── community/      # Community-specific modules
│   │   └── sidebar/    # Community sidebar modules
│   ├── acervo/         # Acervo-specific modules
│   ├── providers/      # App-wide providers
│   └── shell/          # App shell components
├── pages/              # Route components
├── hooks/              # UI-specific custom hooks
└── packages/
    └── hooks/          # Data-fetching hooks (TanStack Query)
```

---

## 📝 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Core Features (Completas)
1. **Sistema de Autenticação**
   - Login/Signup com email
   - Integração com Supabase Auth
   - Proteção de rotas
   - Gestão de sessões

2. **Acervo de Reviews**
   - Visualização em grid responsivo
   - Sistema de tags hierárquico
   - Busca e filtros avançados
   - Paginação otimizada

3. **Review Detail Page**
   - Renderização de conteúdo estruturado
   - Sistema de blocos modulares
   - Navegação otimizada
   - Contagem de visualizações

4. **App Shell & Navigation**
   - Layout responsivo desktop/mobile
   - Sidebar colapsível
   - Bottom tab bar (mobile)
   - Sistema de temas

### 🚧 Community Module (Em Estabilização)

#### ✅ Funcionalidades Ativas
1. **Post Creation System**
   - ✅ Formulário de criação com rich text editor
   - ✅ Sistema de categorias
   - ✅ Validação aprimorada de formulário
   - ✅ RPC transacional para criação de posts
   - ✅ Auto-upvote do autor
   - ✅ Tratamento robusto de erros
   - ✅ Suporte completo a multimedia

2. **Multimedia Post Support**
   - ✅ **Image Posts**: Upload com drag-and-drop, preview e validação
   - ✅ **Video Posts**: Integração com YouTube, Vimeo, Dailymotion
   - ✅ **Poll Posts**: Criação de enquetes com múltiplas opções
   - ✅ **Text Posts**: Editor rich text aprimorado

3. **Community Feed**
   - ✅ Listagem de posts com paginação
   - ✅ Sistema de votação (upvote/downvote)
   - ✅ Filtragem por categoria
   - ✅ Cache invalidation automático
   - ✅ Visualização de conteúdo multimedia

4. **Post Management**
   - ✅ Visualização detalhada de posts
   - ✅ Sistema de moderação básico
   - ✅ Ações de post (salvar, reportar)

5. **Community Sidebar** ✅ **COMPLETE & STABLE**
   - ✅ **Featured Poll Module**: Enquetes em destaque com votação interativa
   - ✅ **Trending Discussions**: Discussões populares com métricas
   - ✅ **Rules Module**: Regras da comunidade organizadas
   - ✅ **Links Module**: Links úteis com navegação externa/interna
   - ✅ **Recent Activity Module**: Atividade recente com proteção contra undefined
   - ✅ **Sidebar Integration**: Componente principal orquestrando todos os módulos

---

## 🔄 PLANO DE ESTABILIZAÇÃO E PROTOCOLOS v2.4.0

### 📅 COMMUNITY MODULE STABILIZATION PLAN

**Status Atual**: 🚧 Em execução ativa (Milestone 1/5)

**Objetivo Geral**: Resolver 26 erros críticos TypeScript e estabelecer protocolos robustos de desenvolvimento para prevenir problemas similares.

#### 🏗️ MILESTONE 1: Type System Consolidation (🚧 EM EXECUÇÃO)
**Objetivo**: Estabelecer fonte única de verdade para tipos relacionados à comunidade

**Tasks Principais**:
- ✅ **1.1**: Consolidar interface CommunityPost (eliminar duplicações)
- ✅ **1.2**: Atualizar imports de componentes para fonte canônica

**Status**: 🚧 Iniciado - Consolidando definições de tipos

#### 🔧 MILESTONE 2: TanStack Query Modernization (⏳ PENDENTE)
**Objetivo**: Atualizar hooks para padrões TanStack Query v5

**Tasks Principais**:
- **2.1**: Adicionar `initialPageParam` em useSavedPostsQuery
- **2.2**: Verificar consistência em useCommunityPageQuery

**Dependências**: Milestone 1 (tipos atualizados)

#### 🎯 MILESTONE 3: Component Integration Fixes (⏳ PENDENTE)
**Objetivo**: Resolver erros de componentes e padrões de acesso a dados

**Tasks Principais**:
- **3.1**: Corrigir padrão de acesso SavedPostsPage (data.pages vs data.posts)
- **3.2**: Adicionar imports de ícones Lucide React ausentes
- **3.3**: Verificar type safety de todos os componentes

**Dependências**: Milestones 1 & 2 (tipos e queries atualizados)

#### 📋 MILESTONE 4: Development Protocol Implementation (⏳ PENDENTE)
**Objetivo**: Implementar verificações automatizadas e protocolos

**Tasks Principais**:
- **4.1**: Configurar ESLint para type safety enforcement
- **4.2**: Criar testes de integração para contratos de tipos

**Dependências**: Milestone 3 (sistema funcional para testes)

#### 📚 MILESTONE 5: Documentation & Knowledge Transfer (⏳ PENDENTE)
**Objetivo**: Documentar mudanças e estabelecer protocolos

**Tasks Principais**:
- **5.1**: Atualizar documentação técnica
- **5.2**: Criar guias de desenvolvimento (DEVELOPMENT_PROTOCOLS.md)

**Dependências**: Milestone 4 (protocolos completos)

### 🎯 PRÓXIMAS ETAPAS IDENTIFICADAS (Post-Stabilization)

#### Prioridade Imediata (Após Milestone 5)
1. **Advanced Community Features**: Sistema de threading para comentários
2. **User Reputation System**: Sistema de reputação avançado
3. **Enhanced Moderation**: Ferramentas de moderação expandidas

#### Médio Prazo (1-2 meses)
1. Sistema de notificações em tempo real
2. Analytics e dashboard administrativo
3. API pública para integrações

#### Longo Prazo (3+ meses)
1. Mobile app nativo
2. Integração com ferramentas externas
3. Sistema de certificações

---

## 🔧 CONFIGURAÇÕES TÉCNICAS

### Database Schema
- **Reviews**: Conteúdo principal com estrutura JSON
- **CommunityPosts**: Sistema de discussões com threading e multimedia
- **Practitioners**: Perfis de usuários e reputação
- **Tags**: Sistema hierárquico de categorização
- **Votes**: Sistema de votação para posts e sugestões

### RLS Policies
- Implementação completa de Row Level Security
- Policies específicas por tipo de usuário (admin, editor, practitioner)
- Proteção de dados sensíveis e privacidade

### Edge Functions
- **create-community-post**: Criação transacional de posts com multimedia
- **get-community-page-data**: Feed consolidado da comunidade
- **cast-community-vote**: Sistema de votação
- **moderate-community-post**: Ferramentas de moderação

---

## 📊 MÉTRICAS E MONITORAMENTO

### Performance Metrics
- **Lighthouse Score**: 95+ (Performance)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Cumulative Layout Shift**: <0.1

### Funcionalidades por Módulo
- **Authentication**: 100% ✅
- **Acervo**: 100% ✅
- **Review Detail**: 100% ✅
- **Community**: 85% 🚧 (Em estabilização técnica)
- **Profile**: 80% 🟡
- **Admin Panel**: 30% 🔴

---

## 🛡️ SECURITY & COMPLIANCE

### Implementado
- Row Level Security (RLS) em todas as tabelas
- Autenticação JWT com Supabase
- Rate limiting em Edge Functions
- Sanitização de inputs
- Validação de uploads de mídia

### Planejado
- Audit trail completo
- GDPR compliance
- Content moderation automática
- Backup e disaster recovery

---

## 📚 DÉBITO TÉCNICO IDENTIFICADO

### Refatoração Necessária (Pós-Estabilização)
1. **Arquivos Extensos Identificados**:
   - `PostCard.tsx` (273 linhas) → Extrair componentes multimedia
   - `PostDetailCard.tsx` (249 linhas) → Separar rendering logic
   - `SavedPostsPage.tsx` (320 linhas) → Modularizar funcionalidades
   - `src/types/index.ts` (291 linhas) → Dividir por domínios

2. **Melhorias de Arquitetura**:
   - Implementar component composition patterns
   - Criar hooks especializados para multimedia
   - Estabelecer design system mais robusto

3. **Otimizações de Performance**:
   - Lazy loading de componentes pesados
   - Memoização estratégica
   - Bundle size optimization

**Estratégia**: Abordar itens após conclusão do plano de estabilização atual, priorizando por impacto no desenvolvimento futuro.

---

**📈 Status Geral: 85% Implementado | 🎯 Meta Atual: Estabilização Community Module + Development Protocols | 🚀 ETA Milestone 5: +5 dias**

