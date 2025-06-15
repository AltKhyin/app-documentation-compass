\[DOC\_9\] Monorepo Architecture

Version: 1.0

Date: June 14, 2025

Purpose: This document provides the canonical and non-negotiable architecture for the EVIDENS monorepo. It defines the directory structure, package management, and shared code strategy, ensuring that both the \`main\` and \`admin\` applications are built from a consistent and maintainable foundation.

\================================================================================

1.0. Core Principles & Rationale

\================================================================================

\*   \*\*Why a Monorepo?\*\* The EVIDENS platform consists of two distinct Next.js applications (\`main\` and \`admin\`) that need to share code (UI components, database types, configuration). A monorepo allows us to manage these projects in a single repository, which drastically simplifies dependency management and eliminates code duplication.

\*   \*\*Principle of Shared Truth:\*\* There must be a single source of truth for any shared code. Code should be written once in a shared \`package\` and imported into the \`apps\`, never copied and pasted.

\================================================================================

2.0. Mandatory Tooling

\================================================================================

\*   \*\*Package Manager:\*\* \`pnpm\`. Its use of symlinks is highly efficient for monorepos. All \`npm\` or \`yarn\` commands should be replaced with their \`pnpm\` equivalents (e.g., \`pnpm install\`, \`pnpm add\`).

\*   \*\*Monorepo Orchestrator:\*\* \`Turborepo\`. We will use Turborepo to manage tasks and builds across the repository. It provides intelligent caching and task pipelining, dramatically speeding up development workflows.

\================================================================================

3.0. Canonical Directory Structure

\================================================================================

The repository root MUST adhere to the following structure.

/

|-- apps/

|   |-- main/         \# The main user-facing Next.js application

|   |   |-- app/

|   |   |-- package.json

|   |   \`-- tsconfig.json

|   |

|   \`-- admin/        \# The admin-facing Next.js application

|       |-- pages/

|       |-- package.json

|       \`-- tsconfig.json

|

|-- packages/

|   |-- ui/           \# Shared, headless React UI components

|   |   |-- components/

|   |   |-- package.json

|   |   \`-- tsconfig.json

|   |

|   |-- db/           \# Auto-generated Supabase database types

|   |   |-- index.ts

|   |   \`-- package.json

|   |

|   \`-- config/       \# Shared configurations (ESLint, TypeScript)

|       |-- eslint-preset.js

|       \`-- tsconfig.base.json

|

|-- .gitignore

|-- pnpm-workspace.yaml

|-- package.json      \# Root package.json

\`-- turbo.json        \# Turborepo configuration

\================================================================================

4.0. Package Breakdown & Purpose

\================================================================================

\*   \*\*\`apps/main\`:\*\* The user-facing Next.js app.

\*   \*\*\`apps/admin\`:\*\* The admin-facing Next.js app.

\*   \*\*\`packages/ui\`:\*\* A shared library of React components.

    \*   \*\*RULE:\*\* Any UI component that is needed in both \`main\` and \`admin\` (e.g., \`Button\`, \`Card\`, \`Logo\`) MUST be created here. It should be styled using Tailwind CSS and exportable.

\*   \*\*\`packages/db\`:\*\* The single source of truth for database types.

    \*   \*\*RULE:\*\* The \`supabase gen types typescript\` command should be configured to output its \`database.ts\` file here. Both \`main\` and \`admin\` apps will import their types from this package.

\*   \*\*\`packages/config\`:\*\* Shared configurations.

    \*   \*\*RULE:\*\* Both \`apps/main/tsconfig.json\` and \`apps/admin/tsconfig.json\` will \`extend\` the base configuration from \`packages/config/tsconfig.base.json\` to ensure consistent compiler options.

\================================================================================

5.0. Configuration & Implementation Details

\================================================================================

5.1. \`pnpm-workspace.yaml\`

\*   This file, at the root, defines the monorepo structure for \`pnpm\`.

    \`\`\`yaml

    packages:

      \- 'apps/\*'

      \- 'packages/\*'

    \`\`\`

5.2. Root \`package.json\`

\*   This file will contain the scripts to run commands across the entire monorepo using Turborepo.

    \`\`\`json

    {

      "name": "evidens-monorepo",

      "private": true,

      "scripts": {

        "build": "turbo build",

        "dev": "turbo dev",

        "lint": "turbo lint",

        "format": "prettier \--write \\"\*\*/\*.{ts,tsx,md}\\""

      },

      "devDependencies": {

        "turborepo": "latest",

        "typescript": "latest",

        "prettier": "latest"

      },

      "packageManager": "pnpm@8.x.x"

    }

    \`\`\`

5.3. TypeScript Path Aliases

\*   To allow clean imports (e.g., \`import { Button } from "@repo/ui";\`), each app's \`tsconfig.json\` must be configured with path aliases.

    \`\`\`json

    // In apps/main/tsconfig.json

    {

      "extends": "@repo/config/tsconfig.base.json",

      "compilerOptions": {

        "paths": {

          "@repo/ui/\*": \["../../packages/ui/\*"\]

        }

      },

      // ... other app-specific options

    }

    \`\`\`

