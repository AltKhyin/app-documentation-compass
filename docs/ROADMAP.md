EVIDENS: Final Implementation Roadmap

Version: 2.0

Purpose: This document provides the complete, granular, and sequenced checklist of development tasks required to build the EVIDENS platform. It is the master project plan, and each task is designed to be a discrete unit of work for the AI developer.

\================================================================================

Part I: Foundational Setup

\================================================================================

Milestone 0: Project Initialization & Monorepo Setup

[ ] Task 0.1: [Human] Initialize a new Supabase project and a local Git repository.
[ ] Task 0.2: [AI] Set up the pnpm monorepo with Turborepo and all required directories as per [DOC_9].
[ ] Task 0.3: [AI] Create all root configuration files (package.json, turbo.json, etc.).
[ ] Task 0.4: [AI] Create the /docs directory and populate it with all final [DOC_X] and [Blueprint] documents.
[ ] Task 0.5: [AI] Create the initial skeleton for /docs/README-BÍBLIA.md.

\================================================================================

Part II: Building the Main Application

\================================================================================

Milestone 1: Core Identity & Authentication
  
[ ] Task 1.1 (Backend): Create DB migrations for Practitioners and Onboarding tables.
[ ] Task 1.2 (Backend): Create the handle_new_user trigger with JWT custom claims logic.
[ ] Task 1.3 (Backend): Implement all RLS policies for Practitioners.
[ ] Task 1.4 (Frontend - Structure): Configure the Supabase Auth client in the Main App.
[ ] Task 1.5 (Frontend - Structure): Build the functional, unstyled logic for the /login and /signup pages and their data mutations.
[ ] Task 1.6 (Frontend - Structure): Build the functional, multi-step logic for the OnboardingWizard.js and its data hooks.
[📸 VISUAL CHECKPOINT 1]
What to Check: The complete authentication flow. Can you sign up? Can you log in? Does the onboarding wizard appear correctly on the first login?
Goal: Verify that the core user identity system is functional before applying pixel-perfect styling.
[ ] Task 1.7 (Frontend - Polish): Apply all final styling from [DOC_7] to the /login page, /signup page, and the OnboardingWizard.js modal to achieve a 1:1 match with the visual design.
M

Milestone 2: Application Shell & Homepage
  
[ ] Task 2.1 (Frontend - Structure): Build the core AppShell components (DesktopShell, MobileShell, CollapsibleSidebar, BottomTabBar) with their responsive logic.
[ ] Task 2.2 (Frontend - Structure): Build the UserProfileBlock and NotificationBell components and their data hooks (useUserProfileQuery, useNotificationCountQuery).
[📸 VISUAL CHECKPOINT 2]
What to Check: The main application shell on both desktop and mobile. Does the layout switch correctly at the breakpoint? Do the user's name and avatar appear? Does the sidebar collapse?
Goal: Ensure the application's "chrome" is structurally sound before adding detailed styling.
[ ] Task 2.3 (Frontend - Polish): Apply all final styling to the entire AppShell, including the sidebar, header, and bottom tab bar. Implement the smooth collapse/expand animation for the desktop sidebar.

Milestone 3: The Acervo (Archive)

[ ] Task 3.1 (Backend): Create the get-personalized-recommendations and consolidated get-homepage-feed Edge Functions.
[ ] Task 3.2 (Frontend - Structure): Implement the useHomepageFeedQuery hook.
[ ] Task 3.3 (Frontend - Structure): Build the structural components for the homepage modules (FeaturedReview, ReviewCarousel, NextEditionModule). Wire them up to the data hook.
[📸 VISUAL CHECKPOINT 3]
What to Check: The homepage with unstyled but functional modules. Does the featured review appear? Do the carousels receive the correct data? Does the poll work?
Goal: Verify all homepage data is flowing correctly before visual refinement.
[ ] Task 3.4 (Frontend - Polish): Apply final styling to all homepage modules. Implement the horizontal swipe/scroll for the carousels. Ensure all typography and spacing matches the blueprint.


Milestone 4: The Review Reading Experience

[ ] Task 4.1 (Backend): Create the get-acervo-data Edge Function.
[ ] Task 4.2 (Frontend - Structure): Build the TagsPanel, the mobile "Bottom Sheet" adaptation, and the MasonryGrid component.
[ ] Task 4.3 (Frontend - Structure): Implement the client-side sorting logic based on tag selection.
[📸 VISUAL CHECKPOINT 4]
What to Check: The Acervo page functionality. Does the grid render? Does clicking a tag reorder the items correctly (check the developer console network tab to ensure no new API calls are made)?
Goal: Confirm the complex, client-side reordering logic works before polishing the animation.
[ ] Task 4.4 (Frontend - Polish): Implement the smooth, animated reordering of the MasonryGrid using a library like Framer Motion to prevent a jarring experience. Apply final styling to all cards and tags.
  
Milestone 5: The Community Platform

