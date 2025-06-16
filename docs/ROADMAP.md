EVIDENS: Canonical Development Roadmap v2.0
Status: Active | Date: June 16, 2025
Purpose: This document supersedes the previous ROADMAP.md. It provides the complete, granular, and sequenced checklist of development tasks required to build the EVIDENS platform from its current hardened state. It is designed for atomic, verifiable progress and parallel development of administrative features.
Phase I: Foundational Hardening & Quality Assurance (Completed)

Rationale: This phase officially documents the work completed during our recent diagnostic sessions. It establishes a stable, secure, and performant baseline for all future development.

  Milestone 11: System-Wide Hardening (Completed)
* Task 11.1: Resolved critical CORS and database errors preventing the /acervo page from functioning.
* Task 11.2: Created and applied all missing database migrations for Tags, ReviewTags, and rate_limit_log.
* Task 11.3: Applied all performance and security optimizations recommended by the Supabase Linter, including adding indexes and cleaning up policies.
* Task 11.4: Confirmed all user-facing Edge Functions are properly rate-limited.
* Verification: ✅ The application is fully functional in its current state. The /acervo page now loads correctly.

  
Phase II: Core Content & Community Implementation

Rationale: With a stable foundation, this phase focuses on building the core user experience. We will transform the existing placeholder pages into fully functional, data-driven features, starting with the most critical aspect of the platform: viewing content.
Milestone 12: The Review Detail Page (The Reading Experience)
Objective: To enable users to view the rich, custom-layout content of a Review, fulfilling the core promise of the platform.
* Task 12.1: Implement Backend Data Fetching
   * Action: Create the useReviewQuery custom hook. This hook will use TanStack Query's useQuery to fetch a single review from the Reviews table by its slug or ID, joining the author's information from the Practitioners table.
   * Rationale: As per [DOC_6], all data fetching must be encapsulated in a dedicated hook. This ensures caching and a clean separation of concerns.
   * Blueprint Compliance: [Blueprint] 05, Section 4.0.
   * Verification: The hook can be called with a review ID and successfully returns the correct review object, including the structured_content JSON.

  * Task 12.2: Build the Core Rendering Engine
   * Action: Create the LayoutAwareRenderer.js and BlockRenderer.js components. Implement the initial block types: TextBlock.js and HeadingBlock.js. Wire this up to a new /reviews/[slug] page.
   * Rationale: This is the heart of the platform's content display. Building the renderer allows us to translate the abstract JSON from the database into the visually rich, custom layouts that define the EVIDENS brand.
   * Blueprint Compliance: [Blueprint] 05, Section 3.0.
   * Technical Implementation Details:
      1. The LayoutAwareRenderer will use the useIsMobile() hook to select either the desktop or mobile layout array from the structured_content prop.
      2. It will render a CSS Grid container and iterate over the nodes, passing each node and its corresponding layout object to the BlockRenderer.
      3. The BlockRenderer will use a switch statement on node.type to render the correct component (e.g., TextBlock) and apply the grid positioning styles from the layout prop.
   * Verification (Visual Checkpoint): You can navigate to a URL like /reviews/1. A simple review with only text and headings renders on the page, with elements positioned correctly according to the layout defined in the database for both desktop and mobile views. The layout should be unstyled but structurally correct.

  * Task 12.3: Implement Advanced Blocks & Interactivity
   * Action: Build out the remaining block components (ImageBlock.js, DiagramBlock.js). Implement the state and logic for collapsible sections within the HeadingBlock.js component.
   * Rationale: This completes the content rendering engine, making it capable of displaying all content types from the editor.
   * Blueprint Compliance: [Blueprint] 05, Sections 2.3 & 4.1.
   * Verification (Visual Checkpoint): A complex review page containing images, diagrams, and collapsible headings renders perfectly. The collapsible sections expand and collapse correctly on click.

  * Task 12.4: Implement Lazy-Loaded Comments & Recommendations
   * Action: Create the useCommunityThreadQuery hook (using useInfiniteQuery) and the useRecommendationsQuery hook. Use an intersection observer to trigger the fetching of the community thread only when the user scrolls it into view.
   * Rationale: As per the blueprint, the comments section must be lazy-loaded to ensure the initial page load for the review itself is as fast as possible.
   * Blueprint Compliance: [Blueprint] 05, Section 4.0.
   * Verification (Visual Checkpoint): The Review Detail Page loads instantly. The comments section initially shows a skeleton loader. When you scroll down, a network request is fired, and the comments are then rendered. The "Leituras recomendadas" section also populates correctly.


  Milestone 13: The Community Platform
