
# EVIDENS - Documentação Canônica do Sistema
**Versão:** 2.0.0  
**Data:** 19 de Junho de 2025  
**Status:** Milestone 3 Community Module - Core Implementation Complete

## 📚 VISÃO GERAL DO PROJETO
Este documento serve como a fonte única de verdade para a arquitetura, convenções e decisões de design do aplicativo EVIDENS. Ele deve ser lido e referenciado por todos os membros da equipe de desenvolvimento antes de iniciar qualquer tarefa de codificação.

O objetivo é garantir consistência, manutenibilidade e escalabilidade em todo o projeto.

## 🎯 PRINCÍPIOS FUNDAMENTAIS
- **[P1] Máxima Precisão:** Priorizar a exatidão e a correção em todas as implementações.
- **[P2] Simplicidade:** Remover complexidade desnecessária e evitar soluções excessivamente intrincadas.
- **[P3] Padronização:** Aderir a padrões e convenções estabelecidas para garantir a consistência.
- **[P4] Reutilização:** Maximizar a reutilização de componentes e código para reduzir a duplicação.
- **[P5] Testabilidade:** Projetar componentes e módulos para serem facilmente testáveis.
- **[P6] Segurança:** Implementar medidas de segurança em todas as camadas do aplicativo.
- **[P7] Desempenho:** Otimizar o desempenho para garantir uma experiência de usuário fluida.
- **[P8] Acessibilidade:** Garantir que o aplicativo seja acessível a todos os usuários, independentemente de suas habilidades.

## ⚙️ CONFIGURAÇÃO DO AMBIENTE
1.  Instale o Node.js (v18 ou superior)
2.  Instale o pnpm (`npm install -g pnpm`)
3.  Clone o repositório
4.  Execute `pnpm install` na raiz do projeto
5.  Configure as variáveis de ambiente (consulte a seção abaixo)
6.  Execute `pnpm dev` para iniciar o servidor de desenvolvimento

### Variáveis de Ambiente Necessárias
- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de função de serviço do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase (para o cliente)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase (para o cliente)

## 🗂️ ESTRUTURA DE PASTAS
```
├── src/                # Código fonte principal
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── community/  # Módulo da comunidade
│   │   │   ├── sidebar/    # Componentes da barra lateral
│   │   │   ├── CommunityErrorBoundary.tsx
│   │   │   ├── CommunityLoadingState.tsx
│   │   │   └── CommunityFeedWithSidebar.tsx
│   ├── contexts/       # Contextos React para gerenciamento de estado global
│   ├── hooks/          # Hooks React personalizados
│   ├── pages/          # Páginas do aplicativo
│   ├── styles/         # Estilos globais e temas
│   ├── utils/          # Funções utilitárias
├── packages/           # Hooks de data fetching
│   └── hooks/          # Hooks customizados para acesso a dados
├── public/             # Arquivos estáticos
├── supabase/           # Configuração do Supabase
├── docs/               # Documentação do projeto
├── README.md           # Instruções de configuração e uso
└── package.json        # Metadados do projeto e dependências
```

## 🗺️ ROUTING
O aplicativo usa `react-router-dom` para gerenciamento de rotas. As rotas são definidas no arquivo `src/router/AppRouter.tsx`.

### Rotas Principais
- `/`: Homepage (Index)
- `/acervo`: Acervo de reviews
- `/comunidade`: Comunidade (fórum) - **FUNCIONAL**
- `/comunidade/:postId`: Detalhe de um post na comunidade
- `/comunidade/criar`: Criação de novos posts
- `/profile`: Página de perfil do usuário
- `/reviews/:slug`: Detalhe de uma review
- `/auth`: Autenticação (login/signup)

## 💾 BANCO DE DADOS
O aplicativo usa o Supabase como banco de dados. O esquema do banco de dados é definido no arquivo `supabase/migrations/*.sql`.

### Tabelas Principais
- `Practitioners`: Informações dos usuários (profissionais)
- `Reviews`: Reviews de artigos científicos
- `CommunityPosts`: Posts da comunidade (fórum)
- `CommunityPost_Votes`: Votos dos usuários nos posts da comunidade
- `SiteSettings`: Configurações do site (administradas pelo painel de controle)

## 🔑 ROW LEVEL SECURITY (RLS)
O aplicativo usa RLS para garantir que os usuários só possam acessar os dados que têm permissão para acessar. As políticas de RLS são definidas nos arquivos `supabase/policies/*.sql`.

### Políticas Principais
- `Practitioners`: Os usuários só podem ver seus próprios dados, exceto administradores.
- `Reviews`: Todos os usuários podem ver todas as reviews.
- `CommunityPosts`: Todos os usuários podem ver todos os posts, mas apenas usuários autenticados podem criar, atualizar ou deletar seus próprios posts. Administradores podem deletar qualquer post.
- `CommunityPost_Votes`: Usuários autenticados podem votar em posts.