[ ] Task 5.1 (Frontend - Structure): Build the LayoutAwareRenderer and BlockRenderer components. Implement the core recursive logic to render the structured_content.
[ ] Task 5.2 (Frontend - Structure): Implement the logic for collapsible sections and the lazy-loading of the community thread.
[ ] Task 5.3 (Frontend - Structure): Build the RecommendedSection and its data hook.
[📸 VISUAL CHECKPOINT 5]
What to Check: A single Review page. Does the custom layout from the JSON render correctly on both desktop and mobile? Do collapsible sections work? Do the comments lazy-load upon scrolling?
Goal: Ensure the most complex renderer in the application is functionally perfect before styling.


Milestone 6: Practitioner Profiles & Social Features

[ ] Task 6.1 (Backend): Create migrations and RLS policies for all community-related tables.
[ ] Task 6.2 (Backend): Implement the create-community-post, cast-post-vote, and get-community-sidebar-data Edge Functions.
[ ] Task 6.3 (Frontend - Structure): Build the structural components: CommunityFeed, PostCard (with Edit/Delete menu logic), CommunitySidebar, and all its sub-modules.
[ ] Task 6.4 (Frontend - Structure): Implement the hierarchical, on-demand comment fetching logic.
[ ] Task 6.5 (Frontend - Structure): Assemble the /community and /community/[postId] pages.
[📸 VISUAL CHECKPOINT 6]
What to Check: The Community page on desktop. Is the two-column layout correct? Does the sidebar fetch and display its data? Does the feed load? Can you vote and post?
Goal: Verify the most complex user-facing page is functionally complete.
[ ] Task 6.6 (Frontend - Polish): Apply final styling to match the screenshot with extreme fidelity. Ensure proper alignment, spacing, and mobile adaptation (e.g., pinned cards for sidebar modules).
  
\================================================================================

Part III: Building the Admin Application

\================================================================================

Milestone 7: Admin App Foundation & The Editor

[ ] Task 7.1 (Backend): Create the get-user-activity Edge Function and the v_contribution_summary SQL view.
[ ] Task 7.2 (Frontend - Structure): Build the /profile/[id] page and its tabbed layout.
[ ] Task 7.3 (Frontend - Structure): Implement the ProfileHoverCard (desktop) and its long-press mobile equivalent.
[📸 VISUAL CHECKPOINT 7]
What to Check: A user's profile page. Do the activity tabs work? Does the hover/long-press card appear with the correct data?
Goal: Confirm all social features are in place.
[ ] Task 7.4 (Frontend - Polish): Apply final styling to the profile page and the hover card to match the visual design and flair specifications.

Milestone 8: Admin Management Dashboards

[ ] Task 8.1 (Admin Frontend - Structure): Build the core layout for the Admin App (shell, sidebar).
[ ] Task 8.2 (Backend): Implement the upsert-review Edge Function for saving editor content.
[ ] Task 8.3 (Admin Frontend - Structure): [CRITICAL] Implement the full functional logic of the Visual Composition Engine as per [Blueprint] 08a, including the canvas, block palette, inspector panel, and state management.
[📸 VISUAL CHECKPOINT 8]
What to Check: The Admin Editor. Can you create, move, resize, and edit different content blocks? Can you switch between desktop and mobile layouts? Does the "Save" button successfully send the correct JSON payload to the backend?
Goal: This is the most critical checkpoint. The editor must be fully functional before it is styled.
[ ] Task 8.4 (Admin Frontend - Polish): Apply final styling to the entire editor interface to make it a polished and user-friendly tool for the administrative team.


Milestone 9: Moderation & Notification Systems

[ ] Task 10.1 (Backend): Implement the full backend for the Denúncias system and the Notification system as per their blueprints.
[ ] Task 10.2 (Admin Frontend - Structure): Build the Moderation Dashboard UI.
[ ] Task 10.3 (Frontend - Structure): Build the user-facing ReportModal and the /notifications page in the Main App.
[📸 VISUAL CHECKPOINT 10]
What to Check: The end-to-end moderation and notification flow. Can a user submit a report? Does it appear in the admin dashboard? Can an admin action it? Do notifications appear correctly in the main app?
Goal: Verify the complete feedback and safety loops of the platform.
[ ] Task 10.4 (Frontend/Admin - Polish): Apply final styling to the moderation dashboard and the notifications UI.

\================================================================================

Part IV: Finalization

\================================================================================

Milestone 10: Analytics & Deployment

[ ] Task 11.1 (Backend): Implement the full analytics data pipeline (log-event function, Summary_* tables, run-analytics-etl cron job).
[ ] Task 11.2 (Main App): Instrument the front-end with all required logEvent calls.
[ ] Task 11.3 (Admin Frontend - Structure): Build the complete, functional Analytics Dashboard UI, including all charts and the "Playground."
[📸 VISUAL CHECKPOINT 11]
What to Check: The Analytics Dashboard in the Admin App. Is it populated with data? Do the charts render correctly?
Goal: Final verification of the analytics system.
[ ] Task 11.4 (Admin Frontend - Polish): Apply final styling to the Analytics Dashboard.
[ ] Task 11.5 (Ops): Configure production environments and deployment pipelines for both applications.
[ ] Task 11.6 (QA): Conduct final end-to-end testing across the entire platform.