Objective: To activate the "scientific Reddit" functionality, allowing users to create and interact with discussion posts.

  * Task 13.1: Implement Backend for Community
   * Action: Create the get-community-feed and get-community-sidebar-data Edge Functions. Define and implement a clear rate limit for each.
   * Rationale: These consolidated endpoints are essential for providing a performant experience on the community pages, as they prevent "chatty" API behavior.
   * Blueprint Compliance: [Blueprint] 06, Section 4.0.
   * Verification: The Edge Functions can be called with appropriate parameters (e.g., pagination cursor) and return the correctly shaped JSON data. The endpoints are protected by rate limiting.

  * Task 13.2: Build the Community Page UI
   * Action: Build the CommunityPage.js, CommunityFeed.js, and CommunitySidebar.js components. Implement the two-column desktop layout and the single-column mobile layout with pinned cards.
   * Rationale: This builds the main user interface for community interaction, fulfilling a core part of the platform's vision.
   * Blueprint Compliance: [Blueprint] 06, Section 3.0.
   * Verification (Visual Checkpoint): Navigating to /comunidade displays the correct layout on both desktop and mobile. The feed infinitely scrolls, and the sidebar (on desktop) or pinned cards (on mobile) are populated with data from the backend. The page is read-only at this stage.

  * Task 13.3: Implement Community Post & Vote Mutations
   * Action: Create the useCreatePostMutation and useCastVoteMutation hooks. Wire them up to the UI to enable posting new discussions and upvoting/downvoting comments.
   * Rationale: This task makes the community interactive, transforming it from a read-only feed into a dynamic platform for engagement.
   * Blueprint Compliance: [Blueprint] 06, [DOC_5], [DOC_6].
   * Technical Implementation Details: The useCastVoteMutation should implement an optimistic update on the UI, as seen in the existing useCastVoteMutation for suggestions, to make voting feel instantaneous.
   * Verification (Visual Checkpoint): A logged-in user can create a new post, and it appears in the feed. Users can upvote and downvote posts and comments, and the scores update correctly.

                                                  
                                                  
Phase III: Administrative Tooling & Governance

Rationale: Following the "Parallel, Feature-Centric" development strategy, now that we have core content and community features, we will build the administrative tools required to manage and govern them. This phase is executed within the main application via protected routes.
Milestone 14: Content Management (The Visual Editor)
Objective: To empower administrators to create and edit Reviews using the "Figma-like" Visual Composition Engine.

  * Task 14.1: Implement Editor Foundation
   * Action: Create the protected routes for /editor and /editor/:reviewId. Build the main EditorShell.js component and the useEditorStore Zustand store.
   * Rationale: This sets up the foundational plumbing for the entire content editing experience.
   * Blueprint Compliance: [Blueprint] 08a_EDITOR_BLUEPRINT_VITE.md.
   * Verification: Navigating to /editor as a non-admin redirects to /unauthorized. Navigating as an admin displays a blank shell, and the Zustand store is visible in React DevTools.

  * Task 14.2: Build the Core Editor Canvas & Tools
   * Action: Build the three-panel editor layout: BlockPalette.js, EditorCanvas.js (using React Flow), and InspectorPanel.js. Implement the drag-and-drop functionality for adding new blocks from the palette to the canvas.
   * Rationale: This is the most complex single task in the project and creates the core interactive editing experience.
   * Blueprint Compliance: [Blueprint] 08a.
   * Verification (Visual Checkpoint): As an admin, you can drag blocks from the left panel onto the canvas. You can select, move, and resize these blocks. Selecting a block shows its properties in the right-hand inspector panel. The state is not yet saved.

  * Task 14.3: Implement Content Editing and Persistence
   * Action: Integrate Tiptap for rich text editing within the TextBlockNode. Build the upsert-review Edge Function and the useAutoSave hook to periodically save the editor's state to the database.
   * Rationale: This makes the editor fully functional, allowing for the actual modification of content and ensuring that work is not lost.
   * Blueprint Compliance: [Blueprint] 08a.
   * Verification (Visual Checkpoint): You can edit the text within a text block. After a short delay, a "Saving..." indicator appears, and a network request is sent to the upsert-review function. Reloading the page shows the saved content.

  Milestone 15: Community Management (Moderation)
Objective: To provide admins with the tools to handle user-generated reports and maintain community health.

  * Task 15.1: Implement Backend for Moderation
   * Action: Create the Reports table via a new migration. Implement the submit-report, get-reports, and action-report Edge Functions, each with appropriate rate limits and security.
   * Rationale: Builds the secure backend infrastructure required for the entire moderation workflow.
   * Blueprint Compliance: [Blueprint] 08c_MODERATION_BLUEPRINT.md.
   * Verification: The Edge Functions are created and testable.

  * Task 15.2: Build User-Facing Reporting UI
   * Action: Build the ReportModal.js component and wire it up to the "more options" menu on community posts and comments. Implement the useSubmitReportMutation hook.
   * Rationale: This empowers the community to flag inappropriate content, which is the first step in any moderation system.
   * Verification (Visual Checkpoint): A user can click the three-dot menu on a post, select "Denunciar," fill out the modal, and submit a report. A success toast appears.

  * Task 15.3: Build the Admin Moderation Dashboard
   * Action: Build the /admin/moderation page. This includes the two-column layout with the ReportQueue.js on the left and the ReportDetailPanel.js on the right. Implement the useReportsQuery and useActionReportMutation hooks.
   * Rationale: This completes the moderation loop, giving admins the power to view and act upon user reports.
   * Blueprint Compliance: [Blueprint] 08c.
   * Verification (Visual Checkpoint): As an admin, navigating to /admin/moderation shows a list of pending reports. Clicking a report displays its full details. Clicking "Dismiss Report" or "Delete Content" correctly actions the report and removes it from the pending queue.

  
  
  Phase IV: Advanced Systems & Platform Maturity

