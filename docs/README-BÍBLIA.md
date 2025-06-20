# Evidens AI-Powered App - README BÍBLIA

## 📖 Overview
This document serves as the central source of truth for the Evidens application, an AI-powered platform designed to revolutionize how users discover, review, and interact with content. It outlines the system architecture, key components, data flow, and coding standards to ensure consistency and maintainability across the project.

## 🏛️ System Architecture
The Evidens app follows a modular, microservices-inspired architecture, leveraging the power of Supabase for backend services and React for a dynamic frontend experience.

### 🧱 Core Components
1. **Frontend (React):** User interface built with React, TypeScript, and Tailwind CSS.
2. **Backend (Supabase):** Database, authentication, and serverless functions.
3. **Edge Functions:** Serverless functions for handling specific tasks like content creation, voting, and moderation.
4. **Realtime Server:** Supabase Realtime for live updates and notifications.
5. **Storage:** Supabase Storage for media assets.

### 🔄 Data Flow
1. User interacts with the React frontend.
2. Frontend makes API requests to Supabase Edge Functions or directly to the database.
3. Edge Functions perform business logic and interact with the database.
4. Supabase Realtime pushes updates to the frontend for real-time experiences.

## 🗂️ Database Schema
The database schema is designed to be flexible and scalable, with a focus on relational data and JSONB columns for unstructured data.

### 📜 Key Tables
1. **Practitioners:** User profiles and authentication data.
2. **Reviews:** Content reviews with detailed metadata.
3. **CommunityPosts:** Community discussions, comments, and polls.
4. **AcervoItems:** Curated collection of content items.
5. **Notifications:** User-specific notifications and alerts.

## 🔑 Row Level Security (RLS)
Row Level Security is implemented on all tables to ensure data privacy and security. Policies are defined to restrict access based on user roles and permissions.

### 🛡️ RLS Policies
1. **Practitioners:** Users can only access their own profile data.
2. **Reviews:** Publicly accessible, but modifications are restricted to authors and admins.
3. **CommunityPosts:** Access controlled based on post visibility and user roles.
4. **AcervoItems:** Publicly accessible, but modifications are restricted to admins.
5. **Notifications:** Users can only access their own notifications.

## 📡 API Contract
The API contract defines the structure and behavior of all API endpoints, ensuring consistency and predictability across the system.

### ⚙️ API Endpoints
1. **/api/reviews:** CRUD operations for content reviews.
2. **/api/community:** Endpoints for managing community discussions and comments.
3. **/api/acervo:** Endpoints for accessing and managing the curated content collection.
4. **/api/notifications:** Endpoints for managing user notifications.
5. **/api/auth:** Authentication and authorization endpoints.

## 🧮 Data Fetching Strategy
The data fetching strategy prioritizes performance and user experience, leveraging TanStack Query for caching, optimistic updates, and background refetching.

### ⚡️ TanStack Query
1. **Caching:** Data is cached on the client-side to reduce network requests.
2. **Optimistic Updates:** UI is updated immediately, even before the API request completes.
3. **Background Refetching:** Data is automatically refetched in the background to keep the UI up-to-date.
4. **Prefetching:** Data is prefetched before the user navigates to a new page.

## 🎨 Visual System
The visual system is based on Tailwind CSS and a custom theme, ensuring a consistent and modern look and feel across the application.

### 🌈 Tailwind CSS
1. **Utility-First:** CSS classes are used to apply styles directly in the HTML.
2. **Responsive Design:** Styles are adapted to different screen sizes using media queries.
3. **Custom Theme:** A custom theme is defined to ensure consistency across the application.

## 📱 Mobile Adaptation
The application is designed to be responsive and adapt to different screen sizes, providing a seamless user experience on both desktop and mobile devices.

### 📐 Responsive Design
1. **Mobile-First:** The application is designed for mobile devices first, and then adapted to larger screen sizes.
2. **Media Queries:** CSS media queries are used to apply different styles based on screen size.
3. **Flexible Layout:** The layout is designed to be flexible and adapt to different screen sizes.

