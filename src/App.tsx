
// ABOUTME: Main application router and providers configuration.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AcervoPage from "./pages/AcervoPage";
import ComunidadePage from "./pages/ComunidadePage";
import PerfilPage from "./pages/PerfilPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";
import { AuthSessionProvider } from "./components/auth/AuthSessionProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppShell from "./components/shell/AppShell";
import { AppDataProvider } from "./contexts/AppDataContext";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthSessionProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <AppDataProvider>
                      <AppShell>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/acervo" element={<AcervoPage />} />
                          <Route path="/comunidade" element={<ComunidadePage />} />
                          <Route path="/perfil" element={<PerfilPage />} />
                          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
                          
                          {/* Future Editor Routes - Protected by role-based access */}
                          {/* Placeholder routes for documentation purposes */}
                          {/* 
                          <Route path="/editor" element={
                            <ProtectedRoute requiredRole="editor">
                              <EditorDashboard />
                            </ProtectedRoute>
                          } />
                          <Route path="/editor/:reviewId" element={
                            <ProtectedRoute requiredRole="editor">
                              <VisualCompositionEngine />
                            </ProtectedRoute>
                          } />
                          */}
                          
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AppShell>
                    </AppDataProvider>
                  </ProtectedRoute>
                } />
              </Routes>
            </AuthSessionProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
