[Blueprint] 08b: Management Dashboards
Version: 1.0
Date: June 14, 2025
Purpose: This document provides the canonical blueprint for the core management interfaces within the EVIDENS Admin Application. It details the functionality for managing Users, Tags, and the dynamic layouts of the Homepage and Community Sidebar.

================================================================================
1.0. Core Principles & User Experience
================================================================================

1.1. Feature Goal
To empower administrators with intuitive, powerful, and error-proof tools to manage the platform's users, content taxonomy, and dynamic layouts without requiring developer intervention for routine tasks.

1.2. Core User Stories
*   "As an Admin, I want to view a list of all users, search for a specific user, and change their role or subscription tier with a single click."
*   "As an Editor, I want a visual, drag-and-drop interface to create, rename, delete, and re-organize the entire tag hierarchy (categorias and subtags)."
*   "As an Admin, I want to change the order of sections on the homepage and toggle their visibility for all users."
*   "As an Admin, I want to edit the community rules and useful links that appear in the community sidebar."

================================================================================
2.0. Feature 1: User Management
================================================================================

2.1. Visual & Interaction Blueprint
*   Layout: A full-page view within the Admin App. It consists of a header with summary statistics and a main table listing all users.
*   Header: Displays two KPI cards: "Total Users" and "Total Admins." A "Search" input allows filtering the user list.
*   User Table: A table view with columns for `Avatar`, `Full Name`, `Email`, `Role`, `Subscription Tier`, and `Actions`.
*   Interaction:
    *   An admin can click a "Make Admin" or "Revoke Admin" button in the `Actions` column.
    *   A dropdown menu in the `Subscription Tier` column allows changing a user's tier.
    *   All actions should trigger a confirmation modal before executing.

2.2. Backend & Data Flow
*   Data Fetch: The page uses a `useUsersQuery` hook to fetch a paginated list of all users from the `Practitioners` table.
*   Mutations: Dedicated Edge Functions, `change-user-role` and `change-user-tier`, will be used. These functions must require `admin` privileges and will be responsible for updating the user's record and their JWT custom claims.

================================================================================
3.0. Feature 2: Tag Management
================================================================================

3.1. Visual & Interaction Blueprint
*   Layout: A two-panel layout. The left panel shows the interactive tag tree, and the right panel is a preview of how the tags will appear in the Acervo.
*   Tag Tree:
    *   This is the primary interface. It displays all `Tags` in a nested, hierarchical list.
    *   An "Add Categoria" button at the top level. Each `categoria` has an "Add Subtag" button.
*   Interaction:
    *   Drag and Drop: Users can drag any tag (categoria or subtag) and drop it onto another categoria to re-parent it.
    *   Inline Editing: Double-clicking a tag's name turns it into an input field for renaming.
    *   Deletion: Each tag has a delete icon (with a confirmation step).

3.2. Backend & Data Flow
*   Data Fetch: A single `useTagHierarchyQuery` fetches the entire `Tags` table. The hierarchy is constructed on the client.
*   Mutations: Dedicated Edge Functions (`create-tag`, `update-tag-name`, `update-tag-parent`, `delete-tag`) will handle all modifications to the `Tags` table. This is safer than direct database writes.

================================================================================
4.0. Feature 3: Layout Management (Homepage & Community Sidebar)
================================================================================

4.1. Visual & Interaction Blueprint
*   Layout: A tabbed interface with tabs for "Homepage" and "Community Sidebar."
*   Homepage Tab:
    *   Displays a list of all potential homepage modules (Featured, Recent, Popular, etc.).
    *   Each list item has a visibility toggle (eye icon) and drag handles for reordering.
    *   A "Save Layout" button persists the changes.
*   Community Sidebar Tab:
    *   Contains sub-sections for editing different parts of the sidebar.
    *   "Rules" and "Links": A dynamic list where an admin can add, edit, reorder, and delete rules/links.
    *   "Featured Poll": A dropdown menu to select which active `CommunityPost` with a poll should be featured.

4.2. Backend & Data Flow
*   Data Source: All layout and configuration data is stored in the `Site_Settings` table as a single JSONB object for each key (e.g., key: `homepage_layout`, key: `community_sidebar_settings`).
*   Data Fetch: The page fetches the initial settings from the `Site_Settings` table.
*   Saving: The "Save" button makes a single API call to an Edge Function (`update-site-settings`) that takes the entire updated JSON object and overwrites the value in the database. This atomic update is safer than patching individual fields.

================================================================================
5.0. Implementation Checklist
================================================================================

1.  [ ] **User Management:** Build the user list UI, search functionality, and the `change-user-role`/`change-user-tier` Edge Functions.
2.  [ ] **Tag Management:** Build the interactive tree component using a library like `react-beautiful-dnd` or similar. Implement all aysnc tag mutation functions.
3.  [ ] **Layout Management:** Build the tabbed interface. Implement the draggable list for the homepage layout. Implement the forms for editing the community sidebar content.
4.  [ ] **Backend (Settings):** Create the `update-site-settings` Edge Function for atomic updates.
5.  [ ] **Integration:** Ensure all admin UIs are protected by role-based access control, allowing only `admin` or `editor` roles to access them.