## 📡 API CONTRACT
O aplicativo usa Edge Functions do Supabase para expor uma API REST. Os contratos da API são definidos em `docs/[DOC_5]_API_CONTRACT.md`.

### Endpoints Principais
- `get-community-page-data`: Retorna os dados para a página da comunidade (posts e sidebar). **FUNCIONAL**
- `get-review-by-slug`: Retorna uma review pelo seu slug.
- `create-community-post`: Cria um novo post na comunidade.
- `moderate-community-post`: Executa ações de moderação em um post da comunidade (pin, hide, etc.).

## 🧰 DATA FETCHING
O aplicativo usa TanStack Query para gerenciamento de estado e cache de dados. Os hooks de data fetching são definidos na pasta `packages/hooks/`.

### Hooks Principais
- `useCommunityPageQuery`: Retorna os dados para a página da comunidade (posts e sidebar). **FUNCIONAL**
- `useReviewBySlugQuery`: Retorna uma review pelo seu slug.
- `useCreateCommunityPostMutation`: Cria um novo post na comunidade.
- `usePostActionMutation`: Executa ações de moderação em um post da comunidade (pin, hide, etc.).

## 🎨 VISUAL SYSTEM
O aplicativo usa componentes do Shadcn UI para garantir consistência visual. Os estilos globais são definidos no arquivo `src/index.css`.

### Componentes Principais
- `Button`: Botão
- `Card`: Cartão
- `Input`: Input de texto
- `Select`: Select (dropdown)
- `Alert`: Alerta (mensagem de erro/sucesso)

## 📱 MOBILE ADAPTATION
O aplicativo usa um design responsivo para se adaptar a diferentes tamanhos de tela. O breakpoint para mobile é definido como `768px` no arquivo `src/hooks/use-mobile.tsx`.

### Estratégias de Adaptação
- **Layout:** O layout de duas colunas (feed + sidebar) é usado em telas maiores que `768px`. Em telas menores, o layout é de uma coluna, e a sidebar é omitida.
- **Componentes:** Alguns componentes têm versões diferentes para mobile e desktop. Por exemplo, a bottom tab bar é usada apenas em mobile.
- **Navegação:** A navegação principal é feita através da bottom tab bar em mobile e da sidebar em desktop.

## 📊 STATUS ATUAL DO PROJETO

### ✅ MÓDULOS IMPLEMENTADOS E FUNCIONAIS
- **Autenticação Completa:** Login/Signup com Supabase Auth
- **App Shell Responsivo:** Desktop sidebar + Mobile bottom tabs
- **Homepage Feed:** Reviews recentes e sugestões
- **Acervo Completo:** Filtros, busca, tags hierárquicas
- **Review Detail:** Renderização de conteúdo estruturado
- **Community Module (MILESTONE 3 COMPLETE):**
  - **✅ Backend:** Edge functions operacionais
  - **✅ Frontend:** Routing estabilizado (CRITICAL FIX APPLIED)
  - **✅ UI Padronizada:** Error boundaries e loading states
  - **✅ Desktop:** Feed + Sidebar layout completo
  - **✅ Mobile:** Feed responsivo (sidebar omitida)
  - **✅ Sidebar Modules:** Rules, Links, Trending, Recent Activity

### 🔧 FEATURES TÉCNICAS IMPLEMENTADAS
- **Rate Limiting:** Todos os endpoints protegidos
- **Error Boundaries:** Padronizados por módulo (CommunityErrorBoundary)
- **Loading States:** Componentes reutilizáveis (CommunityLoadingState)
- **Mobile-First Design:** Breakpoints padronizados
- **Data Access Layer:** TanStack Query + hooks customizados

### 🚧 PRÓXIMAS IMPLEMENTAÇÕES NECESSÁRIAS
1. **Post Creation Workflow:** Completar fluxo de criação de posts
2. **Post Detail View:** Implementar visualização individual
3. **Voting System:** Sistema de upvote/downvote
4. **Comment System:** Sistema de comentários e replies
5. **Moderation Tools:** Ferramentas de moderação para admins

## 🏛️ ARQUITETURA GERAL

### Diagrama de Alto Nível
```
[Cliente] ↔ [App Shell] ↔ [Módulos] ↔ [Data Hooks] ↔ [Edge Functions] ↔ [Supabase DB]
```

### Fluxo de Dados Típico
1.  O usuário interage com um componente na UI.
2.  O componente chama um hook de data fetching (`use...Query` ou `use...Mutation`).
3.  O hook chama uma Edge Function do Supabase.
4.  A Edge Function executa uma query no banco de dados Supabase.
5.  O banco de dados retorna os dados para a Edge Function.
6.  A Edge Function retorna os dados para o hook.
7.  O hook atualiza o estado do componente, que é re-renderizado.