## 🛡️ Error Handling
Robust error handling is implemented throughout the application to provide a graceful user experience and prevent unexpected crashes.

### 🐞 Error Boundaries
1. **Hierarchical Error Boundaries:** Error boundaries are placed at different levels of the component tree to catch errors and prevent them from propagating to the entire application.
2. **Custom Error Fallbacks:** Custom error fallbacks are displayed to the user when an error occurs, providing helpful information and options for recovery.
3. **Centralized Error Logging:** Errors are logged to a central location for monitoring and analysis.

## 🧪 Testing Strategy
A comprehensive testing strategy is implemented to ensure the quality and reliability of the application.

### 🛠️ Testing Frameworks
1. **Jest:** JavaScript testing framework for unit and integration tests.
2. **React Testing Library:** Testing library for React components.
3. **Cypress:** End-to-end testing framework for testing the entire application.

## 🚀 Implementation Status

### ✅ Phase 1: Database Foundation (COMPLETED)
- [x] **Migration 1**: Added `is_rewarded` column to CommunityPosts table
- [x] **Migration 2**: Created `get_comments_for_post` RPC function with recursive CTE
- [x] **Migration 3**: Updated `create_post_and_auto_vote` RPC to support parent_post_id

### ✅ Phase 2: Backend Edge Functions (COMPLETED)
- [x] **Enhanced create-community-post**: Now supports comment creation via parent_post_id
- [x] **New reward-content function**: Admin-only endpoint for rewarding exceptional content
- [x] **RPC Updates**: All database functions updated to handle comment hierarchy

### ✅ Phase 3: Frontend Implementation (COMPLETED)
- [x] **Data Access Layer**: Created specialized hooks following [DAL.1]
  - `usePostWithCommentsQuery`: Fetches post + complete comment tree
  - `useCreateCommentMutation`: Handles comment creation with cache invalidation
  - `useRewardContentMutation`: Admin-only content rewarding
- [x] **UI Components**: Built recursive comment system
  - `Comment.tsx`: Individual comment display with nesting support
  - `CommentEditor.tsx`: Rich text comment creation form
  - `CommentThread.tsx`: Recursive comment tree renderer
- [x] **Integration**: Updated CommunityPostPage.tsx with full commenting system

### 🔧 Phase 4: Critical Infrastructure Fixes (IN PROGRESS)
- [x] **React Hook Context Fix**: Resolved "Cannot read properties of null (reading 'useEffect')" error
  - Fixed QueryClient instantiation in AppProviders.tsx
  - Stabilized provider hierarchy to prevent re-creation
  - Enhanced error handling in query defaults
  - Moved StrictMode to proper location in App.tsx
  - Added root element validation in main.tsx

### 📊 Current System Health
- **Database**: ✅ All migrations applied successfully
- **Backend**: ✅ All Edge Functions operational
- **Frontend**: ✅ All components implemented
- **React Context**: ✅ Hook system stabilized
- **Error Boundaries**: ✅ Hierarchical protection active

### 🎯 Next Steps
1. **Testing Phase**: Comprehensive testing of comment creation, nesting, and rewards
2. **Performance Optimization**: Implement lazy loading for deep comment threads
3. **Moderation Tools**: Extend admin capabilities for comment management
4. **Analytics Integration**: Track engagement metrics for commenting system

## 📜 Change Log
- **Version 0.1.0 (Initial Release):** Basic application structure and core components.
- **Version 0.2.0 (Community Features):** Implemented community discussions and commenting system.
- **Version 0.2.1 (Critical Infrastructure Fix):** Resolved React hook context error and stabilized provider hierarchy.

## 📝 Notes
- This document is a living document and will be updated as the application evolves.
- All code must adhere to the coding standards outlined in this document.
- All changes must be reviewed and approved by a senior developer.
