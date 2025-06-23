
// ABOUTME: Main application router with all route definitions including admin protected routes
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AppShell from "@/components/shell/AppShell";
import Index from "@/pages/Index";
import CommunityPage from "@/pages/CommunityPage";
import ArchivePage from "@/pages/ArchivePage";
import ReviewDetailPage from "@/pages/ReviewDetailPage";
import ErrorBoundary from "@/components/ErrorBoundary";
import CommunityPostDetail from "@/pages/CommunityPostDetail";
import SavePost from "@/components/community/SavePost";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import SuggestionPage from "@/pages/SuggestionPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import LoginPage from "@/pages/LoginPage";
import { AdminProtectedRoute } from '@/components/routes/AdminProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/pages/AdminDashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: (
      <ErrorBoundary 
        tier="root"
        context="aplicação completa"
        showDetails={process.env.NODE_ENV === 'development'}
        showHomeButton={false}
        showBackButton={false}
      />
    ),
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
      {
        path: "community/:postId",
        element: <CommunityPostDetail />,
      },
      {
        path: "archive",
        element: <ArchivePage />,
      },
      {
        path: "reviews/:reviewSlug",
        element: <ReviewDetailPage />,
      },
      {
        path: "profile/:userId",
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "suggestions",
        element: <SuggestionPage />,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      
      // Admin Routes
      {
        path: "/admin",
        element: (
          <AdminProtectedRoute requiredRoles={['admin', 'editor']}>
            <AdminLayout />
          </AdminProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          // Placeholder routes for future implementation
          {
            path: "content",
            element: <div className="p-6 text-center text-gray-500">Gestão de Conteúdo - Em desenvolvimento</div>,
          },
          {
            path: "users", 
            element: <div className="p-6 text-center text-gray-500">Gestão de Usuários - Em desenvolvimento</div>,
          },
          {
            path: "tags",
            element: <div className="p-6 text-center text-gray-500">Gestão de Tags - Em desenvolvimento</div>,
          },
          {
            path: "layout",
            element: <div className="p-6 text-center text-gray-500">Gestão de Layout - Em desenvolvimento</div>,
          },
          {
            path: "analytics",
            element: <div className="p-6 text-center text-gray-500">Analytics - Em desenvolvimento</div>,
          },
        ],
      },
    ],
  },
  {
    path: "/save-post",
    element: <SavePost />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
