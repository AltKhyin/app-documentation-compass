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
import ContentManagement from '@/pages/ContentManagement';

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
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro na Aplicação</h1>
            <p className="text-gray-600">Ocorreu um erro inesperado. Recarregue a página.</p>
          </div>
        </div>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "comunidade",
        element: <CommunityPage />,
      },
      {
        path: "comunidade/:postId",
        element: <CommunityPostDetail />,
      },
      {
        path: "acervo",
        element: <ArchivePage />,
      },
      {
        path: "reviews/:reviewSlug",
        element: <ReviewDetailPage />,
      },
      {
        path: "perfil/:userId",
        element: <ProfilePage />,
      },
      {
        path: "configuracoes",
        element: <SettingsPage />,
      },
      {
        path: "sugestoes",
        element: <SuggestionPage />,
      },
      {
        path: "nao-autorizado",
        element: <UnauthorizedPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      
      // Admin Routes - English maintained for internal tools
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
          {
            path: "content",
            element: <ContentManagement />,
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
    path: "/salvar-post",
    element: <SavePost />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
