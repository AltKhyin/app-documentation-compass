# **\[Blueprint\] 02: Main Application Shell**

Version: 1.0  
Date: June 14, 2025  
Purpose: This document provides the canonical, feature-specific blueprint for the main application shell of the EVIDENS platform. It defines the persistent navigation, layout, and identity components that frame all user-facing content. This blueprint is the single source of truth for the application's core structure and ergonomics.

## **1.0 Core Principles & User Experience**

### **1.1 Feature Goal**

To provide a consistent, intuitive, ergonomic, and aesthetically pleasing application frame that gives users a constant sense of place and provides immediate access to core features, while adapting perfectly to both desktop and mobile contexts. The shell must embody the "editorial feel" of the brand through its clean structure and typography.

### **1.2 Core User Stories**

* **Story:** As a Practitioner, I want to be able to seamlessly navigate between the main sections of the platform (Home, Acervo, Community, Profile) from any page.  
* **Story:** As a Practitioner on a desktop computer, I want the ability to collapse the main navigation sidebar to maximize my screen real estate for reading content.  
* **Story:** As a Practitioner on a mobile device, I want all primary navigation actions to be comfortably within reach of my thumb for easy one-handed use.  
* **Story:** As an authenticated user, I want to see my identity (name and avatar) clearly represented in the main navigation and have a clear path to log out.  
* **Story:** As a user, I want to see at a glance if I have new notifications, regardless of which page I am on.

### **1.3 Guiding Constitutional Documents**

* **Visuals & Styling:** All components defined in this blueprint MUST strictly adhere to the rules and tokens defined in **\[DOC\_7\]\_VISUAL\_SYSTEM.md**.  
* **Mobile Adaptation:** The transformation from desktop to mobile layouts MUST follow the principles and specific rules laid out in **\[DOC\_8\]\_MOBILE\_ADAPTATION.md**.

## **2.0 Visual & Interaction Blueprint**

This section defines the precise look, feel, and behavior of the application shell across different viewports.

### **2.1 Desktop View (\>= 1024px)**

* **Layout:** A persistent, two-column layout.  
  * **Left Column (CollapsibleSidebar):** Fixed width of 240px. When collapsed, it shrinks to 80px. It is always present on screen.  
  * **Right Column (Main Content Area):** Occupies the remaining screen width. This is where the content of each page (/, /acervo, etc.) is rendered.  
* **Components & Behavior:**  
  * **CollapsibleSidebar:**  
    * **Appearance:** Styled with bg-background, it contains the "Reviews." logotype at the top, followed by a list of NavItem components, and a user profile/logout section at the bottom.  
    * **Navigation Items:** Each NavItem consists of an icon and a text label. The currently active NavItem is styled differently (e.g., with bg-secondary) to indicate the user's location.  
    * **Collapse Interaction:** A dedicated "Esconder" (Hide) button with a chevron icon is present at the bottom of the sidebar.  
      * Clicking this button smoothly transitions the sidebar width from 240px to 80px. The transition for the width property should use an ease-in-out timing function over 200ms.  
      * In the collapsed state, the text labels for NavItems disappear, leaving only the icons. The main logotype is replaced with a smaller logomark. The collapse button's icon flips to indicate it will expand.  
  * **Header:** The header area above the main content is minimal, perhaps only containing the title of the current page. The primary branding and navigation are owned by the sidebar.

### **2.2 Mobile View (\< 1024px)**

* **Layout:** A single-column layout. The two-column desktop structure is completely replaced.  
* **RULE:** The CollapsibleSidebar component **IS NOT RENDERED** on mobile viewports.  
* **Components & Behavior:**  
  * **Header:** The mobile header is more prominent. It is fixed to the top of the viewport. It contains the "Reviews." logotype on the left and a NotificationBell icon button on the right.  
  * **BottomTabBar:**  
    * **Appearance:** A bar fixed to the bottom of the viewport, styled with bg-card to give it slight separation from the page content. It contains 4-5 NavItem components.  
    * **Ergonomics:** This is the primary navigation mechanism on mobile. Each NavItem is an icon paired with a text label, with generous tap targets (minimum 44px height).  
    * **Active State:** The currently active NavItem is clearly indicated with a different color for its icon and label (e.g., text-primary), as per \[DOC\_7\].  
  * **Main Content Area:** Occupies the full width and height between the Header and the BottomTabBar.

## **3.0 Front-End Architecture**

### **3.1 Component Breakdown & Contracts**

