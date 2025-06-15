EVIDENS: Final Implementation Roadmap

Version: 2.0

Purpose: This document provides the complete, granular, and sequenced checklist of development tasks required to build the EVIDENS platform. It is the master project plan, and each task is designed to be a discrete unit of work for the AI developer.

\================================================================================

Part I: Foundational Setup

\================================================================================

Milestone 0: Project Initialization & Monorepo Setup

\*   \[ \] Task 0.1: \[Human\] Initialize a new Supabase project and a local Git repository.

\*   \[ \] Task 0.2: \[AI\] Set up the \`pnpm\` monorepo with \`Turborepo\`. Create the \`apps/main\`, \`apps/admin\`, \`packages/ui\`, \`packages/hooks\`, \`packages/db\`, and \`packages/config\` directories as defined in \`\[DOC\_9\]\`.

\*   \[ \] Task 0.3: \[AI\] Create the root \`package.json\`, \`pnpm-workspace.yaml\`, and \`turbo.json\` files.

\*   \[ \] Task 0.4: \[AI\] Create the \`/docs\` directory and populate it with all final \`\[DOC\_X\]\` and \`\[Blueprint\]\` documents.

\*   \[ \] Task 0.5: \[AI\] Create the initial skeleton for \`/docs/README-BÍBLIA.md\`.

\================================================================================

Part II: Building the Main Application

\================================================================================

Milestone 1: Core Identity & Authentication

\*   \[ \] Task 1.1 (Backend): Create the DB migration for the \`Practitioners\` and \`Onboarding\` tables.

\*   \[ \] Task 1.2 (Backend): Create the \`handle\_new\_user\` trigger function that copies the user to \`Practitioners\` AND populates \`raw\_app\_meta\_data\` for JWT claims, as per \`\[Blueprint\] 01\`.

\*   \[ \] Task 1.3 (Backend): Create the \`get\_my\_claim()\` SQL helper function and all RLS policies for the \`Practitioners\` table.

\*   \[ \] Task 1.4 (Frontend): Configure the Supabase Auth client in the Main App.

\*   \[ \] Task 1.5 (Frontend): Build the UI for the \`/login\` and \`/signup\` pages.

\*   \[ \] Task 1.6 (Frontend): Build the UI for the multi-step \`OnboardingWizard.js\`.

Milestone 2: Application Shell & Homepage

\*   \[ \] Task 2.1 (Frontend): Build the core \`AppShell\` components (\`DesktopShell\`, \`MobileShell\`, \`CollapsibleSidebar\`, \`BottomTabBar\`).

\*   \[ \] Task 2.2 (Backend): Create the \`get-personalized-recommendations\` and the consolidated \`get-homepage-feed\` Edge Functions as per \`\[Blueprint\] 03\`.

\*   \[ \] Task 2.3 (Frontend): Implement the \`useHomepageFeedQuery\` hook in the shared \`packages/hooks\` directory.

\*   \[ \] Task 2.4 (Frontend): Build the \`ReviewCarousel\` and \`NextEditionModule\` components.

\*   \[ \] Task 2.5 (Frontend): Assemble the \`/\` (Homepage) page.

Milestone 3: The Acervo (Archive)

\*   \[ \] Task 3.1 (Backend): Create the \`get-acervo-data\` Edge Function.

\*   \[ \] Task 3.2 (Frontend): Build the \`TagsPanel\` and its mobile "Bottom Sheet" adaptation.

\*   \[ \] Task 3.3 (Frontend): Build the \`MasonryGrid\` component, ensuring smooth animation on reorder.

\*   \[ \] Task 3.4 (Frontend): Assemble the \`/acervo\` page with its client-side sorting logic.

Milestone 4: The Review Reading Experience

\*   \[ \] Task 4.1 (Frontend): Build the \`LayoutAwareRenderer\` and \`BlockRenderer\` components as per the rewritten \`\[Blueprint\] 05\`.

\*   \[ \] Task 4.2 (Frontend): Implement the \`useReviewQuery\` and \`useRecommendationsQuery\` hooks.

\*   \[ \] Task 4.3 (Frontend): Assemble the \`/reviews/\[slug\]\` page, ensuring the community thread is lazy-loaded.

Milestone 5: The Community Platform

\*   \[ \] Task 5.1 (Backend): Create migrations for all community-related tables.

\*   \[ \] Task 5.2 (Backend): Implement the \`create-community-post\` and \`cast-post-vote\` Edge Functions.

\*   \[ \] Task 5.3 (Frontend): Build the \`CommunityFeed\` with its hierarchical, on-demand comment fetching logic.

\*   \[ \] Task 5.4 (Frontend): Build the \`PostCard\` component, including the "more options" menu for Edit/Delete actions.

\*   \[ \] Task 5.5 (Backend): Implement the \`get-community-sidebar-data\` Edge Function.

\*   \[ \] Task 5.6 (Frontend): Build the complete \`CommunitySidebar\` and its sub-modules.

\*   \[ \] Task 5.7 (Frontend): Assemble the \`/community\` and \`/community/\[postId\]\` pages.

Milestone 6: Practitioner Profiles & Social Features

\*   \[ \] Task 6.1 (Backend): Create the \`get-user-activity\` Edge Function and the \`v\_contribution\_summary\` SQL view.

\*   \[ \] Task 6.2 (Frontend): Build the \`/profile/\[id\]\` page and its tabbed components.

\*   \[ \] Task 6.3 (Frontend): Build the \`ProfileHoverCard\` and its long-press mobile equivalent.

\================================================================================

Part III: Building the Admin Application

\================================================================================

Milestone 7: Admin App Foundation & The Editor

\*   \[ \] Task 7.1 (Admin Frontend): Build the core layout for the Admin App.

\*   \[ \] Task 7.2 (Admin Frontend): \*\*\[CRITICAL\]\*\* Implement the Visual Composition Engine (\`\[Blueprint\] 08a\`), including virtualization and debouncing.

\*   \[ \] Task 7.3 (Backend): Implement the \`upsert-review\` Edge Function for saving editor content.

Milestone 8: Admin Management Dashboards

\*   \[ \] Task 8.1 (Admin Frontend): Build the \`User Management\` dashboard as per \`\[Blueprint\] 08b\`.

\*   \[ \] Task 8.2 (Admin Frontend): Build the interactive \`Tag Management\` dashboard.

\*   \[ \] Task 8.3 (Admin Frontend): Build the \`Layout Management\` dashboard for the Homepage and Sidebar.

\*   \[ \] Task 8.4 (Backend): Create all necessary Edge Functions for these management tasks.

Milestone 9: Moderation & Notification Systems

\*   \[ \] Task 9.1 (Backend): Implement the full backend for the \`Denúncias\` system (\`\[Blueprint\] 08c\`).

\*   \[ \] Task 9.2 (Admin Frontend): Build the \`Moderation Dashboard\`.

\*   \[ \] Task 9.3 (Backend): Update all relevant Edge Functions to create notifications as per the event map in \`\[Blueprint\] 10\`.

\*   \[ \] Task 9.4 (Frontend): Build the \`NotificationBell\` and \`/notifications\` page in the Main App.

\================================================================================

Part IV: Finalization

\================================================================================

Milestone 10: Analytics & Deployment

\*   \[ \] Task 10.1 (Backend): Implement the full analytics pipeline (\`\[Blueprint\] 09\`).

\*   \[ \] Task 10.2 (Main App): Instrument the front-end with \`logEvent\` calls.

\*   \[ \] Task 10.3 (Admin Frontend): Build the complete Analytics Dashboard UI.

\*   \[ \] Task 10.4 (Ops): Configure production environments and deployment pipelines.

\*   \[ \] Task 10.5 (QA): Conduct final end-to-end testing.