## 🧱 ARQUITETURA DE COMPONENTES (ATUALIZADA)

### Padrão de Error Handling
```
CommunityErrorBoundary (por módulo)
├── Fallback UI padronizado
├── Reset de estado automático
└── Logging centralizado
```

### Padrão de Loading States
```
CommunityLoadingState
├── Variant: feed | sidebar | post | minimal
├── Skeleton patterns consistentes
└── Count configurável
```

### Hierarquia Mobile-First
```
CommunityFeedWithSidebar
├── Desktop: Two-column (feed + sidebar)
├── Mobile: Single column (feed only)
└── Responsive breakpoints ([DOC_8])
```

### Módulos da Sidebar da Comunidade
```
CommunitySidebar
├── FeaturedPollModule (se disponível)
├── RulesModule (regras da comunidade)
├── TrendingDiscussionsModule (discussões em alta)
├── RecentActivityModule (atividade recente)
└── LinksModule (links úteis)
```

## 🛡️ DIRETRIZES DE SEGURANÇA

### [SEC.1] Autenticação e Autorização
- Use o Supabase Auth para autenticação de usuários.
- Use RLS para autorização e controle de acesso aos dados.
- Valide os dados de entrada em todas as Edge Functions.
- Implemente rate limiting para proteger contra ataques de negação de serviço.

### [SEC.2] Moderação de Conteúdo
- Implemente um sistema de moderação de conteúdo para a comunidade.
- Permita que administradores e moderadores removam posts ofensivos ou spam.
- Implemente um sistema de denúncia de posts.
- Monitore a atividade da comunidade para identificar e remover conteúdo impróprio.

## 🧪 DIRETRIZES DE TESTE

### [T1] Testes Unitários
- Escreva testes unitários para todos os componentes e funções utilitárias.
- Use Jest e React Testing Library para testes unitários.
- Garanta que todos os testes unitários passem antes de fazer commit do código.

### [T2] Testes de Integração
- Escreva testes de integração para garantir que os diferentes módulos do aplicativo funcionem juntos corretamente.
- Use Cypress para testes de integração.
- Garanta que todos os testes de integração passem antes de fazer deploy do aplicativo.

## 🚀 DIRETRIZES DE DEPLOY

### [D1] Ambiente de Produção
- Use um ambiente de produção separado do ambiente de desenvolvimento.
- Configure as variáveis de ambiente corretamente no ambiente de produção.
- Use um certificado SSL para garantir a segurança das conexões HTTPS.
- Monitore o desempenho do aplicativo em produção.

### [D2] Continuous Integration/Continuous Deployment (CI/CD)
- Use um sistema de CI/CD para automatizar o processo de deploy.
- Configure o sistema de CI/CD para executar testes automatizados antes de fazer deploy do aplicativo.
- Use um sistema de versionamento de código (Git) para gerenciar as alterações no código.

## 📋 PLANO DE DESENVOLVIMENTO FUTURO

### Phase 4: POST INTERACTION SYSTEM
**Objetivo:** Implementar sistema completo de interação com posts
**Componentes Necessários:**
- PostDetail component para visualização individual
- VoteButtons component para upvote/downvote
- Comment system para discussões aninhadas
- Reply functionality para respostas

### Phase 5: CONTENT CREATION & MODERATION
**Objetivo:** Completar ferramentas de criação e moderação
**Componentes Necessários:**
- Enhanced CreatePostForm com rich text editor
- Moderation dashboard para admins
- Content flagging system
- User reputation system

### Phase 6: PERFORMANCE OPTIMIZATION
**Objetivo:** Otimizar performance e cache
**Melhorias Necessárias:**
- Implement virtual scrolling para feeds longos
- Optimize image loading com lazy loading
- Implement infinite scroll com intersection observer
- Cache optimization para dados da sidebar

## 📜 GLOSSÁRIO

### Termos Comuns
- **Review:** Avaliação de um artigo científico.
- **Acervo:** Coleção de reviews.
- **Comunidade:** Fórum de discussão científica.
- **Post:** Mensagem em um fórum de discussão.
- **Slug:** Identificador único de uma review (usado na URL).
- **Edge Function:** Função serverless executada no Edge do Supabase.
- **RLS:** Row Level Security (segurança em nível de linha).
- **Sidebar:** Barra lateral com módulos informativos da comunidade.

---
**Última Atualização:** Milestone 3 - Core Community Implementation Complete (Routing Fixed)
**Próximo Marco:** Milestone 4 - Post Interaction System & Content Creation