| Component Name | Type | Props Contract | State Management | Responsibilities |
| :---- | :---- | :---- | :---- | :---- |
| AppShell.js | Layout Controller | { children: ReactNode } | Manages isSidebarCollapsed state, subscribes to global auth state and viewport size. | The root layout component. Renders either DesktopShell or MobileShell based on viewport. Provides global state context to children. |
| DesktopShell.js | Layout | { children, isSidebarCollapsed, onToggleSidebar } | None | Renders the two-column grid layout for desktop. Renders the CollapsibleSidebar and the main content area. |
| MobileShell.js | Layout | { children } | None | Renders the single-column flex layout for mobile. Renders the Header, BottomTabBar, and the main content area. |
| CollapsibleSidebar.js | Module | { isCollapsed: boolean, onToggle: () \=\> void } | Consumes useRouter to determine active path. | Displays logotype, list of NavItems, and user profile block. Handles the collapse/expand action. |
| BottomTabBar.js | Module | () | Consumes useRouter to determine active path. | Displays a list of NavItems fixed to the bottom of the screen. |
| NavItem.js | Atomic | { href: string, icon: ReactElement, label: string } | Consumes useRouter to determine if isActive. | A reusable link component. Renders an icon and label. Applies active styling based on the current route. |
| Header.js | Module | () | None | Renders the top bar. On mobile, contains the logotype and secondary actions. |
| NotificationBell.js | Atomic | () | Consumes useNotificationCountQuery. | Displays a bell icon. Shows a badge if unreadCount \> 0\. |
| UserProfileBlock.js | Atomic | () | Consumes useUserProfileQuery and global auth state. | Displays the user's avatar and name in the sidebar. Provides a logout action. Shows a loading skeleton initially. |

### **3.2 State Management & Data Flow**

* **Viewport Detection:** The AppShell component will use a custom hook (e.g., useBreakpoint) to listen to window resize events and determine if the current viewport matches the desktop breakpoint (1024px).  
* **Sidebar State:** The isSidebarCollapsed boolean state will be managed via useState within the top-level AppShell.js component and passed down as props to DesktopShell and CollapsibleSidebar.  
* **Authentication State:** The global Zustand store (or similar), which subscribes to supabase.auth.onAuthStateChange, will provide the session and practitioner objects. The AppShell will consume this to conditionally render elements like the UserProfileBlock.  
* **Active Route State:** There is no need for a dedicated state variable. The NavItem component will derive its isActive status directly by comparing its href prop to the pathname from Next.js's useRouter() hook.

## **4.0 Backend Architecture & Data Flow**

### **4.1 Data Requirements**

The application shell itself has minimal but important data requirements to personalize the experience.

* **User Profile Data:** To display the user's name and avatar in the UserProfileBlock (desktop sidebar).  
* **Notification Count:** To display the notification badge on the NotificationBell.

### **4.2 Data-Fetching Hooks**

* **RULE:** The shell components must use the following dedicated hooks, which must adhere to the patterns in \[DOC\_6\]\_DATA\_FETCHING\_STRATEGY.md.  
  * useUserProfileQuery(): Fetches the profile data for the currently authenticated user.  
  * useNotificationCountQuery(): Fetches the count of unread notifications for the current user.

### **4.3 Relevant Database Tables & RLS**

* **Tables Involved:** Practitioners, Notifications.  
* **RLS Policies:** The RLS policies for Practitioners (users can only read their own profile) and Notifications (users can only read their own notifications), as defined in \[DOC\_4\], are critical for securing the data fetched by the shell.

## **5.0 Implementation Checklist**

### **Backend & Foundation (Dependencies)**

* \[ \] **Task 1.1:** Ensure the API endpoints to fetch the current user's profile and notification count are implemented.  
* \[ \] **Task 1.2:** Ensure the RLS policies for the Practitioners and Notifications tables are active.

### **Frontend (Atomic Components First)**

* \[ \] **Task 2.1:** Build the NavItem.js component, including its active/inactive visual states.  
* \[ \] **Task 2.2:** Build the NotificationBell.js component and its data hook.  
* \[ \] **Task 2.3:** Build the UserProfileBlock.js component and its data hook, including loading/skeleton states.

### **Frontend (Module Assembly)**

* \[ \] **Task 3.1:** Build the Header.js component.  
* \[ \] **Task 3.2:** Build the CollapsibleSidebar.js module, composing NavItem and UserProfileBlock. Implement the collapse/expand transition.  
* \[ \] **Task 3.3:** Build the BottomTabBar.js module, composing NavItem components.

### **Frontend (Final Orchestration)**

* \[ \] **Task 4.1:** Build the DesktopShell.js component, arranging the CollapsibleSidebar and the main content area in a grid.  
* \[ \] **Task 4.2:** Build the MobileShell.js component, arranging the Header, BottomTabBar, and main content area in a flex column.  
* \[ \] **Task 4.3:** Build the main AppShell.js controller, including the useBreakpoint hook logic to switch between the desktop and mobile shells.  
* \[ \] **Task 4.4:** Integrate the AppShell as the root layout in \_app.tsx, wrapping all page content.  
* \[ \] **Task 4.5:** Conduct thorough responsive testing to ensure seamless transition and pixel-perfect rendering at the 1024px breakpoint.