Rationale: With the core content and community loops established and manageable, this phase focuses on building out the systems that create a richer, more engaging, and data-informed platform.
Milestone 16: Profile & Notification Systems
Objective: To complete the user-centric features, making the platform feel more personalized and responsive.

  * Task 16.1: Complete the User Profile Page
   * Action: Fully implement the features on the /perfil page, including the SavedList and Contribution tabs. This requires creating the Saved_Items table and the v_contribution_summary SQL view.
   * Rationale: This enriches the user profile from a placeholder into a functional hub for personal activity.
   * Blueprint Compliance: [Blueprint] 07_PROFILE_BLUEPRINT.md.
   * Verification (Visual Checkpoint): A user's profile page correctly displays their activity, saved items, and contribution stats.

  * Task 16.2: Implement the Full Notification System
   * Action: Update all relevant Edge Functions (create-community-post, etc.) to insert records into the Notifications table. Build the NotificationPopover and the full /notifications page. Implement the "mark all as read" mutation.
   * Rationale: This activates the platform's re-engagement engine, bringing users back to the site for relevant events.
   * Blueprint Compliance: [Blueprint] 10_NOTIFICATIONS_BLUEPRINT.md.
   * Verification (Visual Checkpoint): Performing actions like commenting triggers a notification badge on the bell icon. The popover shows recent notifications, and the /notifications page shows a full history.
Milestone 17: Admin Management Dashboards
Objective: To provide admins with comprehensive control over the platform's users, taxonomy, and layouts.

  * Task 17.1: Build User and Tag Management Dashboards
   * Action: Create the /admin/users and /admin/tags pages. Implement the user table with role-changing functionality and the drag-and-drop tag hierarchy editor.
   * Rationale: Gives admins crucial control over user permissions and the platform's core content taxonomy.
   * Blueprint Compliance: [Blueprint] 08b_MANAGEMENT_BLUEPRINTS.md.
   * Verification (Visual Checkpoint): Admins can view and search for users, change their roles, and visually reorganize the entire tag structure.

  * Task 17.2: Build Layout Management Dashboard
   * Action: Create the /admin/layout page with its tabbed interface for managing the Homepage and Community Sidebar layouts. Implement the update-site-settings Edge Function.
   * Rationale: Decouples the visual layout of key pages from the codebase, allowing for dynamic changes without a new deployment.
   * Blueprint Compliance: [Blueprint] 08b.
   * Verification (Visual Checkpoint): An admin can drag and drop to reorder modules on the homepage, save the changes, and see the live homepage update immediately.

  
  
Phase V: Finalization & Launch Readiness
Rationale: The final phase focuses on implementing the analytics pipeline and conducting the final QA necessary for a confident launch.
Milestone 18: Analytics & Final Polish

  * Task 18.1: Implement the Analytics Pipeline
   * Action: Create the Analytics_Events and Summary_* tables. Implement the log-event ingestion function and the run-analytics-etl scheduled cron job. Instrument the main application to call log-event on all key user actions.
   * Rationale: Builds the data foundation for all platform metrics. This is a background task with no immediate UI impact but is critical for long-term business intelligence.
   * Blueprint Compliance: [Blueprint] 09_ANALYTICS_BLUEPRINT.md.
   * Verification: User actions in the main app create corresponding entries in the Analytics_Events table. The cron job runs successfully and populates the Summary_* tables.

  * Task 18.2: Build the Analytics Dashboard
   * Action: Build the /admin/analytics page, including the KPI cards, charts, and the custom query "Playground."
   * Rationale: Provides the administrative team with the tools to monitor platform health and user engagement.
   * Blueprint Compliance: [Blueprint] 09.
   * Verification (Visual Checkpoint): The analytics dashboard loads and displays charts and metrics based on the data in the summary tables.

  * Task 18.3: Final Quality Assurance & Documentation Review
   * Action: Conduct a full, end-to-end regression test of the entire platform on all target devices. Perform a final review of all documentation and update README-BÍBLIA.md to reflect the "Launch Ready" state.
   * Rationale: Ensures the platform is stable, polished, and ready for public launch.
   * Verification: The platform is declared launch-ready.